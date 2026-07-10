import { config } from "../config";
config.MAX_N_RESULTS_PER_PAGE = 10
import { beforeAll, describe, expect, test } from "bun:test";
import { getResources, addResource } from "../handlers/protected";
import { register, login } from "../handlers/auth";

const TEST_USER = `pagination-test-user-${Math.random().toString(36).substring(7)}`
const TEST_PASSWORD = "test-password"
let token: string;
let createdIds: number[] = [];
const N_RESOURCES = config.MAX_N_RESULTS_PER_PAGE

beforeAll(async () => {
  const registerReq = new Request("http://localhost:3000/api/users/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: TEST_USER, password: TEST_PASSWORD })
  })
  await register(registerReq)

  const loginReq = new Request("http://localhost:3000/api/users/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: TEST_USER, password: TEST_PASSWORD })
  })
  const loginRes = await login(loginReq)
  const loginData = await loginRes.json() as { accessToken: string }
  token = loginData.accessToken
})

describe("TEST: pagination response structure", async () => {
  beforeAll(async () => {
    for (let i = 0; i < N_RESOURCES; i++) {
      const req = new Request("http://localhost:3000/api/resources/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `pagination-resource-${i}`,
          resourceUrl: `https://example.com/pagination/${i}`,
        })
      })
      const res = await addResource(req)
      const data = await res.json() as { id: number }
      createdIds.push(data.id)
    }
  })

  test("returns offset, length, and resources fields", async () => {
    const req = new Request("http://localhost:3000/api/resources/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(req)
    const data = await res.json() as { offset: number; length: number; resources: any[] }

    expect(res.ok).toBe(true)
    expect(data).toHaveProperty("offset")
    expect(data).toHaveProperty("length")
    expect(data).toHaveProperty("resources")
    expect(Array.isArray(data.resources)).toBe(true)
  })

  test("length matches resources array length", async () => {
    const req = new Request("http://localhost:3000/api/resources/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(req)
    const data = await res.json() as { offset: number; length: number; resources: any[] }

    expect(data.length).toBe(data.resources.length)
  })

  test("includes created resources in the response", async () => {
    const req = new Request("http://localhost:3000/api/resources/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(req)
    const data = await res.json() as { offset: number; length: number; resources: any[] }

    const titles = data.resources.map((r: any) => r.title)
    for (let i = 0; i < N_RESOURCES; i++) {
      expect(titles).toContain(`pagination-resource-${i}`)
    }
  })

  test("does not return more than MAX_N_RESULTS_PER_PAGE items", async () => {
    const req = new Request("http://localhost:3000/api/resources/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(req)
    const data = await res.json() as { offset: number; length: number; resources: any[] }

    expect(data.resources.length).toBeLessThanOrEqual(config.MAX_N_RESULTS_PER_PAGE)
  })
})

describe("TEST: offset parameter", async () => {
  test("defaults offset to 0 when omitted", async () => {
    const req = new Request("http://localhost:3000/api/resources/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(req)
    const data = await res.json() as { offset: number; length: number; resources: any[], max: number }

    expect(data.offset).toBeGreaterThanOrEqual(N_RESOURCES)
    expect(data.length).toBe(N_RESOURCES)
  })

  test("offset 0 returns same as no offset", async () => {
    const req1 = new Request("http://localhost:3000/api/resources/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res1 = await getResources(req1)
    const data1 = await res1.json() as { offset: number; length: number; resources: any[] }

    const req2 = new Request("http://localhost:3000/api/resources/?offset=0", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res2 = await getResources(req2)
    const data2 = await res2.json() as { offset: number; length: number; resources: any[] }

    expect(data1.resources.length).toBe(data2.resources.length)
  })

  test("offset is cumulative: offset + length equals returned offset", async () => {
    const req = new Request("http://localhost:3000/api/resources/?offset=0", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(req)
    const data = await res.json() as { offset: number; length: number; resources: any[] }

    expect(data.offset).toBe(data.length)
  })
})

describe("TEST: edge cases", async () => {
  test("handles non-numeric offset without crashing", async () => {
    const req = new Request("http://localhost:3000/api/resources/?offset=abc", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(req)
    expect(res.ok).toBe(true)
  })

  test("handles negative offset without crashing", async () => {
    const req = new Request("http://localhost:3000/api/resources/?offset=-1", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(req)
    expect(res.ok).toBe(true)
  })

  test("returns empty array for offset beyond total resources", async () => {
    const req = new Request(`http://localhost:3000/api/resources/?offset=99999`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(req)
    const data = await res.json() as { offset: number; length: number; resources: any[] }

    expect(data.resources).toEqual([])
    expect(data.length).toBe(0)
  })

  test("resources are ordered by createdAt descending", async () => {
    const req = new Request("http://localhost:3000/api/resources/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const res = await getResources(req)
    const data = await res.json() as { resources: any[] }

    for (let i = 1; i < data.resources.length; i++) {
      const prev = new Date(data.resources[i - 1].createdAt).getTime()
      const curr = new Date(data.resources[i].createdAt).getTime()
      expect(prev).toBeGreaterThanOrEqual(curr)
    }
  })
})
