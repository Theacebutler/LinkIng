import { apiResourcesOpts, apiAppleShortcutsPost } from "./handlers/api_resources";
import { apiResourceScreenshotGet, apiResourceScreenshotGetImage } from "./handlers/api_resources_screenshots";

import { addResource, deleteResource, getResources, updateResource } from "./handlers/protected";
import { config } from "./config";
import { googleOAuthCallback, getRedirectUrl as googleOAuthLogin, login, logout, refresh, register } from "./handlers/auth";
import { getUserKey } from "./handlers/protected";

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
    "/api/users/get-key": {
      OPTIONS: () => {
        const res = Response.json({});
        res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PATCH");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Authorization");
        return res;
      },
      GET: async (req): Promise<Response> => {
        return await getUserKey(req)
      },
    },

    "/api/auth/google/login": {
      GET: async (_req) => {
        console.log("CALLED: /api/auth/google/login");
        return await googleOAuthLogin()
      }
    },
    "/api/auth/google/callback": {
      GET: async (req) => {
        console.log("CALLED: /api/auth/google/callback");
        return googleOAuthCallback(req)
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
      PATCH: async (req): Promise<Response> => {
        return updateResource(req)
      },
      DELETE: async (req) => {
        return deleteResource(req)
      },
      OPTIONS: () => {
        const res = Response.json({});
        res.headers.set("Access-Control-Allow-Origin", config.FRONTEND_URL as string);
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PATCH");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Authorization");
        return res;
      },
    },
    "/api/resources/apple-shortcuts": {
      POST: async (req): Promise<Response> => {
        return apiAppleShortcutsPost(req);
      }
    },
    "/api/resources/screenshots/:id/image": {
      OPTIONS: () => apiResourcesOpts(),
      GET: async (req) => apiResourceScreenshotGetImage(req),
    },
  },
});

console.log(`API running at ${server.protocol}://${server.hostname}:${server.port}`);
