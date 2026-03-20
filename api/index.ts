interface Resource {
  id: string;
  title: string;
  resourceUrl: string;
  sourceUrl: string;
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
        const body = await req.json() as Omit<Resource, 'id' | 'createdAt'>;
        const newResource: Resource = {
          ...body,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
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
  },
});

console.log(`API running at http://localhost:${server.port}`);
