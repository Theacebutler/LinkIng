import { desc } from "drizzle-orm";
import { db } from "../db";
import { resourcesTable } from "../db/schema";
import type { Resource } from "../shered/types";
import { handleScreenshot } from "../utils/handleScreenshot";

const FRUNTEND_URL = process.env.FRUNTEND_URL as string;

export async function apiResourcesGet(): Promise<Response> {
  const resources = await db.select()
    .from(resourcesTable)
    .orderBy(desc(resourcesTable.createdAt));
  const res = Response.json(resources);
  res.headers.set("Access-Control-Allow-Origin", FRUNTEND_URL);
  return res;
}

export async function apiResourcesOpts(): Promise<Response> {
  const res = Response.json({});
  res.headers.set("Access-Control-Allow-Origin", FRUNTEND_URL);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin");
  return res;
}

export async function apiResourcesPost(req: Bun.BunRequest<"/api/resources">, server: Bun.Server<undefined>) {
  const body = await req.json() as Omit<Resource, 'id' | 'createdAt' | 'sourceImage'>;
  const newResource: Resource = {
    ...body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  // save the screenshot to the DB
  const [id] = await db.insert(resourcesTable)
    .values(newResource)
    .returning({ insertId: resourcesTable.id });

  handleScreenshot(server, newResource.resourceUrl, id?.insertId)
  const res = Response.json(newResource);
  res.headers.set("Access-Control-Allow-Origin", FRUNTEND_URL);
  return res;
}
