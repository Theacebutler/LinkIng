import { db } from "../db";
import { expect, test, describe, beforeAll, afterAll } from "bun:test"
import { login, register } from "../handlers/auth";
import { addResource } from "../handlers/protected";
import { resourcesTable, screenshotsTable, usersTable } from "../db/schema";
import { eq, like } from "drizzle-orm";
import type { Resource } from "../shared/types";
import { deleteOrphanedScreenshots } from "../utils/deleteOrphanedScreenshots";


const TEST_USER = `test-user-${Math.random().toString(36).substring(7)}-delete`
const TEST_PASSWORD = "test-password-delete"
let token: string;
const MOCK_RESOURCES: Resource[] = [
  {
    owner: TEST_USER,
    title: "test-1",
    resourceUrl: "https://www.google.com",
    tags: ["test"]
  },
  {
    owner: TEST_USER,
    title: "test-2",
    resourceUrl: "https://coolors.co/",
    tags: ["test"]
  },
  {
    owner: TEST_USER,
    title: "test0-3",
    resourceUrl: "https://metatags.io/",
    tags: ["test"]
  }
]
// Create a user for testing
beforeAll(async () => {
  Bun.env.JWT_SECRET = crypto.randomUUID().replace(/-/g, '').slice(0, 32);
  Bun.env.REFRESH_SECRET = crypto.randomUUID().replace(/-/g, '').slice(0, 32);
  const mockLoginRequest: Request = new Request(
    "http://localhost:3000/api/users/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: TEST_USER,
      password: TEST_PASSWORD
    })
  })
  await register(mockLoginRequest)
  await login(mockLoginRequest)
    .then(async (res) => {
      const data = await res.json() as { accessToken: string };
      token = data.accessToken
    })

  // Create the resources for testing
  for (const resource of MOCK_RESOURCES) {
    await addResource(new Request("http://localhost:3000/api/resources/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(resource)
    }))
  }
})

describe("TEST delete orphed screenshots", () => {
  let deletedResourceId: number | undefined;
  test("TEST: delete resources and leave the screenshots", async () => {
    // delete the resources
    const [deletedResource] = await db.delete(resourcesTable)
      .where(eq(resourcesTable.title, "test-1"))
      .returning()
    deletedResourceId = deletedResource?.id
    expect(deletedResourceId).toBeNumber()
  })
  test("TEST: delete resources and leave the screenshots", async () => {
    deleteOrphanedScreenshots()
    const deletedScreenshots = await db.select()
      .from(screenshotsTable)
      // deletedResourceId must me defined as checked in the previous test
      .where(eq(screenshotsTable.resourceId, deletedResourceId!))
    expect(deletedScreenshots.length).toBe(0)
  })
})

afterAll(() => {
  db.delete(resourcesTable)
    .where(like(resourcesTable.title, "test-%"))
  db.delete(usersTable)
    .where(like(usersTable.username, "test-user-%-delete"))
  db.delete(screenshotsTable)
})
