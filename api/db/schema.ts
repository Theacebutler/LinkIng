// import { serial, pgTable, text } from "drizzle-orm/pg-core"
// Historical migration notes (do not "fix" the old SQL files - they're
// applied in production):
//   0002: FK resources.owner -> users_table.name where name isn't UNIQUE.
//         0006 rewrites it to point at users_table.username (which is).
//   0003 / 0006: resources.title is declared `integer`. 0008 corrects it
//         to `text`. Don't insert non-numeric titles between those.
//   0005: UNIQUE INDEX on users_table.password (kept by 0006/0007).
//         Cosmetically odd; functionally fine with bcrypt.
//   0006 -> 0007: password -> passwordHash -> password round-trip. Net zero.
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"


// users table
export const usersTable = sqliteTable("users_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  password: text().notNull(),
  createdAt: text(),
  apiAuthToken: text()
})

// resources table
export const resourcesTable = sqliteTable("resources_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  owner: text().notNull().references(() => usersTable.username),
  title: text().notNull(),
  resourceUrl: text(),
  sourceUrl: text(),
  createdAt: text(),
  updatedAt: text(),
})

// screenshots table
export const screenshotsTable = sqliteTable("screenshots_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  resourceId: integer("resource_id").notNull().references(() => resourcesTable.id),
  image: text(),
  hasImage: integer().default(0),
})
