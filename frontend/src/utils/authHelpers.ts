import { config } from "../../config"
import { COOKIE_CONFIG } from "../utils/cookies"
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
      Cookies.set(config.ACCESS_TOKEN_KEY_NAME, data.accessToken, {
        sameSite: "lax",
        path: COOKIE_CONFIG.path,
        expires: data.expiresIn,
        secure: COOKIE_CONFIG.secure
      })
      Cookies.set(config.REFRESH_TOKEN_KEY_NAME, data.refreshToken, {
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

export async function GoogleLogin() {
  const res = await fetch(`${config.VITE_API_URL}/auth/google/login`)
  if (!res.ok) {
    console.error("Google OAuth login failed", await res.text())
    throw new Error("Failed to get Google login URL")
  }
  const { redirectUrl } = await res.json() as { redirectUrl: string }
  window.location.href = redirectUrl
}

let googleCallbackHandled = false

export async function handleGoogleCallback(): Promise<boolean> {
  if (googleCallbackHandled) return false
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state')
  if (!code || !state) return false
  // Remove code/state from URL immediately so re-renders don't re-trigger
  window.history.replaceState({}, document.title, window.location.pathname)

  const res = await fetch(`${config.VITE_API_URL}/auth/google/callback?code=${code}&state=${state}`)
  console.log("res", res)
  if (!res.ok) {
    console.error("Google OAuth callback failed", await res.text())
    return false
  }

  const data = await res.json() as {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
  }
  Cookies.set(config.ACCESS_TOKEN_KEY_NAME, data.accessToken, {
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
  googleCallbackHandled = true
  // FIX: this is a hack to refresh the resources
  window.location.href = '/dashboard'
  return true
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

export async function getUserKey(): Promise<{ key: string, owner: string }> {
  const accessToken = Cookies.get(config.ACCESS_TOKEN_KEY_NAME)
  if (!accessToken) throw new Error("No access token")
  const res = await fetch(`${config.VITE_API_URL}/users/get-key`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
  })
  if (!res.ok) throw new Error("Failed to get user key")
  return await res.json() as { key: string, owner: string }
}

