import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";

/**
 * ThemeConfig — the complete tenant-editable surface of Orbit OS.
 * Every field here maps 1:1 to a CSS variable set on :root at runtime,
 * so a single JSON blob is a full "tenant theme pack".
 *
 * Factory defaults live in tokens.json / tokens.css — this config only
 * *overrides* them. Clearing the override reverts to factory.
 */
export interface ThemeConfig {
  /* Brand */
  primaryColor: string;

  /* Typography */
  radius: number;
  fontSans: string;
  fontHeading: string;
  fontMono: string;
  fontSizeBase: number;

  /* Surface colours (semantic) */
  colorBackground: string;
  colorForeground: string;
  colorCard: string;
  colorBorder: string;

  /* Status colours (edit the 500 shade; 100/700 stay factory unless overridden) */
  colorSuccess: string;
  colorWarning: string;
  colorDanger: string;
  colorInfo: string;

  /* KPI gradients (from → to pairs) */
  kpiArrivalsFrom: string;   kpiArrivalsTo: string;
  kpiInHouseFrom: string;    kpiInHouseTo: string;
  kpiDeparturesFrom: string; kpiDeparturesTo: string;
  kpiRevenueFrom: string;    kpiRevenueTo: string;
  kpiOccupancyFrom: string;  kpiOccupancyTo: string;
  kpiAdrRevparFrom: string;  kpiAdrRevparTo: string;

  /* Motion */
  motionDurationFast: number;  // ms
  motionDurationBase: number;  // ms
  motionDurationSlow: number;  // ms

  /* AI Chat Window (Agentic AI right panel) */
  aiPanelBg: string;
  aiPanelHeaderBg: string;
  aiUserBubbleBg: string;
  aiAssistantBubbleBg: string;

  /* Sidebar */
  sidebarVariant: "classic-rail" | "top-nav";
  sidebarStyle: "glass" | "solid" | "gradient";
  sidebarMainBg: string;
  sidebarSubBg: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  sidebarHoverBg: string;
  sidebarIconColor: string;
}

export const defaultThemeConfig: ThemeConfig = {
  primaryColor: "#8b5cf6",

  radius: 16,
  fontSans: "Inter",
  fontHeading: "Outfit",
  fontMono: "JetBrains Mono",
  fontSizeBase: 16,

  colorBackground: "#f3f4f6",
  colorForeground: "#1f2937",
  colorCard: "#ffffff",
  colorBorder: "#e5e7eb",

  colorSuccess: "#10b981",
  colorWarning: "#f59e0b",
  colorDanger:  "#ef4444",
  colorInfo:    "#3b82f6",

  kpiArrivalsFrom: "#ec4899",   kpiArrivalsTo: "#e11d48",
  kpiInHouseFrom: "#8b5cf6",    kpiInHouseTo: "#9333ea",
  kpiDeparturesFrom: "#10b981", kpiDeparturesTo: "#16a34a",
  kpiRevenueFrom: "#f59e0b",    kpiRevenueTo: "#ca8a04",
  kpiOccupancyFrom: "#3b82f6",  kpiOccupancyTo: "#0891b2",
  kpiAdrRevparFrom: "#6366f1",  kpiAdrRevparTo: "#7c3aed",

  motionDurationFast: 120,
  motionDurationBase: 200,
  motionDurationSlow: 320,

  aiPanelBg: "#ffffff",
  aiPanelHeaderBg: "rgba(255, 255, 255, 0.6)",
  aiUserBubbleBg: "#8b5cf6",
  aiAssistantBubbleBg: "#f1f5f9",

  sidebarVariant: "classic-rail",
  sidebarStyle: "glass",
  sidebarMainBg: "#5b21b6",
  sidebarSubBg: "#7c3aed",
  sidebarActiveBg: "#f3f4f6",
  sidebarActiveText: "#7c3aed",
  sidebarHoverBg: "rgba(255, 255, 255, 0.1)",
  sidebarIconColor: "#c4b5fd",
};

/**
 * Map of ThemeConfig field → CSS custom property.
 * Adding a new editable token = add an entry here (and to ThemeConfig / defaults).
 * The runtime apply loop is fully data-driven from this map.
 */
const CSS_VAR_MAP: Record<keyof ThemeConfig, string | null> = {
  primaryColor: "--primary",

  radius: "--radius",          // numeric → px suffix
  fontSans: "--font-sans",     // special: wrapped in font stack
  fontHeading: "--font-heading",
  fontMono: "--font-mono",
  fontSizeBase: "--font-size-base", // numeric → px suffix, also sets root.fontSize

  colorBackground: "--background",
  colorForeground: "--foreground",
  colorCard: "--card",
  colorBorder: "--border",

  colorSuccess: "--color-success-500",
  colorWarning: "--color-warning-500",
  colorDanger:  "--color-danger-500",
  colorInfo:    "--color-info-500",

  kpiArrivalsFrom: "--kpi-arrivals-from",
  kpiArrivalsTo: "--kpi-arrivals-to",
  kpiInHouseFrom: "--kpi-in-house-from",
  kpiInHouseTo: "--kpi-in-house-to",
  kpiDeparturesFrom: "--kpi-departures-from",
  kpiDeparturesTo: "--kpi-departures-to",
  kpiRevenueFrom: "--kpi-revenue-from",
  kpiRevenueTo: "--kpi-revenue-to",
  kpiOccupancyFrom: "--kpi-occupancy-from",
  kpiOccupancyTo: "--kpi-occupancy-to",
  kpiAdrRevparFrom: "--kpi-adr-revpar-from",
  kpiAdrRevparTo: "--kpi-adr-revpar-to",

  motionDurationFast: "--motion-duration-fast",  // numeric → ms suffix
  motionDurationBase: "--motion-duration-base",
  motionDurationSlow: "--motion-duration-slow",

  aiPanelBg: "--ai-panel-bg",
  aiPanelHeaderBg: "--ai-panel-header-bg",
  aiUserBubbleBg: "--ai-user-bubble-bg",
  aiAssistantBubbleBg: "--ai-assistant-bubble-bg",

  sidebarVariant: null, // consumed by Layout.tsx, not a CSS var
  sidebarStyle: null, // consumed by Layout.tsx, not a CSS var
  sidebarMainBg: "--sidebar-main-bg",
  sidebarSubBg: "--sidebar-sub-bg",
  sidebarActiveBg: "--sidebar-active-bg",
  sidebarActiveText: "--sidebar-active-text",
  sidebarHoverBg: "--sidebar-hover-bg",
  sidebarIconColor: "--sidebar-icon-color",
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  configStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  config: ThemeConfig;
  setConfig: (config: Partial<ThemeConfig>) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (json: string) => { ok: boolean; error?: string };
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  config: defaultThemeConfig,
  setConfig: () => null,
  resetConfig: () => null,
  exportConfig: () => "",
  importConfig: () => ({ ok: false, error: "not initialized" }),
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "omnistay-theme",
  configStorageKey = "omnistay-config",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [config, setConfigState] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem(configStorageKey);
    if (saved) {
      try {
        return { ...defaultThemeConfig, ...JSON.parse(saved) };
      } catch (e) {
        return defaultThemeConfig;
      }
    }
    return defaultThemeConfig;
  });

  // Theme mode (light/dark/system)
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Data-driven CSS-var application — one loop over CSS_VAR_MAP
  useEffect(() => {
    const root = window.document.documentElement;

    (Object.keys(CSS_VAR_MAP) as (keyof ThemeConfig)[]).forEach((key) => {
      const cssVar = CSS_VAR_MAP[key];
      if (!cssVar) return;
      const raw = config[key];

      // Fonts need a fallback stack
      if (key === "fontSans") {
        root.style.setProperty(cssVar, `"${raw}", ui-sans-serif, system-ui, sans-serif`);
      } else if (key === "fontHeading") {
        root.style.setProperty(cssVar, `"${raw}", "${config.fontSans}", sans-serif`);
      } else if (key === "fontMono") {
        root.style.setProperty(cssVar, `"${raw}", ui-monospace, SFMono-Regular, monospace`);
      }
      // Numeric → px
      else if (key === "radius" || key === "fontSizeBase") {
        root.style.setProperty(cssVar, `${raw}px`);
      }
      // Numeric → ms
      else if (key === "motionDurationFast" || key === "motionDurationBase" || key === "motionDurationSlow") {
        root.style.setProperty(cssVar, `${raw}ms`);
      }
      // Colour / string passthrough
      else {
        root.style.setProperty(cssVar, String(raw));
      }
    });

    // Extra: primary → ring
    root.style.setProperty("--ring", config.primaryColor);

    // Extra: root.fontSize for rem scaling
    root.style.fontSize = `${config.fontSizeBase}px`;

    // Dynamic Google Fonts link
    const fontFamilies = [config.fontSans, config.fontHeading, config.fontMono].filter(Boolean);
    const linkId = "dynamic-fonts";
    let link = document.getElementById(linkId) as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    const fontQuery = fontFamilies
      .map((f) => `family=${f.replace(/\s+/g, "+")}:wght@400;500;600;700`)
      .join("&");
    link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
  }, [config]);

  const value: ThemeProviderState = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    config,
    setConfig: (newConfig: Partial<ThemeConfig>) => {
      const updated = { ...config, ...newConfig };
      localStorage.setItem(configStorageKey, JSON.stringify(updated));
      setConfigState(updated);
    },
    resetConfig: () => {
      localStorage.removeItem(configStorageKey);
      setConfigState(defaultThemeConfig);
    },
    exportConfig: () => JSON.stringify(config, null, 2),
    importConfig: (json: string) => {
      try {
        const parsed = JSON.parse(json);
        if (typeof parsed !== "object" || parsed === null) {
          return { ok: false, error: "Not a valid JSON object" };
        }
        // Shallow-merge with defaults so missing keys fall back
        const merged = { ...defaultThemeConfig, ...parsed };
        localStorage.setItem(configStorageKey, JSON.stringify(merged));
        setConfigState(merged);
        return { ok: true };
      } catch (e: any) {
        return { ok: false, error: e?.message ?? "Parse error" };
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
