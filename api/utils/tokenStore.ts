// Refresh token storage with rotation and revocation support

// Stored refresh token metadata
interface StoredToken {
  tokenId: string;
  userId: string;
  familyId: string;      // Groups tokens from same login session
  deviceInfo: string;    // User-Agent for session management
  createdAt: Date;
  expiresAt: Date;
  revoked: boolean;
}

// In-memory token store (use Redis or database in production)
const refreshTokens = new Map<string, StoredToken>();

// Store a new refresh token
export function storeRefreshToken(
  tokenId: string,
  userId: string,
  familyId: string,
  deviceInfo: string,
  expiresInDays: number = 7
): void {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  refreshTokens.set(tokenId, {
    tokenId,
    userId,
    familyId,
    deviceInfo,
    createdAt: new Date(),
    expiresAt,
    revoked: false,
  });
}

// Get stored token by ID
export function getStoredToken(tokenId: string): StoredToken | undefined {
  return refreshTokens.get(tokenId);
}

// Revoke a single token
export function revokeToken(tokenId: string): boolean {
  const token = refreshTokens.get(tokenId);
  if (token) {
    token.revoked = true;
    return true;
  }
  return false;
}

// Revoke all tokens in a family (for reuse detection)
export function revokeTokenFamily(familyId: string): void {
  for (const token of refreshTokens.values()) {
    if (token.familyId === familyId) {
      token.revoked = true;
    }
  }
}

// Revoke all tokens for a user (logout everywhere)
export function revokeAllUserTokens(userId: string): void {
  for (const token of refreshTokens.values()) {
    if (token.userId === userId) {
      token.revoked = true;
    }
  }
}

// Get all active sessions for a user
export function getUserSessions(userId: string): StoredToken[] {
  return Array.from(refreshTokens.values()).filter(
    (t) => t.userId === userId && !t.revoked && t.expiresAt > new Date()
  );
}

// Cleanup expired tokens (call periodically)
export function cleanupExpiredTokens(): number {
  const now = new Date();
  let removed = 0;

  for (const [tokenId, token] of refreshTokens.entries()) {
    if (token.expiresAt < now) {
      refreshTokens.delete(tokenId);
      removed++;
    }
  }

  return removed;
}
