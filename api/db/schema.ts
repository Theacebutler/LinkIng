import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"


// users table
export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  // HASH!!!
  password: text().notNull().unique(),
})

// resources table
export const resourcesTable = sqliteTable("resources_table", {
  id: int().primaryKey({ autoIncrement: true }),
  owner: text().notNull().references(() => usersTable.name),
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
