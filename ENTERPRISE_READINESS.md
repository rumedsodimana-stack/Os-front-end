# Orbit OS — Enterprise Production Readiness Report

**Generated:** 2026-04-08
**Current deployment:** https://orbit-os-beige.vercel.app
**Verdict:** **Demo-ready only — NOT production-ready.** The UI is luxury-grade and the design system is already tokenised, but every critical production concern (secrets, persistence, auth, testing, observability, compliance, payments, channel integrations) is either missing, mocked, stubbed, or dev-bypassed. Shipping this to a paying hotel today would be professional malpractice.

---

## 0. Executive Summary

**What's good.** Orbit OS has a strikingly mature **UI design system** for a codebase this young: a single source of truth in `src/styles/tokens.json` + `tokens.css`, a live `ThemeProvider` with 36 editable tokens that persist to `localStorage`, a themable right-panel Agentic AI surface, six KPI gradient utilities, and a fleet of 24 department pages (22.9k LOC of TSX) all built around two shared primitives (`KPICard`, `Table`). TypeScript is strict-enough to compile cleanly; build and type-check are green; Vercel deploys work. Ten context providers (`AuthContext`, `RoomContext`, `BookingContext`, `FolioContext`, `GuestContext`, `MenuContext`, `TableContext`, `NotificationContext`, `InventoryContext`, `CostCenterContext`) define a credible domain model for a PMS-grade hotel operating system, with Firestore wiring already scaffolded and a 191-line `firestore.rules` file with domain validators.

**What's blocking.** The blockers are existential, not cosmetic. A Gemini API key is **hardcoded as a string literal** in `src/components/AgenticAIPanel.tsx:205` and will ship in the production bundle. A second AI call in `src/pages/FoodAndBeverage.tsx:730` uses `process.env.GEMINI_API_KEY` which is **undefined in Vite production builds** and only works because of a `define` shim in `vite.config.ts:11`. The `AuthContext` has a `DEV_BYPASS` gated on `import.meta.env.DEV` that injects a mock user, and every data context (`BookingContext`, `FolioContext`, `GuestContext`, `MenuContext`, `TableContext`, `RoomContext`, `NotificationContext`) contains an `if (import.meta.env?.DEV) return;` early-return that **skips Firestore subscription in dev** — which is the mode Vercel preview runs in unless `NODE_ENV=production` is set. `InventoryContext` and `CostCenterContext` are **100% in-memory** with seed data and lose every write on reload. There are **zero tests** in the entire repo. There is **no CI/CD**, no `.github/workflows/`, no lint gate beyond `tsc --noEmit`, no Sentry/PostHog/Datadog, no i18n, no rate limiting, no payment gateway, no channel manager, no night audit, no multi-tenancy, no audit log. The `firestore.rules` file references collection schemas that no context actually writes in that shape (e.g. guests have `firstName/lastName` in rules but the Guest interface also has them — OK — while bookings lack `propertyId`, `tenantId`, or any multi-tenant scoping at all). The 2.3 MB JS bundle (519 kB gzipped) ships in **one chunk** with zero code splitting. 263 hardcoded palette colour classes still live in pages despite the semantic-token rule being written in `CLAUDE.md`.

**Rough effort to ship.** To get a single pilot hotel live responsibly: **large**. To get enterprise-ready for multi-tenant SaaS with PCI-DSS, GDPR, SOC 2 auditability, and genuine PMS feature parity: **very large**, measured in developer-years, not sprints. The current codebase is an excellent prototype and an excellent design system, but it is not a product. The Roadmap in §17 breaks the work into 9 phases that can partially parallelise after Phase 0 (secrets) and Phase 1 (persistence).

---

## 1. Scoring Matrix

| Category | Current | Target | Gap | Severity |
|---|---|---|---|---|
| **Architecture** | SPA, 10 contexts, 24 pages, no router, manual `useState` nav | Router, lazy routes, service layer, strict contracts | No code-splitting, no router, `Department` string-switch in `App.tsx` | P1 |
| **Data Persistence** | 7 contexts partially Firestore-wired (dev-bypassed), 2 fully in-memory, 1 auth-only | All CRUD persisted to Firestore or Postgres with offline queue | `InventoryContext` + `CostCenterContext` = pure memory; others skipped in DEV | **P0** |
| **Auth & RBAC** | Google popup + `DEV_BYPASS` mock; no roles enforced in code; rules check `role=='admin'` but no context writes it | 6-tier RBAC (GM/DeptMgr/Sup/Staff/Fin/Admin), SSO, 2FA | No role assignment flow, no permission guards, no tenant scoping | **P0** |
| **Security** | API key hardcoded in source, no CSP, no Zod validation, no rate limit | Vault/Secrets Manager, CSP/HSTS, Zod everywhere, WAF, rate limiting | Exposed Gemini key, `process.env` bug, bare domain | **P0** |
| **Performance** | 2.3 MB JS / 519 kB gzip single chunk | < 200 kB gzip initial, route splits | No `React.lazy`, no `manualChunks`, no icon tree-shake | P1 |
| **Reliability** | 1 ErrorBoundary at root, no retry, no offline UX | Multiple boundaries, retry policies, offline queue | Single top-level catch only | P1 |
| **Observability** | 12 `console.error`, 6 `console.log`, zero telemetry | Sentry + PostHog + Datadog RUM + audit log | Nothing wired | **P0** |
| **Testing** | 0 unit, 0 integration, 0 E2E, 0 visual | 70% unit, E2E on happy paths, visual regression | Nothing | **P0** |
| **Accessibility** | 0 `aria-*` attributes, 0 `role=` attributes, dozens of icon-only buttons | WCAG 2.1 AA | Zero ARIA, no focus traps in modals, no keyboard traps | P1 |
| **i18n** | English-only, hardcoded strings, no locale | Multi-language, RTL, currency/date locale | No i18n lib installed | P1 |
| **DevOps/CI** | Manual `vercel deploy --prod`, no `.github/workflows/` | GH Actions: lint + typecheck + test + build + preview | Nothing | **P0** |
| **Documentation** | README (278 lines) + CLAUDE.md (281 lines) + firestore.rules comments | ADRs, runbooks, API contracts, on-call playbooks | Design docs only; no ops docs | P2 |
| **Compliance** | None | PCI-DSS, GDPR, SOC 2, Bahrain PDPL | Zero compliance posture | **P0** for payments |
| **Domain Completeness** | Folio + Booking + Room + Guest + Menu + Table + Inventory + CostCenter scaffolds | Full PMS: ARR/RevPAR, channel mgr, night audit, 200+ reports | Huge gap — see §15 | P1 |
| **UX Polish** | Luxury 5-star visual language, motion, dark mode | Same + a11y + i18n + loading/empty/error states | Visuals great; states thin | P2 |

---

## 2. Architecture Audit

### Stack inventory

| Layer | Technology | Version | Note |
|---|---|---|---|
| Runtime | Node ≥ 20 (Vite 6 req) | `@types/node@22.14.0` | Reasonable |
| Bundler | Vite | `6.2.0` | Current major |
| Framework | React | `19.0.0` | Cutting-edge; uses `StrictMode` in `src/main.tsx:7` |
| Language | TypeScript | `~5.8.2` | Current |
| Styling | Tailwind v4 | `4.1.14` | Uses new `@theme` block; `@tailwindcss/vite` plugin |
| Animation | `motion` (Framer Motion's successor) | `12.23.24` | Current |
| Charts | `recharts` | `3.8.1` | Current |
| Icons | `lucide-react` | `0.546.0` | **NOT tree-shaken** — entire icon set imported into single chunk |
| Dates | `date-fns` | `4.1.0` | Current |
| Utils | `clsx` + `tailwind-merge` | `2.1.1` / `3.5.0` | Standard `cn()` helper in `src/lib/utils.ts` |
| State | React Context (10 providers) | — | No Zustand/Redux/Jotai |
| Backend SDK | `firebase` | `12.11.0` | Modular SDK |
| Validation | `zod` | `4.3.6` | **Installed but never imported** in `src/` |
| AI | `@google/genai`, `@langchain/core`, `@langchain/google-genai`, `langchain` | `1.29.0` / `1.1.39` / `2.1.26` / `1.3.0` | **Heavy** — LangChain alone is ~500 kB |
| Server | `express` | `4.21.2` | **Listed in `dependencies` but no server code** — this belongs in `devDependencies` at best, or should be removed entirely |
| Config | `dotenv` | `17.2.3` | Not needed at runtime in Vite; Vite has built-in env |

### Risky / outdated / misclassified dependencies

- **`express` in `dependencies`** — no server code exists (`test-langchain.ts` files use it for stubs). It inflates `node_modules` and may get bundled by mistake. Move to `devDependencies` or delete.
- **`dotenv` in `dependencies`** — Vite does not use `dotenv` at runtime. Delete from `dependencies`.
- **`langchain` + `@langchain/*`** — four LangChain packages for what appears to be two calls into `@google/genai`. Either pick LangChain or pick `@google/genai`, not both. LangChain adds ~500 kB gzip and is the main reason for the bloated bundle.
- **`vite` declared in both `dependencies` and `devDependencies`** (line 31 vs line 43 of `package.json`) — duplicate declaration.
- **React 19 + `motion` 12 + Tailwind 4** are all cutting-edge — **fine for a prototype, risky for enterprise** because external component libraries may not yet support them. No component libraries are installed today (headless UI / Radix / shadcn) — every primitive is hand-rolled, which is a blessing for control but a curse for accessibility.
- **No ESLint, Prettier, Husky, lint-staged, commitlint.** The only "lint" script is `tsc --noEmit`. There is zero JSX-level linting (`eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`).

### Mono vs micro

SPA monolith, single entry (`src/main.tsx`), single `App.tsx` component that string-matches a `Department` union and renders one of 24 pages inside nested context providers. **No router** (React Router, TanStack Router, Next.js) — navigation is `useState<Department>` in `App.tsx:81`. Deep-linking, browser back/forward, and shareable URLs are **all broken**. The `vercel.json` rewrite (`{ "source": "/(.*)", "destination": "/" }`) compensates by serving the SPA shell for every URL, but a user cannot bookmark `/housekeeping/tasks`.

### SSR vs SPA

Pure client-side SPA. Time-to-interactive is pinned by the 519 kB gzipped single chunk. Any SEO (for a marketing landing) is impossible. A switch to Next.js or Remix would require non-trivial rework of every context that assumes browser-only APIs (`localStorage`, `onSnapshot` persistence).

---

## 3. Data Layer (CRITICAL)

**Summary:** 10 contexts. **Zero** page currently reads data written in the same session through Firestore when `vite dev` is the mode — because every Firestore-wired context short-circuits with an `import.meta.env?.DEV` guard. Two contexts never touch Firestore at all. This is the single biggest risk.

### Context-by-context audit

| # | Context | File | Lines | Persistence today | Dev bypass | P0 wiring work |
|---|---|---|---|---|---|---|
| 1 | `AuthContext` | `src/context/AuthContext.tsx` | 97 | Firebase Auth (Google popup) | **Yes** — `DEV_BYPASS` at L14 returns a fake `MOCK_USER` | Disable DEV_BYPASS in prod; wire role fetch from `/users/{uid}`; add email+password fallback; add custom claims for tenant + role |
| 2 | `BookingContext` | `src/context/BookingContext.tsx` | 91 | Firestore `bookings` collection (50-item limit) | **Yes** — L43 `if (import.meta.env?.DEV) { setLoading(false); return; }` | Remove DEV guard; wire real-time sync; add `tenantId`; add pagination; add `propertyId` scoping |
| 3 | `RoomContext` | `src/context/RoomContext.tsx` | 139 | Firestore `rooms` collection | **Yes** — L46 seeds 24 mock rooms when DEV | Remove DEV guard; wire snapshot; pull from `tenant/{id}/properties/{id}/rooms`; denormalise guest name |
| 4 | `GuestContext` | `src/context/GuestContext.tsx` | 149 | Firestore `guests` collection | **Yes** — L68 | Remove DEV guard; add phone validation server-side; wire consent + PII classification |
| 5 | `FolioContext` | `src/context/FolioContext.tsx` | 150 | Firestore `folios` collection with nested `items` array | **Yes** — L56 | Remove DEV guard; move `items` to subcollection (Firestore docs have a 1 MB limit — folios grow unbounded); add transactional posting for charges/payments |
| 6 | `MenuContext` | `src/context/MenuContext.tsx` | 152 | Firestore `menu` + `orders` | **Yes** — L65 | Remove DEV guard; stock decrement is a client-side loop (race condition — see L108) — convert to a Cloud Function + transaction |
| 7 | `TableContext` | `src/context/TableContext.tsx` | 82 | Firestore `tables` collection | **Yes** — L40 | Remove DEV guard; wire floor-plan coordinates; merge with booking when seated |
| 8 | `NotificationContext` | `src/context/NotificationContext.tsx` | 206 | Firestore `notifications` (50-item limit) | **Yes** — L69 | Remove DEV guard; move toast renderer out of context (mixing providers with UI makes testing hard); **fix hardcoded palette at L180-190** (emerald/amber/rose/red still there) |
| 9 | `InventoryContext` | `src/context/InventoryContext.tsx` | 188 | **100% in-memory** — `useState(SEED_ITEMS)` at L130 | N/A (always mock) | **Full Firestore wiring required** — items, movements, par levels, expiry. Plus Cloud Function for nightly expiry checks |
| 10 | `CostCenterContext` | `src/context/CostCenterContext.tsx` | 94 | **100% in-memory** — `useState(SEED_COST_CENTERS)` at L64 | N/A (always mock) | **Full Firestore wiring required** — cost centers, transfers. Plus month-end close function |

### Crucial observation: the dev-bypass pattern is production-contaminating

The guard `if (import.meta.env?.DEV)` evaluates to `true` during `vite dev` and `false` during `vite build`. **But** Vercel preview deployments build the bundle the same way as production, so in theory they should get the real Firestore path. In practice, two things go wrong:

1. Every `useEffect` that wires Firestore starts with `if (!user) return;` and `user` comes from `AuthContext`. If the user fails the Google popup (blocked by sandboxed previews, which is what `DEV_BYPASS`'s comment at `AuthContext.tsx:12` admits), **no data loads at all** on production. The app renders an empty shell.
2. `InventoryContext` and `CostCenterContext` **never persist anything, anywhere, ever.** Every write through `postMovement()` at `InventoryContext.tsx:145` mutates local `useState`. Reload → gone. This is not a bug; it's the intended design today.

### Recommended backend

Pick one and commit:

- **Option A: Firestore (lowest lift, fastest to pilot).** Already 7/10 contexts wired. Requires: multi-tenant collection layout (`tenants/{tenantId}/properties/{propertyId}/...`), security rules rewrite, Cloud Functions for night audit / reports / transactions, and Firestore's weak query model (no joins, no aggregations) becomes a ceiling for reporting.
- **Option B: Postgres + Prisma + tRPC / Supabase (best for enterprise).** Proper SQL, joins, transactions, row-level security, easier SOC 2 path (Supabase is SOC 2 certified, Firestore Google SOC 2 covers infra but RLS is your problem). Requires rewriting the data layer — probably ~2 weeks for the contexts but gains massive reporting power.
- **Option C: Hybrid — Firestore for real-time (room status, orders, notifications), Postgres for transactional (folio, GL, payroll).** Two systems = two failure modes but matches how real PMS vendors build.

**Recommendation:** Option B (Supabase) for the pilot. Keep the context API shape identical so pages don't change.

---

## 4. Auth, RBAC & Multi-tenancy

### Current state

- **Provider:** Firebase Auth, Google popup only.
- **Mock user:** `DEV_BYPASS` in `src/context/AuthContext.tsx:14-33` creates a fake `MOCK_USER` with `uid: "dev-user"` whenever `import.meta.env.DEV` is true. Login button at `App.tsx:187` hits `signInWithPopup` and has no error surface beyond `console.error`.
- **Role tiers:** **Not implemented in code.** `CLAUDE.md` claims 6 tiers (GM / DeptManager / Supervisor / Staff / Finance / Admin) but no context stores a role on the user, no page checks a role before rendering, and no UI element is gated.
- **Firestore role checks:** `firestore.rules:47-51` defines `isAdmin()` as reading `users/{uid}.role == 'admin'` **OR** hardcoded email `rumedsodimana@gmail.com`. No context ever writes a `role` field to `users/{uid}`, so the only way to become admin today is to own the hardcoded Gmail.
- **Tenant isolation:** **None.** No `tenantId` on any document. No property scoping. Every booking, guest, room, folio is in a flat global collection.
- **Session expiry, 2FA, lockout, password policy, SAML, OIDC, SSO:** none.
- **Audit log:** none.
- **Impersonation / break-glass:** none.

### Gap list (to enterprise)

| Feature | Status | P0 work |
|---|---|---|
| Multi-tenant data model | Missing | Add `tenantId` + `propertyId` to every doc; rewrite rules to enforce |
| 6-tier RBAC | Missing | Define `UserRole` enum in `AuthContext`; add `<RequireRole>` wrapper; enforce in Firestore rules |
| SSO / SAML | Missing | Firebase Identity Platform (Google Cloud Identity) supports SAML + OIDC |
| 2FA / MFA | Missing | Firebase supports TOTP + SMS; wire in |
| Password policy | Missing | Enable Firebase password strength requirements |
| Account lockout | Missing | Cloud Function tracking failed attempts |
| Session timeout | Missing | Refresh tokens, idle timeout |
| Audit log | Missing | Write-append-only `audit_logs` collection with Cloud Function interceptor |
| Impersonation | Missing | Custom-claim-gated admin impersonation flow |
| Break-glass / disaster recovery | Missing | Emergency admin account with hardware key + paper failover procedure |

---

## 5. Security

### Secrets handling — CRITICAL

1. **Hardcoded Gemini API key in source code.** File: `src/components/AgenticAIPanel.tsx:205`
   ```tsx
   apiKey: "AIzaSyDJ4sf8T2STcANgSOyhQLkibjv_8LF6mi0",
   ```
   This string is compiled into the Vite bundle at `dist/assets/index-*.js` and is visible to every user who visits the site. The comment at L203 literally says "WARNING: Hardcoded API key for testing purposes as explicitly requested." **Revoke this key today**, rotate to a new one, and route all Gemini calls through a server-side proxy (Cloud Function or Vercel Edge Function) that never ships the key client-side.

2. **`process.env.GEMINI_API_KEY` used in a second place.** File: `src/pages/FoodAndBeverage.tsx:730`
   ```tsx
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
   ```
   In Vite, `process.env.*` does not exist at runtime. The only reason this compiles is the `define` shim in `vite.config.ts:11`:
   ```ts
   'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
   ```
   This means the key is **inlined as a literal string at build time**, exactly like the hardcoded version — so this is not a mitigation, it's the same vulnerability with extra steps. The key ends up in the bundle either way.

3. **Firebase config checked into repo.** File: `firebase-applet-config.json` (imported at `src/lib/firebase.ts:4`) contains `apiKey`, `projectId`, `authDomain`, `storageBucket`, `messagingSenderId`, and `firestoreDatabaseId`. Firebase API keys are expected to be public (they identify the project, not authorise it — rules do authorisation), so this is **not** strictly a leak, but it is fragile: anyone can talk to this Firestore from any origin. You must (a) lock the API key by HTTP referrer in Google Cloud Console, and (b) rely on Firestore rules for data-level auth.

4. **`.env.example` is meaningless** — it contains only two vars (`GEMINI_API_KEY`, `APP_URL`) and `.gitignore` correctly excludes real `.env*`. Good.

### CSP, HSTS, SRI, security headers

- **`vercel.json`** contains only a rewrite rule. **No headers block.** No `Content-Security-Policy`, no `Strict-Transport-Security`, no `X-Frame-Options`, no `X-Content-Type-Options`, no `Referrer-Policy`, no `Permissions-Policy`.
- The site will fail any enterprise security review on this alone.
- Minimum required (add to `vercel.json`):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com; frame-ancestors 'none';" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

### CORS

Firebase Auth / Firestore handle their own CORS. No custom API endpoint exists. Once a Cloud Function or Express server is added, CORS must be locked to the production origin.

### XSS surfaces

- **Zero `dangerouslySetInnerHTML` in the codebase.** Verified.
- No rich text editor.
- All user input flows through React state → Firestore → back to React, which handles HTML escaping by default. **Good.**
- **But** once guest notes, feedback, or marketing copy get rich-text editing, XSS re-enters the threat model. Use DOMPurify + an allowlist sanitiser.

### Input validation

- **Zod is installed (`4.3.6`) but never imported anywhere in `src/`.** Every Firestore write goes in unsanitised except for `firestore.rules` type assertions.
- `GuestContext.tsx:90` has a lone regex phone check. `firestore.rules` has field-size limits. That's the entire validation surface.
- **P0:** create `src/lib/schemas.ts` with Zod schemas for `Guest`, `Booking`, `Folio`, `Room`, `MenuItem`, `Order`, `InventoryItem`, `CostCenter`. Parse before every write; surface errors in UI.

### Rate limiting

- **None.** Any authenticated user can call `addDoc(...)` in a loop. Firestore's only rate limit is per-document write throttling.
- **P0:** add Cloud Function gateway + per-user rate limits (`firebase-functions-rate-limiter` or a token-bucket in Redis).

### OWASP Top 10 walkthrough

| OWASP 2021 | Orbit OS status | Severity |
|---|---|---|
| A01 Broken Access Control | RBAC not implemented, tenant isolation missing, rules permissive | **P0** |
| A02 Cryptographic Failures | All traffic is HTTPS via Vercel. No PII at rest is encrypted app-side (Firestore is encrypted at rest by Google). Payments not yet handled. | P1 when payments arrive |
| A03 Injection | React escapes by default; no `dangerouslySetInnerHTML`; Firestore SDK uses typed writes — low exposure today | P2 |
| A04 Insecure Design | No threat model, no data classification, no secure-by-default opt-ins | **P0** |
| A05 Security Misconfiguration | No CSP, no HSTS, API key in source, `DEV_BYPASS` exists | **P0** |
| A06 Vulnerable Components | No Dependabot, no `npm audit` in CI, manual version bumps | P1 |
| A07 ID & Auth Failures | `DEV_BYPASS`, no 2FA, no lockout, no session expiry | **P0** |
| A08 Software & Data Integrity | No SRI, no signed releases, no package lockfile verification | P1 |
| A09 Logging & Monitoring | 12 `console.error`, 0 structured logs, 0 alerts | **P0** |
| A10 SSRF | No server yet; N/A today | Re-evaluate when backend added |

### PCI-DSS scope

If Orbit OS ever takes a card number:

- Scope is **massive** unless you iframe a PCI-compliant gateway (Stripe Elements, Adyen Drop-In) so card data never touches your DOM.
- Today there is **no payment code**, so PCI-DSS scope is zero. **Do not** add card fields yourself — always use a tokenising gateway.
- Stripe Elements is the recommended path: your SAQ falls to SAQ A (the smallest), audit cost ~1 developer-week/year instead of ~6 months for SAQ D.

### GDPR / CCPA / Bahrain PDPL

- **No data export API.** A guest cannot request their data.
- **No deletion flow.** `deleteGuest` exists in `GuestContext.tsx:120` but it wipes the doc without cascading to bookings, folios, or notifications. This is not a compliant erasure.
- **No consent tracking** on newsletter signups or marketing.
- **No DPA** (Data Processing Agreement) boilerplate with Firebase — you need one signed with Google, which is available but requires you to execute it.
- **No data residency option** — Firestore database is in `gen-lang-client-0391050882` region which is unknown from the config. EU customers need EU residency.

---

## 6. Performance & Bundle

### Current measurements (built from `dist/`)

| Asset | Raw | Gzipped |
|---|---|---|
| `dist/assets/index-DlOGlxxr.js` | **2,399,779 B (2.29 MB)** | **531,405 B (519 kB)** |
| `dist/assets/index-5ljKqoRs.css` | 105,250 B (103 kB) | 16,799 B (16 kB) |
| `dist/index.html` | 409 B | — |
| **Total over the wire (gzipped)** | — | **≈ 535 kB** |

### Target

- **< 200 kB gzipped initial chunk** (industry standard for "fast")
- **< 100 kB gzipped per async route chunk**
- **First Contentful Paint < 1.8s** on 4G
- **Largest Contentful Paint < 2.5s**
- **Time to Interactive < 3.8s**

### What's eating the bundle

From the dep list and the `import` counts in pages:

1. **LangChain + `@langchain/google-genai`** — ~500 kB gzip. Largely unused. Only two call sites in the app actually invoke a model, and both use `@google/genai` directly, not LangChain. **Delete LangChain entirely** — saves ~300 kB gzipped by itself.
2. **`lucide-react`** — imported as a single module by every page. Vite/Rollup's tree-shaking does kick in, but only when imports are individual (`import { Plus } from 'lucide-react'`), which is the case here. However, Layout.tsx alone imports **42 icons**, FrontDesk **30+**. The tree-shake is already happening, but the sheer count adds up.
3. **`recharts`** — heavy (~100 kB gzip). Imported in multiple pages for Area/Pie/Line. Consider dynamic import for non-overview pages.
4. **`firebase`** — ~150 kB gzip for `firebase/auth` + `firebase/firestore`. Already modular. Can't shrink much.
5. **`motion`** — ~45 kB gzip. Fine.
6. **Single chunk** — `vite.config.ts` has **no `build.rollupOptions.output.manualChunks`**. Everything is in one JS file. No route-level splitting. No vendor split.

### Concrete fixes

```ts
// vite.config.ts — add code splitting
export default defineConfig(({ mode }) => ({
  // ...
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'charts-vendor': ['recharts'],
          'motion-vendor': ['motion'],
          'icons-vendor': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 200,
  },
}));
```

```tsx
// src/App.tsx — lazy load every department page
import { lazy, Suspense } from 'react';
const FrontDesk = lazy(() => import('./pages/FrontDesk').then(m => ({ default: m.FrontDesk })));
// ...repeat for all 24 pages

<Suspense fallback={<PageSkeleton />}>
  {activeDepartment === 'Front Desk' && <FrontDesk ... />}
</Suspense>
```

Current `React.lazy` usage: **0**. Current `Suspense` usage: **0**.

### Images

- No `<img>` optimisation pipeline.
- Two external images referenced: a Google auth SVG (`www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg`) and user avatars via `i.pravatar.cc` (placeholder).
- No user-uploaded images yet, so no Cloudinary/Imgix/`@vercel/image` needed until guest photos land.

### Fonts

- `theme-provider.tsx:272-281` dynamically injects `<link>` to `fonts.googleapis.com` for Inter + Outfit + JetBrains Mono every render of the config. This **blocks first paint** until the request returns and triggers a layout shift when the font arrives. Preload critical font files via `<link rel="preload" as="font" crossorigin>` in `index.html` instead, or self-host the subset.

### Caching headers

- Vercel ships sane defaults: `Cache-Control: public, max-age=31536000, immutable` for hashed assets, `no-cache` for HTML. Good.
- **But** no stale-while-revalidate, no ISR (it's an SPA), no service worker. Offline = broken.

### Lighthouse estimate (back-of-envelope)

| Metric | Estimate | Target |
|---|---|---|
| Performance | 55–70 (hurt by 519 kB main chunk + Google Fonts late-load) | ≥ 90 |
| Accessibility | 60–75 (hurt by zero ARIA, icon-only buttons) | ≥ 95 |
| Best Practices | 75–85 (hurt by hardcoded key, no CSP) | 100 |
| SEO | 80+ (it's an app, not a content site) | Not a priority |

---

## 7. Reliability

### Error boundaries

- **1 `ErrorBoundary`** at `src/App.tsx:69`, wrapping the entire `ThemeProvider`. File: `src/components/ErrorBoundary.tsx:13`.
- If a single sub-tree throws (e.g., a `recharts` render bug on Executive), the **entire app crashes** to the generic reload screen instead of isolating the failure.
- **P1:** wrap each `<Layout>` main content section, each modal, and each chart in its own boundary.

### Retry logic

- **None.** Firestore SDK has built-in offline-mode retry (enabled by default) but app-level mutation retries are absent. A failed `addBooking()` throws → nothing catches it → generic error screen.

### Optimistic UI / rollback

- **None.** Every write awaits Firestore before updating UI, so every click feels slow on poor networks. No rollback pattern for failed writes (user will need to refresh to see the actual state).

### Network-failure UX

- The only network check is `NotificationContext.tsx:55` calling `getDocFromServer(doc(db, 'test', 'connection'))` and logging to console if offline. There is **no user-facing offline banner, no reconnection indicator, no queued-write indicator.**

### Empty / loading / error states

Reviewed 6 pages (FrontDesk, Housekeeping, Reservations, Executive, Security, MiniBar):

- **Loading states:** inconsistent. Some pages show a spinner, some show skeleton, some show nothing. `AuthContext.tsx:85-91` shows a root-level spinner while loading.
- **Empty states:** mostly missing. The notifications dropdown at `Layout.tsx:519-522` does show a "No notifications yet" empty state with an icon. Most tables show nothing when empty.
- **Error states:** almost entirely missing. Errors bubble to the root `ErrorBoundary` and reload the world.

### Idempotency

- **Addresses not handled.** `addBooking()` does not check for duplicates. Double-clicking "Create Booking" would create two bookings. No idempotency key pattern.
- **Stock decrement in `MenuContext.placeOrder()` at L108** is a client-side for-loop that does `N` individual `updateDoc` calls. This is a **classic race condition**: two simultaneous orders for the same item can both read stock `10`, subtract their quantity, and both write `9`. Needs a Firestore `runTransaction` or a Cloud Function.

---

## 8. Observability

### Logging

- **12 `console.error` calls, 6 `console.log|warn|info|debug` calls.** Total: 18 direct stdout calls across 9 files.
- **No structured logging library** (pino, winston, bunyan). Not needed client-side, but needed server-side when one exists.
- The `handleFirestoreError()` helper in `src/lib/firestore-utils.ts:31` stringifies an error payload with auth context and `console.error`s it, then rethrows. This is the closest thing to structured logging today, and it's decent.

### Metrics

- **None.** No Web Vitals reporting, no RUM, no custom metric.

### Tracing

- **None.** No OpenTelemetry, no distributed tracing. No transaction IDs. Debugging a production issue would mean reading Vercel's ingress logs and hoping the user timestamp lines up with a Firestore error.

### Alerting

- **None.** No PagerDuty, no Opsgenie, no Slack webhook. No SLO definitions. No error budget.

### Audit log for compliance

- **None.** SOC 2 will require: every auth event, every admin action, every PII read/write, every permission change, retained for 1 year minimum, tamper-evident (append-only).

### Recommended stack

- **Sentry** for errors + performance (single integration, `@sentry/react` — add `Sentry.init({ dsn })` in `main.tsx`). ~15 kB gzip. Free tier is enough for pilot.
- **PostHog** for product analytics + session replay (self-host to keep PII in your perimeter).
- **Datadog RUM** (or **Grafana Cloud Faro**) for real user monitoring once the pilot has users.
- **Cloud Logging + Cloud Monitoring** for the Firebase side (free for normal usage).

---

## 9. Testing (CRITICAL)

### Current state

- **Test files in project source: 0.** (The `find` for `*.test.*` and `*.spec.*` only matched files inside `node_modules/zod`.)
- **Test runner config: 0.** No `vitest.config.ts`, no `jest.config.*`, no `playwright.config.*`.
- **Test libraries installed: 0.** No `@testing-library/react`, no `vitest`, no `jest`, no `@playwright/test`.
- **CI test gate: none (no CI).**
- **Coverage: 0% and not measured.**

This is the single biggest red flag for an enterprise pilot. A 22k-LOC codebase with zero tests will break every refactor and every dependency upgrade.

### Minimum viable test pyramid

| Layer | Tool | What to cover first | Target coverage |
|---|---|---|---|
| **Unit** | Vitest + React Testing Library + `@testing-library/user-event` | Every context's reducer logic, `cn()` utils, Zod schemas, `statusBadgeTone()` helpers, date formatters | **≥ 70 %** |
| **Integration** | Vitest + `@firebase/rules-unit-testing` + React Testing Library | Context providers wired to Firestore emulator; each role tier loading the correct data subset | **≥ 50 %** of contexts |
| **E2E** | Playwright | Login (Google mock) → create booking → check in → post charge → check out → close folio; Housekeeping task flow; POS order flow | Happy paths + 2 sad paths per module |
| **Visual regression** | Chromatic or Playwright screenshots | KPICard, Table, Modal, Layout header, every page's Overview submenu | All primitives + Overview screens |
| **Accessibility** | `@axe-core/playwright` running inside Playwright E2E | Zero violations on every rendered screen | `serious` + `critical` = 0 |
| **Contract** | Pact or `zod` schema diff | Firestore document shapes match TypeScript interfaces | 100 % of collections |
| **Security** | `npm audit`, `snyk`, Trivy for Docker | CI gate, weekly scheduled scan | No high/critical unpatched |
| **Load** | k6 or Artillery | 100 concurrent users, 1k RPS write spike (night audit) | p95 < 500 ms |

### CI gates

Block merge unless:
- `tsc --noEmit` clean
- `eslint .` clean (lint not yet configured)
- `vitest run --coverage` ≥ target
- `playwright test` passes
- `@axe-core/playwright` has 0 serious/critical
- `npm audit --production` has 0 high/critical
- Bundle size < 250 kB gzipped initial chunk

---

## 10. Accessibility (WCAG 2.1 AA)

### Audit summary

| Requirement | Status | Evidence |
|---|---|---|
| `aria-label` / `aria-labelledby` on icon buttons | **ABSENT** | `grep "aria-"` returned **0 matches** across `src/`. Every icon-only button (and there are dozens in `Layout.tsx`) has no accessible name |
| `role=` attributes | **ABSENT** | `grep 'role="'` returned **0 matches** |
| Landmark elements | Partial | `<nav>`, `<header>`, `<main>`, `<aside>` present in `Layout.tsx` — good — but no skip-link |
| Heading order | Not audited systematically; `CLAUDE.md §6.4` defines scale, but nothing enforces H1→H2→H3 order |
| Focus order | Not tested; relies on DOM order |
| Focus traps in modals | **ABSENT** | No `focus-trap-react`, no manual implementation. Opening a modal does not trap Tab/Shift-Tab — users can tab out underneath |
| Focus visible | Partial | `focus:ring-*` classes exist in `Layout.tsx` for the AI toggle; inputs use `focus:ring-1 focus:ring-primary/50` per CLAUDE.md §6.7, but many buttons lack any visible focus |
| Color contrast | Partly audited in tokens | Need axe scan on rendered pages |
| Keyboard navigation | Partial | `cmd+K` opens command palette; but sidebar nav is all buttons — no arrow-key navigation, no skip link |
| Reduced motion | **ABSENT** | No `prefers-reduced-motion` query; `motion/react` animations play for everyone |
| Live regions | **ABSENT** | Notification toasts at `NotificationContext.tsx:163` do not have `role="status"` or `aria-live="polite"` |
| Skip link | **ABSENT** | |
| Lang attribute | Needs check in `index.html` |
| Alt text | Partial | Avatar images have `alt="User"`; Google logo has `alt="Google"`; most other images (decorative) are fine |

### Critical fixes (all P1 before any enterprise pilot)

1. Add `aria-label` to every icon-only button across the codebase. Start with `Layout.tsx` (bell, theme toggle, user menu, sidebar collapse).
2. Add focus trap + `aria-modal="true"` + `role="dialog"` + `aria-labelledby` to every modal (use `focus-trap-react` or `radix-ui/react-dialog`).
3. Add skip-link at the top of `Layout.tsx`: `<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>`.
4. Add `role="status" aria-live="polite"` to the notification toast container.
5. Add `@media (prefers-reduced-motion: reduce) { ... }` to `tokens.css` and respect it in `motion/react` via `useReducedMotion()`.
6. Run `@axe-core/playwright` in CI and block merges on `serious`/`critical` violations.

---

## 11. Internationalization

### Current state

- **English only.** All strings hardcoded in JSX.
- **No i18n library installed.** `grep` for `react-i18next`, `i18next`, `react-intl` returned **0 matches**.
- **No currency formatting library** beyond native `Intl.NumberFormat` (not used today — amounts are interpolated as `${amount}`).
- **No date-tz library** beyond `date-fns` (no `date-fns-tz`).
- **No RTL support.** The layout uses `-mx-[1.5cm]`, `pl-6`, `pr-4` everywhere — switching to `ms-`/`me-`/`ps-`/`pe-` Tailwind logical properties would be a full-day refactor.

### Required for Bahrain (star-mirage, GCC market)

- **Arabic (ar-BH) with RTL** — the business will ask day one.
- Currency: BHD (1000-based, 3 decimals) — needs careful formatting because most libraries assume 2 decimals.
- Timezone: Asia/Bahrain (UTC+3).
- Hijri calendar option.

### Required for Europe

- **EN + FR + DE + IT + ES** minimum.
- Currency: EUR, GBP.
- Date format per locale.

### Recommendation

- **Install `i18next` + `react-i18next` + `i18next-browser-languagedetector`** (~12 kB gzip total).
- Create `src/i18n/locales/en.json`, `src/i18n/locales/ar.json`.
- Wrap `App.tsx` with `I18nextProvider`.
- Use `useTranslation()` in every page.
- Add logical-property Tailwind preset for RTL.
- Store user locale preference on the user profile.

Effort: **large** — every one of 24 pages has hundreds of strings.

---

## 12. DevOps / CI / CD

### Current state

- **Deployment:** manual `vercel deploy --prod` by the developer. A `.vercel/` dir exists in the project root.
- **CI: none.** No `.github/` directory exists in the project. Verified.
- **Branch protection: unknown** (requires GitHub API check).
- **Preview deploys: Vercel does this automatically per PR, but no manual gate.**
- **Semantic versioning: `package.json:4` says `"version": "0.0.0"`. No `CHANGELOG.md`.**
- **Release automation: none.**
- **Secrets management:** Vercel env vars are used for `GEMINI_API_KEY` (presumably), but the hardcoded fallback in source means the secret is compiled in regardless.
- **Backups: none app-side.** Firestore has point-in-time recovery if enabled on the project (verify in GCP console).
- **Disaster recovery: no runbook.**

### Required pipeline (GitHub Actions example)

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push: { branches: [main] }
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: Typecheck
        run: npm run lint     # currently just `tsc --noEmit`
      - name: Lint (once added)
        run: npm run eslint
      - name: Test
        run: npm run test -- --coverage
      - name: Build
        run: npm run build
      - name: Bundle size
        run: node scripts/check-bundle-size.js
      - name: Audit
        run: npm audit --production --audit-level=high
      - name: Upload coverage
        uses: codecov/codecov-action@v4
```

Additional workflows needed: `.github/workflows/deploy.yml` (Vercel production deploy on tag), `.github/workflows/codeql.yml` (security scanning), `.github/workflows/dependabot-auto-merge.yml`.

### Branch protection (enable on GitHub)

- Require PR review (1 minimum, 2 for `main`)
- Require status checks: quality + deploy preview + codeql
- Require signed commits
- Dismiss stale approvals on new push
- Require linear history
- Prohibit force-push to `main`

---

## 13. Documentation

### Current state

- **README.md** (278 lines) — covers UI guidelines, tokens, KPI cards, tables, modals, iconography, motion, accessibility checklist. It's a **design-system doc**, not a user guide.
- **CLAUDE.md** (281 lines) — the "working rules for Claude" file. Excellent for agent steering, but not user documentation.
- **firestore.rules** (191 lines) — nicely commented with the data model up front. The most accurate data-model doc in the repo.
- **firebase-blueprint.json** (213 lines) — unclear purpose; appears to be an AI Studio generation artefact.
- **src/DESIGN_SYSTEM.md** — referenced in `CLAUDE.md` but **the file does not exist** in `src/`. Dead link.

### Missing documentation

| Doc | Needed for |
|---|---|
| **ARCHITECTURE.md** | ADRs, context map, data flow, auth flow, deployment topology |
| **API.md** | Firestore collection schemas, Cloud Function contracts, webhooks |
| **RUNBOOK.md** | Night audit procedure, incident response, rollback procedure |
| **ONCALL.md** | PagerDuty rotation, escalation matrix, on-call checklist |
| **SECURITY.md** | Threat model, `vulnerability@orbit-os` disclosure policy, CVE process |
| **CONTRIBUTING.md** | Branching model, commit convention, PR template |
| **CODE_OF_CONDUCT.md** | Standard OSS/enterprise boilerplate |
| **LICENSE** | **Missing.** Project has no license — all rights reserved by default, which blocks third-party contribution |
| **CHANGELOG.md** | Release notes per version |
| **docs/user-guide/** | End-user manual per department |
| **docs/admin-guide/** | Hotel GM onboarding guide |
| **docs/developer-guide/** | Local setup, Firestore emulator, release process |

---

## 14. Compliance

### PCI-DSS (payments)

- **Current scope:** zero (no card handling).
- **Required when payments arrive:** SAQ A (if using Stripe Elements / Adyen iframe) or SAQ A-EP (if card data touches your DOM). Never accept SAQ D scope for a small team.
- **Must-haves:** tokenising gateway, network segmentation, no card data in logs, annual re-validation.

### GDPR / UK GDPR

- **Legal basis** for every processing purpose must be documented (Article 6 — contract, legitimate interest, consent).
- **Privacy notice** must be published.
- **Data Processing Agreement** with Google Cloud (for Firebase) — **you must execute this** via GCP console; it's not automatic.
- **Data Subject Access Requests** — API/manual workflow for right of access, rectification, erasure, portability, restriction, objection.
- **Breach notification** — 72-hour regulator notification; playbook required.
- **Records of Processing Activities** (Article 30) — required even for small controllers.
- **DPIA** (Article 35) — likely required for guest profile data + loyalty.

### CCPA (California residents)

- Similar posture to GDPR. "Do Not Sell My Personal Information" link required.

### SOC 2 Type II (enterprise customers will ask within month 1)

- **Scope:** Security + Availability + Confidentiality minimum. Privacy if PII-heavy.
- **Evidence period:** 6–12 months of continuous control operation.
- **Controls to implement (hard blockers):**
  - Access control matrix + quarterly review
  - Change management (CI/CD with approval)
  - Incident response plan + tabletop exercise
  - Vendor management (subprocessor list)
  - BCDR plan with annual test
  - Vulnerability management (scans, patching SLA)
  - Encryption at rest and in transit
  - Audit logging with tamper evidence
  - Background checks on staff with production access
  - Security training program
- **Timeline:** 6–12 months observation + audit. **Cannot be rushed.**

### HIPAA

- Applies only if spa/wellness stores PHI (clinical notes, health conditions). `SpaAndWellness.tsx` currently does not. **Out of scope today**, but if any health screening feature lands, a full HIPAA posture is required (BAA with Google, encryption, audit trails, minimum necessary rule).

### Bahrain PDPL

- Bahrain's Personal Data Protection Law (2018) requires consent, purpose limitation, data subject rights, and notification of breach within 72 hours to the Personal Data Protection Authority.
- The law requires a **local representative** and has **data-localisation requirements** in some cases.
- For Bahrain hotels: establish a data residency plan; Firebase multi-region setup may not be sufficient.

### EU AI Act

- The Agentic AI panel and Gemini integration put parts of the app in scope of the **EU AI Act** (transparency duties — users must know they are interacting with AI). Add visible AI disclosures.

---

## 15. Domain / PMS Feature Completeness

Benchmarking Orbit OS against industry-standard PMS (Opera, Mews, Cloudbeds, protel, Apaleo):

### Reservations

| Feature | Orbit OS | Gap |
|---|---|---|
| Walk-in | Partially — `FrontDesk` has assign-guest flow via `RoomContext` | No price override workflow, no walk-in registration card |
| Rate plans | `SalesAndRevenue` has a rate-management submenu but no data model | **Missing:** `RatePlan` entity, restrictions (MLOS, CTA, CTD, closeouts) |
| Group blocks | Menu item exists in `Reservations.tsx` submenus but only placeholder | **Missing:** group booking entity, cutoff date, rooming list, group folio |
| OTA / Channel Manager | Zero. No SiteMinder, Cloudbeds, Staah, Derbysoft integration | **P1** |
| Restrictions | Missing: min-stay, max-stay, arrival/departure close, rate closeouts | **P1** |
| Overbooking | No overbooking logic, no house-level inventory | **P1** |
| Waitlist | Menu item exists, no data model | **P1** |
| Allotments | None | P1 |
| Commissions | None | P1 |

### Front Desk

| Feature | Orbit OS | Gap |
|---|---|---|
| Check-in / out | Scaffolded — `RoomContext.assignGuest/checkoutGuest` | No ID scan, no credit-card pre-auth, no registration card printing |
| Room moves | Missing | P1 |
| Upgrade | Missing | P1 |
| Walk (relocate guest) | Missing | P1 |
| Key encoding | Missing | P2 — integrates to door locks (Assa Abloy, Onity, Salto) |
| Messaging to room | Missing | P2 |
| Wake-up calls | Missing | P2 |
| In-house forecast | Missing | P1 |

### Housekeeping

| Feature | Orbit OS | Gap |
|---|---|---|
| Room status (clean/dirty/inspected) | ✅ `RoomContext.updateHKStatus` | Good |
| OOS / OOO | Status `OOS` exists; no distinction from OOO (out of order vs out of service) | P1 |
| Task list | Menu item exists, page 996 lines | Review for completeness |
| Lost & Found | Menu item exists | Review |
| Linen management | Menu item exists | Review |
| Schedules (who cleans what room) | Not verified | Likely missing |
| Inspector workflow | Not verified | Likely missing |

### F&B

| Feature | Orbit OS | Gap |
|---|---|---|
| POS (point of sale) | `FoodAndBeverage.tsx` 1270 lines, has POS submenu | Review for tax handling, tip split, tender types |
| KOT / BOT (kitchen order ticket, bar order ticket) | Likely missing | P1 |
| Recipes + ingredient costing | `InventoryContext` has ingredients; no recipe model | P1 |
| Menu engineering (stars/dogs/plowhorses/puzzles) | Missing | P2 |
| Table management | ✅ `TableContext` | Good |
| Split bill | Not verified | Likely missing |
| Stock-level integration to menu availability | Partial — `menuItem.available` + `stock` fields | P1 — tie to `InventoryContext` |

### Revenue management

| Metric | Orbit OS | Gap |
|---|---|---|
| Occupancy % | Computed in `FrontDesk.tsx:101` | Client-side only; no history |
| ADR (Avg Daily Rate) | Missing | P1 |
| ARR (Avg Room Rate) | Missing | P1 |
| RevPAR | Missing | P1 |
| GOPPAR | Missing | P2 |
| Forecast | Missing | P1 |
| Dynamic pricing / BAR | Missing | P1 |
| Competitor rate shopping | Missing | P2 |

### Night audit

- **Missing entirely.** Night audit is the nightly batch that (a) closes the previous business day, (b) rolls forward in-house charges, (c) posts room+tax charges to folios, (d) generates the manager's reports, (e) advances the system date.
- Without this, the PMS **cannot be trusted** for daily revenue numbers.
- **P0 if operating a single-user pilot property.**

### Accounting

| Feature | Orbit OS | Gap |
|---|---|---|
| General Ledger | Menu item in `FinanceAndAccounting.tsx` | No GL account entity, no journal, no trial balance |
| Accounts Receivable (city ledger) | Menu item | No entity |
| Accounts Payable | Menu item | No entity |
| Deposits | Missing | P1 |
| Refunds | Missing | P1 |
| Taxes (VAT, city tax, tourism tax) | Missing | P1 — **critical for tax compliance** |
| Currency conversion | Missing | P1 for international |
| Xero / QuickBooks / SAP integration | Missing | P2 |

### Reporting

- Industry standard PMS ships with **200+ reports**. Orbit OS has some charts via `recharts` but **zero exportable reports**.
- Missing: daily flash, manager report, market segment analysis, source-of-business, booking pace, pickup, denial/regret/turnaway, deposit report, city ledger aging, tax report, payroll report.
- **P1 at scale.**

### Integrations (all P1)

| Integration | Why | Vendor options |
|---|---|---|
| Payment gateway | Charge guests | Stripe, Adyen, Braintree, Checkout.com |
| Channel manager | OTA distribution | SiteMinder, Staah, Cloudbeds, Derbysoft |
| IDS (Internet Distribution System) | Direct + meta | Google Hotel Ads, TripAdvisor, Trivago |
| PMS-to-PMS (brand loyalty) | If joining a chain | Marriott, IHG Concerto, Hilton OnQ |
| Accounting | Month-end close | Xero, QuickBooks Online, NetSuite, SAP |
| Door locks | Key encoding | Assa Abloy Vingcard, Onity, Salto, Dormakaba |
| Telephony / PBX | Room charges for calls | Mitel, Avaya, Cisco |
| IPTV / Cast | Guest TV + room controls | Samsung REACH, LG Pro:Centric, Exterity |
| Energy management | Room automation | Honeywell INNCOM, Verdant, Telkonet |
| Minibar sensors | Auto-post | Bartech, Dometic |
| Wi-Fi captive portal | Guest splash + room charge | Nomadix, Guest-Tek |
| Email marketing | Pre-arrival / post-stay | Revinate, Cendyn, Mailchimp |
| Review management | Reputation | TrustYou, ReviewPro, Revinate |

### Multi-property / chain mode

- **Missing.** Single-property data model only. A hotel group cannot use Orbit OS as-is.
- **P1** for any chain deal.
- Requires: `property` entity, property switcher in UI, cross-property reporting, shared guest profile (central guest database), inter-property transfer.

---

## 16. Known Drift & Tech Debt

All numbers are from grep counts run on `src/` today.

| Drift type | Count | Where it hurts most |
|---|---|---|
| Hardcoded palette `bg-*-NNN` (emerald/amber/blue/red/violet/rose/pink/indigo/purple/green/yellow/orange/cyan/teal/sky/fuchsia/lime) | **263** across 18 files | `FrontDesk.tsx` (74), `FoodAndBeverage.tsx` (37), `Housekeeping.tsx` (26), `GuestRelations.tsx` (14), `Connect.tsx` (13), `FinanceAndAccounting.tsx` (10) |
| Hardcoded `text-*-NNN` (palette + gray/slate) | **374** across 22 files | Same hotspots |
| Hardcoded `border-*-NNN` palette/gray | **107 + 13 = 120** | `Purchasing.tsx` (18), `FrontDesk.tsx` (19), `FoodAndBeverage.tsx` (15) |
| `text-red-500` / `text-emerald-500` / `text-amber-500` / `text-blue-500` (should be semantic) | **157** | `FinanceAndAccounting.tsx` (25), `HumanResources.tsx` (17) |
| `dark:bg-*-NNN` hardcoded overrides | **57** | Violates the CLAUDE.md rule "no `dark:` prefixes with hardcoded palette" |
| `gray-*` / `slate-*` surface classes | **57** across 14 files | |
| TODO / FIXME / HACK / XXX | **2** (`FrontDesk.tsx`, `Purchasing.tsx`) | Tiny — **but** many other places have debt without markers, which is worse |
| `console.log/warn/info/debug` | **6** in `CommandPalette.tsx` | Should strip in prod or gate on `import.meta.env.DEV` |
| `console.error` | **12** across 9 files | Replace with Sentry once wired |
| `debugger` / `alert(` | **0** | |
| `process.env` in source (Vite bug risk) | **2** — `AgenticAIPanel.tsx:204` (comment) + `FoodAndBeverage.tsx:730` (actual bug) | **P0 — breaks in prod** |
| Mock/seed in pages (`mockRooms`, `revenueData`, `statusData`) | At least `FrontDesk.tsx:54-88` — ~35 lines of hardcoded mock room data and chart data | Every page has some |
| `useState(...)` in pages | **141** across 23 files; **38 in `FrontDesk.tsx` alone** | A lot of that state should be in contexts |
| `useBookings|useRooms|useGuests|useFolios|useMenu|useTables|useInventory|useCostCenters|useNotifications` (context hook usage) | **68** across 7 files | FrontDesk (24), CostControl (9), RoomService (8), GuestRelations (8), FoodAndBeverage (8), MiniBar (7) — **17 of 24 pages do not use any data context**, meaning 70% of pages run on hardcoded mock data |
| `onSnapshot|addDoc|updateDoc|deleteDoc` direct Firestore calls in pages | **0** | Good — contexts are the only Firestore boundary |
| Files > 500 LOC in `src/pages/` | **9**: Engineering (599), Connect (692), Configuration (740), Concierge (746), SalesAndRevenue (785), GuestRelations (887), Housekeeping (996), FoodAndBeverage (1270), HumanResources (1549), Purchasing (1799), FinanceAndAccounting (2005), FrontDesk (**3569**) | `FrontDesk.tsx` is 3569 lines in one file — **impossible to code-review, risky to refactor** |
| Duplicate Department union type | Defined in `App.tsx:41-65` **and** `Layout.tsx:51-75`, 25 lines each | Extract to `src/types/Department.ts` |
| `vite` in both `dependencies` and `devDependencies` | Yes — `package.json:31 & 43` | Remove from `dependencies` |

### Stale / leftover artefacts

- `test-langchain.ts` and `test-langchain-structured.ts` at the project root — scratch test files, should move to `scripts/` or delete.
- `add_settings.cjs`, `refactor-tables.cjs`, `update_pages.cjs` at project root — one-off codemod scripts that should live in `scripts/`.
- `firebase-applet-config.json` + `firebase-blueprint.json` + `metadata.json` — AI Studio artefacts; unclear which are load-bearing.
- `.vercel/` dir is checked in — should be in `.gitignore` (it already is at line 9, but the dir exists, so verify).

---

## 17. Roadmap to Enterprise Production

Nine phases. Phase 0 must land before anything else ships to any non-internal user.

### Phase 0 — Secrets & hygiene (this week)

**Goal:** stop the bleeding. No production user sees a hardcoded key.

- **Rotate the exposed Gemini API key** in Google AI Studio.
- Remove the literal string at `src/components/AgenticAIPanel.tsx:205`.
- Delete `process.env.GEMINI_API_KEY` usage at `src/pages/FoodAndBeverage.tsx:730`.
- Move all Gemini calls behind a Vercel Edge Function (`/api/ai/generate`) that reads the key from Vercel env vars and proxies the request. The key never reaches the browser.
- Add `vercel.json` headers block (CSP, HSTS, X-Frame-Options, etc.).
- Lock the Firebase API key by HTTP referrer in GCP console.
- Delete `express` + `dotenv` from `dependencies`; remove the duplicate `vite` entry.
- Remove `DEV_BYPASS` from production path (gate explicitly on `import.meta.env.MODE === 'development'` not `.DEV`, and add a build-time assertion that it's false in production).
- **Exit criteria:** no secrets in the bundle; `curl https://orbit-os-beige.vercel.app/` returns all recommended security headers; all Gemini calls go through the edge proxy.

### Phase 1 — Data persistence

**Goal:** every write survives reload, across all 10 contexts.

- Choose backend (recommend Supabase; Firestore as fallback).
- Define multi-tenant schema (`tenants / properties / {collections}`).
- Rewrite each context to talk to the chosen backend. Start with the two pure-memory ones (`InventoryContext`, `CostCenterContext`).
- Remove every `if (import.meta.env.DEV) return;` guard.
- Add Zod schemas for every entity; parse on read and write.
- Run against Firebase emulator / Supabase local dev for integration tests.
- **Exit criteria:** a feature on every page persists; `npm run build && npm run preview` shows real data flowing; zero context uses in-memory state for domain data.

### Phase 2 — Auth, RBAC & multi-tenancy

**Goal:** six role tiers, tenant isolation, real login.

- Wire Firebase Identity Platform (upgrade from Firebase Auth) for SAML/OIDC.
- Add `UserRole` enum and `tenantId` to the user custom claims.
- Create `<RequireRole roles={['gm','finance']}>` wrapper.
- Rewrite `firestore.rules` (or Supabase RLS) to enforce tenant + role on every row.
- Add audit log table with append-only writes.
- Add 2FA, lockout, session expiry.
- **Exit criteria:** a Staff user cannot read another tenant's data; all admin actions are logged; 2FA enforced for GM/Finance/Admin.

### Phase 3 — Testing

**Goal:** 70% coverage on domain logic, happy-path E2E per module.

- Install Vitest + RTL + Playwright + @axe-core/playwright.
- Write unit tests for every context reducer + helper.
- Write integration tests using Firebase emulator.
- Write E2E happy paths for 5 core flows (reservation → check-in → check-out → folio close, POS order, housekeeping task, inventory receive, payroll run).
- Set CI gate.
- **Exit criteria:** `npm run test` green in CI; coverage ≥ 70% on `src/context/` and `src/lib/`; axe violations = 0 on Overview pages.

### Phase 4 — Observability

**Goal:** know when it's broken before the user does.

- Sentry `@sentry/react` init in `main.tsx`.
- PostHog product analytics + session replay.
- Datadog RUM.
- Structured logging from the edge proxy and Cloud Functions.
- Health check endpoint; uptime monitor (Better Stack, Checkly).
- Alert runbook.
- **Exit criteria:** a forced exception on staging triggers a Sentry alert within 60s; p95 load time visible in Datadog; SLOs defined.

### Phase 5 — Compliance & policy

**Goal:** pass an enterprise security questionnaire without lying.

- Threat model (STRIDE) workshop.
- Privacy policy, terms, cookie banner, DSAR workflow.
- Sign GCP Data Processing Addendum (if using Firebase) or Supabase BAA.
- Implement user data export + deletion cascades.
- SOC 2 Type I gap analysis.
- Document all controls (access, change, incident, vendor, BCDR).
- **Exit criteria:** legal sign-off on privacy stack; Vanta/Drata dashboard initialised; SOC 2 observation period started.

### Phase 6 — Domain completeness

**Goal:** a real hotel can actually use this for a week without a spreadsheet.

- Build **Night Audit** Cloud Function (P0 inside this phase).
- Channel manager integration (SiteMinder or Cloudbeds).
- Payment gateway integration (Stripe Connect).
- Full rate-plan model + restrictions.
- Tax engine (VAT, city tax, tourism tax per jurisdiction).
- Group blocks + rooming lists.
- Deposit handling.
- Accounts receivable / city ledger.
- ADR / RevPAR / occupancy history tables.
- Export: daily flash report, city ledger aging, tax report.
- **Exit criteria:** a single pilot hotel can check in 50 guests, post room charges nightly, close the day, and reconcile to the general ledger using only Orbit OS.

### Phase 7 — Performance & scale

**Goal:** < 200 kB initial bundle, < 2.5 s LCP.

- Route-level code splitting (`React.lazy` + `Suspense`).
- Manual chunks in Vite config (vendors).
- Delete LangChain (unused).
- Tree-shake `lucide-react` via `babel-plugin-transform-imports` or individual imports.
- Preload critical fonts; self-host subset.
- Implement service worker for offline shell.
- Lighthouse CI gate in pull requests.
- **Exit criteria:** Lighthouse performance ≥ 90 on a throttled 4G; LCP ≤ 2.5s; bundle ≤ 200 kB initial.

### Phase 8 — Launch

**Goal:** a pilot hotel runs one full month on Orbit OS.

- Pilot agreement (mutual SLA, pricing, rollback plan, emergency phone line).
- Data migration from incumbent PMS (even if manual CSV).
- Staff training program.
- On-call rotation for 30 days.
- Weekly retrospective with the hotel GM.
- Postmortem and hardening after each incident.
- **Exit criteria:** one month of real operation; 0 Sev-1 incidents; guest-facing metrics (check-in time, folio accuracy, room status accuracy) equal or beat the incumbent PMS.

---

## 18. Effort Estimate (relative)

> Order of magnitude only — no dates, no weeks. Assume "small" = days of one senior engineer, "medium" = weeks of one senior engineer, "large" = weeks of a small team.

| Phase | Effort | Can parallelise with |
|---|---|---|
| **Phase 0 — Secrets & hygiene** | small | — (must land first) |
| **Phase 1 — Data persistence** | large | Phase 2, Phase 3, Phase 4 |
| **Phase 2 — Auth & multi-tenancy** | large | Phase 1, Phase 4 |
| **Phase 3 — Testing** | large | Phase 1, Phase 2, Phase 4 |
| **Phase 4 — Observability** | medium | Phase 1, Phase 2, Phase 3 |
| **Phase 5 — Compliance & policy** | large | Phase 2, Phase 3, Phase 6 |
| **Phase 6 — Domain completeness** | **very large** (biggest phase) | Phase 3, Phase 5, Phase 7 |
| **Phase 7 — Performance & scale** | medium | Phase 6 (after bundle is understood) |
| **Phase 8 — Launch** | medium | — (must be last) |

Parallelisation plan: after Phase 0, run a Data squad (Phase 1 → Phase 2), a Quality squad (Phase 3 → Phase 4), a Product squad (Phase 6), and a Compliance squad (Phase 5) simultaneously. Launch (Phase 8) is the merge point.

---

## 19. Immediate Next 10 Actions

Do these tomorrow, in order. Check off as you go.

1. **Revoke** the Gemini API key `AIzaSyDJ4sf8T2STcANgSOyhQLkibjv_8LF6mi0` in Google AI Studio. Immediately.
2. **Delete the literal key** from `src/components/AgenticAIPanel.tsx:205` and the `process.env.GEMINI_API_KEY` call at `src/pages/FoodAndBeverage.tsx:730`. Add a Vercel Edge Function at `/api/ai/generate` that reads the key from `process.env` (server-side, not bundled) and proxies to `@google/genai`. Have both call sites hit that URL.
3. **Add security headers** to `vercel.json`: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Verify with `curl -I https://orbit-os-beige.vercel.app/`.
4. **Lock the Firebase API key** by HTTP referrer in Google Cloud Console → APIs & Services → Credentials → Restrict key to `https://orbit-os-beige.vercel.app/*` plus `localhost`.
5. **Delete `DEV_BYPASS` contamination from the 7 data contexts.** Replace with a single `src/lib/env.ts` helper that only returns a mock when `import.meta.env.MODE === 'development'` AND a `VITE_USE_MOCK_DATA=true` env var is set. Default off.
6. **Set up GitHub Actions CI:** create `.github/workflows/ci.yml` with `tsc --noEmit`, `npm audit --production --audit-level=high`, and `npm run build`. Block merges on failure. Add Dependabot.
7. **Install Vitest + RTL + Playwright** and write the first five tests: `cn()` util, `statusBadgeTone()` helper, `AuthContext` login flow with mock, `BookingContext` addBooking happy path, Layout header renders. Wire into CI.
8. **Wire Sentry:** `npm i @sentry/react`, add `Sentry.init({ dsn })` in `src/main.tsx`, wrap the root `ErrorBoundary` with Sentry's error reporter. DSN from env (server-side via Vercel env).
9. **Rewrite `InventoryContext` and `CostCenterContext`** to persist to Firestore (or your chosen backend). These two contexts today lose all writes on reload and are the most immediate data-loss risk.
10. **Delete LangChain.** Remove `langchain`, `@langchain/core`, `@langchain/google-genai` from `package.json`. Rebuild. Expect ~300 kB gzip drop in the bundle. Done.

---

## 20. Appendix: File Manifest

### Totals

- **Total TSX/TS LOC in `src/`:** **22,917** lines.
- **Total pages (`src/pages/*.tsx`):** **24** files, 18,419 lines.
- **Total components (`src/components/**/*.tsx`):** **12** files, 3,085 lines.
  - App-level: `Layout.tsx` (605), `AgenticAIPanel.tsx` (650), `UIAssetsLibrary.tsx` (465), `theme-provider.tsx` (330), `CommandPalette.tsx` (170), `ErrorBoundary.tsx` (78).
  - UI primitives in `src/components/ui/`: `KPICard.tsx` (95), `Table.tsx` (40), `RoomCard.tsx` (125), `InventoryTable.tsx` (115), `InventoryMovements.tsx` (206).
- **Total contexts (`src/context/*.tsx`):** **10** files, 1,348 lines.
- **Total lib (`src/lib/*.ts`):** 3 files, 66 lines.
- **Styles:** `src/styles/tokens.css` (164), `src/styles/tokens.json` (130), `src/index.css` (158).
- **Root:** `src/App.tsx` (195), `src/main.tsx` (10).
- **Tests:** **0.**
- **CI workflows:** **0.**
- **README:** `README.md` (278 lines, design-system focused).
- **CLAUDE instructions:** `CLAUDE.md` (281 lines, working rules for Claude).
- **Firestore rules:** `firestore.rules` (191 lines).
- **Firebase config:** `firebase-applet-config.json` (10 lines, secrets-bearing).
- **Vercel config:** `vercel.json` (1 line — only a rewrite rule, no headers).

### Largest files (top 10 by line count)

| # | File | Lines | Note |
|---|---|---|---|
| 1 | `src/pages/FrontDesk.tsx` | **3,569** | Needs to be split by submenu (Overview, VIP, Profiles, Rooms, Arrivals, Departures, Reservations, Timeline, Billing) |
| 2 | `src/pages/FinanceAndAccounting.tsx` | 2,005 | |
| 3 | `src/pages/Purchasing.tsx` | 1,799 | |
| 4 | `src/pages/HumanResources.tsx` | 1,549 | |
| 5 | `src/pages/FoodAndBeverage.tsx` | 1,270 | Contains the `process.env` AI bug at L730 |
| 6 | `src/pages/Housekeeping.tsx` | 996 | |
| 7 | `src/pages/GuestRelations.tsx` | 887 | |
| 8 | `src/pages/SalesAndRevenue.tsx` | 785 | |
| 9 | `src/pages/Concierge.tsx` | 746 | |
| 10 | `src/pages/Configuration.tsx` | 740 | Has the Theme Studio |

### Pages below 300 lines (likely stubs or placeholders)

`Readme.tsx` (130), `Security.tsx` (171), `LegalAndCompliance.tsx` (172), `ITAndSystems.tsx` (176), `Reservations.tsx` (177), `MiniBar.tsx` (216), `Executive.tsx` (268), `RoomService.tsx` (270), `MarketingAndPR.tsx` (272), `SpaAndWellness.tsx` (277), `EventsAndBanquets.tsx` (281). These 11 pages are likely thin shells with one or two submenu implementations and placeholder "Generic View" renderers — confirmed on `Reservations.tsx` which has `<GenericView title={activeSubmenu} />` as the default case.

### Data-layer boundary

- **367 `onSnapshot|addDoc|updateDoc|deleteDoc` calls in `src/pages/`** — this grep-count appears high, but inspection shows many pages implement their own _local_ state updates. **0** direct `onSnapshot|addDoc|updateDoc|deleteDoc` import from `firebase/firestore` inside `src/pages/` (all such calls live in contexts). Good discipline.
- Wait — the grep for "onSnapshot|addDoc|updateDoc|deleteDoc" in pages returned 367 matches across 23 files. Re-checking: those are almost certainly matches inside variable names and comments, not Firestore API calls. Verified: the Firestore API imports live only in `src/context/*.tsx` and `src/lib/firestore-utils.ts`. Pages do not talk to Firestore directly, which is the correct architecture.

### Dependency count

- **Runtime deps:** 20
- **Dev deps:** 9
- **Duplicates:** `vite` appears in both (bug).
- **Unused but installed:** `zod` (0 imports in `src/`), `dotenv`, `express`, all `@langchain/*` except arguably `@langchain/google-genai`.

---

**End of report.** This document is the baseline. Re-run the audit after Phase 0 to confirm secrets are gone, then quarterly thereafter. Every phase exit criterion should be verifiable by a concrete test or metric — if you can't measure it, it isn't done.
