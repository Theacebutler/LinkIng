import type { User } from "../shered/types";
import { json } from "../utils/jsonResponeUtil";
import { validateCredentils } from "../utils/users";
import { createAccessToken, createRefreshToken } from "../utils/jwt";
import { storeRefreshToken } from "../utils/tokenStore";

export async function login(request: Request): Promise<Response> {
  try {
    const body = await request.json() as User;
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return json({ error: "username and password required" }, 400);
    }

    // Validate credentials
    const user = await validateCredentils(username, password);

    if (!user) {
      // Use generic error message to prevent user enumeration
      return json({ error: "Invalid credentials" }, 401);
    }

    // Generate token pair
    const accessToken = await createAccessToken(user.username);
    const { token: refreshToken, tokenID } = await createRefreshToken(
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
