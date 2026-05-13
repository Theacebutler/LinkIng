import { usersTable, resourcesTable, screenshotsTable } from "../db/schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";


type Resource = InferInsertModel<typeof resourcesTable>;
type user = InferInsertModel<typeof usersTable>;
type Screenshot = InferInsertModel<typeof screenshotsTable>;
