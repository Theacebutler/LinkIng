import bcrypt from "bcrypt";
import { usersTable } from "../db/schema";
import { type User } from "../shered/types";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function createUserInDB(
  username: string, password: string
): Promise<{ created: boolean, userId?: number, error?: string | unknown }> {
  // Check for existing user
  const existingUser = await db.select()
    .from(usersTable)
    .where((user) => eq(user.username, username))
    .execute()

  if (existingUser) {
    throw new Error("User already exists");
  }
  const newUser: User = {
    username,
    password,
    createdAt: new Date().toISOString(),
  };
  try {
    const res = await db.insert(usersTable).values(newUser).returning();
    const id = res[0]?.id
    return { created: true, userId: id }
  } catch (err) {
    return { created: false, error: err }
  }

}


