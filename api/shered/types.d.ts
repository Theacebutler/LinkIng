import { usersTable, resourcesTable, screenshotsTable } from "../db/schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";


type Resource = InferInsertModel<typeof resourcesTable>;
type users = InferInsertModel<typeof usersTable>;
type Screenshot = InferInsertModel<typeof screenshotsTable>;
