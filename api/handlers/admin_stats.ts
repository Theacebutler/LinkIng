import { usersTable, resourcesTable, screenshotsTable } from "../db/schema";
import { db } from "../db";
import { count } from "drizzle-orm";


async function getNumUsers() {
  const n = await db.select({ v: count(usersTable.id) })
    .from(usersTable)
  console.log(n);
}
getNumUsers();
