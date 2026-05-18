import { describe, expect, test } from "bun:test";
import { register } from "../handlers/register";
import { login } from "../handlers/login";

const TEST_USER = "test-user012"

describe("TEST: register new user", async () => {
  const mockRequest: Request = new Request(
    "http://localhost:3000/api/users/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: TEST_USER,
      password: "test-password"
    })
  })
  test("TEST register", async () => {
    const res = await register(mockRequest)
    const data = await res.json() as { message: string; userId?: number, error?: string | unknown };
    expect(res.ok).toBe(true);
    expect(res.status).toBe(201);
    // test the data.message output
    expect(data.userId).toBeDefined();
    expect(data.error).toBeUndefined();
  })

  test("TEST register with existing username", async () => {
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: TEST_USER,
        password: "test-password"
      })
    })
    const res = await register(mockRequest)
    expect(res.ok).toBe(false);
    expect(res.status).toBe(409);
  })

  test("TEST register with short password", async () => {
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: TEST_USER,
        password: "spass"
      })
    })
    const res = await register(mockRequest)
    expect(res.status).toBe(400);
  })

})

describe("TEST login", async () => {
  test("TEST login with valid credentials", async () => {
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: TEST_USER,
        password: "test-password"
      })
    })
    const res = await login(mockRequest)
    const data = await res.json() as { accessToken: string, refreshToken: string, tokenType: string, expiresIn: number };
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(data.accessToken).toBeDefined();
    expect(data.refreshToken).toBeDefined();
    expect(data.tokenType).toBeDefined();
    expect(data.expiresIn).toBeDefined();
  });
  test("TEST login with invalid credentials", async () => {
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: TEST_USER,
        password: "not-a-valid-password"
      })
    })
    const res = await login(mockRequest)
    expect(res.ok).toBe(false);
    expect(res.status).toBe(401);
  })
});
