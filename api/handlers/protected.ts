// Example protected routes that require authentication

import { withAuth, type AuthenticatedRequest } from "../utils/token_gen";
import { apiResourcesGet } from "./api_resources";

// Helper for JSON responses
function json(data: object, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const getResources = withAuth(
  async (request: AuthenticatedRequest): Promise<Response> => {
    console.log("body: ", request.body);
    const name = request.user;
    console.log("name: ", name);
    return apiResourcesGet(request.user?.sub as string);
  }
)
