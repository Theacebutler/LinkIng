import { db } from "../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import type { AuthenticatedRequest } from "./token_gen";


export default async function getUserKeyFromDB(req: AuthenticatedRequest): Promise<Response> {
  const username = req.user.sub
  const [userFromDB] = await db.select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1)
    .execute()

  if (!userFromDB) {
    return new Response("User not found", { status: 404 })
  }
  return new Response(JSON.stringify({ key: userFromDB.key, owner: userFromDB.username }), { status: 200 })
}
