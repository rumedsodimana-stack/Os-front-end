import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analytics";
import { cn } from "../lib/utils";
import {
  DollarSign, TrendingUp, Users, Percent, BarChart2,
  Building2, Globe, Target, ArrowUp, ArrowDown, Sparkles
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";

interface ExecutiveProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

// Mock data
const mockKPI = {
  occupancyRate: 72, revPAR: 145.5, adr: 201.8, totalRevenue: 48200,
  arrivals: 45, departures: 32, inHouse: 128, availableRooms: 180, goppar: 89.4
};
const mockTrend = [
  { month: "Oct", revenue: 320000, revPAR: 130, occupancy: 68 },
  { month: "Nov", revenue: 290000, revPAR: 118, occupancy: 62 },
  { month: "Dec", revenue: 410000, revPAR: 167, occupancy: 88 },
  { month: "Jan", revenue: 380000, revPAR: 155, occupancy: 82 },
  { month: "Feb", revenue: 350000, revPAR: 143, occupancy: 76 },
  { month: "Mar", revenue: 440000, revPAR: 179, occupancy: 90 },
];
const mockRevMix = [
  { name: "Rooms", value: 68, color: "#8b5cf6" },
  { name: "F&B", value: 18, color: "#ec4899" },
  { name: "Spa", value: 8, color: "#10b981" },
  { name: "Other", value: 6, color: "#f59e0b" },
];

function SkeletonCard() {
  return <div className="bg-card border border-border rounded-xl p-6 animate-pulse h-28" />;
}

function ExecutiveOverview({ aiEnabled }: { aiEnabled: boolean }) {
  const { data: kpi, isLoading } = useQuery({ queryKey: ['dailyKPI'], queryFn: analyticsService.getDailyKPI, retry: false });
  const kpiData = kpi ?? mockKPI;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Executive Dashboard</h1>
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {aiEnabled && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="bg-primary/20 p-2 rounded-full mt-0.5 shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Agentic AI Executive Briefing</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Today's occupancy of <strong>{kpiData.occupancyRate}%</strong> is tracking <strong>+6%</strong> vs last week.
              RevPAR of <strong>${kpiData.revPAR.toFixed(0)}</strong> is outpacing comp set by 12%.
              Recommend considering rate increase for the weekend — demand signals are strong.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
          [
            { label: "Total Revenue", value: `$${kpiData.totalRevenue.toLocaleString()}`, trend: "+8%", up: true, icon: DollarSign, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
            { label: "RevPAR", value: `$${kpiData.revPAR.toFixed(0)}`, trend: "+12%", up: true, icon: BarChart2, bg: "bg-gradient-to-r from-pink-400 to-pink-500" },
            { label: "Occupancy", value: `${kpiData.occupancyRate}%`, trend: "+6%", up: true, icon: Percent, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
            { label: "GOPPAR", value: kpiData.goppar ? `$${kpiData.goppar.toFixed(0)}` : "—", trend: "+3%", up: true, icon: TrendingUp, bg: "bg-gradient-to-r from-yellow-400 to-yellow-500" },
          ].map((stat, i) => (
            <div key={i} className={cn("rounded-2xl p-6 shadow-sm text-white relative overflow-hidden", stat.bg)}>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg"><stat.icon className="w-5 h-5 text-white" /></div>
                  <p className="text-sm font-medium text-white/90">{stat.label}</p>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.trend} vs last period
                </p>
              </div>
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">6-Month Performance Trend</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="font-semibold mb-2">Revenue Mix</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[160px] w-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockRevMix} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                    {mockRevMix.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-4 space-y-2">
              {mockRevMix.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HighLevelKPIs() {
  const { data: kpi, isLoading } = useQuery({ queryKey: ['dailyKPI'], queryFn: analyticsService.getDailyKPI, retry: false });
  const kpiData = kpi ?? mockKPI;

  const kpis = [
    { label: "Occupancy Rate", value: `${kpiData.occupancyRate}%`, target: "75%", met: kpiData.occupancyRate >= 75, category: "Rooms" },
    { label: "ADR", value: `$${kpiData.adr.toFixed(0)}`, target: "$195", met: kpiData.adr >= 195, category: "Rooms" },
    { label: "RevPAR", value: `$${kpiData.revPAR.toFixed(0)}`, target: "$140", met: kpiData.revPAR >= 140, category: "Rooms" },
    { label: "GOPPAR", value: kpiData.goppar ? `$${kpiData.goppar.toFixed(0)}` : "—", target: "$85", met: (kpiData.goppar ?? 0) >= 85, category: "Profitability" },
    { label: "Total Revenue", value: `$${kpiData.totalRevenue.toLocaleString()}`, target: "$45,000", met: kpiData.totalRevenue >= 45000, category: "Revenue" },
    { label: "In-House Guests", value: kpiData.inHouse, target: "130", met: kpiData.inHouse >= 130, category: "Occupancy" },
    { label: "Arrivals Today", value: kpiData.arrivals, target: "40", met: kpiData.arrivals >= 40, category: "Operations" },
    { label: "Departures Today", value: kpiData.departures, target: "30", met: kpiData.departures >= 30, category: "Operations" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">High-Level KPIs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />) :
          kpis.map((kpi, i) => (
            <div key={i} className={cn("bg-card border rounded-2xl p-5 shadow-sm",
              kpi.met ? "border-emerald-200 dark:border-emerald-800" : "border-amber-200 dark:border-amber-800"
            )}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.category}</span>
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
                  kpi.met ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                )}>
                  {kpi.met ? "On Target" : "Below Target"}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-bold mt-1">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">Target: {kpi.target}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function Financials() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Financials</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Monthly Revenue", value: "$440,000", change: "+12.8%", up: true },
          { label: "Operating Costs", value: "$285,000", change: "+3.2%", up: false },
          { label: "Net Operating Income", value: "$155,000", change: "+24.6%", up: true },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
            <p className="text-3xl font-bold">{item.value}</p>
            <p className={cn("text-sm mt-1 flex items-center gap-1 font-medium", item.up ? "text-emerald-600" : "text-red-500")}>
              {item.up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {item.change} vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Monthly P&L Summary</h2>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
              <Legend />
              <Bar dataKey="revenue" name="Total Revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border"><h2 className="font-semibold">Revenue by Segment — March 2026</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Segment</th>
                <th className="px-5 py-3 font-medium text-right">Revenue</th>
                <th className="px-5 py-3 font-medium text-right">% of Total</th>
                <th className="px-5 py-3 font-medium text-right">vs LY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { segment: "Rooms", revenue: 299200, pct: 68, vs: "+14%" },
                { segment: "Food & Beverage", revenue: 79200, pct: 18, vs: "+8%" },
                { segment: "Spa & Wellness", revenue: 35200, pct: 8, vs: "+22%" },
                { segment: "Other / Ancillary", revenue: 26400, pct: 6, vs: "+5%" },
              ].map(row => (
                <tr key={row.segment} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4 font-medium">{row.segment}</td>
                  <td className="px-5 py-4 text-right font-semibold">${row.revenue.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-muted-foreground">{row.pct}%</td>
                  <td className="px-5 py-4 text-right text-emerald-600 font-medium">{row.vs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StrategicPlanning() {
  const goals = [
    { goal: "Achieve 80% Occupancy Q2 2026", progress: 72, target: 80, status: "On Track" },
    { goal: "Increase RevPAR by 15% YOY", progress: 12, target: 15, status: "On Track" },
    { goal: "Launch Loyalty Program", progress: 65, target: 100, status: "In Progress" },
    { goal: "Expand to 3rd Property", progress: 25, target: 100, status: "Planning" },
    { goal: "Achieve 4.5 Guest Satisfaction Score", progress: 4.3, target: 4.5, status: "On Track" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Strategic Planning</h1>

      {/* Strategic Goals */}
      <div className="bg-card border border-border rounded-2xl shadow-sm">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">2026 Strategic Goals</h2>
        </div>
        <div className="p-5 space-y-5">
          {goals.map((goal, i) => {
            const pct = Math.min((goal.progress / goal.target) * 100, 100);
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{goal.goal}</p>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
                    goal.status === "On Track" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    goal.status === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    "bg-secondary text-muted-foreground"
                  )}>
                    {goal.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-secondary rounded-full h-2.5 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700",
                        pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-violet-500" : "bg-amber-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground w-10 text-right">{Math.round(pct)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Initiatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Digital Transformation", desc: "PMS upgrade, mobile check-in, contactless payments rollout", status: "Active", icon: Globe, color: "text-violet-600 bg-violet-100 dark:bg-violet-900/30" },
          { title: "Sustainability Program", desc: "Carbon neutral by 2028 — solar panels, EV chargers, waste reduction", status: "Planning", icon: Building2, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
          { title: "Revenue Optimization", desc: "Dynamic pricing AI, direct booking incentives, loyalty program", status: "Active", icon: TrendingUp, color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30" },
          { title: "Workforce Excellence", desc: "Training curriculum overhaul, competitive compensation review", status: "In Progress", icon: Users, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-xl shrink-0", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                    item.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    item.status === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    "bg-secondary text-muted-foreground"
                  )}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Executive({ aiEnabled, activeSubmenu }: ExecutiveProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview": return <ExecutiveOverview aiEnabled={aiEnabled} />;
      case "High-level KPIs": return <HighLevelKPIs />;
      case "Financials": return <Financials />;
      case "Strategic Planning": return <StrategicPlanning />;
      default: return <ExecutiveOverview aiEnabled={aiEnabled} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSubmenu}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}
