import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { resourcesTable } from "../db/schema";
import type { Resource } from "../shered/types";
import { handleScreenshot } from "../utils/handleScreenshot";

const FRONTEND_URL = process.env.FRONTEND_URL as string;

export async function apiResourcesGet(name: string): Promise<Response> {
  const resources = await db.select()
    .from(resourcesTable)
    .where((resouce) => eq(resouce.owner, name))
    .orderBy(desc(resourcesTable.createdAt));
  const res = Response.json(resources);
  res.headers.set("Access-Control-Allow-Origin", FRONTEND_URL);
  return res;
}

export async function apiResourcesOpts(): Promise<Response> {
  const res = Response.json({});
  res.headers.set("Access-Control-Allow-Origin", FRONTEND_URL);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Authorization");
  return res;
}

export async function apiResourcesPost(req: Request, server: Bun.Server<undefined>) {
  const body = await req.json() as Omit<Resource, 'id' | 'createdAt' | 'sourceImage'>;

  // BUG: get the correct typing for the user
  const name = req.user.sub
  const newResource: Resource = {
    ...body,
    createdAt: new Date().toISOString(),
    owner: name,
  };
  // save the screenshot to the DB
  const [id] = await db.insert(resourcesTable)
    .values(newResource)
    .returning({ insertId: resourcesTable.id });

  handleScreenshot(server, newResource.resourceUrl, id?.insertId)
  const res = Response.json(newResource);
  res.headers.set("Access-Control-Allow-Origin", FRONTEND_URL);
  return res;
}
