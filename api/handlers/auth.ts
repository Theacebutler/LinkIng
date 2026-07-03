import bcrypt from "bcrypt";
import { config } from "../config";
import { createAccessToken, createRefreshToken } from "../utils/jwt";
import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { generateState, OAuth2Client } from "oslo/oauth2"
import { getStoredToken } from "../utils/tokenStore";
import { json } from "../utils/jsonResponseUtil";
import { revokeToken, revokeTokenFamily } from "../utils/tokenStore";
import { storeRefreshToken } from "../utils/tokenStore";
import { usersTable } from "../db/schema";
import { validateCredentials } from "../utils/validateCred";
import { verifyRefreshToken } from "../utils/jwt";
import { withAuth, type AuthenticatedRequest } from "../utils/token_gen";
import type { GoogleUser, User } from "../shared/types";

// this function should take in the register request and return a response with the userId
export async function register(request: Request): Promise<Response> {
  try {
    // TODO: implement a better interface for registration and Login to avoid this `clone` hack
    // since it's not a good practice to modify the request object and its not very memory efficient
    const body = await request.clone().json() as { username: string; password: string; };
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return json({ error: "Username and password required" }, 400);
    }
    // Validate password strength
    if (password.length < 8) {
      return json(
        { error: "Password must be at least 8 characters" },
        400
      );
    }

    // Create user with hashed password in DB
    // Check for existing user. If so, try log the user in
    const [existingUser] = await db.select()
      .from(usersTable)
      .where((user) => eq(user.username, username))
      .limit(1)
      .execute();

    if (existingUser) {
      const user = await validateCredentials(username, password);
      if (!user) {
        return json({ error: "Invalid username or password" }, 401);
      }
      return login(request);
    }
    // Create user with hashed password in DB
    const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
    const newUser: User = {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    // Try / catch to handle DB errors
    let id: number | undefined;
    try {
      const out = await db.insert(usersTable)
        .values(newUser)
        .returning();
      id = out[0]?.id;
    } catch (err) {
      return json({ error: "Registration failed" }, 500);
    }

    return json({
      message: "User created successfully",
      userId: id
    }, 201);

  } catch (error) {
    if (error instanceof Error && error.message === "User already exists") {
      return json({ error: "Username already registered" }, 409);
    }
    return json({ error: "Registration failed" }, 500);
  }
}
// POST /auth/refresh - Exchange refresh token for new token pair
export async function refresh(request: Request): Promise<Response> {
  try {
    const body = await request.json() as any;
    const { refreshToken } = body;

    if (!refreshToken) {
      return json({ error: "Refresh token required" }, 400);
    }

    // Verify the refresh token signature and claims
    const payload = await verifyRefreshToken(refreshToken);

    // Get stored token metadata
    const storedToken = getStoredToken(payload.jti as string);

    if (!storedToken) {
      return json({ error: "Refresh token not found" }, 401);
    }

    // Check if token was revoked (already used or explicitly revoked)
    if (storedToken.revoked) {
      // SECURITY: Token reuse detected - possible theft!
      // Revoke entire token family to force re-authentication
      revokeTokenFamily(storedToken.familyId);
      return json(
        { error: "Token reuse detected. All sessions revoked." },
        401
      );
    }

    // Mark old token as used (revoked)
    revokeToken(payload.jti as string);

    // Generate new token pair
    const newAccessToken = await createAccessToken(
      payload.username as string
    );
    const { refreshToken: newRefreshToken, tokenID: newTokenId } =
      await createRefreshToken(
        payload.username as string
      );

    // Store new refresh token in same family
    storeRefreshToken(
      newTokenId,
      payload.sub as string,
      storedToken.familyId,
      storedToken.deviceInfo
    );

    return json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenType: "Bearer",
      expiresIn: 900,
    });
  } catch (error) {
    return json({ error: "Invalid refresh token" }, 401);
  }
}

// POST /auth/logout - Revoke current refresh token
export const logout = withAuth(
  async (request: AuthenticatedRequest): Promise<Response> => {
    try {
      const body = await request.json() as any;
      const { refreshToken } = body;

      if (refreshToken) {
        // Verify and revoke the provided refresh token
        const payload = await verifyRefreshToken(refreshToken);
        revokeToken(payload.jti as string);
      }
      return json({ message: "Logged out successfully" });
    } catch (error) {
      // Even if token validation fails, consider logout successful
      return json({ message: "Logged out" });
    }
  }
);


export async function login(request: Request): Promise<Response> {
  const { username, password } = await request.json() as { username: string; password: string; };
  try {
    // Validate input
    if (!username || !password) {
      return json({ error: "username and password required" }, 400);
    }

    // Validate credentials
    const user = await validateCredentials(username, password);

    if (!user) {
      // Use generic error message to prevent user enumeration
      return json({ error: "Invalid credentials" }, 401);
    }

    // Generate token pair
    const accessToken = await createAccessToken(user.username);
    const { refreshToken, tokenID } = await createRefreshToken(
      user.username
    );

    // Create family ID for token rotation tracking
    const familyId = crypto.randomUUID();

    // Store refresh token metadata
    const deviceInfo = request.headers.get("User-Agent") || "Unknown";
    storeRefreshToken(tokenID, user.id?.toString() as string, familyId, deviceInfo);

    return json({
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: 900, // 15 minutes in seconds
    });
  } catch (error) {
    return json({ error: "Login failed" }, 500);
  }
}

const state = generateState()
const googleClient = new OAuth2Client(
  config.GOOGLE_CLIENT_ID!,
  "https://accounts.google.com/o/oauth2/v2/auth",
  "https://oauth2.googleapis.com/token",
  {
    redirectURI: `${config.FRONTEND_URL}/`
  }
)
export async function getRedirectUrl(): Promise<Response> {
  const url = await googleClient.createAuthorizationURL({
    state,
    scopes: ["openid", "profile"],
  })
  return Response.json({ redirectUrl: url.toString() })
}

export async function googleOAuthCallback(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  if (!code) {
    return Response.redirect(url.toString() + "&prompt=select_account")
  }
  if (state !== state) {
    return Response.redirect(url.toString() + "&prompt=select_account")
  }
  const token = await googleClient.validateAuthorizationCode(code, {
    credentials: config.GOOGLE_CLIENT_SECRET,
    authenticateWith: "request_body",
  })
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  })
    .then(res => res.json())
    .catch(err => {
      console.log("error fetching user info", err)
      return { error: "Google OAuth callback failed", status: 500 }
    })

  // work with the user info from google
  const { name, id } = res as GoogleUser
  const [existingUser]: { username: string }[] = await db
    .select({ username: usersTable.username })
    .from(usersTable)
    .where(
      and(
        eq(usersTable.username, name),
        eq(usersTable.googleOauthId, id)
      )
    )
    .limit(1)
  if (!existingUser) {
    // create new user from google user
    const password = crypto.randomUUID()
    const newUser: User = {
      username: name,
      password,
      googleOauthId: id
    }
    await db.insert(usersTable)
      .values(newUser)
  }
  try {
    // Generate token pair
    const accessToken = await createAccessToken(name);
    const { refreshToken, tokenID } = await createRefreshToken(name
    );

    // Create family ID for token rotation tracking
    const familyId = crypto.randomUUID();

    // Store refresh token metadata
    const deviceInfo = req.headers.get("User-Agent") || "Unknown"
    storeRefreshToken(tokenID, id.toString() as string, familyId, deviceInfo);

    return Response.json({
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: 900, // 15 minutes in seconds
    });
  } catch (error) {
    // TODO: handle error in createing access token
    return Response.json({ error: "Google OAuth callback failed to create token pair", status: 500 })
  }
}
