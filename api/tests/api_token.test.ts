import { describe, expect, test, beforeAll } from "bun:test";
import { login, register } from "../handlers/auth";

type Response = { message: string; id?: number, error?: string | unknown }
let token: string;
let TEST_RESOURCE_ID: number
const TEST_API_AUTH_USER = `test-user-${Math.random().toString(36).substring(7)}`
const TEST_API_AUTH_PASSWORD = "test-api-auth-password"

// beforeAll(async () => {
//   const mockRequest: Request = new Request(
//     "http://localhost:3000/api/users/register/", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       username: TEST_API_AUTH_USER,
//       password: TEST_API_AUTH_PASSWORD
//     })
//   })
//   await register(mockRequest)
//   await login(mockRequest)
//     .then(async (res) => {
//       const data = await res.json() as { accessToken: string };
//       token = data.accessToken
//     })
// })


// describe("TEST api auth", () => {
//   test("TEST: get api auth token", () => {
//   })
// })
