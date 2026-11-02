import { usersTable, resourcesTable, screenshotsTable } from "../db/schema";
import { db } from "../db";
import { count, eq } from "drizzle-orm";


export async function getNumUsers() {
  // SELECT users.id, COUNT(screenshots.id), COUNT(resourcesTable.id)
  // FROM usersTable
  // JOIN resourcesTable ON usersTable.id = resourcesTable.owner
  // GROUP BY usersTable.id

  const usersN = await db.select()
    .from(usersTable)
  const screenshotsN = db.select().from(screenshotsTable);
  const resourcesN = db.select().from(resourcesTable);

  const data = await db.select()
    .from(usersTable)
    .fullJoin(resourcesTable, eq(resourcesTable.owner, usersTable.username))
    .groupBy(usersTable.id)

  console.log(data);

  return new Response(JSON.stringify({
    users: usersN.length,
    screenshots: (await screenshotsN).length,
    resources: (await resourcesN).length,
    data
  }))
}
