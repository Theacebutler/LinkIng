import { sqliteTable, text } from "drizzle-orm/sqlite-core"


// users table

export const usersTable = sqliteTable("users_table", {
  id: text().primaryKey(),
  name: text().notNull(),
  // HASH!!!
  password: text(),
})
// resources table
export const resourcesTable = sqliteTable("resources_table", {
  id: text().primaryKey(),
  title: text().notNull(),
  resourceUrl: text(),
  sourceUrl: text(),
  sourceImage: text(),
  createdAt: text(),
})
// screenshots table

