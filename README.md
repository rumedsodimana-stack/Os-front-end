# 5-Star Hotel Management System - UI Assets & Guidelines

This document outlines the standard UI components, assets, and design patterns used across the application. When adding new features or modules, please adhere to these guidelines to maintain a consistent, luxury 5-star standard.

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

## 8. Orbit OS Theme (Layout)

The application supports a premium, macOS-inspired layout called the **Orbit OS Theme**. This layout replaces the traditional left-hand sidebar with a top menu bar and a floating bottom dock.

**Key Features of Orbit OS Theme:**
- **Glassmorphism:** Heavy use of `backdrop-blur-xl` and semi-transparent backgrounds (`bg-background/40`) to create a frosted glass effect.
- **Top Menu Bar:** Displays the active department icon and name on the left, followed by its sub-menus. System actions (Search, AI, Theme, Notifications) are aligned to the right.
- **Floating Dock:** A centered, glassy dock at the bottom of the screen containing icons for the main departments. Tooltips appear on hover to identify each department.

**Usage:**
To activate this theme, set the `layoutStyle` in the `ThemeConfig` to `"orbit-os"`.

```tsx
// In theme-provider.tsx or via setConfig
setConfig({ layoutStyle: "orbit-os" });
```

**Claude AI Handover Context:**
When modifying the Orbit OS layout in `Layout.tsx`, look for the `isOrbitOS` boolean. Ensure that any new elements added to the top bar or bottom dock maintain the established glassmorphism styling (e.g., `bg-background/40 backdrop-blur-xl border-white/10 dark:border-white/5`).

## 9. AI Coworker (Sandbox)

The AI Coworker is an experimental feature located in the Sandbox module (`src/pages/NewFeature.tsx`). It leverages the Gemini API to assist hotel staff with complex operational tasks.

**Key Capabilities:**
- **Conversational Interface:** Users can chat with the AI to request tasks.
- **Dynamic UI Generation:** The AI can return structured JSON that triggers the rendering of specific UI components (e.g., `reservation_form`, `reservation_table`).
- **Live Data Integration:** The AI Coworker is wired into the application's core context providers (like `BookingContext`). When the AI generates a reservation form and the user confirms it, it writes real data to the Firestore database and displays the live result in a table.

**Claude AI Handover Context:**
- The core logic for processing AI responses and rendering dynamic UI is in `src/pages/NewFeature.tsx` within the `handleStart` function and the message rendering loop.
- To add new capabilities (e.g., generating a housekeeping schedule), you must:
  1. Update the `systemInstruction` in the Gemini API call to understand the new request.
  2. Add a new `uiComponent` type to the JSON schema.
  3. Add the corresponding rendering logic in the message loop in `NewFeature.tsx`.
- The `ReservationTable` component (`src/components/ReservationTable.tsx`) has been updated to prioritize displaying specific live data when passed via props, falling back to all bookings or mock data as needed.

---
*Note: Always use the `cn()` utility function from `src/lib/utils.ts` when conditionally joining Tailwind classes.*
