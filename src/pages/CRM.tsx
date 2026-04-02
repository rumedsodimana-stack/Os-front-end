import React, { useState } from "react";
import { Users, Star, Heart, TrendingUp, Search, X, Award, Clock, Globe } from "lucide-react";
import { cn } from "../lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface CRMProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

const getTierBadge = (tier: string) => {
  switch (tier) {
    case "Platinum": return "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300";
    case "Gold": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
    case "Silver": return "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400";
    default: return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400";
  }
};

const mockGuests = [
  { id: 1, name: "James Whitfield", email: "j.whitfield@email.com", phone: "+1 555-0101", nationality: "USA", vip: true, tier: "Platinum", totalStays: 42, lastStay: "2026-03-28" },
  { id: 2, name: "Amara Osei", email: "a.osei@email.com", phone: "+44 7700 900123", nationality: "Ghana", vip: true, tier: "Gold", totalStays: 18, lastStay: "2026-03-20" },
  { id: 3, name: "Mei Lin Zhang", email: "meilin@email.com", phone: "+86 138 0013 8000", nationality: "China", vip: false, tier: "Silver", totalStays: 7, lastStay: "2026-02-15" },
  { id: 4, name: "Carlos Mendez", email: "c.mendez@email.com", phone: "+52 55 1234 5678", nationality: "Mexico", vip: false, tier: "Bronze", totalStays: 3, lastStay: "2026-01-30" },
  { id: 5, name: "Sophie Laurent", email: "s.laurent@email.com", phone: "+33 6 12 34 56 78", nationality: "France", vip: true, tier: "Gold", totalStays: 22, lastStay: "2026-03-15" },
  { id: 6, name: "Omar Al-Rashid", email: "o.rashid@email.com", phone: "+971 50 123 4567", nationality: "UAE", vip: true, tier: "Platinum", totalStays: 35, lastStay: "2026-03-29" },
  { id: 7, name: "Priya Sharma", email: "p.sharma@email.com", phone: "+91 98765 43210", nationality: "India", vip: false, tier: "Silver", totalStays: 9, lastStay: "2026-02-28" },
  { id: 8, name: "Luca Rossi", email: "l.rossi@email.com", phone: "+39 02 1234567", nationality: "Italy", vip: false, tier: "Bronze", totalStays: 2, lastStay: "2025-12-10" },
];

const stayHistory = [
  { date: "2026-03-29", guest: "Omar Al-Rashid", room: "Suite 501", nights: 4, revenue: "$3,200", tier: "Platinum" },
  { date: "2026-03-28", guest: "James Whitfield", room: "Deluxe 302", nights: 2, revenue: "$980", tier: "Platinum" },
  { date: "2026-03-20", guest: "Amara Osei", room: "Standard 104", nights: 3, revenue: "$720", tier: "Gold" },
  { date: "2026-03-15", guest: "Sophie Laurent", room: "Suite 402", nights: 5, revenue: "$4,500", tier: "Gold" },
  { date: "2026-02-28", guest: "Priya Sharma", room: "Standard 205", nights: 2, revenue: "$440", tier: "Silver" },
  { date: "2026-02-15", guest: "Mei Lin Zhang", room: "Deluxe 310", nights: 1, revenue: "$320", tier: "Silver" },
];

const tierData = [
  { name: "Platinum", value: 12, color: "#64748b" },
  { name: "Gold", value: 28, color: "#eab308" },
  { name: "Silver", value: 47, color: "#9ca3af" },
  { name: "Bronze", value: 83, color: "#f97316" },
];

const preferenceData = [
  { tag: "High Floor", count: 87 },
  { tag: "Late Checkout", count: 72 },
  { tag: "No Feather Pillows", count: 61 },
  { tag: "Extra Towels", count: 54 },
  { tag: "Quiet Room", count: 49 },
  { tag: "Early Check-in", count: 38 },
  { tag: "King Bed", count: 35 },
  { tag: "Near Elevator", count: 22 },
];

const activityFeed = [
  { time: "2m ago", event: "James Whitfield checked in — Suite 501", type: "checkin" },
  { time: "15m ago", event: "Amara Osei earned 500 loyalty points", type: "loyalty" },
  { time: "1h ago", event: "Sophie Laurent preference updated: No Feather Pillows", type: "preference" },
  { time: "3h ago", event: "Omar Al-Rashid reached Platinum status", type: "milestone" },
  { time: "5h ago", event: "Carlos Mendez stay completed — Room 204", type: "checkout" },
];

function GuestProfilePanel({ guest, onClose }: { guest: typeof mockGuests[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border-l border-border h-full overflow-y-auto shadow-2xl p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Guest Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
            {guest.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">{guest.name}</p>
              {guest.vip && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">VIP</span>}
            </div>
            <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getTierBadge(guest.tier))}>{guest.tier}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Email", value: guest.email },
            { label: "Phone", value: guest.phone },
            { label: "Nationality", value: guest.nationality },
            { label: "Total Stays", value: guest.totalStays.toString() },
            { label: "Last Stay", value: guest.lastStay },
            { label: "Loyalty Points", value: (guest.totalStays * 120).toLocaleString() },
          ].map(item => (
            <div key={item.label} className="bg-secondary/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
              <p className="text-sm font-medium truncate">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-sm font-medium mb-2">Preferences</p>
          <div className="flex flex-wrap gap-2">
            {["High Floor", "Late Checkout", "Extra Towels"].map(p => (
              <span key={p} className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CRMOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">CRM Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Guests", value: "1,842", change: "+12% this month", icon: Users, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
          { label: "Returning Guests", value: "68%", change: "+3% vs last month", icon: TrendingUp, bg: "bg-gradient-to-r from-pink-400 to-pink-500" },
          { label: "VIP Guests", value: "47", change: "4 new this month", icon: Star, bg: "bg-gradient-to-r from-yellow-400 to-yellow-500" },
          { label: "Avg Stays", value: "3.2", change: "+0.4 vs last month", icon: Heart, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-2xl p-6 shadow-sm text-white relative overflow-hidden", stat.bg)}>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/20 rounded-lg"><stat.icon className="w-6 h-6 text-white" /></div>
                <p className="text-lg font-medium text-white/90">{stat.label}</p>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-white/80">{stat.change}</p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <h2 className="font-semibold text-base mb-4">Recent Guest Activity</h2>
        <div className="space-y-3">
          {activityFeed.map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
              <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 shrink-0" />
              <p className="text-sm text-foreground flex-1">{item.event}</p>
              <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GuestProfiles() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof mockGuests[0] | null>(null);
  const filtered = mockGuests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Guest Profiles</h1>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring w-64"
            placeholder="Search guests..."
          />
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Guest</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Contact</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Nationality</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Tier</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Stays</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Last Stay</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(guest => (
              <tr
                key={guest.id}
                className="border-t border-border hover:bg-secondary/30 cursor-pointer transition-colors"
                onClick={() => setSelected(guest)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {guest.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{guest.name}</p>
                      {guest.vip && <span className="text-xs text-yellow-600 font-medium">VIP</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{guest.email}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-1"><Globe className="w-3 h-3 text-muted-foreground" />{guest.nationality}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getTierBadge(guest.tier))}>{guest.tier}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">{guest.totalStays}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{guest.lastStay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && <GuestProfilePanel guest={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function StayHistory() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Stay History</h1>
        <div className="flex gap-2">
          <select className="bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none">
            <option>All Tiers</option>
            <option>Platinum</option>
            <option>Gold</option>
            <option>Silver</option>
            <option>Bronze</option>
          </select>
          <input type="date" className="bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Guest</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Room</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Nights</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Revenue</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Tier</th>
            </tr>
          </thead>
          <tbody>
            {stayHistory.map((s, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 text-muted-foreground"><div className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.date}</div></td>
                <td className="px-4 py-3 font-medium">{s.guest}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.room}</td>
                <td className="px-4 py-3">{s.nights}</td>
                <td className="px-4 py-3 font-medium text-emerald-600">{s.revenue}</td>
                <td className="px-4 py-3"><span className={cn("px-3 py-1 rounded-full text-xs font-medium", getTierBadge(s.tier))}>{s.tier}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Loyalty() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Loyalty Program</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <h2 className="font-semibold text-base mb-4">Members by Tier</h2>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tierData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                  {tierData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <h2 className="font-semibold text-base mb-4">Tier Summary</h2>
          <div className="space-y-3">
            {tierData.map(t => (
              <div key={t.name} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                  <span className="font-medium">{t.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{t.value}</p>
                  <p className="text-xs text-muted-foreground">{(t.value * 120).toLocaleString()} pts avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Preferences() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Guest Preferences</h1>
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <h2 className="font-semibold text-base mb-4">Most Common Preferences</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={preferenceData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis dataKey="tag" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={130} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {preferenceData.slice(0, 4).map(p => (
          <div key={p.tag} className="bg-card rounded-2xl shadow-sm border border-border p-4 text-center">
            <p className="text-2xl font-bold text-violet-600">{p.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{p.tag}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CRM({ aiEnabled, activeSubmenu = "Overview" }: CRMProps) {
  return (
    <div className="space-y-6">
      {activeSubmenu === "Overview" && <CRMOverview />}
      {activeSubmenu === "Guest Profiles" && <GuestProfiles />}
      {activeSubmenu === "Stay History" && <StayHistory />}
      {activeSubmenu === "Loyalty" && <Loyalty />}
      {activeSubmenu === "Preferences" && <Preferences />}
    </div>
  );
}
