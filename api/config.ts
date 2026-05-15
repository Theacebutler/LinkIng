export const config = {
  JWT_SECRET: Bun.env.JWT_SECRET,
  REFRESH_SECRET: Bun.env.REFRESH_SECRET,
  FRONTEND_URL: Bun.env.FRONTEND_URL,
  DB_CONN: Bun.env.DB_CONN,
  TOKEN_EXP: 60 * 60 * 1, // expires in 1 hour
  REFRESH_EXP: 60 * 60 * 12, // expires in 1 hour
  HASH_ALG: 'HS256',
  JWT_ISSUER: "gatherlink",
}
if (!config.JWT_SECRET || config.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set and at least 32 characters");
}
if (!config.REFRESH_SECRET || config.REFRESH_SECRET.length < 32) {
  throw new Error("REFRESH_SECRET must be set and at least 32 characters");
}
