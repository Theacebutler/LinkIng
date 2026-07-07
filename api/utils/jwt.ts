import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import { config } from "../config";




export interface TokenPayload extends JWTPayload {
  sub: string;
  type: "access" | "refresh";
  // email: string,
  jti: string
}

export const access_secret = new TextEncoder().encode(config.JWT_SECRET)
export const refresh_secret = new TextEncoder().encode(config.REFRESH_SECRET)


function ranbomTokenID(): string {
  return crypto.randomUUID()
}

export async function createAccessToken(username: string): Promise<string> {
  const tokenID = ranbomTokenID();
  const token = await new SignJWT({
    sub: username,
    type: "access",
    jti: tokenID,
  })
    .setProtectedHeader({ alg: config.HASH_ALG })
    .setIssuedAt()
    .setIssuer(config.JWT_ISSUER)
    .setAudience(config.JWT_AUDIENCE)
    .setExpirationTime(config.TOKEN_EXP)
    .sign(access_secret)

  return token
}
export async function createRefreshToken(username: string): Promise<{ token: string, tokenID: string }> {
  const tokenID = ranbomTokenID();
  const token = await new SignJWT({
    sub: username,
    type: "refresh",
    jti: tokenID,
  })
    .setProtectedHeader({ alg: config.HASH_ALG })
    .setIssuedAt()
    .setIssuer(config.JWT_ISSUER)
    .setAudience(config.JWT_AUDIENCE)
    .setExpirationTime(config.REFRESH_EXP)
    .sign(refresh_secret)

  return { token, tokenID }
}


export async function verifyAccessToken(
  token: string
): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, access_secret, {
      issuer: config.JWT_ISSUER,
      audience: config.JWT_AUDIENCE
    });
    if (payload.type !== "access") {
      throw new Error("Invalid token type");
    }
    return payload as TokenPayload
  } catch (err) {
    throw new Error("Invalid or expired access token");
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, refresh_secret, {
      issuer: config.JWT_ISSUER,
      audience: config.JWT_AUDIENCE
    });
    if (payload.type !== "refresh") {
      throw new Error("Invalid token type");
    }
    return payload as TokenPayload
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
}
