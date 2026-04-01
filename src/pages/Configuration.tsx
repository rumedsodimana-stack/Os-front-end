import React, { useState, useRef, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { Check, Sliders, Palette, Type, Layout, Building2, RotateCcw, Upload, X } from "lucide-react";
import { cn } from "../lib/utils";
import {
  useThemeStore,
  THEME_PRESETS,
  type ThemePreset,
  type FontFamily,
  type DensityMode,
} from "../store/themeStore";

// ─── Nav tabs ───────────────────────────────────────────────────────────────

type Tab = "Appearance" | "Colours" | "Typography" | "Layout" | "Brand Identity";

const TABS: { id: Tab; icon: React.ElementType; label: string }[] = [
  { id: "Appearance", icon: Sliders, label: "Appearance" },
  { id: "Colours", icon: Palette, label: "Colours" },
  { id: "Typography", icon: Type, label: "Typography" },
  { id: "Layout", icon: Layout, label: "Layout" },
  { id: "Brand Identity", icon: Building2, label: "Brand Identity" },
];

// ─── Tiny preset thumbnail ───────────────────────────────────────────────────

function PresetCard({
  preset,
  isActive,
  onSelect,
}: {
  preset: ThemePreset;
  isActive: boolean;
  onSelect: () => void;
}) {
  const isDark =
    preset.mode === "dark" ||
    (preset.mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const radius = `${preset.borderRadius * 0.5}rem`;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative rounded-xl overflow-hidden border-2 transition-all duration-200 text-left group hover:scale-[1.02]",
        isActive
          ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/30"
          : "border-border hover:border-primary/40"
      )}
    >
      {/* Mini UI mockup */}
      <div
        className="w-full h-28 flex"
        style={{ backgroundColor: preset.backgroundColor }}
      >
        {/* Sidebar strip */}
        <div
          className="w-8 h-full flex flex-col items-center py-2 gap-1.5"
          style={{ backgroundColor: preset.sidebarColor }}
        >
          <div className="w-4 h-4 rounded-sm bg-white/20" />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-4 h-3 rounded-sm",
                i === 0 ? "bg-white/40" : "bg-white/15"
              )}
            />
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 p-2 flex flex-col gap-1.5">
          {/* Header row */}
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="h-2 w-16 rounded-full"
              style={{ backgroundColor: isDark ? "#334155" : "#e5e7eb" }}
            />
            <div
              className="ml-auto h-2 w-6 rounded-full"
              style={{ backgroundColor: preset.primaryColor }}
            />
          </div>

          {/* Card */}
          <div
            className="rounded p-1.5 flex flex-col gap-1 flex-1"
            style={{
              backgroundColor: preset.cardColor,
              borderRadius: radius,
              border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
            }}
          >
            <div
              className="h-1.5 w-10 rounded-full"
              style={{ backgroundColor: preset.primaryColor, opacity: 0.8 }}
            />
            <div
              className="h-1 w-14 rounded-full"
              style={{
                backgroundColor: isDark ? "#475569" : "#d1d5db",
              }}
            />
            <div
              className="h-1 w-10 rounded-full"
              style={{
                backgroundColor: isDark ? "#475569" : "#d1d5db",
              }}
            />
            <div className="mt-auto flex gap-1">
              <div
                className="h-3 w-8 rounded"
                style={{
                  backgroundColor: preset.primaryColor,
                  borderRadius: `${preset.borderRadius * 0.25}rem`,
                }}
              />
              <div
                className="h-3 w-6 rounded"
                style={{
                  backgroundColor: preset.accentColor,
                  opacity: 0.4,
                  borderRadius: `${preset.borderRadius * 0.25}rem`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-card px-3 py-2 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground leading-tight">
              {preset.name}
            </p>
            <p className="text-[10px] text-muted-foreground">{preset.description}</p>
          </div>
          {isActive && (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Color picker row ────────────────────────────────────────────────────────

function ColorPickerField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  const handleHexInput = (v: string) => {
    setHex(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
  };

  const handlePickerChange = (c: string) => {
    setHex(c);
    onChange(c);
  };

  // sync hex when value changes externally
  React.useEffect(() => {
    setHex(value);
  }, [value]);

  return (
    <div className={cn("flex items-center gap-4", disabled && "opacity-40 pointer-events-none")}>
      <span className="text-sm font-medium text-foreground w-32 shrink-0">{label}</span>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-10 h-10 rounded-xl border-2 border-border shadow-sm transition-all hover:scale-105 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          style={{ backgroundColor: value }}
        />
        {open && (
          <div className="absolute top-12 left-0 z-50 bg-card rounded-2xl shadow-2xl border border-border p-4 flex flex-col gap-3">
            <HexColorPicker color={value} onChange={handlePickerChange} />
            <input
              type="text"
              value={hex}
              onChange={(e) => handleHexInput(e.target.value)}
              className="w-full text-center text-sm font-mono bg-background border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              maxLength={7}
            />
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground text-center transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
      <input
        type="text"
        value={hex}
        onChange={(e) => handleHexInput(e.target.value)}
        className="flex-1 text-sm font-mono bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        maxLength={7}
        disabled={disabled}
      />
    </div>
  );
}

// ─── Live Preview ─────────────────────────────────────────────────────────────

function LivePreview({ onReset }: { onReset: () => void }) {
  const theme = useThemeStore();
  const isDark = theme.mode === "dark";
  const radius = `${theme.borderRadius * 0.5}rem`;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Live Preview
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div
        className="p-3"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div className="flex gap-2 h-36">
          {/* Mini sidebar */}
          <div
            className="w-8 h-full rounded-xl flex flex-col items-center py-2 gap-1.5"
            style={{ backgroundColor: theme.sidebarColor }}
          >
            <div className="w-4 h-4 rounded-lg bg-white/20" />
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn("w-4 h-3 rounded", i === 0 ? "bg-white/40" : "bg-white/15")}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Card */}
            <div
              className="flex-1 p-2.5 flex flex-col gap-2"
              style={{
                backgroundColor: theme.cardColor,
                borderRadius: radius,
                border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
              }}
            >
              <div
                className="h-2 w-16 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div
                className="h-1.5 w-full rounded-full"
                style={{ backgroundColor: isDark ? "#334155" : "#e5e7eb" }}
              />
              <div
                className="h-1.5 w-3/4 rounded-full"
                style={{ backgroundColor: isDark ? "#334155" : "#e5e7eb" }}
              />
              <div className="mt-auto flex gap-1.5">
                <div
                  className="h-5 w-14 rounded flex items-center justify-center"
                  style={{
                    backgroundColor: theme.primaryColor,
                    borderRadius: `${theme.borderRadius * 0.3}rem`,
                  }}
                >
                  <span className="text-[9px] font-semibold text-white">Button</span>
                </div>
                <div
                  className="h-5 px-2 rounded flex items-center justify-center"
                  style={{
                    backgroundColor: theme.accentColor + "30",
                    borderRadius: `${theme.borderRadius * 0.3}rem`,
                  }}
                >
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: theme.accentColor }}
                  >
                    Badge
                  </span>
                </div>
              </div>
            </div>

            {/* Second smaller card */}
            <div
              className="h-8 px-2 flex items-center gap-2"
              style={{
                backgroundColor: theme.cardColor,
                borderRadius: `${theme.borderRadius * 0.4}rem`,
                border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div
                className="h-1.5 flex-1 rounded-full"
                style={{ backgroundColor: isDark ? "#334155" : "#e5e7eb" }}
              />
            </div>
          </div>
        </div>

        {/* Font sample */}
        <div
          className="mt-2 px-2 py-1.5 rounded-lg text-[10px] leading-relaxed"
          style={{
            fontFamily: "var(--font-family)",
            color: isDark ? "#94a3b8" : "#6b7280",
            backgroundColor: isDark ? "#1e293b" : "#f9fafb",
            borderRadius: `${theme.borderRadius * 0.3}rem`,
          }}
        >
          <span style={{ color: isDark ? "#f8fafc" : "#1f2937", fontWeight: 600 }}>
            {theme.propertyName}
          </span>
          {" — Welcome to your PMS."}
        </div>
      </div>
    </div>
  );
}

// ─── Appearance Tab ──────────────────────────────────────────────────────────

function AppearanceTab() {
  const { activePresetId, setPreset } = useThemeStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Themes</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Choose a theme or create your own
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {THEME_PRESETS.map((preset) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            isActive={activePresetId === preset.id}
            onSelect={() => setPreset(preset)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Colours Tab ─────────────────────────────────────────────────────────────

function ColoursTab() {
  const {
    activePresetId,
    primaryColor, setPrimaryColor,
    sidebarColor, setSidebarColor,
    accentColor, setAccentColor,
    backgroundColor, setBackgroundColor,
    cardColor, setCardColor,
  } = useThemeStore();

  const isCustom = activePresetId === "custom";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Colours</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Fine-tune every color in your interface
        </p>
      </div>

      {!isCustom && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Switch to the <strong>Custom</strong> theme in Appearance to unlock individual color editing.
          </p>
        </div>
      )}

      <div className="space-y-5">
        <ColorPickerField
          label="Primary Color"
          value={primaryColor}
          onChange={setPrimaryColor}
          disabled={!isCustom}
        />
        <ColorPickerField
          label="Sidebar Color"
          value={sidebarColor}
          onChange={setSidebarColor}
          disabled={!isCustom}
        />
        <ColorPickerField
          label="Accent Color"
          value={accentColor}
          onChange={setAccentColor}
          disabled={!isCustom}
        />
        <ColorPickerField
          label="Background"
          value={backgroundColor}
          onChange={setBackgroundColor}
          disabled={!isCustom}
        />
        <ColorPickerField
          label="Card Surface"
          value={cardColor}
          onChange={setCardColor}
          disabled={!isCustom}
        />
      </div>
    </div>
  );
}

// ─── Typography Tab ──────────────────────────────────────────────────────────

const FONTS: { id: FontFamily; label: string; family: string }[] = [
  { id: "system", label: "System UI", family: "system-ui, -apple-system, sans-serif" },
  { id: "inter", label: "Inter", family: '"Inter", sans-serif' },
  { id: "dm-sans", label: "DM Sans", family: '"DM Sans", sans-serif' },
  { id: "playfair", label: "Playfair Display", family: '"Playfair Display", Georgia, serif' },
  { id: "mono", label: "JetBrains Mono", family: '"JetBrains Mono", monospace' },
];

const FONT_SIZES: { id: "compact" | "default" | "large"; label: string; px: string }[] = [
  { id: "compact", label: "Compact", px: "13px" },
  { id: "default", label: "Default", px: "14px" },
  { id: "large", label: "Large", px: "16px" },
];

function TypographyTab() {
  const { fontFamily, setFontFamily, fontSize, setFontSize, propertyName } = useThemeStore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Typography</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Set the font style and size for the entire interface
        </p>
      </div>

      {/* Font family */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Font Family</label>
        <div className="grid grid-cols-1 gap-2">
          {FONTS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFontFamily(f.id)}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left",
                fontFamily === f.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/30 bg-card"
              )}
            >
              <span className="text-sm text-foreground" style={{ fontFamily: f.family }}>
                {f.label}
              </span>
              <span
                className="text-xs text-muted-foreground"
                style={{ fontFamily: f.family }}
              >
                Aa Bb Cc
              </span>
              {fontFamily === f.id && (
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center ml-3">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font size */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Font Size</label>
        <div className="flex gap-3">
          {FONT_SIZES.map((s) => (
            <button
              key={s.id}
              onClick={() => setFontSize(s.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border transition-all",
                fontSize === s.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/30 bg-card"
              )}
            >
              <span
                style={{ fontSize: s.px, fontFamily: "var(--font-family)" }}
                className="text-foreground font-medium leading-none"
              >
                Aa
              </span>
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
              <span className="text-[10px] text-muted-foreground/60">{s.px}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live text sample */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Sample
        </p>
        <p
          className="font-semibold text-foreground leading-snug"
          style={{ fontFamily: "var(--font-family)", fontSize: "var(--font-size-base)" }}
        >
          {propertyName || "The Grand Palace Hotel"}
        </p>
        <p
          className="text-muted-foreground"
          style={{ fontFamily: "var(--font-family)", fontSize: "var(--font-size-base)" }}
        >
          Welcome to your property management system.
        </p>
        <p
          className="text-muted-foreground/70"
          style={{
            fontFamily: "var(--font-family)",
            fontSize: `calc(var(--font-size-base) - 1px)`,
          }}
        >
          Room 204 · Suite · Checked In · John Doe
        </p>
      </div>
    </div>
  );
}

// ─── Layout Tab ───────────────────────────────────────────────────────────────

const DENSITY_OPTIONS: {
  id: DensityMode;
  label: string;
  desc: string;
  rows: number;
}[] = [
  { id: "compact", label: "Compact", desc: "py-1.5", rows: 5 },
  { id: "default", label: "Default", desc: "py-3", rows: 4 },
  { id: "spacious", label: "Spacious", desc: "py-5", rows: 3 },
];

function LayoutTab() {
  const { borderRadius, setBorderRadius, density, setDensity } = useThemeStore();

  const radiusLabel =
    borderRadius <= 0.25
      ? "Square"
      : borderRadius <= 0.5
      ? "Sharp"
      : borderRadius <= 1
      ? "Default"
      : "Rounded";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Layout</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Adjust spacing density and corner radius
        </p>
      </div>

      {/* Border Radius */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Border Radius</label>
          <span className="text-sm text-muted-foreground">
            {radiusLabel} — {borderRadius.toFixed(2)}rem
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={1.5}
          step={0.05}
          value={borderRadius}
          onChange={(e) => setBorderRadius(parseFloat(e.target.value))}
          className="w-full accent-primary h-2 cursor-pointer"
          style={{ accentColor: "var(--primary)" }}
        />

        {/* Preview chips */}
        <div className="flex gap-3 pt-1">
          {[
            { label: "Sharp", r: "0rem" },
            { label: "Default", r: "0.75rem" },
            { label: "Rounded", r: "1.5rem" },
          ].map((chip) => (
            <div
              key={chip.label}
              className="flex-1 bg-primary/10 border border-primary/30 flex flex-col items-center gap-1.5 p-3"
              style={{ borderRadius: chip.r }}
            >
              <div
                className="w-full h-2 bg-primary/50"
                style={{ borderRadius: chip.r }}
              />
              <span className="text-[10px] text-muted-foreground">{chip.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Density */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Density</label>
        <div className="grid grid-cols-3 gap-3">
          {DENSITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setDensity(opt.id)}
              className={cn(
                "flex flex-col gap-2 p-3 rounded-xl border transition-all text-left",
                density === opt.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/30 bg-card"
              )}
            >
              {/* Mini table mockup */}
              <div className="space-y-0.5 w-full">
                {[...Array(opt.rows)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-1 bg-muted/60 rounded-sm",
                      opt.id === "compact"
                        ? "py-0.5 px-1"
                        : opt.id === "default"
                        ? "py-1 px-1"
                        : "py-1.5 px-1"
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                    <div className="h-1 flex-1 bg-muted-foreground/20 rounded-full" />
                    <div className="h-1 w-4 bg-muted-foreground/20 rounded-full" />
                  </div>
                ))}
              </div>
              <span className="text-[11px] font-medium text-foreground">{opt.label}</span>
              {density === opt.id && (
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Brand Identity Tab ───────────────────────────────────────────────────────

function BrandIdentityTab() {
  const { propertyName, setPropertyName, logoUrl, setLogoUrl } = useThemeStore();
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => setLogoUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [setLogoUrl]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Brand Identity</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Personalise the system with your property's branding
        </p>
      </div>

      {/* Property Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground block">Property Name</label>
        <input
          type="text"
          value={propertyName}
          onChange={(e) => setPropertyName(e.target.value)}
          placeholder="e.g. The Grand Palace Hotel"
          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        <p className="text-[11px] text-muted-foreground">
          Displayed in the sidebar and throughout the app
        </p>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground block">Logo</label>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all",
            dragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/40 hover:bg-primary/5"
          )}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo preview"
              className="h-16 object-contain rounded-lg"
            />
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Drag & drop your logo
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PNG, JPG, SVG up to 2MB
                </p>
              </div>
            </>
          )}
        </div>

        {logoUrl && (
          <button
            onClick={() => setLogoUrl(null)}
            className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors"
          >
            <X className="w-3 h-3" />
            Remove logo
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Info note */}
      <div className="bg-muted/50 border border-border rounded-xl px-4 py-3 flex items-start gap-3">
        <Building2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          These settings apply to your property. All staff members will see this branding when they log in.
        </p>
      </div>
    </div>
  );
}

// ─── Main Configuration Page ──────────────────────────────────────────────────

export function Configuration() {
  const [activeTab, setActiveTab] = useState<Tab>("Appearance");
  const { resetToDefault } = useThemeStore();

  const renderContent = () => {
    switch (activeTab) {
      case "Appearance": return <AppearanceTab />;
      case "Colours": return <ColoursTab />;
      case "Typography": return <TypographyTab />;
      case "Layout": return <LayoutTab />;
      case "Brand Identity": return <BrandIdentityTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Configuration</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Personalise the look and feel of Singularity PMS
          </p>
        </div>
        <button
          onClick={resetToDefault}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all bg-card"
        >
          <RotateCcw className="w-4 h-4" />
          Reset defaults
        </button>
      </div>

      {/* Body — Left nav + Right content */}
      <div className="flex gap-6 min-h-[600px]">
        {/* Left vertical nav */}
        <div className="w-52 shrink-0">
          <div className="bg-card border border-border rounded-2xl p-2 sticky top-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm",
                  activeTab === tab.id
                    ? "bg-primary text-white font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 bg-card border border-border rounded-2xl p-6 pb-32">
          {renderContent()}
        </div>
      </div>

      {/* Live Preview */}
      <LivePreview onReset={resetToDefault} />
    </div>
  );
}
