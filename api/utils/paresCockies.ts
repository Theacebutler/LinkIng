/**
 * Get a cookie value from a request object 

 * @param cookieName - The name of the cookie to get
 * @param request - The request object
 * @returns The value of the cookie or undefined if not found
 **/
export function parseCookies(cookieName: string, request: Request): string | undefined {
  const cookieHeader = request.headers.get("Cookie")
  if (!cookieHeader) return undefined
  const cookies = cookieHeader.split(";")
  for (const cookie of cookies) {
    const [k, v] = cookie.split("=")
    if (k.trim() === cookieName) {
      return v
    }
  }
  return undefined
}
