import { describe, expect, test, beforeAll } from "bun:test";
import { apiGenerateToken, login, register } from "../handlers/auth";
import { config } from "../config";

let token: string;
const TEST_API_AUTH_USER = `test-user-${Math.random().toString(36).substring(7)}`
const TEST_API_AUTH_PASSWORD = "test-api-auth-password"

type TokenResponse = {
  accessToken: string,
  tokenType: string,
  expiresIn: string,
  error?: string
};

beforeAll(async () => {
  const mockRequest: Request = new Request(
    "http://localhost:3000/api/users/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: TEST_API_AUTH_USER,
      password: TEST_API_AUTH_PASSWORD
    })
  })
  await register(mockRequest)
  await login(mockRequest)
    .then(async (res) => {
      const data = await res.json() as { accessToken: string };
      token = data.accessToken
    })
})


describe("TEST api auth", () => {

  test("TEST: get api auth token", async () => {
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/users/api-auth/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: TEST_API_AUTH_USER,
        password: TEST_API_AUTH_PASSWORD
      })
    })
    const res = await apiGenerateToken(mockRequest)
    const data = await res.json() as TokenResponse;
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(data.accessToken).toBeDefined();
    expect(data.tokenType).toBeDefined();
    expect(data.expiresIn).toBe(config.API_TOKEN_EXP);
  })

  test("TEST: invalid api auth token", async () => {
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/users/api-auth/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "not-a-valid-user",
        password: TEST_API_AUTH_PASSWORD
      })
    })
    const res = await apiGenerateToken(mockRequest)
    const data = await res.json() as TokenResponse;
    expect(res.ok).toBe(false);
    expect(res.status).toBe(401);
    expect(data.accessToken).toBeUndefined();
    expect(data.tokenType).toBeUndefined();
    expect(data.expiresIn).toBeUndefined();
    expect(data.error).toBeDefined();
  })
})
