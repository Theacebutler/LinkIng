import dotenv from "dotenv"

dotenv.config({ path: "./.env" })
export const config = {
  PORT: process.env.SCREENSHOTS_PORT,
}

if (!config.PORT) {
  throw new Error("PORT is not set")
}
