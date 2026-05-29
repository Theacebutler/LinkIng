import { expect, test } from "bun:test"
import { config } from "../config.ts"

test("START API", async () => {
  const res = await fetch(`http://localhost:${config.PORT}/api/screenshots/1`)
  expect(res.status).toBe(200)
})
