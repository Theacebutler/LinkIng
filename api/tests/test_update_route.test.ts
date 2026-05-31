import { beforeAll, describe, expect, test } from "bun:test";

import { addResource, deleteResource, getResources, updateResource } from "../handlers/protected";
import { register } from "../handlers/register";
import { login } from "../handlers/login";
import type { Resource } from "../shared/types";

type Response = { message: string; id?: number, error?: string | unknown }
let token: string;
let TEST_RESOURCE_ID: number
const TEST_USER = `test-user-${Math.random().toString(36).substring(7)}`
const TEST_PASSWORD = "test-password"

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
  await login(TEST_USER, TEST_PASSWORD, mockRequest.headers)
    .then(async (res) => {
      const data = await res.json() as { accessToken: string };
      token = data.accessToken
    })
})

describe("TEST: resource CRUD", async () => {
  test("TEST add resource", async () => {
    const mockRequest: Request = new Request(
      "http://localhost:3000/api/resources/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title: "initial title",
        resourceUrl: "https://www.google.com",
        sourceUrl: "https://www.google.com",
      })
    })
    const res = await addResource(mockRequest)
    const data = await res.json() as Response;
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
    // test the data.message output
    expect(data.id).toBeDefined();
    expect(data.error).toBeUndefined();
    TEST_RESOURCE_ID = data.id as number
  })

  test("TEST get resource", async () => {
    const mockRequest: Request = new Request(
      `http://localhost:3000/api/resources/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(mockRequest)
    const data = await res.json() as Resource[];
    expect(res.ok).toBe(true);
    const resource = data.find(resource => resource.id === TEST_RESOURCE_ID)
    expect(resource).toBeDefined()
    expect(resource?.title).toBe("initial title")
  })

  test("TEST update resource", async () => {
    const mockRequest: Request = new Request(
      `http://localhost:3000/api/resources/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title: "new title",
        resourceUrl: "https://www.google.com",
        sourceUrl: "https://www.google.com",
        owner: TEST_USER,
        id: TEST_RESOURCE_ID
      })
    })
    const res = await updateResource(mockRequest)
    const data = await res.json() as Response;

    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    // test the data.message output
    expect(data.error).toBeUndefined();
  })

  test("CHECK resource update", async () => {
    const mockRequest: Request = new Request(
      `http://localhost:3000/api/resources`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
    const res = await getResources(mockRequest)
    const data = await res.json() as Resource[];
    expect(res.ok).toBe(true);

    const updatedResource = data.find(resource => resource.id === TEST_RESOURCE_ID)
    expect(updatedResource).toBeDefined()
    expect(updatedResource?.title).toBe("new title")
  })

  test("TEST delete resource", async () => {
    const mockRequest: Request = new Request(
      `http://localhost:3000/api/resources/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        id: TEST_RESOURCE_ID
      })
    })
    const res = await deleteResource(mockRequest)
    const data = await res.json() as Response;
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    // test the data.message output
    expect(data.error).toBeUndefined();
  })

})
