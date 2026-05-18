// register a new user
import { config } from "../../config"
import login from "./login"


export default async function register(username: string, password: string): Promise<string | Error | undefined> {
  const data = await fetch(`${config.VITE_API_URL}/users/register`, {
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

  switch (data.status) {
    // user created - store the username and userId in a cookie
    case 200 | 201:
      await login(username, password)
      window.location.reload()
      return
    // username already exists
    case 409:
      throw new Error("User already exists")
    case 400:
      throw new Error("Username and password required")
    case 500:
    default:
      throw new Error("Unknown error")
  }
}
