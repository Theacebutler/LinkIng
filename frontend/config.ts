export const config = {
  PORT: import.meta.env.PORT as string || "5173",
  VITE_API_URL: import.meta.env.VITE_API_URL as string || "",
  ALLOWED_ORIGINS: "*",
};

if (!import.meta.env.PORT) {
  console.warn('PORT is not set');
}

if (!import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL is not set');
}
