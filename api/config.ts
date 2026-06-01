export const config = {
  PORT: Bun.env.PORT,
  JWT_SECRET: Bun.env.JWT_SECRET,
  REFRESH_SECRET: Bun.env.REFRESH_SECRET,
  FRONTEND_URL: "*",
  DB_CONN: Bun.env.DB_CONN,
  TOKEN_EXP: "3h", // expires is 3 hours
  API_TOKEN_EXP: "30d",
  REFRESH_EXP: "12h", // expires is 12 hours
  HASH_ALG: 'HS256',
  JWT_ISSUER: "gatherlink",
  JWT_AUDIENCE: "gatherlink_frontend",
  JWT_AUDIENCE_API: "linking_api",
  SALT_ROUNDS: 10,
  MAX_SCREENSHOT_TRIES: 3,
}
if (!config.JWT_SECRET || config.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set and at least 32 characters");
}
if (!config.REFRESH_SECRET || config.REFRESH_SECRET.length < 32) {
  throw new Error("REFRESH_SECRET must be set and at least 32 characters");
}
