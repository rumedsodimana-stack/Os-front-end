import React, { useState } from "react";
import { 
  Palette, 
  Type, 
  Layout as LayoutIcon, 
  Monitor, 
  Moon, 
  Sun, 
  Check, 
  RotateCcw,
  Square,
  Circle,
  Plus,
  Type as FontIcon,
  Sidebar as SidebarIcon,
  Smartphone,
  Maximize2,
  Settings,
  Users,
  Layers,
  Sparkles,
  Droplet,
  Gauge,
  Download,
  Upload,
  ChevronDown
} from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../components/theme-provider";
import { motion } from "motion/react";

const PRESET_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Slate", value: "#64748b" },
  { name: "Omnistay", value: "#0ea5e9" },
];

const FONTS = [
  { name: "Inter", value: "Inter" },
  { name: "Outfit", value: "Outfit" },
  { name: "Space Grotesk", value: "Space Grotesk" },
  { name: "Playfair Display", value: "Playfair Display" },
  { name: "JetBrains Mono", value: "JetBrains Mono" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
];

/**
 * Reusable: one colour-picker row (swatch + hex input), used across all new
 * Theme Studio sections. Keeps the existing Sidebar Styling visual pattern
 * (see lines ~192–213) as the canonical control.
 */
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg border border-border shrink-0 relative overflow-hidden"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer scale-150"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}

/** Collapsible wrapper — uses native <details> so no new dep. */
function StudioSection({
  icon: Icon,
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group bg-card border border-border rounded-2xl overflow-hidden">
      <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer list-none hover:bg-secondary/30 transition-colors">
        <Icon className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 py-5 border-t border-border space-y-5">{children}</div>
    </details>
  );
}

export function Configuration({ activeSubmenu }: { activeSubmenu: string }) {
  const { theme, setTheme, config, setConfig, resetConfig, exportConfig, importConfig } = useTheme();
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    const json = exportConfig();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orbit-theme-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importConfig(String(reader.result));
      if (!result.ok) setImportError(result.error ?? "Import failed");
      else setImportError(null);
    };
    reader.readAsText(file);
    e.target.value = ""; // allow re-upload of same file
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case "Appearance":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Theme Mode */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Theme Mode</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setTheme(mode.id as any)}
                    className={cn(
                      "flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all",
                      theme === mode.id 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    )}
                  >
                    <mode.icon className="w-5 h-5" />
                    <span className="font-medium">{mode.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Primary Color */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Primary Color</h2>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setConfig({ primaryColor: color.value })}
                    className={cn(
                      "group relative w-full aspect-square rounded-xl flex items-center justify-center transition-all",
                      config.primaryColor === color.value 
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                        : "hover:scale-105"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {config.primaryColor === color.value && (
                      <Check className="w-5 h-5 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
                <div className="relative w-full aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center group hover:border-primary transition-colors">
                  <input 
                    type="color" 
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ primaryColor: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </div>
              </div>
            </section>

            {/* Typography */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <FontIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Typography</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Sans Font (UI)</label>
                  <select 
                    value={config.fontSans}
                    onChange={(e) => setConfig({ fontSans: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {FONTS.map(font => <option key={font.value} value={font.value}>{font.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Heading Font</label>
                  <select 
                    value={config.fontHeading}
                    onChange={(e) => setConfig({ fontHeading: e.target.value })}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {FONTS.map(font => <option key={font.value} value={font.value}>{font.name}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Border Radius */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Border Radius</h2>
              </div>
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
                <span className="text-xs font-medium text-muted-foreground">Sharp</span>
                <input 
                  type="range" 
                  min="0" 
                  max="32" 
                  step="1" 
                  value={config.radius}
                  onChange={(e) => setConfig({ radius: parseInt(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span className="text-xs font-medium text-muted-foreground">Round</span>
                <div className="ml-4 px-3 py-1 bg-secondary rounded-lg text-sm font-mono">
                  {config.radius}px
                </div>
              </div>
            </section>


            {/* ══════════════════════════════════════════════════════════
                 THEME STUDIO — every design token, editable in one place
                 ══════════════════════════════════════════════════════════ */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Theme Studio</h2>
              </div>
              <p className="text-xs text-muted-foreground -mt-1">
                Every editable design token in one place. Source of truth:{" "}
                <code className="px-1 py-0.5 rounded bg-secondary text-[11px]">src/styles/tokens.json</code>.
                Changes apply live and persist to <code className="text-[11px]">localStorage</code>.
                Export as a <strong>theme pack</strong> to re-use across tenants.
              </p>

              {/* Surfaces */}
              <StudioSection icon={Droplet} title="Surfaces" subtitle="Page background, foreground text, card, border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorField label="Background" value={config.colorBackground} onChange={(v) => setConfig({ colorBackground: v })} />
                  <ColorField label="Foreground (text)" value={config.colorForeground} onChange={(v) => setConfig({ colorForeground: v })} />
                  <ColorField label="Card" value={config.colorCard} onChange={(v) => setConfig({ colorCard: v })} />
                  <ColorField label="Border" value={config.colorBorder} onChange={(v) => setConfig({ colorBorder: v })} />
                </div>
              </StudioSection>

              {/* Status */}
              <StudioSection icon={Palette} title="Status colours" subtitle="Success · Warning · Danger · Info (edits the 500 shade)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorField label="Success (emerald)" value={config.colorSuccess} onChange={(v) => setConfig({ colorSuccess: v })} />
                  <ColorField label="Warning (amber)" value={config.colorWarning} onChange={(v) => setConfig({ colorWarning: v })} />
                  <ColorField label="Danger (red)" value={config.colorDanger} onChange={(v) => setConfig({ colorDanger: v })} />
                  <ColorField label="Info (blue)" value={config.colorInfo} onChange={(v) => setConfig({ colorInfo: v })} />
                </div>
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[
                    { v: config.colorSuccess, label: "success" },
                    { v: config.colorWarning, label: "warning" },
                    { v: config.colorDanger,  label: "danger"  },
                    { v: config.colorInfo,    label: "info"    },
                  ].map((s) => (
                    <div key={s.label} className="space-y-1">
                      <div className="h-6 rounded-md border border-border" style={{ backgroundColor: s.v }} />
                      <div className="text-[10px] text-center font-mono text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </StudioSection>

              {/* KPI Gradients */}
              <StudioSection icon={Gauge} title="KPI gradients" subtitle="6 gradient pairs used on KPI hero tiles (.bg-kpi-*)">
                <div className="space-y-4">
                  {[
                    { label: "Arrivals",     from: "kpiArrivalsFrom",   to: "kpiArrivalsTo",   cls: "bg-kpi-arrivals" },
                    { label: "In House",     from: "kpiInHouseFrom",    to: "kpiInHouseTo",    cls: "bg-kpi-in-house" },
                    { label: "Departures",   from: "kpiDeparturesFrom", to: "kpiDeparturesTo", cls: "bg-kpi-departures" },
                    { label: "Revenue",      from: "kpiRevenueFrom",    to: "kpiRevenueTo",    cls: "bg-kpi-revenue" },
                    { label: "Occupancy",    from: "kpiOccupancyFrom",  to: "kpiOccupancyTo",  cls: "bg-kpi-occupancy" },
                    { label: "ADR / RevPAR", from: "kpiAdrRevparFrom",  to: "kpiAdrRevparTo",  cls: "bg-kpi-adr-revpar" },
                  ].map((g) => (
                    <div key={g.cls} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-center">
                      <div className={cn("h-14 rounded-xl shadow-sm flex items-center justify-center text-[11px] font-bold text-white uppercase tracking-wider", g.cls)}>
                        {g.label}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <ColorField label="From" value={(config as any)[g.from]} onChange={(v) => setConfig({ [g.from]: v } as any)} />
                        <ColorField label="To"   value={(config as any)[g.to]}   onChange={(v) => setConfig({ [g.to]:   v } as any)} />
                      </div>
                    </div>
                  ))}
                </div>
              </StudioSection>

              {/* Typography — mono + base size (sans/heading already above) */}
              <StudioSection icon={FontIcon} title="Typography (advanced)" subtitle="Monospace font & base size">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Monospace Font (code / data)</label>
                    <select
                      value={config.fontMono}
                      onChange={(e) => setConfig({ fontMono: e.target.value })}
                      className="w-full bg-card border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {FONTS.map((font) => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Base Font Size ({config.fontSizeBase}px)</label>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      step="1"
                      value={config.fontSizeBase}
                      onChange={(e) => setConfig({ fontSizeBase: parseInt(e.target.value) })}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </StudioSection>

              {/* Motion */}
              <StudioSection icon={Gauge} title="Motion" subtitle="Animation durations (ms)">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: "motionDurationFast", label: "Fast",  min: 50,  max: 300 },
                    { key: "motionDurationBase", label: "Base",  min: 100, max: 500 },
                    { key: "motionDurationSlow", label: "Slow",  min: 200, max: 800 },
                  ].map((m) => (
                    <div key={m.key} className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">{m.label} ({(config as any)[m.key]}ms)</label>
                      <input
                        type="range"
                        min={m.min}
                        max={m.max}
                        step="10"
                        value={(config as any)[m.key]}
                        onChange={(e) => setConfig({ [m.key]: parseInt(e.target.value) } as any)}
                        className="w-full accent-primary"
                      />
                    </div>
                  ))}
                </div>
              </StudioSection>

              {/* Sidebar */}
              <StudioSection icon={SidebarIcon} title="Sidebar" subtitle="Layout variant, colours, style, and hover states">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Layout variant</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "classic-rail", label: "Classic Rail", desc: "80px icon rail + 256px submenu drawer (default)" },
                      { id: "top-nav",      label: "Top Nav",      desc: "Horizontal top bar, no left sidebar — max content width" },
                    ].map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setConfig({ sidebarVariant: v.id as any })}
                        className={cn(
                          "flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all",
                          config.sidebarVariant === v.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className={cn("font-semibold", config.sidebarVariant === v.id ? "text-primary" : "text-foreground")}>
                          {v.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{v.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border">
                  {[
                    { id: "classic", label: "Classic", desc: "Solid background with borders" },
                    { id: "glass",   label: "Glassmorphism", desc: "Translucent with blur effect" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setConfig({ sidebarStyle: style.id as any })}
                      className={cn(
                        "flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all",
                        config.sidebarStyle === style.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className={cn("font-semibold", config.sidebarStyle === style.id ? "text-primary" : "text-foreground")}>
                        {style.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{style.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-border">
                  <ColorField label="Main Strip BG"     value={config.sidebarMainBg}     onChange={(v) => setConfig({ sidebarMainBg: v })} />
                  <ColorField label="Submenu Area BG"   value={config.sidebarSubBg}      onChange={(v) => setConfig({ sidebarSubBg: v })} />
                  <ColorField label="Active Link BG"    value={config.sidebarActiveBg}   onChange={(v) => setConfig({ sidebarActiveBg: v })} />
                  <ColorField label="Active Link Text"  value={config.sidebarActiveText} onChange={(v) => setConfig({ sidebarActiveText: v })} />
                  <ColorField label="Hover Background"  value={config.sidebarHoverBg}    onChange={(v) => setConfig({ sidebarHoverBg: v })} />
                  <ColorField label="Icon Color"        value={config.sidebarIconColor}  onChange={(v) => setConfig({ sidebarIconColor: v })} />
                </div>
              </StudioSection>

              {/* AI Chat Window */}
              <StudioSection icon={Sparkles} title="AI Chat Window" subtitle="The Agentic AI right-side panel">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorField label="Panel Background"      value={config.aiPanelBg}           onChange={(v) => setConfig({ aiPanelBg: v })} />
                  <ColorField label="Panel Header BG"       value={config.aiPanelHeaderBg}     onChange={(v) => setConfig({ aiPanelHeaderBg: v })} />
                  <ColorField label="User Bubble BG"        value={config.aiUserBubbleBg}      onChange={(v) => setConfig({ aiUserBubbleBg: v })} />
                  <ColorField label="Assistant Bubble BG"   value={config.aiAssistantBubbleBg} onChange={(v) => setConfig({ aiAssistantBubbleBg: v })} />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Tip: turn the AI panel on (toggle in the top header) to preview changes live.
                </p>
              </StudioSection>

              {/* Export / Import */}
              <StudioSection icon={Download} title="Theme pack — export / import" subtitle="Save the full config as JSON, or load a tenant theme pack">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Export theme.json
                  </button>
                  <label className="flex items-center gap-2 bg-card border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" /> Import theme.json
                    <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
                {importError && (
                  <p className="text-xs text-danger-500 mt-2">Import error: {importError}</p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  The theme pack contains every editable token (colours, gradients, radius, typography, motion, sidebar). Drop it into another Orbit OS tenant to rebrand without touching code.
                </p>
              </StudioSection>
            </section>

            {/* Reset */}
            <div className="pt-6 border-t border-border">
              <button 
                onClick={resetConfig}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Default Settings
              </button>
            </div>
          </div>
        );
      case "Overview":
        return <ConfigurationOverview />;
      case "User Roles":
        return <UserRoles />;
      case "System Parameters":
        return <SystemParameters />;
      case "Integrations":
        return <Integrations />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <Settings className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Configuration - {activeSubmenu}</h2>
            <p className="text-muted-foreground max-w-md">
              The {activeSubmenu} settings are currently under development.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Configuration</h2>
            <h1 className="text-2xl font-bold text-foreground">{activeSubmenu}</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage settings and configurations for {activeSubmenu}</p>
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}

function ConfigurationOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-2">Appearance</h3>
          <p className="text-sm text-muted-foreground">Customize the look and feel of the application, including themes and density.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">User Roles</h3>
          <p className="text-sm text-muted-foreground">Manage user permissions, roles, and access control lists.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
            <Settings className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">System Parameters</h3>
          <p className="text-sm text-muted-foreground">Configure core system settings, tax rates, and operational defaults.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
            <Layers className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">Integrations</h3>
          <p className="text-sm text-muted-foreground">Manage connections to third-party services, OTAs, and payment gateways.</p>
        </div>
      </div>
    </div>
  );
}

function UserRoles() {
  const roles = [
    { id: "R1", name: "Administrator", users: 3, description: "Full system access including configuration and user management." },
    { id: "R2", name: "Front Desk Manager", users: 5, description: "Access to all front desk operations, reporting, and overrides." },
    { id: "R3", name: "Front Desk Agent", users: 12, description: "Standard access to reservations, check-in/out, and guest profiles." },
    { id: "R4", name: "Housekeeping Manager", users: 2, description: "Manage room status, task assignments, and inventory." },
    { id: "R5", name: "Housekeeper", users: 24, description: "View assigned tasks and update room status." },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create Role
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Role Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Active Users</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {roles.map((role) => (
                <tr key={role.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">{role.name}</td>
                  <td className="p-4 text-muted-foreground text-sm">{role.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-secondary text-xs font-medium">
                      {role.users}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Settings className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SystemParameters() {
  const parameters = [
    { id: "P1", category: "General", name: "Hotel Name", value: "Grand Plaza Resort" },
    { id: "P2", category: "General", name: "Timezone", value: "America/Los_Angeles" },
    { id: "P3", category: "Finance", name: "Default Currency", value: "USD ($)" },
    { id: "P4", category: "Finance", name: "Standard Tax Rate", value: "8.5%" },
    { id: "P5", category: "Operations", name: "Check-in Time", value: "15:00" },
    { id: "P6", category: "Operations", name: "Check-out Time", value: "11:00" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Parameter Name</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {parameters.map((param) => (
                <tr key={param.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 text-muted-foreground text-sm">{param.category}</td>
                  <td className="p-4 font-medium">{param.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-secondary text-sm font-medium">
                      {param.value}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Settings className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Integrations() {
  const integrations = [
    { id: "I1", name: "Stripe", type: "Payment Gateway", status: "Connected", lastSync: "10 mins ago" },
    { id: "I2", name: "Expedia", type: "OTA", status: "Connected", lastSync: "1 hour ago" },
    { id: "I3", name: "Booking.com", type: "OTA", status: "Connected", lastSync: "5 mins ago" },
    { id: "I4", name: "Mailchimp", type: "Marketing", status: "Disconnected", lastSync: "-" },
    { id: "I5", name: "QuickBooks", type: "Accounting", status: "Connected", lastSync: "Yesterday" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Integration
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Integration Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Sync</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {integrations.map((integration) => (
                <tr key={integration.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">{integration.name}</td>
                  <td className="p-4 text-muted-foreground text-sm">{integration.type}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      integration.status === "Connected" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      {integration.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{integration.lastSync}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <Settings className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
