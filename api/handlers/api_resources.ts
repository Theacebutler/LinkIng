import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { resourcesTable } from "../db/schema";
import type { Resource } from "../shared/types";
import addToScreenshotQ from "../utils/screenshot";
import { config } from "../config";
import type { AuthenticatedRequest } from "../utils/token_gen";


export async function apiResourcesGet(request: AuthenticatedRequest): Promise<Response> {
  const owner = request.user?.sub
  if (!owner) {
    return Response.json({ error: "owner is required" }, 400);
  }
  const resources = await db.select()
    .from(resourcesTable)
    .where((resource) => eq(resource.owner, owner))
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

export async function apiAppleShortcutsPost(req: Request): Promise<Response> {
  // WARNING: This is a dangerous route since it allows anyone to add resources, it should only be used by Apple Shortcuts
  const headers = req.headers;
  const userAgent = headers.get("user-agent");
  if (!userAgent) {
    return Response.json({ error: "User-Agent header missing" }, { status: 400 });
  }
  if (!userAgent.includes("BackgroundShortcutRunner")) {
    return Response.json({ error: "User-Agent header must include BackgroundShortcutRunner" }, { status: 400 });
  }
  const body = await req.json() as { resourceUrl: string; title: string; sourceUrl: string; owner: string; };
  // TODO: validate the request body
  const newResource: Resource = {
    resourceUrl: body.resourceUrl,
    title: body.title,
    sourceUrl: body.sourceUrl,
    createdAt: new Date().toISOString(),
    owner: body.owner,
  };
  // save the screenshot to the DB
  const [id] = await db.insert(resourcesTable)
    .values(newResource)
    .returning();
  const insertId = id?.id
  addToScreenshotQ(newResource.resourceUrl, insertId)
  const out = { ...newResource, id: insertId };
  const res = Response.json(out);
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
  addToScreenshotQ(newResource.resourceUrl, insertId)
  const out = { ...newResource, id: insertId };
  const res = Response.json(out);
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
  return res;
}

export async function apiResourcesIdUpdate(request: AuthenticatedRequest): Promise<Response> {
  const body = await request.json() as Omit<Resource, 'createdAt' | 'sourceImage'>;
  if (!body.id) {
    return Response.json({ error: "id is required" }, 400);
  }
  await db.update(resourcesTable)
    .set({
      ...body,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(resourcesTable.id, body.id));
  const res = Response.json({ updated: true });
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL);
  return res
}

export async function apiResourcesIdDelete(request: AuthenticatedRequest): Promise<Response> {
  const json = await request.json() as { id: number }
  const id = json.id
  if (!id) {
    return Response.json({ error: "id and owner are required" }, 400);
  }
  await db.delete(resourcesTable).where(eq(resourcesTable.id, id));
  const res = Response.json({ deleted: true });
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL);
  return res
}
