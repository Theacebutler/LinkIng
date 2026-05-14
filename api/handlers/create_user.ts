import { type user as user } from "../shered/types";
import { usersTable } from "../db/schema";

import { db } from "../db";

type Data = { created: boolean, user?: string, err?: string | unknown }

export async function createUser(body: user): Promise<Data> {
  const newUser: user = {
    name: body.name,
    password: body.password,
  }
  try {
    const res = await db.insert(usersTable).values(newUser).returning();
    const out = res[0]?.name
    return { created: true, user: out }
  } catch (err) {
    return { created: false, err: err }
  }
}


export async function createUserResponse(data: Data): Promise<Response> {
  if (data.created) {
    return new Response(JSON.stringify(data.user), {
      headers: {
        "Content-Type": "application/json",
      }, status: 201,
    });
  } else {
    return new Response(JSON.stringify(data.err), {
      headers: {
        "Content-Type": "application/json",
      }, status: 409
    });
  }
}
