import { apiResourcesGet, apiResourcesOpts, apiResourcesPost } from "./handlers/api_resources";
import { apiResourcesIdDelete, apiResourcesIdOpts } from "./handlers/api_resources_id";
import { apiResurceScreenshotGet, apiResurceScreenshotOpts } from "./handlers/api_resouces_screenshots";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/api/:name/resources": async (req) => {
      const name = req.params.name;
      return apiResourcesGet(name)
    },
    "/api/resources": {
      POST: async (req): Promise<Response> => apiResourcesPost(req, server),
      OPTIONS: () => apiResourcesOpts(),
    },
    "/api/resources/:id": {
      OPTIONS: () => apiResourcesIdOpts(),
      DELETE: async (req) => apiResourcesIdDelete(req),
    },
    "/api/resources/screenshots/:id": {
      OPTIONS: () => apiResurceScreenshotOpts(),
      GET: async (req) => apiResurceScreenshotGet(req),
    },
  },
});

console.log(`API running at http://localhost:${server.port}`);
