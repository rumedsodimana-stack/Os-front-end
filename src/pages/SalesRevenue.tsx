import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rmsService, PricingRule, OTAChannel, RatePlan } from "../services/rms";
import { analyticsService } from "../services/analytics";
import { cn } from "../lib/utils";
import {
  TrendingUp, DollarSign, BarChart2, Percent, RefreshCw,
  ToggleLeft, ToggleRight, Link2, AlertCircle, CheckCircle2,
  Tag, FileText, Plus, Edit2
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";

interface SalesRevenueProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

// Mock fallback data
const mockKPI = { occupancyRate: 72, revPAR: 145.5, adr: 201.8, totalRevenue: 48200, arrivals: 45, departures: 32, inHouse: 128, availableRooms: 180 };
const mockRevenueData = [
  { date: "Mar 25", revenue: 38000, rooms: 28000, fb: 7000, other: 3000 },
  { date: "Mar 26", revenue: 42000, rooms: 31000, fb: 8000, other: 3000 },
  { date: "Mar 27", revenue: 35000, rooms: 25000, fb: 7000, other: 3000 },
  { date: "Mar 28", revenue: 48000, rooms: 36000, fb: 8000, other: 4000 },
  { date: "Mar 29", revenue: 52000, rooms: 39000, fb: 9000, other: 4000 },
  { date: "Mar 30", revenue: 44000, rooms: 33000, fb: 7500, other: 3500 },
  { date: "Mar 31", revenue: 48200, rooms: 36000, fb: 8200, other: 4000 },
];
const mockPricingRules: PricingRule[] = [
  { id: "1", name: "Weekend Surge", roomType: "All Rooms", baseRate: 200, adjustmentType: "PERCENT", adjustmentValue: 20, isActive: true },
  { id: "2", name: "Early Bird Discount", roomType: "Standard King", baseRate: 180, adjustmentType: "PERCENT", adjustmentValue: -15, isActive: true },
  { id: "3", name: "Last Minute Deal", roomType: "Suite", baseRate: 400, adjustmentType: "FIXED", adjustmentValue: -50, isActive: false },
  { id: "4", name: "Corporate Rate", roomType: "Standard Double", baseRate: 160, adjustmentType: "PERCENT", adjustmentValue: -10, isActive: true },
];
const mockOTAs: OTAChannel[] = [
  { id: "1", name: "Booking.com", isConnected: true, inventoryAllocation: 40, lastSync: "2 min ago" },
  { id: "2", name: "Expedia", isConnected: true, inventoryAllocation: 25, lastSync: "5 min ago" },
  { id: "3", name: "Airbnb", isConnected: false, inventoryAllocation: 0, lastSync: undefined },
  { id: "4", name: "Hotels.com", isConnected: true, inventoryAllocation: 20, lastSync: "8 min ago" },
  { id: "5", name: "Direct Website", isConnected: true, inventoryAllocation: 15, lastSync: "1 min ago" },
];
const mockRatePlans: RatePlan[] = [
  { id: "1", name: "Best Available Rate", code: "BAR", baseRate: 200, mealsIncluded: "None" },
  { id: "2", name: "Bed & Breakfast", code: "BB", baseRate: 230, mealsIncluded: "Breakfast" },
  { id: "3", name: "Half Board", code: "HB", baseRate: 280, mealsIncluded: "Breakfast + Dinner" },
  { id: "4", name: "Full Board", code: "FB", baseRate: 330, mealsIncluded: "All Meals" },
  { id: "5", name: "All Inclusive", code: "AI", baseRate: 420, mealsIncluded: "All Inclusive" },
];

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-secondary rounded w-1/2 mb-4" />
      <div className="h-8 bg-secondary rounded w-1/3 mb-2" />
      <div className="h-3 bg-secondary rounded w-2/3" />
    </div>
  );
}

function RevenueOverview() {
  const { data: kpi, isLoading: kpiLoading } = useQuery({
    queryKey: ['dailyKPI'],
    queryFn: analyticsService.getDailyKPI,
    retry: false,
  });
  const { data: revenueData, isLoading: revLoading } = useQuery({
    queryKey: ['revenueReport'],
    queryFn: () => analyticsService.getRevenueReport('revenue', 7),
    retry: false,
  });

  const kpiData = kpi ?? mockKPI;
  const chartData = revenueData ?? mockRevenueData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Sales & Revenue Overview</h1>
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">Live Data</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          [
            { label: "Total Revenue", value: `$${kpiData.totalRevenue.toLocaleString()}`, sub: "Today", icon: DollarSign, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
            { label: "RevPAR", value: `$${kpiData.revPAR.toFixed(2)}`, sub: "Revenue per available room", icon: BarChart2, bg: "bg-gradient-to-r from-pink-400 to-pink-500" },
            { label: "ADR", value: `$${kpiData.adr.toFixed(2)}`, sub: "Average daily rate", icon: TrendingUp, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
            { label: "Occupancy", value: `${kpiData.occupancyRate}%`, sub: `${kpiData.inHouse} in-house`, icon: Percent, bg: "bg-gradient-to-r from-yellow-400 to-yellow-500" },
          ].map((stat, i) => (
            <div key={i} className={cn("rounded-2xl p-6 shadow-sm text-white relative overflow-hidden", stat.bg)}>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg"><stat.icon className="w-5 h-5 text-white" /></div>
                  <p className="text-sm font-medium text-white/90">{stat.label}</p>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-xs text-white/80">{stat.sub}</p>
              </div>
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
            </div>
          ))
        )}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Revenue Breakdown (Last 7 Days)</h2>
        </div>
        {revLoading ? (
          <div className="h-[280px] bg-secondary/30 animate-pulse rounded-xl" />
        ) : (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="rooms" name="Rooms" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="fb" name="F&B" stackId="a" fill="#ec4899" radius={[0, 0, 0, 0]} />
                <Bar dataKey="other" name="Other" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function RateManagement() {
  const queryClient = useQueryClient();
  const { data: rules, isLoading } = useQuery({
    queryKey: ['pricingRules'],
    queryFn: rmsService.getPricingRules,
    retry: false,
  });
  const { data: ratePlans, isLoading: rpsLoading } = useQuery({
    queryKey: ['ratePlans'],
    queryFn: rmsService.getRatePlans,
    retry: false,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      rmsService.toggleRule(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pricingRules'] }),
  });

  const displayRules = rules ?? mockPricingRules;
  const displayRatePlans = ratePlans ?? mockRatePlans;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Rate Management</h1>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> New Rule
        </button>
      </div>

      {/* Pricing Rules */}
      <div className="bg-card border border-border rounded-2xl shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Pricing Rules</h2>
        </div>
        <div className="p-5 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-secondary animate-pulse rounded-xl" />
            ))
          ) : displayRules.map(rule => (
            <div key={rule.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors">
              <div>
                <p className="font-medium text-sm">{rule.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {rule.roomType} — Base: ${rule.baseRate} — Adjustment: {rule.adjustmentType === 'PERCENT' ? `${rule.adjustmentValue}%` : `$${rule.adjustmentValue}`}
                </p>
              </div>
              <button
                onClick={() => toggleMutation.mutate({ id: rule.id, isActive: !rule.isActive })}
                className={cn("flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors",
                  rule.isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {rule.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {rule.isActive ? "Active" : "Inactive"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Plans */}
      <div className="bg-card border border-border rounded-2xl shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Rate Plans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Plan Name</th>
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Base Rate</th>
                <th className="px-5 py-3 font-medium">Meals</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rpsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-4 bg-secondary animate-pulse rounded" /></td></tr>
                ))
              ) : displayRatePlans.map(plan => (
                <tr key={plan.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4 font-medium">{plan.name}</td>
                  <td className="px-5 py-4"><span className="px-2 py-1 bg-secondary rounded text-xs font-mono">{plan.code}</span></td>
                  <td className="px-5 py-4 font-semibold text-violet-600">${plan.baseRate}</td>
                  <td className="px-5 py-4 text-muted-foreground">{plan.mealsIncluded ?? "None"}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-primary hover:underline font-medium flex items-center gap-1 ml-auto">
                      <Edit2 className="w-3 h-3" /> Edit
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

function ChannelManager() {
  const { data: otas, isLoading } = useQuery({
    queryKey: ['otas'],
    queryFn: rmsService.getOTAs,
    retry: false,
  });

  const displayOTAs = otas ?? mockOTAs;
  const connected = displayOTAs.filter(o => o.isConnected);
  const totalAllocation = connected.reduce((sum, o) => sum + o.inventoryAllocation, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Channel Manager</h1>
        <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
          <RefreshCw className="w-4 h-4" /> Sync All
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Connected Channels", value: connected.length, icon: Link2, color: "text-emerald-600" },
          { label: "Total Allocation", value: `${totalAllocation}%`, icon: Percent, color: "text-violet-600" },
          { label: "Disconnected", value: displayOTAs.filter(o => !o.isConnected).length, icon: AlertCircle, color: "text-red-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-xl bg-secondary", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* OTA List */}
      <div className="bg-card border border-border rounded-2xl shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold">Distribution Channels</h2>
        </div>
        <div className="p-5 space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-secondary animate-pulse rounded-xl" />)
          ) : displayOTAs.map(ota => (
            <div key={ota.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold",
                  ota.isConnected ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-secondary text-muted-foreground"
                )}>
                  {ota.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{ota.name}</p>
                  {ota.lastSync && <p className="text-xs text-muted-foreground">Last sync: {ota.lastSync}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {ota.isConnected && (
                  <div className="text-right">
                    <p className="text-sm font-semibold">{ota.inventoryAllocation}%</p>
                    <p className="text-xs text-muted-foreground">Allocation</p>
                  </div>
                )}
                <span className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                  ota.isConnected
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {ota.isConnected ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {ota.isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contracts() {
  const contracts = [
    { id: "C-001", client: "TechCorp Inc.", type: "Corporate", rooms: 500, value: "$85,000", expiry: "Dec 31, 2025", status: "Active" },
    { id: "C-002", client: "Global Tours", type: "Wholesale", rooms: 1200, value: "$180,000", expiry: "Mar 31, 2026", status: "Active" },
    { id: "C-003", client: "City Events", type: "Group", rooms: 80, value: "$14,400", expiry: "Nov 15, 2025", status: "Expiring Soon" },
    { id: "C-004", client: "Luxury Travel", type: "Agency", rooms: 200, value: "$32,000", expiry: "Jun 30, 2025", status: "Expired" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Contracts</h1>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> New Contract
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Contract ID</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">Room Nights</th>
                <th className="px-5 py-3 font-medium text-right">Value</th>
                <th className="px-5 py-3 font-medium">Expiry</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contracts.map(c => (
                <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{c.id}</td>
                  <td className="px-5 py-4 font-medium">{c.client}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.type}</td>
                  <td className="px-5 py-4 text-right">{c.rooms.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right font-semibold text-violet-600">{c.value}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.expiry}</td>
                  <td className="px-5 py-4">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium",
                      c.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      c.status === "Expiring Soon" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">View</button>
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

export function SalesRevenue({ activeSubmenu }: SalesRevenueProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview": return <RevenueOverview />;
      case "Rate Management": return <RateManagement />;
      case "Channel Manager": return <ChannelManager />;
      case "Contracts": return <Contracts />;
      default: return <RevenueOverview />;
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
