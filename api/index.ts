import screenshot from "./utils/screenshot";

interface Resource {
  id: string;
  title: string;
  resourceUrl: string;
  sourceUrl: string;
  sourceImage?: string;
  createdAt: string;
}

const resources: Resource[] = [
  {
    "title": "foo",
    "resourceUrl": "https://foobar",
    "sourceUrl": "https://github.com",
    "id": "90b5cd37-36b7-46b5-8c85-6f27d8981ce5",
    "createdAt": "2026-03-20T02:00:46.574Z"
  }
];
const screenshotCache: Record<string, string> = {};

const server = Bun.serve({
  port: 3000,
  routes: {
    "/api/resources": {
      GET: () => {
        const res = Response.json(resources);
        res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
        console.log("GET /api/resources", resources.length, resources);
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

        // TODO: add a new image path that the image can fetch form the frontend, and its not tied to the data,
        // this will be a new DB table that will have a relationship to the resource table

        try {
          const id = newResource.id;
          const image = await screenshot(newResource.resourceUrl);
          screenshotCache[id] = image;
          console.log("screenshot", image, "for", id);
        } catch (err) {
          console.error('Screenshot failed:', err);
        }
        resources.push(newResource);
        const res = Response.json(newResource);
        res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
        console.log("POST /api/resources", resources.length, resources);
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
        const index = resources.findIndex((r) => r.id === id);
        if (index === -1) {
          return Response.json({ error: "Resource not found" }, { status: 404 });
        }
        resources.splice(index, 1);
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

        if (screenshotCache[id]) {
          const res = new Response(Buffer.from(screenshotCache[id], 'base64'), {
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
