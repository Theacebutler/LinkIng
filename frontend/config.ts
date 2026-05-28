export const config = {
  PORT: import.meta.env.PORT as string || "5173",
  VITE_API_URL: import.meta.env.VITE_API_URL as string || "api",
  ALLOWED_ORIGINS: "*",
  ACCESS_TOKEN_KEY_NAME: "accessToken",
  REFRESH_TOKEN_KEY_NAME: "refreshToken",
  MAX_IMAGE_POLLING_ATTEMPTS: 5,
};

if (!import.meta.env.PORT) {
  console.warn('PORT is not set');
}

if (!import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL is not set');
}
