import { apiResourcesOpts } from "./handlers/api_resources";
import { apiResourcesIdDelete, apiResourcesIdOpts } from "./handlers/api_resources_id";
import { apiResurceScreenshotGet, apiResurceScreenshotOpts } from "./handlers/api_resouces_screenshots";

import { addResource, getResources } from "./handlers/protected";
import { login } from "./handlers/login";
import { logout } from "./handlers/logout";
import { refresh } from "./handlers/refresh";
import { register } from "./handlers/register";
import { config } from "./config";


const server = Bun.serve({
  port: 3000,
  routes: {
    "/api/users/register": {
      POST: async (req): Promise<Response> => {
        return await register(req)
      },
      OPTIONS: async (): Promise<Response> => {
        const res = Response.json({}, { status: 204 });
        res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin");
        return res;
      },
    },
    "/api/users/login": {
      POST: async (req): Promise<Response> => {
        return await login(req)
      }
    },
    "/api/users/refresh": {
      POST: async (req): Promise<Response> => {
        return await refresh(req)
      }
    },
    "/api/users/logout": {
      POST: async (req): Promise<Response> => {
        return await logout(req)
      }
    },

    "/api/resources": {
      GET: async (req) => {
        // the getResources function is assuming that the request is authenticated with a valid token
        return getResources(req)
      },
      POST: async (req): Promise<Response> => {
        return addResource(req);
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
