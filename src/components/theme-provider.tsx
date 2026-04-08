import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";

export interface ThemeConfig {
  primaryColor: string;
  radius: number;
  fontSans: string;
  fontHeading: string;
  fontMono: string;
  fontSizeBase: number;
  sidebarStyle: "glass" | "solid" | "gradient";
  sidebarMainBg: string;
  sidebarSubBg: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  sidebarHoverBg: string;
  sidebarIconColor: string;
}

const defaultThemeConfig: ThemeConfig = {
  primaryColor: "#8b5cf6",
  radius: 16,
  fontSans: "Inter",
  fontHeading: "Outfit",
  fontMono: "JetBrains Mono",
  fontSizeBase: 16,
  sidebarStyle: "glass",
  sidebarMainBg: "#5b21b6",
  sidebarSubBg: "#7c3aed",
  sidebarActiveBg: "#f3f4f6",
  sidebarActiveText: "#7c3aed",
  sidebarHoverBg: "rgba(255, 255, 255, 0.1)",
  sidebarIconColor: "#c4b5fd",
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
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  config: defaultThemeConfig,
  setConfig: () => null,
  resetConfig: () => null,
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

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    // Apply colors
    root.style.setProperty("--primary", config.primaryColor);
    root.style.setProperty("--ring", config.primaryColor);
    
    // Apply radius
    root.style.setProperty("--radius", `${config.radius}px`);

    // Apply fonts
    root.style.setProperty("--font-sans", `"${config.fontSans}", ui-sans-serif, system-ui, sans-serif`);
    root.style.setProperty("--font-heading", `"${config.fontHeading}", "${config.fontSans}", sans-serif`);
    root.style.setProperty("--font-mono", `"${config.fontMono}", ui-monospace, SFMono-Regular, monospace`);
    
    // Apply font size
    root.style.setProperty("--font-size-base", `${config.fontSizeBase}px`);
    root.style.fontSize = `${config.fontSizeBase}px`;

    // Apply Sidebar Colors
    root.style.setProperty("--sidebar-main-bg", config.sidebarMainBg);
    root.style.setProperty("--sidebar-sub-bg", config.sidebarSubBg);
    root.style.setProperty("--sidebar-active-bg", config.sidebarActiveBg);
    root.style.setProperty("--sidebar-active-text", config.sidebarActiveText);
    root.style.setProperty("--sidebar-hover-bg", config.sidebarHoverBg);
    root.style.setProperty("--sidebar-icon-color", config.sidebarIconColor);

    // Load fonts dynamically if needed
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
      .map(f => `family=${f.replace(/\s+/g, "+")}:wght@400;500;600;700`)
      .join("&");
    
    link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;

  }, [config]);

  const value = {
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
    }
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
