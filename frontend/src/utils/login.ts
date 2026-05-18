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
      throw new Error("Username and password required at login")
    case 401:
      throw new Error("Invalid username or password")
    case 500:
      throw new Error("Login failed")
    default:
      throw new Error("Unknown error")
  }
}
