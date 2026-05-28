import { serial, pgTable, text, boolean } from "drizzle-orm/pg-core";


// users table
export const usersTable = pgTable("users_table", {
  id: serial().primaryKey(),
  username: text().notNull().unique(),
  // HASH!!!
  password: text().notNull(),
  createdAt: text(),
})

// resources table
export const resourcesTable = pgTable("resources_table", {
  id: serial().primaryKey(),
  owner: text().notNull().references(() => usersTable.username),
  title: text().notNull(),
  resourceUrl: text(),
  sourceUrl: text(),
  hasImage: boolean().notNull().default(false),
  createdAt: text(),
})

// screenshots table
export const screenshotsTable = pgTable("screenshots_table", {
  id: serial().primaryKey(),
  resourceId: serial("resource_id").notNull().references(() => resourcesTable.id),
  image: text(),
})
