export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/"
}


// Clear auth cookies for logout
export function clearAuthCookies(): string[] {
  return [
    "access_token=; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Path=/",
    "refresh_token=; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Path=/auth/refresh",
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
