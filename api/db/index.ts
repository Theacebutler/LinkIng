import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { config } from "../config";

const sqlite = new Database(config.DB_CONN);
export const db = drizzle({ client: sqlite })

// run the migration when the server starts
migrate(db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname })
