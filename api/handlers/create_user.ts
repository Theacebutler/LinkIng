import { type user as user } from "../shered/types";
import { usersTable } from "../db/schema";

import { db } from "../db";



export async function createUser(body: user): Promise<{ name: string } | undefined> {
  const newU: user = {
    name: body.name,
    password: body.password,
  }

  const [inserted] = await db
    .insert(usersTable)
    .values(newU)
    .returning({ name: usersTable.name })

  return inserted
}


