import { eq } from "drizzle-orm";
import { db } from "../db";
import { screenshotsTable } from "../db/schema";

export function apiResurceScreenshotOpts() {
  const res = Response.json({});
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function apiResurceScreenshotGet(req: Bun.BunRequest<"/api/resources/screenshots/:id">) {
  const id = Number(req.params.id)
  const image_recored = await db.select()
    .from(screenshotsTable)
    .where(eq(screenshotsTable.resourceId, id));
  const image = image_recored[0]?.image
  if (image) {
    const res = new Response(Buffer.from(image, 'base64'), {
      headers: {
        'Content-Type': 'image/png',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
      },
    });
    return res;
  } else {
    return new Response(JSON.stringify({ error: "Image not found" }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
      },
    });
  }

}
