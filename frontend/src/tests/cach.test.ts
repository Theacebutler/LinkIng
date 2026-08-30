import { describe, expect, test } from "bun:test";
import { cacheImage, getImage } from "../utils/cache"
import { config } from "../../config";
import getBase64String from "../utils/getBase64string";

const API_BASE = process.env.API_URL ?? "http://localhost:3005";
const api = (path: string) => `${API_BASE}${config.VITE_API_URL}${path}`;

const username = `cache-test-${Date.now()}`;
const password = "test-password";

async function getAccessToken(): Promise<string> {
  await fetch(api("/users/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const res = await fetch(api("/users/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(`login failed: ${res.status}`);
  const data = (await res.json()) as { accessToken: string };
  return data.accessToken;
}

async function getImageUrl(token: string): Promise<string> {
  const auth = { Authorization: `Bearer ${token}` };

  let res = await fetch(api("/resources"), { headers: auth });
  let resources = (await res.json()) as { id: number }[];

  if (resources.length === 0) {
    await fetch(api("/resources"), {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ resourceUrl: "https://github.com", title: "cache test resource" }),
    });

    res = await fetch(api("/resources"), { headers: auth });
    resources = (await res.json()) as { id: number }[];
  }

  return api(`/resources/screenshots/${resources[0].id}/image`);
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

describe("cacheImage", () => {
  test("gets the raw base64 string for an image from the api", async () => {
    const token = await getAccessToken();
    const imageUrl = await getImageUrl(token);
    const data = await getBase64String(imageUrl)
    expect(data).toBeString()
    // cache the image
    await cacheImage(imageUrl, data!);

    // get the same image from cache
    const cachedImage = getImage(imageUrl)

    // get the same image from the API
    const res = await fetch(imageUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.ok).toBe(true);

    const base64 = toBase64(new Uint8Array(await res.arrayBuffer()));
    expect(typeof base64).toBe("string");
    expect(typeof cachedImage).toBe("string");
    expect(base64.length).toBeGreaterThan(0);
    expect(cachedImage).toEqual(base64)
  });
});
