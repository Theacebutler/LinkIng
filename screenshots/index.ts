import { config } from "./config.ts"


export const server = Bun.serve({
  port: config.PORT,
  routes: {
    "/api/screenshots/:id": async (req): Promise<Response> => {
      const id = req.params.id
      // TODO: add the request to a queue
      // TODO: figure out what to respond, maybe with a message teat
      // the request is processed and will be read soon.
      console.log(id)
      return new Response("ok")
    }
  }
})
