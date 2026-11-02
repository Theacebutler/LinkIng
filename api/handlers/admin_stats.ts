import { usersTable, resourcesTable, screenshotsTable } from "../db/schema";
import { db } from "../db";
import { count, eq } from "drizzle-orm";
import { screenshotStack } from "../utils/screenshot"

export async function getNumUsers() {

  const usersN = await db.select()
    .from(usersTable)
  const screenshotsN = await db.select().from(screenshotsTable);
  const resourcesN = await db.select().from(resourcesTable);
  const data = await db.select({
    user_id: usersTable.id,
    user_created: usersTable.createdAt,
    resources_count: count(resourcesTable.id),
  })
    .from(usersTable)
    .leftJoin(resourcesTable, eq(resourcesTable.owner, usersTable.username))
    .groupBy(usersTable.id)

  const screenshot_data = await db.select({ method: screenshotsTable.methodUsed })
    .from(screenshotsTable)
    .groupBy(screenshotsTable.methodUsed)

  const screenshotStackLenght = screenshotStack.length
  return new Response(JSON.stringify({
    users_count: usersN.length,
    screenshots_count: screenshotsN.length,
    resources_count: resourcesN.length,
    screenshotStackLenght,
    mothods: screenshot_data,
    data,
  }))
}
