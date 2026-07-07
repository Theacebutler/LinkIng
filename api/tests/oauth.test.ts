import { describe, expect, test, mock, beforeAll, afterAll } from "bun:test";

mock.module("oslo/oauth2", () => ({
  generateState: () => "test-state-abc123",
  OAuth2Client: class {
    constructor() { }
    async createAuthorizationURL(opts: { state: string; scopes: string[] }) {
      return new URL(
        `https://accounts.google.com/o/oauth2/v2/auth?state=${opts.state}&client_id=test`
      );
    }
    async validateAuthorizationCode() {
      return { access_token: "mocked-google-token" };
    }
  },
}));

import { getRedirectUrl, googleOAuthCallback } from "../handlers/auth";
import { parseCookies } from "../utils/paresCockies";

const OAUTH_TEST_USER = `oauth-test-${Math.random().toString(36).substring(7)}`;
const originalFetch = globalThis.fetch;

function extractCookieValue(setCookie: string | null, name: string): string | null {
  if (!setCookie) return null;
  const parts = setCookie.split("; ");
  for (const part of parts) {
    const eqIdx = part.indexOf("=");
    if (eqIdx > -1 && part.slice(0, eqIdx) === name) return part.slice(eqIdx + 1);
  }
  return null;
}

describe("parseCookies utility", () => {
  test("extracts cookie by name from Cookie header", () => {
    const req = new Request("http://localhost", {
      headers: { Cookie: "oauth_state=test-value; other=val" },
    });
    expect(parseCookies("oauth_state", req)).toBe("test-value");
  });

  test("returns undefined when no Cookie header", () => {
    const req = new Request("http://localhost");
    expect(parseCookies("oauth_state", req)).toBeUndefined();
  });

  test("returns undefined when cookie name not found", () => {
    const req = new Request("http://localhost", {
      headers: { Cookie: "some_other=value" },
    });
    expect(parseCookies("oauth_state", req)).toBeUndefined();
  });

  test("handles multiple cookies and picks the correct one", () => {
    const req = new Request("http://localhost", {
      headers: { Cookie: "a=1; b=2; oauth_state=target; c=3" },
    });
    expect(parseCookies("oauth_state", req)).toBe("target");
  });
});

describe("getRedirectUrl", () => {
  test("returns 200 with redirectUrl in body", async () => {
    const res = await getRedirectUrl();
    expect(res.status).toBe(200);

    const data = await res.json() as { redirectUrl: string };
    expect(data.redirectUrl).toBeDefined();
    expect(data.redirectUrl).toContain("https://accounts.google.com");
    expect(data.redirectUrl).toContain("test-state-abc123");
  });

  test("sets Set-Cookie header with oauth_state and security flags", async () => {
    const res = await getRedirectUrl();
    const setCookie = res.headers.get("Set-Cookie");
    expect(setCookie).toContain("oauth_state=test-state-abc123");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toContain("Max-Age=300");
  });
});

describe("googleOAuthCallback error paths", () => {
  test("returns 400 when code is missing", async () => {
    const req = new Request("http://localhost:5173/");
    const res = await googleOAuthCallback(req);
    expect(res.status).toBe(400);
    const data = await res.json() as { error: string };
    expect(data.error).toContain("code");
  });

  test("returns 400 when state param is missing (cookie present)", async () => {
    const req = new Request("http://localhost:5173/?code=some-code", {
      headers: { Cookie: "oauth_state=test-state-abc123" },
    });
    const res = await googleOAuthCallback(req);
    expect(res.status).toBe(400);
  });

  test("returns 400 when cookie is missing (state param present)", async () => {
    const req = new Request("http://localhost:5173/?code=some-code&state=test-state-abc123");
    const res = await googleOAuthCallback(req);
    expect(res.status).toBe(400);
  });

  test("returns 400 when state param does not match cookie", async () => {
    const req = new Request(
      "http://localhost:5173/?code=some-code&state=wrong-state",
      { headers: { Cookie: "oauth_state=test-state-abc123" } },
    );
    const res = await googleOAuthCallback(req);
    expect(res.status).toBe(400);
    const data = await res.json() as { error: string };
    expect(data.error).toContain("mismatch");
  });
});

describe("googleOAuthCallback success path", () => {
  beforeAll(() => {
    const mockFetch = mock(async (url: string | URL | Request, init?: RequestInit) => {
      if (url.toString().includes("googleapis.com")) {
        return new Response(
          JSON.stringify({
            id: 999999,
            name: OAUTH_TEST_USER,
            given_name: "Test",
            family_name: "User",
            picture: "",
          }),
        );
      }
      return new Response("{}");
    });
    globalThis.fetch = mockFetch as unknown as typeof globalThis.fetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  test("returns 200 with accessToken, refreshToken, tokenType, and expiresIn", async () => {
    const req = new Request(
      "http://localhost:5173/?code=valid-code&state=test-state-abc123",
      { headers: { Cookie: "oauth_state=test-state-abc123" } },
    );
    const res = await googleOAuthCallback(req);
    expect(res.status).toBe(200);
    const data = await res.json() as {
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
    };
    expect(data.accessToken).toBeDefined();
    expect(typeof data.accessToken).toBe("string");
    expect(data.refreshToken).toBeDefined();
    expect(typeof data.refreshToken).toBe("string");
    expect(data.tokenType).toBe("Bearer");
    expect(data.expiresIn).toBe(900);
  });

  test("clears oauth_state cookie on success via Max-Age=0", async () => {
    const req = new Request(
      "http://localhost:5173/?code=valid-code&state=test-state-abc123",
      { headers: { Cookie: "oauth_state=test-state-abc123" } },
    );
    const res = await googleOAuthCallback(req);
    const setCookie = res.headers.get("Set-Cookie");
    expect(setCookie).toContain("oauth_state=");
    expect(setCookie).toContain("Max-Age=0");
  });
});

describe("end-to-end OAuth state flow", () => {
  const E2E_USER = `oauth-e2e-${Math.random().toString(36).substring(7)}`;

  beforeAll(() => {
    const mockFetch = mock(async (url: string | URL | Request, init?: RequestInit) => {
      if (url.toString().includes("googleapis.com")) {
        return new Response(
          JSON.stringify({ id: 777, name: E2E_USER }),
        );
      }
      return new Response("{}");
    });
    globalThis.fetch = mockFetch as unknown as typeof globalThis.fetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  test("getRedirectUrl returns state cookie -> callback with matching state succeeds", async () => {
    const redirectRes = await getRedirectUrl();
    expect(redirectRes.status).toBe(200);
    const setCookie = redirectRes.headers.get("Set-Cookie");
    expect(setCookie).toBeDefined();

    const state = extractCookieValue(setCookie, "oauth_state");
    expect(state).toBe("test-state-abc123");

    const callbackReq = new Request(
      `http://localhost:5173/?code=matching-code&state=${state}`,
      { headers: { Cookie: `oauth_state=${state}` } },
    );
    const callbackRes = await googleOAuthCallback(callbackReq);
    expect(callbackRes.status).toBe(200);
    const data = await callbackRes.json() as { accessToken: string };
    expect(data.accessToken).toBeDefined();
  });

  test("callback rejects when state cookie is tampered with", async () => {
    const callbackReq = new Request(
      "http://localhost:5173/?code=matching-code&state=tampered-state",
      { headers: { Cookie: "oauth_state=test-state-abc123" } },
    );
    const callbackRes = await googleOAuthCallback(callbackReq);
    expect(callbackRes.status).toBe(400);
    const data = await callbackRes.json() as { error: string };
    expect(data.error).toContain("mismatch");
  });
});
