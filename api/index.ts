import { apiResourcesOpts } from "./handlers/api_resources";
import { apiResourceScreenshotGet } from "./handlers/api_resources_screenshots";

import { addResource, deleteResource, getResources } from "./handlers/protected";
import { config } from "./config";
import { login } from "./handlers/login";
import { logout } from "./handlers/logout";
import { refresh } from "./handlers/refresh";
import { register } from "./handlers/register";
import type { User } from "./shared/types";

const PORT = config.PORT
const server = Bun.serve({
  port: PORT,
  routes: {
    "/api/users/register": {
      POST: async (req): Promise<Response> => {
        return await register(req)
      },
      OPTIONS: async (): Promise<Response> => {
        const res = Response.json({}, { status: 204 });
        res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
        res.headers.set("Access-Control-Allow-Headers", "*");
        return res;
      },
    },
    "/api/users/login": {
      POST: async (req): Promise<Response> => {
        const { username, password } = await req.json() as User;;
        return await login(username, password, req.headers)
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
      DELETE: async (req): Promise<Response> => {
        return deleteResource(req)
      },
      OPTIONS: () => {
        return apiResourcesOpts()
      },
    },
    "/api/resources/:id": {
      OPTIONS: () => {
        const res = Response.json({});
        res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Authorization");
        return res;
      },

      DELETE: async (req) => {
        return deleteResource(req)
      },
    },
    "/api/resources/screenshots/:id": {
      OPTIONS: () => apiResourcesOpts(),
      GET: async (req) => apiResourceScreenshotGet(req),
    },
  },
});

console.log(`API running at ${server.protocol}://${server.hostname}:${server.port}`);
