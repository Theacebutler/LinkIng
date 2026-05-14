import { apiResourcesGet, apiResourcesOpts, apiResourcesPost } from "./handlers/api_resources";
import { apiResourcesIdDelete, apiResourcesIdOpts } from "./handlers/api_resources_id";
import { apiResurceScreenshotGet, apiResurceScreenshotOpts } from "./handlers/api_resouces_screenshots";

import { createUser, createUserResponse } from "./handlers/create_user";
import { type user } from "./shered/types";


const server = Bun.serve({
  port: 3000,
  routes: {
    "/api/user/": {
      POST: async (req) => {
        const body = await req.json() as user;
        const data = await createUser(body);
        const out = await createUserResponse(data);
        return out;
      }
    },
    "/api/:name/resources": {
      GET: async (req) => {
        const name = req.params.name;
        return apiResourcesGet(name);
      },
      POST: async (req): Promise<Response> => {
        const name = req.params.name;
        return apiResourcesPost(req, server, name);
      },

      OPTIONS: () => {
        return apiResourcesOpts()
      },
    },
    "/api/:name/resources/:id": {
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
