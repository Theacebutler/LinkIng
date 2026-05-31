import { withAuth, type AuthenticatedRequest } from "../utils/token_gen";
import { apiResourcesGet, apiResourcesPost, apiResourcesIdDelete, apiResourcesIdUpdate } from "./api_resources";


export const getResources = withAuth(
  async (request: AuthenticatedRequest): Promise<Response> => {
    return apiResourcesGet(request);
  }
)

export const addResource = withAuth(
  async (request: AuthenticatedRequest): Promise<Response> => {
    return apiResourcesPost(request)
  }
)

export const updateResource = withAuth(
  async (request: AuthenticatedRequest): Promise<Response> => {
    return apiResourcesIdUpdate(request)
  }
)
export const deleteResource = withAuth(
  async (request: AuthenticatedRequest): Promise<Response> => {
    return apiResourcesIdDelete(request)
  }
)
