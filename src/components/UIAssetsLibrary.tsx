import React from "react";
import { KPICard } from "./ui/KPICard";
import { Users, TrendingUp, AlertCircle, CheckCircle2, Info, Search, Filter, Plus, FileText } from "lucide-react";
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
