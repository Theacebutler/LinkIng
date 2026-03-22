import type { Resource } from "./shere/types";
import screenshot from "./utils/screenshot";
import { db } from "./db";
import { resourcesTable } from "./db/schema";
import { eq } from "drizzle-orm";

const screenshotCache: Record<string, Promise<string | undefined>> = {};

const server = Bun.serve({
  port: 3000,
  routes: {
    "/api/resources": {
      GET: () => {
        const resources = db.select().from(resourcesTable);
        const res = Response.json(resources);
        res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
        return res;
      },
      OPTIONS: () => {
        const res = Response.json({});
        res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin");
        return res;
      },
      POST: async (req) => {
        const body = await req.json() as Omit<Resource, 'id' | 'createdAt' | 'sourceImage'>;
        const newResource: Resource = {
          ...body,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        const image = screenshot(newResource.resourceUrl);
        const id = newResource.id;
        screenshotCache[id] = image;
        db.insert(resourcesTable).values(newResource);
        const res = Response.json(newResource);
        res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
        return res;
      },
    },
    "/api/resources/:id": {
      OPTIONS: () => {
        const res = Response.json({});
        console.log("OPTIONS /api/resources/:id");

        res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
        res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin");
        return res;
      },
      DELETE: (req) => {
        const id = req.params.id;
        db.delete(resourcesTable).where(eq(resourcesTable.id, id));
        const res = Response.json({ deleted: true });
        res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
        return res
      },
    },
    "/api/resources/screenshots/:id": {
      OPTIONS: () => {
        const res = Response.json({});
        res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
        res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type");
        return res;
      },
      GET: async (req) => {
        const id = req.params.id;
        const image = await screenshotCache[id];
        if (image) {
          const res = new Response(Buffer.from(image, 'base64'), {
            headers: {
              'Content-Type': 'image/png',
              'Access-Control-Allow-Origin': 'http://localhost:5173',
            },
          });
          return res;
        } else {
          return new Response(JSON.stringify({ error: "Image not found" }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'http://localhost:5173',
            },
          });
        }

      },
    },
  },
});

console.log(`API running at http://localhost:${server.port}`);
