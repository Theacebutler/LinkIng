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
      console.error('invalid token type requested from cookies');
      token = undefined
      break;
  }
  if (!token) {
    console.error("No access token found")
  }
  return token
}


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
      console.log("Purposefully failed auth to test refreshToken()");
      await refreshToken()
      return await fetchWithAuth(url, method, body)
    }

    return response
  } catch {
    return new Response(null, { status: 401 })
  }
}
