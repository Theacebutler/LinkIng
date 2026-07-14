import { config } from "../../config";

export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/"
}


export function setAccessTokenCookie(token: string): string {
  const maxAge = 60 * 15 // 15 min
  return `${config.ACCESS_TOKEN_KEY_NAME}=${token}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/`;
}


export function setRefreshTokenCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60 // 7 days
  return `${config.REFRESH_TOKEN_KEY_NAME}=${token}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/auth/refresh`;
}


// Clear auth cookies for logout
export function clearAuthCookies(): string[] {
  return [
    `${config.ACCESS_TOKEN_KEY_NAME}=; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Path=/`,
    `${config.REFRESH_TOKEN_KEY_NAME}=; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Path=/`,
  ];
}


// parse cookie from request headers
export function parseCookies(cookieHeader: string | null): Map<string, string> {
  const cookies = new Map<string, string>();
  if (!cookieHeader) {
    return cookies;
  }
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [name, value] = pair.trim().split('=');
    if (name && value) {
      cookies.set(name, value)
    }
  }
  return cookies;
}
