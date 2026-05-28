import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import Database from 'bun:sqlite';

const sqlite = new Database(process.env.DB_CONN as string);
const db = drizzle(sqlite);

async function runMigration() {
  try {
    migrate(db, { migrationsFolder: './drizzle' });
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
