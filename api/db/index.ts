import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const sqlite = new Database(process.env.DB_CONN as string);
export const db = drizzle({ client: sqlite })

// run the migration when the server starts
migrate(db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname })
