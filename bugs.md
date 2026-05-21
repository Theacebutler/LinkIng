# 🐛 Bug Report: LinkIng

## 🔴 CRITICAL

**1. `api/handlers/refresh.ts:51` — `payload.usernam` typo (missing 'e')**
- `payload.usernam` should be `payload.username` → `undefined` is passed to `createRefreshToken()`. The token refresh flow is completely broken — after the first refresh, the new tokens have no valid `sub` claim.

**2. `frontend/src/utils/register.ts:20` — Bitwise OR instead of logical OR**
- `case 200 | 201:` evaluates to `case 201:` (bitwise OR: `200 | 201 = 201`). If the server returns HTTP 200 (success), the case doesn't match and falls to `default`, throwing `"Unknown error"`. Registration on HTTP 200 silently fails.

**3. `frontend/src/utils/cookies.ts` — HttpOnly cookies set from client-side JS is impossible**
- `setAccessTokenCookie()` generates a cookie string like `access_token=...; HttpOnly; Secure; ...`, then `login.ts:23` stores the *entire cookie string* as the **value** of a cookie named `accessToken` via `Cookies.set()`. The result is a cookie named `accessToken` whose value is a full `Set-Cookie` header string. Auth is completely broken:
  - The `HttpOnly` flag is ignored (can't be set from JS)
  - The cookie name is `accessToken`, but `parseCookies()` looks for `access_token` → `ACCESS_TOKEN` is always `undefined`
  - All API requests fail because `Authorization: Bearer undefined` is sent

**4. `frontend/src/utils/cookies.ts:17` — Wrong cookie name in `setRefreshTokenCookie`**
- Line 17: ``access_token=${token}...`` — sets a cookie named `access_token` instead of `refresh_token`. The refresh token overwrites the access token cookie.

**5. `api/handlers/api_resources.ts:31` — `req.user.sub` on wrong type**
- `req` is typed as plain `Request`, but `user` only exists on `AuthenticatedRequest`. While `withAuth` does attach `.user` at runtime, this is a type hole that TypeScript should catch. If the function is ever called without going through `withAuth`, it crashes.

## 🟠 HIGH

**6. `api/db/schema.ts` — `drizzle-orm/pg-core` used with SQLite dialect**
- Schema imports from `drizzle-orm/pg-core` (`pgTable`, `serial`) but the runtime uses `bun:sqlite` + `drizzle-orm/bun-sqlite`, and `drizzle.config.ts` specifies `dialect: 'sqlite'`. `pgTable` generates PostgreSQL SQL — this causes schema/migration mismatches. Miraculously works because the migration SQL is hand-written SQLite-compatible, but `drizzle-kit generate` would produce broken SQL.

**7. `api/utils/screenshot.ts` — Unhandled promise rejection**
- Called fire-and-forget in `apiResourcesPost:42`. If puppeteer fails (bad URL, timeout, no chromium), Bun treats unhandled rejections as **fatal process crashes** by default. One bad URL and the entire server goes down.

**8. `api/handlers/api_resources.ts:57` — Hardcoded CORS origin**
- ``http://localhost:5173`` hardcoded instead of `config.FRONTEND_URL`. Breaks in production deployment.

**9. `api/handlers/api_resouces_screenshots.ts:8` — Hardcoded CORS origin**
- Same issue: ``http://localhost:5173`` hardcoded on line 8 (OPTIONS handler).

**10. `api/utils/token_gen.ts:15-17, 21-24, 31-33` — `Content-Type` header has spaces**
- ``"application / json"`` (with spaces) → browser won't parse as JSON. Error messages from auth middleware are served with an invalid content type.

## 🟡 MEDIUM

**11. `frontend/src/hooks/useResources.ts:10-11` — Cookies parsed at module level (once)**
- `parseCookies()` runs when module first loads, not when cookies change. Without the `window.location.reload()` in `register.ts`, the hook would never pick up new auth tokens.

**12. `api/handlers/login.ts:42` and `api/handlers/refresh.ts:66` — `expiresIn: 900` vs actual JWT `3h`**
- Client told token expires in 15 min (`expiresIn: 900`) but the JWT is issued with `TOKEN_EXP: "3h"` (3 hours). Inconsistency causes premature token refresh attempts.

**13. `frontend/src/hooks/useResources.ts:41` — `Cookies.get('name')` always returns empty**
- No code ever sets a cookie named `name`. The `owner` field sent to the API is always `""`. Works only because the server overwrites it with the JWT `sub`.

**14. `frontend/src/components/ResourceImage.tsx:30-34` — `useEffect` with no dependency array**
- Runs the polling setup on **every render**, not just mount. Creates cascading `setTimeout` chains. The `loaded` guard prevents infinite loops but wasted renders still fire new 300ms delays.

**15. `api/utils/validateCred.ts:19` — Wasteful bcrypt hash on missing user**
- Intentionally calls `bcrypt.hash(password, 10)` for timing-attack mitigation, but discards the result. Each failed login wastes ~100ms+ of CPU. This is 10 bcrypt rounds thrown away.

**16. `api/handlers/login.ts` — No OPTIONS handler on `/api/users/login`**
- CORS preflight requests to the login endpoint will fail (no OPTIONS handler registered in `index.ts`).

**17. `api/handlers/refresh.ts` — No OPTIONS handler on `/api/users/refresh`**
- Same issue as #16.

**18. In-memory token store (`api/utils/tokenStore.ts`)**
- All refresh tokens lost on server restart. Every restart forces all users to re-login. Comments acknowledge this but no persistence is implemented.

## 🔵 LOW (Typos / Cleanup)

| # | File | Issue |
|---|------|-------|
| 19 | `api/handlers/api_resouces_screenshots.ts` | Filename: "resouces" → "resources" (missing 'r') |
| 20 | `api/handlers/api_resouces_screenshots.ts:6,14` | `apiResurceScreenshot*` → `apiResourceScreenshot*` (missing 'o') |
| 21 | `api/handlers/api_resources.ts:12` | `resouce` → `resource` in `.where()` callback |
| 22 | `api/utils/validateCred.ts:8` | `validateCredentils` → `validateCredentials` |
| 23 | `api/utils/jwt.ts:18` | `ranbdomTokenID` → `randomTokenID` |
| 24 | `api/utils/token_gen.ts:11` | `authMiddlewate` → `authMiddleware` |
| 25 | `api/handlers/create_user.ts` | Dead code — entire file unused, duplicates `register.ts` |
| 26 | `api/tests/auth_routes.test.ts` | Login test URL says `/register/`; login test body shaped as register body |
