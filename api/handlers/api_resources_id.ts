import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { resourcesTable } from "../db/schema";


export function apiResourcesIdOpts() {
  const res = Response.json({});
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin");
  return res;
}

export async function apiResourcesIdDelete(req: Bun.BunRequest) {
  const id = Number(req.params.id)
  const name = req.params.name as string;
  await db.delete(resourcesTable).where(
    and(
      eq(resourcesTable.id, id),
      eq(resourcesTable.owner, name)
    ));
  const res = Response.json({ deleted: true });
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  return res
}
