# Orbit OS — Working Rules for Claude

These are **non-negotiable** standing instructions. Read this file at the start of every session and follow it on every change.

---

## 1. Respect the existing UI design — do not drift

- **Do not invent a new visual language.** The current UI, colors, spacing, typography, iconography, and component patterns are the source of truth.
- Before writing a single line of UI code, **study the existing design first**:
  - Read [`src/DESIGN_SYSTEM.md`](./src/DESIGN_SYSTEM.md) end-to-end.
  - Open [`src/pages/StyleGuide.tsx`](./src/pages/StyleGuide.tsx) to see live examples.
  - Scan [`src/components/`](./src/components/) for existing shared components.
  - Skim the closest 2–3 pages in [`src/pages/`](./src/pages/) that already solve a similar problem.
- Match the **existing tokens** (colors, radii, shadows, spacing, motion). Do not introduce new ones without explicit approval.
- Match the **existing interaction patterns** (drawers, modals, filters, stat cards, tabs). Do not invent parallel patterns.

## 2. Reuse before you build — double-check for existing functionality

- **Every time** you are about to add a component, hook, utility, service method, or page section, first check whether:
  1. It already exists under `src/components/`, `src/lib/`, `src/services/`, `src/hooks/`, or `src/store/`.
  2. Something **similar** already exists that provides the same or overlapping function — even if named differently.
  3. Another page already solves the same UX problem — if so, reuse its component, don't fork it.
- **If similar exists → extend / reuse it.** Do not duplicate. Duplication is the biggest risk in this 25k-LOC codebase.
- When uncertain, **list what you found and ask before creating a new file**.
- Search checklist before creating anything new:
  ```
  Grep for the feature name, the action verb, the data model, and the UI pattern
  (e.g., "StatCard", "work order", "createReservation", "drawer", "filter bar").
  ```

## 3. Keep the user guide (README) in sync — every time

- **Any** new feature, page, component, setting, env variable, command, or workflow change requires a **same-commit update** to [`README.md`](./README.md).
- The README is the **user guide**. It must always answer, for the current state of the code:
  - How to install and run the app
  - How to log in and which roles see what
  - How to use every major feature / department module that exists
  - Any environment variables or config required
  - Any breaking changes since the previous version
- If the README gets long, split into `docs/` but keep the README as the entry point with a table of contents linking into `docs/`.
- **No PR / commit is "done" if the README wasn't updated to match.**

## 4. Zoom out before every major change

- Before making any **major** change (new page, new global state, new routing structure, new auth model, backend contract change, shared-component rewrite, design-token change), **step back and look at the whole system first**:
  1. List every place the change will touch (pages, components, services, context, tests).
  2. Consider the impact on the **6 role tiers** in `DESIGN_SYSTEM.md` (GM, DeptManager, Supervisor, Staff, Finance, Admin).
  3. Consider the impact on the **other 21 department pages** — will they need the same pattern? Is there a shared abstraction?
  4. Consider the impact on the **brand architecture** (Orbit PMS / Portfolio / Insights / Guest / Revenue / Chain).
  5. Consider the impact on the **TravelBook umbrella** — any shared contracts that will later be absorbed?
  6. Choose the approach that is **most reusable, least disruptive, and easiest to roll back**.
- Write a short "plan" comment in the session before starting the change, so the decision is visible.

## 4a. Design tokens are the single source of truth

- **Never hardcode a color, radius, shadow, font, or motion value** in any new code. Use a token from [`src/styles/tokens.css`](./src/styles/tokens.css) / [`src/styles/tokens.json`](./src/styles/tokens.json).
- **Prefer semantic utilities over raw Tailwind palette classes.**
  - ✅ `bg-success-100 text-success-700` · ❌ `bg-emerald-100 text-emerald-700`
  - ✅ `bg-danger-500 text-danger-foreground` · ❌ `bg-red-500 text-white`
  - ✅ `bg-kpi-arrivals` · ❌ `bg-gradient-to-br from-pink-500 to-rose-600`
  - ✅ `bg-primary`, `text-foreground`, `border-border` · ❌ `bg-violet-500`, `text-gray-800`, `border-gray-200`
- **If a semantic token does not exist**, add it to `tokens.json` **and** `tokens.css` **and** register it in the `@theme` block of `src/index.css` — then use it. Never hardcode a hex or a raw palette utility instead.
- **Opportunistic migration:** when you edit any existing page for any reason, migrate its hardcoded palette classes to semantic tokens in the same commit. Do not open a mass find/replace PR.
- **Re-theming for a tenant** must remain a one-file override (a CSS file overriding `--color-*` / `--radius-*` / `--shadow-*` variables) — if a change would break that, reconsider the change.
- The full rules + token map live in [`src/DESIGN_SYSTEM.md` §0](./src/DESIGN_SYSTEM.md).

## 5. Definition of "done" for every change

A change is only complete when **all** of these are true:

- [ ] Existing UI design is respected (rule 1).
- [ ] No duplication of existing components, hooks, services, or utilities (rule 2).
- [ ] `README.md` is updated to document the change for users (rule 3).
- [ ] Major changes were evaluated against the whole system first (rule 4).
- [ ] **No new hardcoded colors / radii / shadows / fonts** — every new value flows through `tokens.json` + `tokens.css` + `@theme` (rule 4a).
- [ ] Strict TypeScript passes (`npm run lint` / `tsc --noEmit`).
- [ ] The change does not break any of the 6 role-access tiers.
- [ ] A one-line entry is added to the relevant section of README roadmap or a `CHANGELOG.md`.

---

## 6. UI Contract — binding patterns (study before touching UI)

**Goal:** keep the Orbit OS UI coherent. Every new pixel must look like it was drawn by the same hand that drew the 21 existing department pages. No parallel visual languages.

### 6.0 Study order (do this every session before any UI change)

1. Open the app → **Readme → UI Assets** (this is the **live source of truth**; it replaces any stale markdown doc).
2. Read [`src/components/UIAssetsLibrary.tsx`](./src/components/UIAssetsLibrary.tsx) — the code behind the live gallery.
3. Read [`src/components/Layout.tsx`](./src/components/Layout.tsx) for the shell (sidebar 2-column, header, `px-[1.5cm]` main content).
4. Read [`src/components/ui/KPICard.tsx`](./src/components/ui/KPICard.tsx) and [`src/components/ui/Table.tsx`](./src/components/ui/Table.tsx) — the two centralised primitives.
5. Skim 2-3 closest existing pages in `src/pages/` that solve a similar problem.
6. Read `src/styles/tokens.json`, `src/styles/tokens.css`, and the `@theme` block of `src/index.css`.

### 6.1 Canonical page header (copy exactly — do NOT invent variants)

Every page in `src/pages/` uses this header. Adhere 100%:

```tsx
<div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">DEPARTMENT_NAME</h2>
      <h1 className="text-2xl font-bold text-foreground">{activeSubmenu}</h1>
      <p className="text-sm text-muted-foreground mt-1">…subtitle…</p>
    </div>
  </div>
</div>
```

- Eyebrow: `text-xs font-bold text-primary uppercase tracking-wider`
- H1: `text-2xl font-bold text-foreground`
- Subtitle: `text-sm text-muted-foreground`
- Negative margin `-mx-[1.5cm]` + padding `px-[1.5cm]` bleed the header across the full content width under the sticky bar. Keep this.

### 6.2 Primitives you MUST reuse (never reinvent)

| Primitive | File | When to use |
|---|---|---|
| `KPICard` | `src/components/ui/KPICard.tsx` | Every metric tile. Props: `label`, `value`, `change`, `trend`, `icon`, `variant` (`vibrant`/`outline`/`ghost`), `color`. Do NOT build a custom stat card from `<div>`. |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | `src/components/ui/Table.tsx` | Every data grid. Styling baked in (`bg-secondary/50`, `divide-border/50`, `hover:bg-secondary/30`). |
| Modal pattern | inline in each page, uses `motion/react` | Backdrop `fixed inset-0 z-50 bg-black/50 backdrop-blur-sm`, content `bg-card rounded-2xl border border-border`, sticky header + body + sticky footer, both footers `bg-secondary/30`. Copy from `SalesAndRevenue.tsx` → `AddRateModal`. |

### 6.3 Spacing & rhythm (hard-coded scale — don't drift)

- Page main content: `px-[1.5cm] pb-8` (set by `Layout.tsx`)
- Between sections on a page: `space-y-6`
- Grid gaps (cards, KPIs): `gap-6`
- Form field vertical rhythm: `space-y-4`
- Inline row gaps: `gap-3` (standard) / `gap-4` (wider)
- Page header bottom margin: `mb-10`

### 6.4 Typography scale

- H1 (page title): `text-2xl font-bold text-foreground`
- H2 (section): `text-lg font-semibold` or `text-xl font-bold`
- Eyebrow label: `text-xs font-bold text-primary uppercase tracking-wider`
- Body: `text-sm`
- Captions / muted: `text-sm text-muted-foreground`
- Status pill text: `text-[10px] font-bold uppercase tracking-wider`

Font weight discipline: `font-medium` for labels/buttons/table headers, `font-bold` only for headings, eyebrows, badges.

### 6.5 Colour rules (hard enforcement of §4a)

**Status badges** — always use semantic tokens, never raw emerald/amber/red/blue:

| Meaning | ✅ Use | ❌ Don't use |
|---|---|---|
| Success / Confirmed / Active | `bg-success-100 text-success-700` | `bg-emerald-100 text-emerald-700` |
| Warning / Pending / In-progress | `bg-warning-100 text-warning-700` | `bg-amber-100 text-amber-700` |
| Danger / Cancelled / Failed | `bg-danger-100 text-danger-700` | `bg-red-100 text-red-700` |
| Info / Draft / Neutral info | `bg-info-100 text-info-700` | `bg-blue-100 text-blue-700` |
| Neutral / Unknown | `bg-secondary text-secondary-foreground` | `bg-gray-100 text-gray-700` |

**KPI gradients** — use the 6 semantic utilities, never inline `from-*-500 to-*-600`:

`bg-kpi-arrivals` · `bg-kpi-in-house` · `bg-kpi-departures` · `bg-kpi-revenue` · `bg-kpi-occupancy` · `bg-kpi-adr-revpar`

**Surface colours** — `bg-background`, `bg-card`, `bg-secondary`, `bg-muted`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-primary`. Never `bg-white`, `bg-gray-100`, `text-gray-800`, `border-gray-200`.

**Required-field star** — `text-danger-500`, not `text-red-500`.

**No `dark:` prefixes with hardcoded palette colours.** Dark mode is handled by `.dark { --color-*: … }` overrides in `tokens.css`. If you type `dark:bg-emerald-900/30` you're doing it wrong.

**Tenant re-theming happens in Configuration → Appearance → Theme Studio** (not by hand-editing `tokens.css`). Every editable token flows through `ThemeConfig` + `CSS_VAR_MAP` in `src/components/theme-provider.tsx`. When you introduce a new token that tenants should be able to customise, you MUST:

1. Add it to `ThemeConfig` + `defaultThemeConfig` + `CSS_VAR_MAP` in `theme-provider.tsx`.
2. Add a control for it in the relevant Theme Studio `StudioSection` in `Configuration.tsx`.
3. Add it to `tokens.json` + `tokens.css` (factory default).
4. Register the semantic Tailwind utility in the `@theme` block of `index.css` (if needed).
5. Document the new token in `README.md` §0.

The theme pack (`theme.json` export from Theme Studio) is the single-file tenant brand. If a change you're about to make would break one-file re-theming, reconsider.

### 6.6 Buttons (raw `<button>`, copy exactly)

```tsx
{/* Primary */}
<button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
  <Plus className="w-4 h-4" /> Action
</button>

{/* Secondary */}
<button className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>

{/* Destructive */}
<button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90">Delete</button>
```

- Always `rounded-lg` (not `rounded-xl`, not `rounded-md`) unless you have a documented reason.
- Always `px-4 py-2 text-sm font-medium`.
- Icon-in-button: `w-4 h-4` + `gap-2`.

### 6.7 Forms & inputs

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium text-muted-foreground">Field <span className="text-danger-500">*</span></label>
    <input className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" />
  </div>
</div>
```

- Focus ring: `focus:ring-2 focus:ring-primary/50` (or `ring-1` as above — both acceptable, pick the one matching neighbouring inputs).
- Required star: `text-danger-500`.
- Label colour: `text-muted-foreground`.

### 6.8 Icons

- Library: `lucide-react` **only**. No SVG imports, no other icon libs.
- Size by context: **`w-4 h-4`** inside buttons / inline with text / table actions · **`w-5 h-5`** in KPI cards / section headings · **`w-6 h-6`** in the top header / large standalone.
- Colour: inherit from parent (`text-foreground`, `text-muted-foreground`, `text-primary`) or semantic status (`text-success-500`, `text-danger-500`, `text-warning-500`). Never `text-emerald-500`, `text-amber-500`.

### 6.9 Motion

- Library: `motion/react` (never `framer-motion` import, never Tailwind `animate-*` except `animate-spin` for loaders).
- Page content transition: `initial={{ opacity: 0, y: 10 }}` → `animate={{ opacity: 1, y: 0 }}` → `exit={{ opacity: 0, y: -10 }}` → `transition={{ duration: 0.2 }}`.
- Modal entry: backdrop fade + content `y: 50 → 0`.
- Duration constants live in tokens: `--motion-duration-fast` (120ms), `--motion-duration-base` (200ms), `--motion-duration-slow` (320ms). If you need a magic number, read it from the token.

### 6.10 State & data — where things live

Before you create a new context or hook, check if it already exists:

- `src/context/` — `AuthContext`, `NotificationContext`, `BookingContext`, `FolioContext`, `GuestContext`, `MenuContext`, `RoomContext`, `TableContext`. If your feature needs guest/room/booking/menu/folio/table/notification data — **use these**, don't fork.
- `src/lib/` — `utils.ts` exports `cn()` (clsx + tailwind-merge). `firebase.ts` exports `auth`, `db`. `firestore-utils.ts` exports `handleFirestoreError()`.
- No `src/services/`, no `src/hooks/`. If you need a hook, put it in `src/context/` alongside its provider or in a new `src/hooks/` folder (and add it to this list in the same commit).

### 6.11 File naming & location rules

- Pages → `src/pages/PascalCase.tsx`, one file per top-level department, sub-sections are inner components in the same file.
- Shared visual primitives → `src/components/ui/PascalCase.tsx`.
- App-level shell / providers → `src/components/PascalCase.tsx` (layout, error boundary) or `src/components/kebab-case.tsx` (existing convention: `theme-provider.tsx`).
- CSS / tokens → `src/styles/kebab-case.css` / `.json`.
- Contexts → `src/context/PascalCaseContext.tsx`, provider is `PascalCaseProvider`, hook is `usePascalCase()`.

### 6.12 Pre-flight checklist (answer ALL before writing UI code)

```
[ ] I opened the app → Readme → UI Assets and studied the live tokens + primitives.
[ ] I searched src/components/ui/ and src/components/ for an existing primitive that does this.
[ ] I searched src/pages/ for a similar problem already solved.
[ ] Every colour I will use is a semantic token (bg-success-*, text-danger-*, bg-primary, etc.) — no raw emerald/amber/red/blue/rose/purple/pink/gray.
[ ] Every spacing value comes from the scale (space-y-4/6, gap-3/4/6, px-4 py-2, px-[1.5cm]).
[ ] Every font size comes from the scale (text-xs/sm/lg/2xl) with the documented weight.
[ ] My page header is the canonical block from §6.1 verbatim.
[ ] I am reusing KPICard / Table, not hand-rolling divs.
[ ] My motion uses motion/react with the standard transition timings.
[ ] If I invented a new token, I added it to tokens.json AND tokens.css AND the @theme block in index.css — in the same commit.
[ ] I updated README.md and the UI Assets library if I added a new primitive.
[ ] tsc --noEmit passes.
```

If any box is unchecked → **stop and fix before continuing**. If a box can't be checked because the existing codebase doesn't yet comply (e.g. you're editing a page that still has hardcoded `bg-emerald-100`) → migrate it in the same commit (§4a opportunistic migration).

### 6.13 Known tech-debt drift (migrate opportunistically; never add more)

- ~450 hardcoded status-badge colours (`bg-emerald-100`, `bg-amber-100`, `bg-red-100`, `bg-blue-100`) across `src/pages/`. Migrate to semantic tokens on any page you touch.
- ~40 hardcoded `dark:bg-*-900/30` pairs on badges. Delete and rely on tokens.
- `theme-provider.tsx` sidebar hex presets (`#5b21b6`, etc.) — should be moved into `tokens.json`. Do not add more hex here.
- Required-field stars use `text-red-500` — migrate to `text-danger-500`.

**Do not create new drift. Only reduce it.**

---

## Quick-reference search commands

```bash
# before creating a new component, always run:
rg -i "<ComponentName>|similarThing" src/
rg -i "createX|updateX|fetchX" src/services src/hooks
rg -i "tokenName|colorName" src/styles src/DESIGN_SYSTEM.md
```

---

*Established 2026-04-08 by the project owner. These rules override any default Claude behavior. When in doubt, re-read this file.*
