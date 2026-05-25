import { config } from "../config";

// Helper for JSON responses
export function json(data: object, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": config.FRONTEND_URL as string,
    },
  });
}
export const SALT_ROUNDS = 10

