## STONEPAD RR — Developer README

This document gives you a concise, high-signal overview of the project so you can work productively without reading every file.


### What this app is
- **Purpose**: A Health & Safety CRM for construction companies.
- **Form factor**: Single Page Application (SPA) built with React + TypeScript + Vite.
- **Auth**: Supabase Auth with Staff vs Worker user types, CAPTCHA (Cloudflare Turnstile), optional access tokens via Supabase Edge Functions.
- **Data**: Supabase database and functions; rich UI modules for Dashboard, Projects, Workers, Health & Safety, Contracts, Purchase Orders, Quotes, Site Survey, Admin tooling, etc.
- **PDFs**: Heavy use of `jsPDF` and `jspdf-autotable` to generate professional documents (contracts, policies, RAMS, toolbox talks, etc.).


## Tech stack
- React 18, TypeScript 5, Vite 5
- React Router 6
- Tailwind CSS 3
- Supabase JS v2
- jsPDF + jspdf-autotable + html2canvas
- Charts and UI: `@nivo/*`, `lucide-react`
- Drag & drop: `@dnd-kit/*`, `react-beautiful-dnd`
- Gantt: `wx-react-gantt`
- Deployment: Netlify (SPA redirect configured)


## Project layout (high-level)
- `index.html`: Single root with `<div id="root" />`
- `src/main.tsx`: App bootstrap; wraps in `BrowserRouter` and `ThemeProvider`
- `src/App.tsx`: Central routing and session/user-type handling
- `src/context/ThemeContext.tsx`: Dark mode state synced to `localStorage` and `documentElement`
- `src/lib/supabase.ts`: Supabase client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- `src/components/`: Feature UI (large surface area)
  - `Dashboard/` (Main and SubDashboards, navbar/sidebar/widgets/modals)
  - `Workers/` (Worker dashboard, profile, questionnaires, policies, risk assessments, QR scanning, etc.)
  - `Projects/` (Project forms, lists, site check-ins, tabs)
  - `HealthSafety/` (Accidents, COSHH, CPP, DSE, Equipment, Policies, RAMS, etc.)
  - `CompanySettings/`, `Contracts/`, `Customers/`, `Leads/`, `PurchaseOrders/`, `Quotes/`, `Settings/`, `SiteSurvey/`, `Admin/*`
  - Auth pages: `AuthForm.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`
- `src/utils/`
  - `form/`: Small helpers, validation, and reusable form components
  - `pdf/`: PDF generators grouped by domain (contracts, policies, RAMS, toolbox talks, vehicles, etc.)
  - `calendar/`: Calendar utilities
  - `formatters.ts`, `adminPassword.ts` (invokes an admin password Edge Function)
- `src/styles/`
  - `main/style.css`, `overrides/style.css`
  - `pdffont.ts` shared PDF style constants
  - visual components like `aurora/Aurora.tsx`, `spotlight/SpotlightCard.tsx`
- `src/types/`: Supabase database types and domain types
- `public/`: images, `_redirects`, licenses


## Local development
1. Prereqs: Node 18+ recommended (Vite 5)
2. Install: `npm install`
3. Env file: create `.env` in the project root with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run dev server: `npm run dev` (Vite is configured to start on port 3000 and auto-open)
5. Lint: `npm run lint`
6. Build: `npm run build`
7. Preview: `npm run preview`


## Deployment (Netlify)
- `netlify.toml` builds with `npm run build` and publishes `dist/`.
- SPA routing is configured to rewrite all paths to `/index.html` (`_redirects` + `netlify.toml`).
- Set environment variables in Netlify:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`


## Authentication and user types
- Supabase auth session checked on load and on auth state changes.
- `App.tsx` stores a `userType` hint in `localStorage` (`'staff' | 'worker'`) and renders:
  - Staff: `Dashboard`
  - Worker: `WorkerDashboard`
- First worker login: if no `workers` table row exists for the auth user, the app attempts to create one (non-blocking if it fails).
- CAPTCHA: `AuthForm.tsx` uses Cloudflare Turnstile (site key currently hard-coded). Verification is delegated to a Supabase Edge Function (`verify-captcha`).
- Additional Edge Functions used:
  - `validate-user-type`: validates a login attempt matches staff/worker
  - `verify-token`: used during sign-up (e.g., staff/worker join tokens)
  - `admin-password`: verify/update admin password

Password reset
- `ForgotPassword.tsx`: requests email via `supabase.auth.resetPasswordForEmail` with redirect to `/reset-password`
- `ResetPassword.tsx`: handles both short OTP codes and JWT-based flows; ultimately calls `supabase.auth.updateUser({ password })`


## Routing overview
- Defined in `src/App.tsx` using `useRoutes`:
  - `/` → staff or worker dashboard depending on `userType`
  - `/project/:id` → dashboard filtered to a project
  - `/site-checkin/:siteId`
  - `/login`, `/forgot-password`, `/reset-password`
  - `/workers/risk-assessments`, `/workers/policies`
  - `/worker-dashboard` (worker dashboard when authenticated)
  - fallback `*` → `/`


## Forms
- `src/utils/form/` has common building blocks:
  - `helpers.ts` (date formatting, step validation factory)
  - `validation.ts` (field validation helpers)
  - `components/` reusable inputs/steppers


## PDF generation
- Heavily organized under `src/utils/pdf/*`
- Uses `jsPDF` + `jspdf-autotable`; some modules add logos via Supabase storage URLs.
- Common styling in `src/styles/pdffont.ts` (font, colors, spacing, layout helpers).
- Examples:
  - Contracts: `src/utils/pdf/contracts/*`
  - RAMS: `src/utils/pdf/rams/*`
  - Toolbox Talks: `src/utils/pdf/toolbox/*`
  - Boards/Signage: `src/utils/pdf/boardsignage/*`
  - Policies, DSE, CPP, Risk Assessments, Vehicles, etc.


## Styling and theming
- TailwindCSS configured in `tailwind.config.js` (class-based dark mode).
- Global styles: `src/styles/main/style.css` and `src/styles/overrides/style.css`
- App-wide dark mode: `ThemeProvider` writes theme to `localStorage('theme')` and toggles `html.dark`.


## Supabase data notes
- The app references tables like `workers`, `projects`, `customers`, `sites`, and many more for H&S modules.
- Types live in `src/types/database.ts` (you can regenerate via Supabase CLI if you own the backend).
- Ensure RLS policies are configured to match frontend access patterns (especially for worker sign-in and signature flows).


## Build, quality, and scripts
- Scripts (`package.json`):
  - `dev`: Vite dev server
  - `build`: Vite build
  - `preview`: Vite preview
  - `lint`: ESLint (TS + React + hooks + refresh)


## Edge Functions required (summary)
- `validate-user-type`: prevent wrong tab logins
- `verify-captcha`: validate Cloudflare Turnstile token
- `verify-token`: gatekeeping signup tokens (staff/worker)
- `admin-password`: verify/update admin password

Deploy these in Supabase and set any secrets (e.g., Turnstile secret) there. Frontend calls them with `supabase.functions.invoke(...)`.


## Known caveats
- Ports: Dev server runs on port 3000 per `vite.config.ts`.
- Turnstile site key is hard-coded in `AuthForm.tsx`; consider moving to `VITE_TURNSTILE_SITE_KEY`.
- SPA redirects are configured both via `public/_redirects` and `netlify.toml`.
- If worker login navigates to a path that doesn’t exist, the `/` route still resolves to the worker dashboard when `userType === 'worker'`.


## Useful files to glance at
- `src/App.tsx` — routes, session/user-type logic, loading transitions
- `src/components/Dashboard/Main/Dashboard.tsx` — staff main dashboard composition
- `src/components/Workers/WorkerDashboard/WorkerDashboard.tsx` — worker dashboard composition and modals
- `src/components/AuthForm.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx` — auth flows
- `src/utils/pdf/*` — PDF builders (organized per domain)
- `src/styles/pdffont.ts` — shared PDF styling


## Licenses
- See `public/licenses.txt` and the project dependencies in `package.json`.


---
If you need deeper details on a feature area, start from the corresponding folder in `src/components/*` and follow the exports (`index.ts`) and hooks to compose the flow. The structure is consistent across modules, so once you understand one, the rest will feel familiar.


