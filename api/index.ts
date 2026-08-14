import { apiResourcesOpts, apiAppleShortcutsPost, apiResourcesGetWithKey } from "./handlers/api_resources";
import { apiResourceScreenshotGetImage } from "./handlers/api_resources_screenshots";

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
        try {
          return await googleOAuthCallback(req)
        } catch (error) {
          console.error("Google OAuth callback error:", error)
          return Response.json({ error: "Google OAuth callback failed" }, { status: 400 })
        }
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
    },
    "/api/resources/api-key/": {
      GET: async (req): Promise<Response> => {
        console.log("CALLED: /api/resources/api-key")
        return apiResourcesGetWithKey(req)
      }
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
