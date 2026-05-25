import { desc, eq, and } from "drizzle-orm";
import { db } from "../db";
import { resourcesTable } from "../db/schema";
import type { Resource } from "../shared/types";
import screenshot from "../utils/screenshot";
import { config } from "../config";
import type { AuthenticatedRequest } from "../utils/token_gen";


export async function apiResourcesGet(name: string): Promise<Response> {
  const resources = await db.select()
    .from(resourcesTable)
    .where((resource) => eq(resource.owner, name))
    .orderBy(desc(resourcesTable.createdAt));
  const res = Response.json(resources);
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
  return res;
}

export async function apiResourcesOpts(): Promise<Response> {
  const res = Response.json({});
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Authorization");
  return res;
}

export async function apiResourcesPost(req: AuthenticatedRequest) {
  const body = await req.json() as Omit<Resource, 'id' | 'createdAt' | 'sourceImage'>;

  const name = req.user.sub
  const newResource: Resource = {
    ...body,
    createdAt: new Date().toISOString(),
    owner: name,
  };
  // save the screenshot to the DB
  const [id] = await db.insert(resourcesTable)
    .values(newResource)
    .returning();
  const insertId = id?.id
  screenshot(newResource.resourceUrl, insertId)
  const out = { ...newResource, id: insertId };
  const res = Response.json(out);
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
  return res;
}


export async function apiResourcesIdDelete(name: string, id: number): Promise<Response> {
  await db.delete(resourcesTable).where(
    and(
      eq(resourcesTable.id, id),
      eq(resourcesTable.owner, name)
    ));
  const res = Response.json({ deleted: true });
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  return res
}
