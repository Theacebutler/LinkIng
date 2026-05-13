import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const sqlite = new Database(process.env.BD_CONN as string);
export const db = drizzle({ client: sqlite })

migrate(db, { migrationsFolder: "./drizzle" })
