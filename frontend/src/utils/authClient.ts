import Cookies from 'js-cookie';
import { COOKIE_CONFIG } from './cookies';
import { config } from '../../config';

export function getAccessToken(): string {
  const token = Cookies.get('accessToken')
  if (!token) {
    Cookies.remove('accessToken')
    throw new Error("No access token found")
  }
  return token
}

async function refreshToken(): Promise<void> {
  const token = Cookies.get('refreshToken')
  if (!token) throw new Error("No refresh token found")

  const response = await fetch(`${config.VITE_API_URL}/users/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: token })
  })

  if (!response.ok) {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    window.location.reload()
    return
  }

  const data = await response.json()
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
}

export async function fetchWithAuth(url: string, method: string = 'GET', body?: string): Promise<Response> {
  try {
    const access_token = getAccessToken()
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${access_token}`
    }
    if (body) headers['Content-Type'] = 'application/json'
    const response = await fetch(url, {
      method,
      headers,
      body
    })

    if (response.status === 401) {
      await refreshToken()
      return await fetchWithAuth(url, method, body)
    }

    return response
  } catch {
    return new Response(null, { status: 401 })
  }
}
