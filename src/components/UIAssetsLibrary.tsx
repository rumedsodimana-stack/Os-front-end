import React from "react";
import { KPICard } from "./ui/KPICard";
import { RoomCard, ROOM_GRID } from "./ui/RoomCard";
import { Users, TrendingUp, AlertCircle, CheckCircle2, Info, Search, Filter, Plus, FileText, BellRing, Wine } from "lucide-react";
import { cn } from "../lib/utils";

export function UIAssetsLibrary() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">
      {/* Header & Handover Note */}
      <section className="space-y-4">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-2">
            <Info className="w-6 h-6" />
            AI Agent Handover & Guidelines
          </h2>
          <p className="text-sm text-foreground mb-4">
            <strong>ATTENTION FUTURE AI AGENTS:</strong> This system uses a strict design language. 
            Do NOT invent new card styles, button styles, or layouts unless absolutely necessary. 
            Always refer to this UI Assets Library for the source of truth on how to build new pages and components.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-background rounded-xl p-4 border border-border">
              <h3 className="font-semibold mb-2">Rules & Frameworks</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Styling:</strong> Tailwind CSS with CSS variables (e.g., <code className="text-xs bg-secondary px-1 rounded">bg-card</code>).</li>
                <li><strong>Icons:</strong> <code className="text-xs bg-secondary px-1 rounded">lucide-react</code> ONLY.</li>
                <li><strong>Animations:</strong> Framer Motion & Tailwind <code className="text-xs bg-secondary px-1 rounded">animate-in</code>.</li>
                <li><strong>Charts:</strong> <code className="text-xs bg-secondary px-1 rounded">recharts</code>.</li>
                <li><strong>Class Merging:</strong> Use the <code className="text-xs bg-secondary px-1 rounded">cn()</code> utility.</li>
              </ul>
            </div>
            <div className="bg-background rounded-xl p-4 border border-border">
              <h3 className="font-semibold mb-2">Pending / Handover</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Advanced DatePicker and Calendar components.</li>
                <li>Real backend integration for all mocked data.</li>
                <li>Form validation standardizations (e.g., Zod + React Hook Form).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Design Tokens — source of truth for colors, radii, shadows, gradients */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-2">Design Tokens</h2>
          <p className="text-sm text-muted-foreground">
            Single source of truth:{" "}
            <code className="text-xs bg-secondary px-1 rounded">src/styles/tokens.json</code> ·{" "}
            <code className="text-xs bg-secondary px-1 rounded">src/styles/tokens.css</code>.
            Use semantic utilities (<code className="text-xs bg-secondary px-1 rounded">bg-success-500</code>,{" "}
            <code className="text-xs bg-secondary px-1 rounded">bg-kpi-arrivals</code>) instead of raw palette classes.
          </p>
        </div>

        {/* Status colors */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Status Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "success", label: "Success" },
              { name: "warning", label: "Warning" },
              { name: "danger", label: "Danger" },
              { name: "info", label: "Info" },
            ].map((s) => (
              <div key={s.name} className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</div>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  {["100", "500", "700"].map((shade) => (
                    <div
                      key={shade}
                      className="flex-1 h-10 flex items-end justify-center pb-1 text-[10px] font-mono"
                      style={{
                        backgroundColor: `var(--color-${s.name}-${shade})`,
                        color: shade === "100" ? "#111" : "#fff",
                      }}
                      title={`--color-${s.name}-${shade}`}
                    >
                      {shade}
                    </div>
                  ))}
                </div>
                <code className="text-[10px] text-muted-foreground">bg-{s.name}-{"{100,500,700}"}</code>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Gradients */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">KPI Gradients</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { cls: "bg-kpi-arrivals", label: "Arrivals" },
              { cls: "bg-kpi-in-house", label: "In House" },
              { cls: "bg-kpi-departures", label: "Departures" },
              { cls: "bg-kpi-revenue", label: "Revenue" },
              { cls: "bg-kpi-occupancy", label: "Occupancy" },
              { cls: "bg-kpi-adr-revpar", label: "ADR / RevPAR" },
            ].map((k) => (
              <div key={k.cls} className="space-y-2">
                <div className={cn("h-16 rounded-xl shadow-sm", k.cls)} />
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-foreground">{k.label}</span>
                  <code className="text-muted-foreground">.{k.cls}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radius & Shadow scales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Radius Scale</h3>
            <div className="flex items-end gap-3">
              {[
                { key: "sm", v: "var(--radius-sm)" },
                { key: "md", v: "var(--radius-md)" },
                { key: "lg", v: "var(--radius-lg)" },
                { key: "xl", v: "var(--radius-xl)" },
                { key: "2xl", v: "var(--radius-2xl)" },
              ].map((r) => (
                <div key={r.key} className="flex-1 space-y-1 text-center">
                  <div className="h-14 bg-primary/15 border border-primary/30" style={{ borderRadius: r.v }} />
                  <div className="text-[10px] font-mono text-muted-foreground">{r.key}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Shadow Scale</h3>
            <div className="flex items-end gap-4">
              {[
                { key: "sm", v: "var(--shadow-sm)" },
                { key: "md", v: "var(--shadow-md)" },
                { key: "lg", v: "var(--shadow-lg)" },
                { key: "xl", v: "var(--shadow-xl)" },
              ].map((sh) => (
                <div key={sh.key} className="flex-1 space-y-1 text-center">
                  <div className="h-14 bg-card rounded-xl border border-border" style={{ boxShadow: sh.v }} />
                  <div className="text-[10px] font-mono text-muted-foreground">{sh.key}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Page Layout Guidelines */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-2">Page Layout Guidelines</h2>
          <p className="text-sm text-muted-foreground">Standard structure for creating new module pages.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="bg-secondary/30 rounded-xl p-4 border border-dashed border-border">
            <h3 className="font-semibold mb-2 text-sm">Global Page Margins</h3>
            <p className="text-xs text-muted-foreground mb-4">
              The main content area uses <code className="text-xs bg-secondary px-1 rounded">px-[1.5cm]</code> for both left and right margins to ensure consistent spacing.
            </p>

            <h3 className="font-semibold mb-2 text-sm">Standard Header Format</h3>
            <div className="bg-background rounded-lg p-4 mb-6 border border-border">
              <div className="mb-4">
                <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Main Menu Name</h2>
                <h1 className="text-2xl font-bold text-foreground">Submenu Name</h1>
                <p className="text-sm text-muted-foreground mt-1">Brief description of the page content and purpose.</p>
              </div>
              <code className="text-xs text-emerald-500 block break-all">
                &lt;div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10"&gt;
              </code>
            </div>

            <h3 className="font-semibold mb-2 text-sm">Content Structure</h3>
            <code className="text-xs text-primary block mb-2">&lt;div className="space-y-6 animate-in fade-in duration-500"&gt;</code>
            
            <div className="bg-background rounded-lg p-3 mb-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">KPI Cards Grid (4 columns on large screens)</p>
              <code className="text-xs text-emerald-500">&lt;div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"&gt;...&lt;/div&gt;</code>
            </div>

            <div className="bg-background rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Main Content Cards (Tables, Charts)</p>
              <code className="text-xs text-emerald-500">&lt;div className="bg-card p-6 rounded-2xl border border-border shadow-sm"&gt;...&lt;/div&gt;</code>
            </div>

            <code className="text-xs text-primary block mt-2">&lt;/div&gt;</code>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-2">KPI Cards</h2>
          <p className="text-sm text-muted-foreground">Use the <code className="bg-secondary px-1 rounded">KPICard</code> component for all top-level metrics. Do not use plain white cards.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            label="Total Users" 
            value="1,234" 
            icon={Users} 
            change="+12% from last month" 
            trend="up" 
            color="blue" 
          />
          <KPICard 
            label="Active Sessions" 
            value="892" 
            icon={TrendingUp} 
            change="+5% from last month" 
            trend="up" 
            color="emerald" 
          />
          <KPICard 
            label="Pending Alerts" 
            value="14" 
            icon={AlertCircle} 
            change="-2% from last month" 
            trend="down" 
            color="amber" 
          />
          <KPICard 
            label="System Health" 
            value="99.9%" 
            icon={CheckCircle2} 
            change="Stable" 
            trend="neutral" 
            color="purple" 
          />
        </div>
      </section>

      {/* Room Card — canonical tile used by Front Desk, Housekeeping, Mini Bar, Room Service */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-2">Room Card</h2>
          <p className="text-sm text-muted-foreground">
            The ONE canonical room tile — <code className="bg-secondary px-1 rounded">src/components/ui/RoomCard.tsx</code>.
            Used everywhere a room grid appears (Front Desk, Housekeeping, Mini Bar, Room Service).
            Shape & rhythm are fixed; departments customise CONTENT via slots: <code className="bg-secondary px-1 rounded">badge</code>,{" "}
            <code className="bg-secondary px-1 rounded">topRight</code>, <code className="bg-secondary px-1 rounded">subtitle</code>,{" "}
            <code className="bg-secondary px-1 rounded">footer</code>, <code className="bg-secondary px-1 rounded">tone</code>,{" "}
            <code className="bg-secondary px-1 rounded">onClick</code>. Grid: <code className="bg-secondary px-1 rounded">ROOM_GRID</code>.
            Clicking any card opens <code className="bg-secondary px-1 rounded">RoomProfileModal</code>.
          </p>
        </div>
        <div className={ROOM_GRID}>
          <RoomCard
            room={{ number: "101", type: "Deluxe King", status: "Stay Over", hkStatus: "Clean", guestName: "J. Smith" } as any}
            tone="info"
            topRight={<CheckCircle2 className="w-4 h-4 text-success-500" />}
            subtitle="J. Smith"
            badge={{ label: "Stay Over", tone: "info" }}
          />
          <RoomCard
            room={{ number: "102", type: "Deluxe King", status: "Arrival", hkStatus: "Dirty" } as any}
            tone="danger"
            topRight={<AlertCircle className="w-4 h-4 text-danger-500" />}
            subtitle={<span className="flex items-center gap-2">Arrival <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-[9px] rounded uppercase tracking-wider font-bold">VIP</span></span>}
            badge={{ label: "Dirty", tone: "danger" }}
          />
          <RoomCard
            room={{ number: "103", type: "Executive Suite", status: "Vacant", hkStatus: "Inspected" } as any}
            tone="success"
            topRight={<Wine className="w-4 h-4 text-muted-foreground" />}
            subtitle="Guest: —"
            badge={{ label: "Stocked", tone: "success" }}
          />
          <RoomCard
            room={{ number: "104", type: "Presidential", status: "Stay Over", hkStatus: "Clean", guestName: "A. Lee" } as any}
            tone="primary"
            topRight={<BellRing className="w-4 h-4 text-primary" />}
            subtitle="Guest: A. Lee"
            badge={{ label: "Active Order", tone: "warning" }}
          />
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Per-department usage (same card, different content):</p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li><strong className="text-foreground">Front Desk:</strong> tone = reservation status · topRight = HK OK/alert · subtitle = guest/notes · badge = room status</li>
            <li><strong className="text-foreground">Housekeeping:</strong> tone = HK condition · footer = assignee + condition buttons + updated time</li>
            <li><strong className="text-foreground">Mini Bar:</strong> tone = stock status · topRight = Wine · subtitle = guest · badge = Stocked/Consumed/Needs Check/Needs Restock</li>
            <li><strong className="text-foreground">Room Service:</strong> tone = primary when active · topRight = BellRing/Check · badge = Active Order/Idle</li>
          </ul>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-2">Buttons</h2>
          <p className="text-sm text-muted-foreground">Standard button styles used across the application.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-wrap gap-4 items-center">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Primary Button
          </button>
          
          <button className="px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Secondary Button
          </button>

          <button className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Outline Button
          </button>

          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Inputs & Controls */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-2">Inputs & Controls</h2>
          <p className="text-sm text-muted-foreground">Standard form elements and search bars.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div className="max-w-md space-y-2">
            <label className="text-sm font-medium">Search Input</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="max-w-md space-y-2">
            <label className="text-sm font-medium">Standard Select</label>
            <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        </div>
      </section>

      {/* Badges & Status */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-2">Badges & Status Indicators</h2>
          <p className="text-sm text-muted-foreground">Used in tables and cards to indicate state.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-wrap gap-4">
          <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
            Active / Success
          </span>
          <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
            Pending / Warning
          </span>
          <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
            Error / Critical
          </span>
          <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
            Info / Processing
          </span>
          <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground">
            Inactive / Draft
          </span>
        </div>
      </section>

      {/* Standard Table */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-2">Standard Table</h2>
          <p className="text-sm text-muted-foreground">Use this structure for all data grids.</p>
        </div>
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Column 1</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Column 2</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium">Data Row 1</td>
                  <td className="px-6 py-4 text-muted-foreground">Additional Info</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium">Data Row 2</td>
                  <td className="px-6 py-4 text-muted-foreground">Additional Info</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Global Modal */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold border-b border-border pb-2 mb-2">Global Modal / Dialog</h2>
          <p className="text-sm text-muted-foreground">Standardized modal structure for forms and confirmations.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden min-h-[400px] flex items-center justify-center bg-secondary/20">
          {/* Simulated Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center p-4">
            {/* Modal Container */}
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
                <h3 className="text-lg font-bold text-foreground">Standard Modal Title</h3>
                <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  This is the standard body area for the modal. Use this space for forms, confirmation messages, or detailed information.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Example Input</label>
                  <input 
                    type="text" 
                    placeholder="Enter value..." 
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3">
                <button className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
