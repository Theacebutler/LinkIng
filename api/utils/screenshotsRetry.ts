import addToScreenshotStack from "./screenshot";
import { db } from "../db";
import { resourcesTable, screenshotsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import getOGinfo from "./getOGInfo";

interface FailedShap {
  screenshots_table: {
    id: number;
    resourceId: number;
    hasImage: number | null;
  };
  resources_table: {
    id: number;
    resourceUrl: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  } | null;
}

export default async function handleFaildScreenshots() {
  // we have a screenshotsTable with a screenshotsTable.resourceId that points
  // to the resourceTable id, we need to get the screenshots without an image,
  // then find the resource linked to them, and get the url from the resource.

  const [failed]: FailedShap[] | undefined = await db.select()
    .from(screenshotsTable)
    .leftJoin(resourcesTable, eq(resourcesTable.id, screenshotsTable.resourceId))
    .where(eq(screenshotsTable.hasImage, 0))
    .limit(1)
    .execute()
  if (!failed || !failed?.resources_table || failed?.screenshots_table) return
  const url = failed.resources_table?.resourceUrl
  if (!url) return
  const { imageData, width, height } = await getOGinfo(url)
  if (imageData) {
    try {
      await db.update(screenshotsTable)
        .set({
          hasImage: 0,
          image: imageData,
          width,
          height
        })
        .where(eq(screenshotsTable.id, failed.screenshots_table.id))
        .execute()
      return
    } catch (e) {
      addToScreenshotStack(url, failed.screenshots_table.resourceId, 0)
      console.error(e)
    }
  }
  addToScreenshotStack(url, failed.screenshots_table.resourceId, 0)
}
