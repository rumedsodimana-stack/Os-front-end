import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import {
  Building2, MapPin, Users, TrendingUp, DollarSign, Percent,
  BarChart2, Settings, ChevronRight, Globe, Activity
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip
} from "recharts";

interface MultiPropertyProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

const mockProperties = [
  { id: "P1", name: "The Grand Omnistay", location: "New York, NY", rooms: 180, occupancy: 72, gm: "Jane Doe", status: "Active", revpar: 145, revenue: 48200, lat: 40.71, lng: -74.00 },
  { id: "P2", name: "Omnistay Midtown", location: "Chicago, IL", rooms: 120, occupancy: 65, gm: "Carlos Rivera", status: "Active", revpar: 118, revenue: 32100, lat: 41.85, lng: -87.65 },
  { id: "P3", name: "Omnistay Beach Resort", location: "Miami, FL", rooms: 240, occupancy: 88, gm: "Sarah Kim", status: "Active", revpar: 201, revenue: 76400, lat: 25.77, lng: -80.19 },
  { id: "P4", name: "Omnistay Mountain Lodge", location: "Denver, CO", rooms: 80, occupancy: 45, gm: "Tom Walsh", status: "Seasonal", revpar: 92, revenue: 18200, lat: 39.74, lng: -104.99 },
  { id: "P5", name: "Omnistay Downtown", location: "Austin, TX", rooms: 150, occupancy: 58, gm: "Lisa Chen", status: "Maintenance", revpar: 103, revenue: 27600, lat: 30.27, lng: -97.74 },
];

const crossPropertyData = [
  { property: "Grand NY", occupancy: 72, revenue: 48200, adr: 201, revpar: 145 },
  { property: "Midtown CHI", occupancy: 65, revenue: 32100, adr: 182, revpar: 118 },
  { property: "Beach MIA", occupancy: 88, revenue: 76400, adr: 228, revpar: 201 },
  { property: "Mountain DEN", occupancy: 45, revenue: 18200, adr: 204, revpar: 92 },
  { property: "Downtown AUS", occupancy: 58, revenue: 27600, adr: 178, revpar: 103 },
];

function PortfolioOverview() {
  const totalProps = mockProperties.length;
  const totalRooms = mockProperties.reduce((s, p) => s + p.rooms, 0);
  const avgOcc = Math.round(mockProperties.reduce((s, p) => s + p.occupancy, 0) / totalProps);
  const totalRevenue = mockProperties.reduce((s, p) => s + p.revenue, 0);
  const groupRevPAR = Math.round(mockProperties.reduce((s, p) => s + p.revpar, 0) / totalProps);

  const kpis = [
    { label: "Total Properties", value: totalProps, icon: Building2, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
    { label: "Combined Occupancy", value: `${avgOcc}%`, icon: Percent, bg: "bg-gradient-to-r from-pink-400 to-pink-500" },
    { label: "Group RevPAR", value: `$${groupRevPAR}`, icon: BarChart2, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, bg: "bg-gradient-to-r from-amber-400 to-amber-500" },
  ];

  const toMapPos = (lat: number, lng: number) => ({
    top: `${Math.round(((48 - lat) / (48 - 25)) * 100)}%`,
    left: `${Math.round(((lng - (-124)) / ((-67) - (-124))) * 100)}%`,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Multi-Property Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className={cn("rounded-2xl p-6 shadow-sm text-white relative overflow-hidden", kpi.bg)}>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white/20 rounded-lg"><kpi.icon className="w-5 h-5 text-white" /></div>
                <p className="text-sm font-medium text-white/90">{kpi.label}</p>
              </div>
              <h3 className="text-2xl font-bold">{kpi.value}</h3>
            </div>
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" /> Property Locations
        </h2>
        <div className="relative w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl overflow-hidden border border-border">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground/40 text-sm font-medium uppercase tracking-widest select-none">United States</p>
          </div>
          {mockProperties.map(p => {
            const pos = toMapPos(p.lat, p.lng);
            const statusColor = p.status === "Active" ? "bg-emerald-500" : p.status === "Maintenance" ? "bg-amber-500" : "bg-blue-400";
            return (
              <div key={p.id} className="absolute group" style={{ top: pos.top, left: pos.left, transform: "translate(-50%,-50%)" }}>
                <div className={cn("w-3.5 h-3.5 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform", statusColor)} />
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl whitespace-nowrap z-10">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-muted-foreground">{p.location}</p>
                  <p className="text-primary font-medium mt-0.5">{p.occupancy}% occ · ${p.revpar} RevPAR</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Active</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Maintenance</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> Seasonal</span>
        </div>
      </div>
    </div>
  );
}

function PropertiesList() {
  const [selected, setSelected] = useState<string | null>(null);

  const statusStyle = (s: string) => {
    if (s === "Active") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (s === "Maintenance") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Properties</h1>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Building2 className="w-4 h-4" /> Add Property
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockProperties.map(p => (
          <div
            key={p.id}
            onClick={() => setSelected(selected === p.id ? null : p.id)}
            className={cn("bg-card border rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all", selected === p.id ? "border-primary ring-2 ring-primary/20" : "border-border")}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm leading-tight">{p.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {p.location}
                </p>
              </div>
              <span className={cn("text-xs px-2 py-1 rounded-full font-medium", statusStyle(p.status))}>{p.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-secondary/50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-primary">{p.occupancy}%</p>
                <p className="text-xs text-muted-foreground">Occupancy</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-violet-600">${p.revpar}</p>
                <p className="text-xs text-muted-foreground">RevPAR</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {p.rooms} rooms</span>
              <span>GM: {p.gm}</span>
            </div>
            {selected === p.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Daily Revenue</span>
                  <span className="font-semibold text-emerald-600">${p.revenue.toLocaleString()}</span>
                </div>
                <button className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-primary font-medium hover:underline">
                  Open Dashboard <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type Metric = "occupancy" | "revenue" | "adr" | "revpar";

function CrossPropertyReports() {
  const [metric, setMetric] = useState<Metric>("occupancy");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const metricConfig: Record<Metric, { label: string; color: string; formatter: (v: number) => string }> = {
    occupancy: { label: "Occupancy %", color: "#8b5cf6", formatter: v => `${v}%` },
    revenue: { label: "Revenue ($)", color: "#ec4899", formatter: v => `$${v.toLocaleString()}` },
    adr: { label: "ADR ($)", color: "#10b981", formatter: v => `$${v}` },
    revpar: { label: "RevPAR ($)", color: "#f59e0b", formatter: v => `$${v}` },
  };

  const cfg = metricConfig[metric];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Cross-Property Reports</h1>
      <div className="flex flex-wrap items-center gap-3">
        <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50">
          {["Today", "Last 7 Days", "Last 30 Days", "Last Quarter", "YTD"].map(r => <option key={r}>{r}</option>)}
        </select>
        <div className="flex gap-2">
          {(Object.keys(metricConfig) as Metric[]).map(m => (
            <button key={m} onClick={() => setMetric(m)} className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-colors", metric === m ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground")}>
              {metricConfig[m].label}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-1">{cfg.label} — All Properties · {dateRange}</h2>
        <p className="text-xs text-muted-foreground mb-6">Comparing performance across the portfolio</p>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={crossPropertyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="property" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={cfg.formatter} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} formatter={(v: number) => [cfg.formatter(v), cfg.label]} />
              <Bar dataKey={metric} name={cfg.label} fill={cfg.color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border"><h2 className="font-semibold">Detailed Breakdown</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Property</th>
                <th className="px-5 py-3 font-medium text-right">Occupancy</th>
                <th className="px-5 py-3 font-medium text-right">RevPAR</th>
                <th className="px-5 py-3 font-medium text-right">Revenue</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockProperties.map(p => (
                <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.location}</p>
                  </td>
                  <td className="px-5 py-4 text-right font-medium">{p.occupancy}%</td>
                  <td className="px-5 py-4 text-right font-semibold text-violet-600">${p.revpar}</td>
                  <td className="px-5 py-4 text-right font-semibold text-emerald-600">${p.revenue.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium",
                      p.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      p.status === "Maintenance" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    )}>{p.status}</span>
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

function GroupSettings() {
  const [groupName, setGroupName] = useState("Omnistay Hotel Group");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState("8.5");
  const [checkInTime, setCheckInTime] = useState("15:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Group Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Group Identity</h2>
          <div><label className="text-sm font-medium text-muted-foreground block mb-1.5">Group Name</label>
            <input value={groupName} onChange={e => setGroupName(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" /></div>
          <div><label className="text-sm font-medium text-muted-foreground block mb-1.5">Default Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50">
              {["USD", "EUR", "GBP", "CAD", "AUD"].map(c => <option key={c}>{c}</option>)}
            </select></div>
          <div><label className="text-sm font-medium text-muted-foreground block mb-1.5">Default Tax Rate (%)</label>
            <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" /></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> Shared Policies</h2>
          <div><label className="text-sm font-medium text-muted-foreground block mb-1.5">Standard Check-In Time</label>
            <input type="time" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" /></div>
          <div><label className="text-sm font-medium text-muted-foreground block mb-1.5">Standard Check-Out Time</label>
            <input type="time" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" /></div>
          <div className="space-y-3">
            {[
              { label: "Shared Loyalty Program", enabled: true },
              { label: "Cross-Property Reservations", enabled: true },
              { label: "Centralized Procurement", enabled: false },
              { label: "Group-wide Rate Parity", enabled: true },
            ].map(policy => (
              <div key={policy.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{policy.label}</span>
                <div className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", policy.enabled ? "bg-primary" : "bg-input")}>
                  <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform", policy.enabled ? "translate-x-4" : "translate-x-1")} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={handleSave} className={cn("px-6 py-2.5 rounded-lg text-sm font-medium transition-colors", saved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
          {saved ? "Saved!" : "Save Group Settings"}
        </button>
      </div>
    </div>
  );
}

export function MultiProperty({ activeSubmenu }: MultiPropertyProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview": return <PortfolioOverview />;
      case "Properties": return <PropertiesList />;
      case "Cross-Property Reports": return <CrossPropertyReports />;
      case "Group Settings": return <GroupSettings />;
      default: return <PortfolioOverview />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={activeSubmenu} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="h-full">
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}
