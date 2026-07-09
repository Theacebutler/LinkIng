# Homepage / Landing Page Plan

## Goal

Build a small homepage at '/'. Move Login to '/login' and Dashboard to '/dashboard'.

## Files to modify

| File | Change |
|------|--------|
| frontend/package.json | Add react-router-dom |
| src/utils/authHelpers.ts | OAuth redirect from '/' to '/dashboard' (line ~122) |
| src/App.tsx | Add BrowserRouter, Routes, Route; remove isLogin conditional |

## Files to create

| File | Purpose |
|------|---------|
| src/pages/Landing.tsx | Hero page. Auto-redirect to dashboard if authenticated |
| src/pages/LoginPage.tsx | Wraps LoginOrReg at /login |
| src/pages/Dashboard.tsx | App interface, receives all App-level state as props |

## Architecture

- App.tsx remains the single state owner (all hooks and state stay there)
- App.tsx wraps in BrowserRouter and Routes with three routes

| Path | Not authenticated | Authenticated |
|------|-------------------|---------------|
| / | Landing page | Auto-redirect to /dashboard |
| /login | Login form | Auto-redirect to /dashboard |
| /dashboard | Auto-redirect to /login | Dashboard |

## Landing.tsx

Three sections:

1. Hero
   - Brand chain-link icon
   - Headline: "Your resources, all in one place"
   - Tagline
   - Two buttons: Get Started (link to /login), View on GitHub (external)
   - Responsive: buttons stack on mobile

2. How It Works
   - 3 steps: Sign in, Save a link, Find it
   - Icons + title + short description
   - Desktop: row of 3 cards
   - Mobile: stack vertically

3. Bottom CTA
   - prompt to get started
   - Button to /login

## Unchanged

- src/main.tsx
- src/components/LoginOrReg.tsx
- All other components

## Verification

- navigate to / -> landing shows
- hitting / while logged in redirects to /dashboard
- OAuth callback redirects to /dashboard
- /login redirects to /dashboard if authenticated
- /dashboard redirects to /login if not
- responsive layout works
