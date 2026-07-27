import { desc, eq, and } from "drizzle-orm";
import { db } from "../db";
import { resourcesTable, screenshotsTable } from "../db/schema";
import type { Resource, Screenshot } from "../shared/types";
import addToScreenshotQ from "../utils/screenshot";
import { config } from "../config";
import type { AuthenticatedRequest } from "../utils/token_gen";
import { validateApiAccessUser } from "../utils/validateCred";
import getOGinfo from "../utils/getOGInfo";


export async function apiResourcesGet(request: AuthenticatedRequest): Promise<Response> {
  const owner = request.user?.sub
  if (!owner) {
    return Response.json({ error: "owner is required" }, 400);
  }
  try {
    const resources = await db.select()
      .from(resourcesTable)
      .where((resource) => eq(resource.owner, owner))
      .orderBy(desc(resourcesTable.createdAt))
      .limit(100)
      .execute();

    const res = Response.json(resources);
    res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
    return res;
  } catch (e) {
    console.error(e)
    return Response.json({ error: "Internal server error" }, 500);
  }
}

export async function apiResourcesOpts(): Promise<Response> {
  const res = Response.json({});
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Authorization");
  return res;
}

export async function apiAppleShortcutsPost(req: Request): Promise<Response> {
  const headers = req.headers;
  const userAgent = headers.get("user-agent");
  if (!userAgent) {
    return Response.json({ error: "User-Agent header missing" }, { status: 400 });
  }
  if (!userAgent.includes("BackgroundShortcutRunner")) {
    return Response.json({ error: "User-Agent header must include BackgroundShortcutRunner" }, { status: 400 });
  }
  const body = await req.json() as Omit<Resource, 'id' | 'tags' | 'createdAt' | 'sourceImage'> & { 'key': string | undefined, 'tags': string };
  if (!body.resourceUrl || !body.owner || !body.key) {
    return Response.json({ error: "Invalid request body, missing resourceUrl, owner or key" }, { status: 400 });
  }
  // validate the user
  if (!await validateApiAccessUser(body.owner, body.key)) {
    return Response.json({ error: "Invalid user or key" }, { status: 400 });
  }
  const tags: string[] = [];
  if (body.tags) {
    const tagsFromBody = body.tags.split(" ");
    tagsFromBody.map((tag: string) => {
      if (!tag.startsWith('#')) {
        tags.push(`#${tag}`)
      } else {
        tags.push(tag)
      }
    })
  }
  const newResource: Resource = {
    resourceUrl: body.resourceUrl,
    title: body.title,
    sourceUrl: body.sourceUrl || "",
    tags,
    createdAt: new Date().toISOString(),
    owner: body.owner,
  };
  // save the screenshot to the DB
  const { imageData, title } = await getOGinfo(body.resourceUrl)
  if (!newResource.title && title) {
    newResource.title = title
  } else {
    newResource.title = "Added via Apple Shortcuts"
  }
  // add the resource to the DB
  const [id] = await db.insert(resourcesTable)
    .values(newResource)
    .returning();
  const insertId = id?.id
  // if we can get an image with open graph, add it to the DB, otherwise add it to the queue
  if (imageData) {
    const newImage: Screenshot = {
      resourceId: insertId as number,
      hasImage: 0,
      image: imageData,
      methodUsed: "openGraph"
    }
    await db.insert(screenshotsTable)
      .values(newImage)
  } else {
    addToScreenshotQ(newResource.resourceUrl, insertId)
  }
  const out = { ...newResource, id: insertId };
  const res = Response.json(out);
  return res;
}

// get all resources with an API key
export async function apiResourcesGetWithKey(req: Request): Promise<Response> {
  console.log("CALLED: /api/resources/api-key")

  const url = new URL(req.url)
  const user = url.searchParams.get("user")
  const key = url.searchParams.get("key")
  if (!user || !key) {
    return Response.json({ error: "user and key are required" }, 400);
  }
  if (!await validateApiAccessUser(user, key)) {
    return Response.json({ error: "Invalid user or key" }, 401);
  }
  try {
    const resources = await db.select()
      .from(resourcesTable)
      .where((resource) => eq(resource.owner, user))
      .orderBy(desc(resourcesTable.createdAt))
      .execute();
    console.log("resources", resources)
    const res = Response.json(resources);
    return res;
  } catch (e) {
    console.error(e)
    return Response.json({ error: "Internal server error" }, 500);
  }
}

export async function apiResourcesPost(req: AuthenticatedRequest) {
  const body = await req.json() as Omit<Resource, 'id' | 'createdAt' | 'sourceImage'>;
  const name = req.user.sub
  const tags: string[] = []
  // add tags to the resource
  if (body.tags) {
    body.tags.map((tag: string) => {
      if (tags.includes(tag)) return
      if (!tag.startsWith('#')) {
        tags.push(`#${tag}`)
      } else {
        tags.push(tag)
      }
    })
  }
  if (!body.resourceUrl) {
    return Response.json({ error: "resourceUrl is required" }, 400);
  }
  const { imageData, title } = await getOGinfo(body.resourceUrl)
  if (!body.title && title) {
    body.title = title
  }
  // add the resource to the DB
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
  // if we can get an image with open graph, add it to the DB, otherwise add it to the queue
  if (imageData) {
    const newImage: Screenshot = {
      resourceId: insertId as number,
      hasImage: 0,
      image: imageData,
      methodUsed: "openGraph"
    }
    await db.insert(screenshotsTable)
      .values(newImage)
  } else {
    addToScreenshotQ(newResource.resourceUrl, insertId)
  }
  const out: Resource = { ...newResource, id: insertId };
  const res = Response.json(out);
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
  return res;
}

export async function apiResourcesIdUpdate(request: AuthenticatedRequest): Promise<Response> {
  const body = await request.json() as Omit<Resource, 'createdAt' | 'sourceImage'>;
  const username = request.user?.sub;

  if (!body.id) {
    return Response.json({ error: "id is required" }, 400);
  }

  if (!username) {
    return Response.json({ error: "username is required" }, 400);
  }

  await db.update(resourcesTable)
    .set({
      ...body,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(resourcesTable.id, body.id), eq(resourcesTable.owner, username)));
  const res = Response.json({ updated: true });
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL);
  return res
}

export async function apiResourcesIdDelete(request: AuthenticatedRequest): Promise<Response> {
  const json = await request.json() as { id: number }
  const id = json.id
  const username = request.user?.sub;

  if (!id) {
    return Response.json({ error: "id is required" }, 400);
  }

  if (!username) {
    return Response.json({ error: "username is required" }, 400);
  }

  await db.delete(resourcesTable).where(and(eq(resourcesTable.id, id), eq(resourcesTable.owner, username)));
  await db.delete(screenshotsTable).where(eq(screenshotsTable.resourceId, id));
  const res = Response.json({ deleted: true });
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL);
  return res
}
