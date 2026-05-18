import { json } from "../utils/jsonResponeUtil";
import { verifyRefreshToken } from "../utils/jwt";
import { withAuth, type AuthenticatedRequest } from "../utils/token_gen";
import { revokeToken } from "../utils/tokenStore";

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

