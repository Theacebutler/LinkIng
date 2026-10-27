import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"


// users table
export const usersTable = sqliteTable("users_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  googleOauthId: integer(),
  key: text().notNull().default(String(crypto.randomUUID())).notNull(),
  username: text().notNull().unique(),
  password: text().notNull(),
  createdAt: text().default(new Date().toISOString()),
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
  tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
  hasImage: integer().notNull().default(1),
})

// screenshots table
export const screenshotsTable = sqliteTable("screenshots_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  resourceId: integer("resource_id").notNull().references(() => resourcesTable.id),
  image: text(),
  hasImage: integer().default(1),
  height: integer(),
  width: integer(),
  methodUsed: text({ enum: ["openGraph", "puppeteer"] }).default("openGraph")
})
