import { json } from "../utils/jsonResponeUtil";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { storeRefreshToken } from "../utils/tokenStore";
import { revokeToken, revokeTokenFamily } from "../utils/tokenStore";
import { getStoredToken } from "../utils/tokenStore";

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
    const { token: newRefreshToken, tokenID: newTokenId } =
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

