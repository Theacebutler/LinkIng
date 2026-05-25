import { verifyAccessToken, type TokenPayload } from "./jwt"




export interface AuthenticatedRequest extends Request {
  user: TokenPayload
}


export async function authMiddleware(request: AuthenticatedRequest): Promise<AuthenticatedRequest | Response> {
  // take in a request with the token 
  const authHeader = request.headers.get("Authorization")
  if (!authHeader) {
    return Response.json(
      { error: "Authorization header missing" },
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }
  if (!authHeader.startsWith("Bearer ")) {
    return Response.json(
      { error: "Authorization header must start with Bearer" },
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }

  // extract the token from the header
  const token = authHeader.substring(7)
  if (!token) {
    return Response.json(
      { error: "token missing" },
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }
  try {
    const payload = await verifyAccessToken(token)
    request.user = payload
    return request
  } catch (err) {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }
}

export function withAuth(
  // this takes in a function to run if the request is authenticated and returns the
  // response after authenticating it
  handler: (req: AuthenticatedRequest, server?: Bun.Server<undefined>) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    // if the request is not authenticated, this with return a 
    const res = await authMiddleware(request as AuthenticatedRequest);
    if (res instanceof Response) {
      return res
    }
    return handler(res)
  }
}
