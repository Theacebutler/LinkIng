import { describe, expect, test, beforeAll } from "bun:test";
import { apiGenerateToken, login, register } from "../handlers/auth";
import { config } from "../config";
import { apiResourcesPostAPI } from "../handlers/api_resources";

let token: string;
const TEST_API_AUTH_USER = `test-user-${Math.random().toString(36).substring(7)}`
const TEST_API_AUTH_PASSWORD = "test-api-auth-password"
let TEST_API_AUTH_TOKEN = ""
type Response = { message: string; id?: number, error?: string | unknown }
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


describe("TEST: get api auth", () => {

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
    TEST_API_AUTH_TOKEN = data.accessToken
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


describe("TEST: api auth", () => {
  test("TEST: invalid api auth token", async () => {
    // console.log("TEST_API_AUTH_TOKEN", TEST_API_AUTH_TOKEN)
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/resources/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${TEST_API_AUTH_TOKEN}`,
        "User-Agent": "apple-shortcuts"
      },
      body: JSON.stringify({
        title: "initial title",
        resourceUrl: "https://www.google.com",
        sourceUrl: "https://www.google.com",
      })
    })
    const res = await apiResourcesPostAPI(mockRequest)
    const data = await res.json() as Response;
    console.log("DATA: ", data);
    expect(res.ok).toBe(true);
    // expect(res.status).toBe(200);
    // expect(data.error).toBeUndefined();
  })
})
