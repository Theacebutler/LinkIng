import { screenshot } from "./screenshot"

export async function handleScreenshot(server: Bun.Server<undefined>, url: string | null | undefined, resourceID: number | undefined) {
  // TODO: take the screenshot
  const image = await screenshot(url, resourceID)
  if (!image) return
  // publish to the web socket
  server.publish("screenshot", image)
}
