import { withAuth, type AuthenticatedRequest } from "../utils/token_gen";
import { apiResourcesGet, apiResourcesPost, apiResourcesIdDelete } from "./api_resources";


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


export const deleteResource = withAuth(
  async (request: AuthenticatedRequest): Promise<Response> => {
    const id = request.params.id as number;
    const name = request.user?.sub as string;
    return apiResourcesIdDelete(name, id)
  }
)
