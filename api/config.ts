
export const config = {
  PORT: process.env.PORT,
  JWT_SECRET: Bun.env.JWT_SECRET,
  REFRESH_SECRET: Bun.env.REFRESH_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  DB_CONN: Bun.env.DB_CONN,
  TOKEN_EXP: "3h", // expires is 3 hours
  REFRESH_EXP: "12h", // expires is 12 hours
  HASH_ALG: 'HS256',
  JWT_ISSUER: "gatherlink",
  JWT_AUDIENCE: "gatherlink_frontend",
  SALT_ROUNDS: 10,
  MAX_SCREENSHOT_TRIES: 3,
}
if (!config.JWT_SECRET || config.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set and at least 32 characters");
}
if (!config.REFRESH_SECRET || config.REFRESH_SECRET.length < 32) {
  throw new Error("REFRESH_SECRET must be set and at least 32 characters");
}

if (!config.FRONTEND_URL) {
  // config.FRONTEND_URL = "http://localhost:5173"
  console.warn("FRONTEND_URL is not set, defaulting to http://localhost:5173")
}
