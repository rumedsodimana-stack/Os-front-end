# 5-Star Hotel Management System - UI Assets & Guidelines

This document outlines the standard UI components, assets, and design patterns used across the application. When adding new features or modules, please adhere to these guidelines to maintain a consistent, luxury 5-star standard.

> **Live preview:** open the app → **Readme → UI Assets** to see every token and component rendered live.

## 0. Design Tokens (source of truth)

All colours, radii, shadows, and gradients flow from **one** source:

- `src/styles/tokens.json` — machine-readable Style-Dictionary-shaped tokens (Figma sync target).
- `src/styles/tokens.css` — runtime CSS variables mirroring `tokens.json`.
- `src/index.css` — `@theme` block + semantic utilities + `.bg-kpi-*` gradient utilities.

**Rule:** never hardcode a hex or a raw Tailwind palette class (`bg-emerald-500`, `text-red-700`, `from-pink-500`). Always use the semantic utility so a tenant re-theme is a one-file override.

### Status colours (100 / 500 / 700)

| Semantic | Utility | CSS var |
|---|---|---|
| Success (emerald) | `bg-success-100`, `bg-success-500`, `bg-success-700` | `--color-success-{100,500,700}` |
| Warning (amber)   | `bg-warning-100`, `bg-warning-500`, `bg-warning-700` | `--color-warning-{100,500,700}` |
| Danger (red)      | `bg-danger-100`, `bg-danger-500`, `bg-danger-700`    | `--color-danger-{100,500,700}`  |
| Info (blue)       | `bg-info-100`, `bg-info-500`, `bg-info-700`          | `--color-info-{100,500,700}`    |

✅ `bg-success-100 text-success-700` · ❌ `bg-emerald-100 text-emerald-700`

### KPI gradients

Use on KPI hero tiles / stat cards:

`.bg-kpi-arrivals` · `.bg-kpi-in-house` · `.bg-kpi-departures` · `.bg-kpi-revenue` · `.bg-kpi-occupancy` · `.bg-kpi-adr-revpar`

### Radius scale

`--radius-sm` (0.25rem) · `--radius-md` (0.5rem) · `--radius-lg` (0.75rem) · `--radius-xl` (1rem) · `--radius-2xl` (1.5rem) · `--radius-full` (9999px)

### Shadow scale

`--shadow-sm` · `--shadow-md` · `--shadow-lg` · `--shadow-xl`

### Adding a new token

1. Add it to `src/styles/tokens.json` (source of truth, Figma-sync).
2. Mirror it as a CSS var in `src/styles/tokens.css` (+ `.dark` override).
3. Register the semantic utility in the `@theme` block of `src/index.css`.
4. Add it to the `ThemeConfig` interface + `defaultThemeConfig` + `CSS_VAR_MAP` in `src/components/theme-provider.tsx` so it becomes runtime-editable.
5. Expose a control for it in `src/pages/Configuration.tsx` → Appearance → Theme Studio.
6. Use the semantic utility in code — never the raw hex.

### Theme Studio — edit everything live, export as a theme pack

Go to **Configuration → Appearance → Theme Studio** to edit every design token at runtime. Sections:

- **Surfaces** — background, foreground, card, border
- **Status colours** — success / warning / danger / info (edits the 500 shade)
- **KPI gradients** — all 6 gradient pairs with live previews
- **Typography (advanced)** — monospace font, base font size (12–20 px)
- **Motion** — fast / base / slow animation durations
- **Theme pack — export / import** — download the complete config as a single `theme.json`, or upload one from another tenant

Changes apply live and persist to `localStorage` under key `omnistay-config`. Hit **Reset to Default Settings** at the bottom to clear all overrides.

**Theme pack (`theme.json`)** is the one-file tenant white-label: drop it into any Orbit OS deployment and the entire UI rebrands without touching code.

## 1. KPI Cards (`KPICard`)

**CRITICAL INSTRUCTION:** Do NOT create custom KPI cards using raw `div` elements (e.g., `<div className="bg-card p-6 rounded-2xl...">`). You **MUST** use the standardized `KPICard` component for all metric displays to ensure consistency across the system.

**Location:** `src/components/ui/KPICard.tsx`

**Usage:**
```tsx
import { KPICard } from "../components/ui/KPICard";
import { Users } from "lucide-react";

// Vibrant Variant (Default)
<KPICard 
  label="Total Guests" 
  value="1,240" 
  change="+12% this month" 
  trend="up" // "up" | "down" | "neutral"
  icon={Users} 
  color="emerald" // "emerald" | "blue" | "purple" | "amber" | "rose" | "indigo" | "cyan"
/>

// Outline Variant
<KPICard 
  label="Loyalty Points" 
  value="45,000" 
  change="Next tier: 2,460 pts away" 
  trend="neutral"
  icon={Award} 
  color="amber"
  variant="outline"
/>
```

## 2. Standardized Tables

All tables across the system must use the following structure and Tailwind classes to ensure consistent spacing, borders, and hover states.

**Usage:**
```tsx
<div className="overflow-x-auto">
  <table className="w-full text-sm text-left border-collapse">
    <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
      <tr>
        <th className="px-4 py-3 font-medium">Column 1</th>
        <th className="px-4 py-3 font-medium text-right">Amount</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border/50">
      <tr className="hover:bg-secondary/30 transition-colors group">
        <td className="px-4 py-3">Data 1</td>
        <td className="px-4 py-3 text-right font-medium">$100.00</td>
      </tr>
    </tbody>
  </table>
</div>
```

## 3. Modals & Dialogs

Modals use `framer-motion` for smooth entrance/exit animations. They include a backdrop blur, a sticky header, a scrollable body, and a sticky footer for actions.

**Usage:**
```tsx
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";

function ExampleModal({ onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 sticky top-0 z-20">
          <div>
            <h3 className="text-lg font-bold text-foreground">Modal Title</h3>
            <p className="text-sm text-muted-foreground">Optional subtitle description.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Content goes here */}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

## 4. Status Badges (Pills)

Use these for statuses (Confirmed, Pending, Cancelled, etc.) or Loyalty Tiers.

**Usage:**
```tsx
// Success / Confirmed / Completed
<span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
  Confirmed
</span>

// Warning / Pending / In Progress
<span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
  Pending
</span>

// Danger / Cancelled / Out of Order
<span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
  Cancelled
</span>

// Neutral / Draft
<span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground">
  Draft
</span>
```

## 5. Forms & Inputs

Standardized spacing and styling for form elements.

**Usage:**
```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium text-muted-foreground">Field Label <span className="text-red-500">*</span></label>
    <input 
      type="text" 
      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" 
      placeholder="Enter value..." 
    />
  </div>
  
  <div className="space-y-2">
    <label className="text-sm font-medium text-muted-foreground">Select Label</label>
    <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
      <option>Option 1</option>
      <option>Option 2</option>
    </select>
  </div>
</div>
```

## 6. Buttons

**Usage:**
```tsx
// Primary Action
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
  <Plus className="w-4 h-4" /> Primary Button
</button>

// Secondary Action
<button className="bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2">
  Secondary Button
</button>

// Destructive Action
<button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2">
  Delete
</button>
```

## 7. Icons

We use `lucide-react` for all icons. Ensure icons are sized appropriately (usually `w-4 h-4` for inline text, `w-5 h-5` for buttons, `w-6 h-6` for headers).

---

## 8. Front Desk — Room Profile Modal

`RoomProfileModal` (exported from `src/pages/FrontDesk.tsx`, reused by Housekeeping, Mini Bar and Room Service) is now fully operational against the shared contexts:

- **Header status badge** — driven by the `statusBadgeTone(status)` helper, pure semantic tokens (`bg-info-100`, `bg-success-100`, `bg-warning-100`, `bg-danger-100`, `bg-secondary`).
- **Overview tab** — live from `useGuests()`, `useBookings()`, `useFolios()`. Shows real guest (name, phone, nationality, VIP loyalty tier), real active booking (res ID, arrival/departure, nights, rate, status) and live folio balance; empty fields fall back to `—`.
- **Folio & Charges** — renders real `folio.items` with date/category/description/amount + total. "Post Charge" opens the existing `PostChargeForm` sub-modal; mini-bar sales post via `addFolioItem` against the current booking's folio.
- **Mini Bar** — pulls from `useInventory().getItemsByDepartment("Mini Bar")`; "Post Charge" calls `postMovement({ type: "SALE", … })` and posts a `F&B` charge to the folio in a single action. Out-of-stock items are disabled.
- **Maintenance** — shows a room-scoped empty state + "Create Ticket" launcher. Work-order listing is left as a clear TODO until a `MaintenanceContext` exists (no new context invented).
- **Assets** — minimal static reference list, explicitly labelled "no asset-by-room context yet".
- **History** — pulls `useBookings()` filtered by the linked guest's full name; empty state when the guest has no prior stays.
- **Smart Controls** — fully token-migrated (`bg-success-100 text-success-700` ONLINE pill). Climate +/− and all three toggles (Master Lights, DND, MUR) are wired to local `useState` and visually reflect the current value.
- **Footer** — Check In/Out and Save now use `bg-primary text-primary-foreground`; the Alerts button uses `bg-danger-100 text-danger-700 border-danger-200`. Accompany / Comments / Profile Notes open an inline note sub-modal (same pattern as Billing/Traces/Routing) that persists to local state and toasts "Saved". No Post toggles a warning-tone state. All 32 Opera Options toast on click; the 5 wired ones (Billing, Wake-up Call, Traces, Alerts, Routing) open their existing sub-modals.

No new hardcoded palette colours were introduced; all changes flow through existing semantic tokens and reuse the existing `DetailField`, `ActionButton`, `PostChargeForm`, `CreateTicketForm`, `CheckInWizard`, `CheckOutWizard` primitives already in `FrontDesk.tsx`.

---
*Note: Always use the `cn()` utility function from `src/lib/utils.ts` when conditionally joining Tailwind classes.*
