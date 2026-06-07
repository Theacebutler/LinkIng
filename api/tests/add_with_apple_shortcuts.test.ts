import { beforeAll, describe, expect, test } from "bun:test";
import { apiAppleShortcutsPost } from "../handlers/api_resources";
import { register, login } from "../handlers/auth";
import { getUserKey } from "../handlers/protected";

const TEST_USER = `test-user-${Math.random().toString(36).substring(7)}`
const TEST_PASSWORD = "test-password"
let token: string;
let TEST_KEY: string;
const TEST_TITLE = "some title"
const TEST_RESOURCE_URL = "https://www.google.com/some-source"
const TEST_SOURCE_URL = "https://www.google.com/some-source"

beforeAll(async () => {
  const mockRequest: Request = new Request(
    "http://localhost:3000/api/users/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: TEST_USER,
      password: TEST_PASSWORD
    })
  })
  await register(mockRequest)
  await login(mockRequest)
    .then(async (res) => {
      const data = await res.json() as { accessToken: string };
      token = data.accessToken
    })
})

describe("TEST: get user key", async () => {
  test("TEST get user key", async () => {
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/users/get-key/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    })
    const res = await getUserKey(mockRequest)
    const data = await res.json() as { key: string };
    TEST_KEY = data.key
  })
})

describe("TEST: add resource with apple shortcuts", async () => {
  test("TEST add resource with apple shortcuts", async () => {
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/resources/apple-shortcuts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "BackgroundShortcutRunner/3612.0.1.5 CFNetwork/3826.600.41.2.1 Darwin/24.6.0"
      },
      body: JSON.stringify({
        resourceUrl: TEST_RESOURCE_URL,
        title: TEST_TITLE,
        sourceUrl: TEST_SOURCE_URL,
        key: TEST_KEY,
        owner: TEST_USER,
      })
    })
    const res = await apiAppleShortcutsPost(mockRequest)
    const data = await res.json() as { id: number, resourceUrl: string, title: string, sourceUrl: string, owner: string };
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    // test the data.message output
    expect(data.id).toBeDefined();
    expect(data.resourceUrl).toBe(TEST_RESOURCE_URL);
    expect(data.title).toBe(TEST_TITLE);
    expect(data.sourceUrl).toBe(TEST_SOURCE_URL);
    expect(data.owner).toBe(TEST_USER);
  });
  test("TEST add resource with apple shortcuts with invalid user agent", async () => {
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/resources/apple-shortcuts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "googlebot/2.1"
      },
      body: JSON.stringify({
        resourceUrl: TEST_RESOURCE_URL,
        title: TEST_TITLE,
        sourceUrl: TEST_SOURCE_URL,
        owner: TEST_USER,
      })
    })
    const res = await apiAppleShortcutsPost(mockRequest)
    const data = await res.json() as { error: string };
    expect(res.ok).toBe(false);
    expect(res.status).toBe(400);
    // test the data.message output
    expect(data.error).toBe("User-Agent header must include BackgroundShortcutRunner");
  });
});
