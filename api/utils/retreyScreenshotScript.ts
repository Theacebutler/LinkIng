import { db } from "../db";
import { eq, isNull } from "drizzle-orm";
import { screenshotsTable, resourcesTable } from "../db/schema";
import handleFaildScreenshots from "./screenshotsRetry";
import screenshotLogger from "./logger";

async function getFailedCount() {
  try {
    const failed = await db.select()
      .from(screenshotsTable)
      .leftJoin(resourcesTable, eq(screenshotsTable.resourceId, resourcesTable.id))
      .where(isNull(screenshotsTable.image))
      .execute()
    return failed?.length || 0
  } catch (e) {
    screenshotLogger.error(e)
    process.exit(1)
  }
}

const failedCount = await getFailedCount()
screenshotLogger.info({ failedCount: failedCount })
async function getFailed() {
  try {
    await handleFaildScreenshots()
  } catch (e) {
    screenshotLogger.error(e)
    process.exit(1)
  }
}
await getFailed()
