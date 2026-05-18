const COOKIE_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/"
}


export function setAccessTokenCookie(token: string): string {
  const maxAge = 60 * 15 // 15 min
  return `access_token=${token}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/`;
}


export function setRefreshTokenCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60 // 7 days
  return `access_token=${token}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/refresh`;
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

// create the cookie based login response
export async function loginWithCookie(
  // request: Request,
  accessToken: string,
  refreshToken: string
): Promise<Response> {
  const response = new Response(
    JSON.stringify({ message: "looged in successfully" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": setAccessTokenCookie(accessToken),
      }
    }
  )
  response.headers.set("Set-Cookie", setRefreshTokenCookie(refreshToken))
  return response;
}
