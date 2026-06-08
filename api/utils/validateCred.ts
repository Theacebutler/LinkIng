import bcrypt from "bcrypt";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import type { User } from "../shared/types";
import { config } from "../config";

export async function validateCredentials(
  username: string,
  password: string
): Promise<User | null> {
  const [userFromDB] = await db.select()
    .from(usersTable)
    .where(eq(usersTable.username, username),)
    .limit(1)
    .execute()

  if (!userFromDB) {
    await bcrypt.hash(password, config.SALT_ROUNDS)
    return null
  }
  const isValid = await bcrypt.compare(password, userFromDB.password)
  if (!isValid) {
    return null
  }
  return userFromDB as User;
}


export async function validateAppleShortcutsUser(username: string, key: string): Promise<boolean> {
  const [userFromDB] = await db.select()
    .from(usersTable)
    .where(eq(usersTable.username, username),)
    .limit(1)
    .execute()

  if (!userFromDB) {
    return false
  }
  if (userFromDB.key !== key) {
    return false
  }
  return true
}
