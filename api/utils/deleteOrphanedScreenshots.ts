import { db } from "../db";
import { resourcesTable, screenshotsTable } from "../db/schema";
import { eq, notExists } from "drizzle-orm";



// Delete the DB entrees from the screenshotsTable where the
// parent resource is already deleted
export const deleteOrphanedScreenshots = async () => {
  await db.delete(screenshotsTable)
    .where(notExists(
      db.select()
        .from(resourcesTable)
        .where(eq(resourcesTable.id, screenshotsTable.resourceId))
    ))
}

