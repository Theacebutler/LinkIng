import { config } from "../../config"
import { COOKIE_CONFIG } from "./cookies"
import Cookies from "js-cookie"

export async function register(username: string, password: string): Promise<void> {
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

  switch (data.status) {
    // user created - store the username and userId in a cookie
    case 200:
    case 201:
      await login(username, password)
      return
    case 401:
      throw new Error("Invalid username or password")
    case 409:
      throw new Error("User already exists")
    case 400:
      throw new Error("Username and password required")
    case 500:
    default:
      throw new Error("Unknown error")
  }
}


export async function login(username: string, password: string) {
  const res = await fetch(`${config.VITE_API_URL}/users/login`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    })
  })
  const data = await res.json() as {
    accessToken: string,
    refreshToken: string,
    tokenType: string,
    expiresIn: number
  }
  switch (res.status) {
    case 200:
      Cookies.set('accessToken', data.accessToken, {
        sameSite: "lax",
        path: COOKIE_CONFIG.path,
        expires: data.expiresIn,
        secure: COOKIE_CONFIG.secure
      })
      Cookies.set('refreshToken', data.refreshToken, {
        sameSite: "lax",
        path: COOKIE_CONFIG.path,
        secure: COOKIE_CONFIG.secure
      })
      break
    case 400:
      throw new Error("Username and password required at login")
    case 401:
      throw new Error("Invalid username or password")
    case 500:
      throw new Error("Login failed")
    default:
      throw new Error("Unknown error")
  }
}


export async function logout(username: string, password: string): Promise<undefined> {
  await fetch(`${config.VITE_API_URL}/users/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  })
  return undefined
}
