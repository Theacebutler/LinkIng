import Cookies from 'js-cookie';
import { COOKIE_CONFIG } from './cookies';
import { config } from '../../config';
import type { ACCESS_TOKEN_KEY_NAME, REFRESH_TOKEN_KEY_NAME } from '../types/global';


function getToken(type: ACCESS_TOKEN_KEY_NAME | REFRESH_TOKEN_KEY_NAME): string | undefined {
  let token: string | undefined
  switch (type) {
    case "accessToken":
      token = Cookies.get(config.ACCESS_TOKEN_KEY_NAME)
      break;
    case "refreshToken":
      token = Cookies.get(config.REFRESH_TOKEN_KEY_NAME)
      break;
    default:
      token = undefined
      break;
  }
  return token
}

let refreshPromise: Promise<void> | null = null

async function doRefreshToken(): Promise<void> {
  if (refreshPromise) return refreshPromise
  refreshPromise = (async () => {
    const refreshToken = getToken("refreshToken")
    if (!refreshToken) {
      return
    }
    const response = await fetch(`${config.VITE_API_URL}/users/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    })
    if (!response.ok) {
      return
    }
    const data = await response.json() as { accessToken: string, refreshToken: string, expiresIn: number }
    if (!data.accessToken || !data.refreshToken) {
      return
    }
    Cookies.remove(config.ACCESS_TOKEN_KEY_NAME)
    Cookies.remove(config.REFRESH_TOKEN_KEY_NAME)
    Cookies.set(config.ACCESS_TOKEN_KEY_NAME, data.accessToken, { sameSite: "lax", path: COOKIE_CONFIG.path, expires: data.expiresIn, secure: COOKIE_CONFIG.secure })
    Cookies.set(config.REFRESH_TOKEN_KEY_NAME, data.refreshToken, { sameSite: "lax", path: COOKIE_CONFIG.path, secure: COOKIE_CONFIG.secure })
  })()
  try {
    await refreshPromise
  } finally {
    refreshPromise = null
  }
}


export async function fetchWithAuth(url: string, method: string = 'GET', body?: string): Promise<Response> {
  try {
    const accessToken = getToken("accessToken")
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${accessToken}`
    }
    if (body) headers['Content-Type'] = 'application/json'
    const response = await fetch(url, {
      method,
      headers,
      body
    })

    if (response.status === 401) {
      await doRefreshToken()

      const accessToken = getToken("accessToken")
      const headers: Record<string, string> = {
        "Authorization": `Bearer ${accessToken}`
      }
      if (body) headers['Content-Type'] = 'application/json'
      return await fetch(url, {
        method,
        headers,
        body
      })
    }

    return response
  } catch {
    return new Response(null, { status: 200 })
  }
}
