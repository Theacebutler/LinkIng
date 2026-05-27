import { eq } from "drizzle-orm";
import { db } from "../db";
import { resourcesTable, screenshotsTable } from "../db/schema";
import { config } from "../config";
import { json } from "../utils/jsonResponseUtil";

export function apiResourceScreenshotOpts() {
  const res = Response.json({});
  res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL);
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function apiResourceScreenshotGet(id: number) {
  if (!id) return json({ error: "id is required" }, 400);
  try {
    const image_record = await db.select()
      .from(screenshotsTable)
      .where(eq(screenshotsTable.resourceId, id));
    const image = image_record[0]?.image
    if (image) {
      // add the image url to the image in the DB
      await db.update(resourcesTable)
        .set({ imageUrl: `/api/resources/screenshots/${id}` })
        .where(eq(resourcesTable.id, id));
      const res = new Response(Buffer.from(image, 'base64'), {
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': config.FRONTEND_URL,
        },
      });
      return res;
    } else {
      return json({ error: "image not found" }, 404);
    }
  } catch (e) {
    if (e instanceof Error) {
      return json({ error: e.message }, 500);
    }
    return json({ error: "unknown error" }, 500);
  }

}
