import Cookies from "js-cookie"
import { config } from "../../config"
import { setAccessTokenCookie, setRefreshTokenCookie } from "./cookies"

interface LoginResponse {
  accessToken: string,
  refreshToken: string,
  tokenType: string,
  expiresIn: number
}

export default async function login(username: string, password: string) {
  const res = await fetch(`${config.VITE_API_URL}/users/login`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    })
  })
  const data = await res.json() as LoginResponse
  switch (res.status) {
    case 200:
      Cookies.set('accessToken', setAccessTokenCookie(data.accessToken))
      Cookies.set('refreshToken', setRefreshTokenCookie(data.refreshToken))
      break
    case 400:
      break
    case 401:
      break
    default:
  }
}
