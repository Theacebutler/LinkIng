import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"


// users table
export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  // HASH!!!
  password: text().notNull(),
  createdAt: text(),
})

// resources table
export const resourcesTable = sqliteTable("resources_table", {
  id: int().primaryKey({ autoIncrement: true }),
  owner: text().notNull().references(() => usersTable.username),
  title: int().notNull(),
  resourceUrl: text(),
  sourceUrl: text(),
  createdAt: text(),
})

// screenshots table
export const screenshotsTable = sqliteTable("screenshots_table", {
  id: int().primaryKey({ autoIncrement: true }),
  resourceId: int("resource_id").notNull().references(() => resourcesTable.id),
  image: text(),
})
