// Example protected routes that require authentication

import { withAuth, type AuthenticatedRequest } from "../utils/token_gen";
import { apiResourcesGet, apiResourcesPost } from "./api_resources";

// Helper for JSON responses
function json(data: object, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const getResources = withAuth(
  async (request: AuthenticatedRequest): Promise<Response> => {
    return apiResourcesGet(request.user?.sub as string);
  }
)


export const addResource = withAuth(
  async (request: AuthenticatedRequest): Promise<Response> => {
    return apiResourcesPost(request)
  }
)
