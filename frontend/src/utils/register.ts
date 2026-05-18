// register a new user
import { config } from "../../config"
import login from "./login"


export default async function register(username: string, password: string): Promise<string | Error | undefined> {
  const data = await fetch(`${config.VITE_API_URL}/users/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  })
  const res = await data.json() as { message?: string, userId?: string, error?: string }
  console.info(res)

  try {
    switch (data.status) {
      // user created - store the username and userId in a cookie
      case 200 | 201:
        // get the userId
        if (res.message && res.userId) {
          await login(username, password)
          console.log("Registerd user: ", res.userId, "username: ", username);

          return res.userId, res.message
        }
        break
      // username already exists
      case 409 | 400:
        throw new Error("User already exists")
      // Username and password required / invalid password
      case 500:
        break
    }
  } catch (err) {
    return err as Error
  }
}
