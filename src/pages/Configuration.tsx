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
  Layers
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

export function Configuration({ activeSubmenu }: { activeSubmenu: string }) {
  const { theme, setTheme, config, setConfig, resetConfig } = useTheme();

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

            {/* Sidebar Styling */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <SidebarIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Sidebar Styling</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-card border border-border rounded-2xl">
                {[
                  { id: "sidebarMainBg", label: "Main Strip BG" },
                  { id: "sidebarSubBg", label: "Submenu Area BG" },
                  { id: "sidebarActiveBg", label: "Active Link BG" },
                  { id: "sidebarActiveText", label: "Active Link Text" },
                  { id: "sidebarHoverBg", label: "Hover Background" },
                  { id: "sidebarIconColor", label: "Icon Color" },
                ].map((item) => (
                  <div key={item.id} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{item.label}</label>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg border border-border shrink-0 relative overflow-hidden"
                        style={{ backgroundColor: (config as any)[item.id] }}
                      >
                        <input 
                          type="color" 
                          value={(config as any)[item.id]}
                          onChange={(e) => setConfig({ [item.id]: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                        />
                      </div>
                      <input 
                        type="text" 
                        value={(config as any)[item.id]}
                        onChange={(e) => setConfig({ [item.id]: e.target.value })}
                        className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sidebar Style */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <SidebarIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Sidebar Style</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "classic", label: "Classic", desc: "Solid background with borders" },
                  { id: "glass", label: "Glassmorphism", desc: "Translucent with blur effect" },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setConfig({ sidebarStyle: style.id as any })}
                    className={cn(
                      "flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all",
                      config.sidebarStyle === style.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className={cn("font-semibold", config.sidebarStyle === style.id ? "text-primary" : "text-foreground")}>
                      {style.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{style.desc}</span>
                  </button>
                ))}
              </div>
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
