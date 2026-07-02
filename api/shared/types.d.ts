import { usersTable, resourcesTable, screenshotsTable } from "../db/schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";


type Resource = InferInsertModel<typeof resourcesTable>;
type User = InferInsertModel<typeof usersTable>;
type Screenshot = InferInsertModel<typeof screenshotsTable>;

type GoogleUser = {
  id: number;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}
