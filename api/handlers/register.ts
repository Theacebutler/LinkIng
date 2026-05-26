import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { config } from "../config";
import { db } from "../db";
import { json } from "../utils/jsonResponseUtil";
import type { User } from "../shared/types";
import { usersTable } from "../db/schema";
import { login } from "./login";
import { validateCredentials } from "../utils/validateCred";

// this function should take in the register request and return a response with the userId
export async function register(request: Request): Promise<Response> {
  try {
    const body = await request.json() as { username: string; password: string; };
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return json({ error: "Username and password required" }, 400);
    }
    // Validate password strength
    if (password.length < 8) {
      return json(
        { error: "Password must be at least 8 characters" },
        400
      );
    }

    // Create user with hashed password in DB
    // Check for existing user. If so, try log the user in
    const [existingUser] = await db.select()
      .from(usersTable)
      .where((user) => eq(user.username, username))
      .limit(1)
      .execute();

    if (existingUser) {
      const user = await validateCredentials(username, password);
      if (!user) {
        return json({ error: "Invalid username or password" }, 401);
      }
      return login(username, password, request.headers);
    }
    // Create user with hashed password in DB
    const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
    const newUser: User = {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    // Try / catch to handle DB errors
    let id: number | undefined;
    try {
      const out = await db.insert(usersTable)
        .values(newUser)
        .returning();
      id = out[0]?.id;
    } catch (err) {
      return json({ error: "Registration failed" }, 500);
    }

    return json({
      message: "User created successfully",
      userId: id
    }, 201);

  } catch (error) {
    if (error instanceof Error && error.message === "User already exists") {
      return json({ error: "Username already registered" }, 409);
    }
    return json({ error: "Registration failed" }, 500);
  }
}
