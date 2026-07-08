// src/tests/jwt.test.ts
// Unit tests for JWT authentication

import { describe, test, expect, beforeAll } from "bun:test";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt";

describe("JWT Token Operations", () => {
  const testUserId = "user-123";
  const testEmail = "test@example.com";

  test("creates valid access token", async () => {
    const token = await createAccessToken(testUserId,);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3); // Header.Payload.Signature
  });

  test("verifies valid access token", async () => {
    const token = await createAccessToken(testUserId);
    const payload = await verifyAccessToken(token);
    expect(payload.sub).toBe(testUserId);
    // expect(payload.email).toBe(testEmail);
    expect(payload.type).toBe("access");
    expect(payload.jti).toBeDefined();
  });

  test("rejects invalid access token", async () => {
    const invalidToken = "invalid.token.here";

    expect(verifyAccessToken(invalidToken)).rejects.toThrow();
  });

  test("rejects refresh token as access token", async () => {
    const { refreshToken } = await createRefreshToken(testUserId,);

    expect(verifyAccessToken(refreshToken)).rejects.toThrow();
  });

  test("creates valid refresh token", async () => {
    const { refreshToken, tokenID } = await createRefreshToken(testUserId);

    expect(refreshToken).toBeDefined();
    expect(tokenID).toBeDefined();
  });

  test("verifies valid refresh token", async () => {
    const { refreshToken } = await createRefreshToken(testUserId,);
    const payload = await verifyRefreshToken(refreshToken);

    expect(payload.sub).toBe(testUserId);
    expect(payload.type).toBe("refresh");
  });
});

describe("Token Expiration", () => {
  test("access token includes expiration claim", async () => {
    const token = await createAccessToken("user-1");
    const payload = await verifyAccessToken(token);

    expect(payload.exp).toBeDefined();
    expect(payload.iat).toBeDefined();
    expect(payload.exp! > payload.iat!).toBe(true);
  });
});
