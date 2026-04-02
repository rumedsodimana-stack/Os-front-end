import React, { useState } from "react";
import { DollarSign, TrendingUp, FileText, AlertCircle, Lock, Download, Plus, Eye } from "lucide-react";
import { cn } from "../lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FinanceProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

const getInvoiceStatus = (status: string) => {
  switch (status) {
    case "Paid": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Sent": return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    case "Draft": return "bg-secondary text-secondary-foreground";
    case "Overdue": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const revenueData = [
  { name: "Jan", revenue: 52000, expenses: 31000 },
  { name: "Feb", revenue: 48000, expenses: 29000 },
  { name: "Mar", revenue: 61000, expenses: 34000 },
  { name: "Apr", revenue: 55000, expenses: 32000 },
  { name: "May", revenue: 67000, expenses: 38000 },
  { name: "Jun", revenue: 72000, expenses: 40000 },
  { name: "Jul", revenue: 68000, expenses: 37000 },
];

const journalEntries = [
  { date: "2026-03-31", ref: "JE-2026-0312", desc: "Room Revenue — March", debit: "", credit: "71,240.00", balance: "71,240.00" },
  { date: "2026-03-31", ref: "JE-2026-0311", desc: "F&B Revenue — March", debit: "", credit: "18,560.00", balance: "89,800.00" },
  { date: "2026-03-30", ref: "JE-2026-0310", desc: "Payroll — March", debit: "22,400.00", credit: "", balance: "67,400.00" },
  { date: "2026-03-29", ref: "JE-2026-0309", desc: "Utility Bills — March", debit: "4,200.00", credit: "", balance: "45,000.00" },
  { date: "2026-03-28", ref: "JE-2026-0308", desc: "Maintenance Supplies", debit: "1,820.00", credit: "", balance: "49,200.00" },
  { date: "2026-03-27", ref: "JE-2026-0307", desc: "F&B Inventory Purchase", debit: "6,300.00", credit: "", balance: "51,020.00" },
  { date: "2026-03-26", ref: "JE-2026-0306", desc: "Event Revenue — Corporate Gala", debit: "", credit: "14,500.00", balance: "57,320.00" },
];

const invoices = [
  { id: "INV-2026-0087", party: "James Whitfield", date: "2026-03-29", amount: "$3,200.00", status: "Paid" },
  { id: "INV-2026-0086", party: "Horizon Events Co.", date: "2026-03-28", amount: "$14,500.00", status: "Sent" },
  { id: "INV-2026-0085", party: "Amara Osei", date: "2026-03-25", amount: "$720.00", status: "Paid" },
  { id: "INV-2026-0084", party: "FreshFarm Suppliers", date: "2026-03-20", amount: "$6,300.00", status: "Overdue" },
  { id: "INV-2026-0083", party: "Sophie Laurent", date: "2026-03-18", amount: "$4,500.00", status: "Paid" },
  { id: "INV-2026-0082", party: "City Utilities Ltd.", date: "2026-03-15", amount: "$4,200.00", status: "Draft" },
];

const auditLog = [
  { time: "2026-03-31 23:45", user: "Maria Santos", action: "Closed period — March 2026", category: "Period Close" },
  { time: "2026-03-31 18:20", user: "Maria Santos", action: "Created JE-2026-0312: Room Revenue", category: "Journal Entry" },
  { time: "2026-03-30 16:10", user: "Admin System", action: "Auto-posted payroll JE-2026-0310", category: "Payroll" },
  { time: "2026-03-29 11:05", user: "John Rivera", action: "Issued INV-2026-0087 to James Whitfield", category: "Invoice" },
  { time: "2026-03-28 14:30", user: "Maria Santos", action: "Approved PO-2026-0051 — FreshFarm Suppliers", category: "Purchase Order" },
  { time: "2026-03-27 09:00", user: "Admin System", action: "Daily balance snapshot — 2026-03-26", category: "Balance" },
];

function FinanceOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Financial Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Revenue This Month", value: "$89,800", change: "+12% vs last month", icon: TrendingUp, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
          { label: "Expenses", value: "$34,720", change: "-3% vs last month", icon: DollarSign, bg: "bg-gradient-to-r from-pink-400 to-pink-500" },
          { label: "Net Profit", value: "$55,080", change: "+18% vs last month", icon: TrendingUp, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
          { label: "Outstanding Invoices", value: "$10,500", change: "2 overdue", icon: AlertCircle, bg: "bg-gradient-to-r from-yellow-400 to-yellow-500" },
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg">Revenue vs Expenses</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-muted-foreground">Revenue</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-500" /><span className="text-muted-foreground">Expenses</span></div>
          </div>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="finRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="finExpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#finRevGrad)" />
              <Area type="monotone" dataKey="expenses" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#finExpGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function JournalEntries() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Journal Entries</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-lg">
          <Lock className="w-4 h-4" />
          <span>Read-only — Immutable records</span>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Reference</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Description</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Debit</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Credit</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {journalEntries.map((e, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                <td className="px-4 py-3 font-mono text-xs text-violet-600">{e.ref}</td>
                <td className="px-4 py-3">{e.desc}</td>
                <td className="px-4 py-3 text-right text-red-600 font-medium">{e.debit && `$${e.debit}`}</td>
                <td className="px-4 py-3 text-right text-emerald-600 font-medium">{e.credit && `$${e.credit}`}</td>
                <td className="px-4 py-3 text-right font-semibold">${e.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Invoices() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Invoice #</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Guest / Vendor</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Date</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Amount</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-xs text-violet-600">{inv.id}</td>
                <td className="px-4 py-3 font-medium">{inv.party}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{inv.date}</td>
                <td className="px-4 py-3 text-right font-semibold">{inv.amount}</td>
                <td className="px-4 py-3"><span className={cn("px-3 py-1 rounded-full text-xs font-medium", getInvoiceStatus(inv.status))}>{inv.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors" title="View"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors" title="Download"><Download className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCreate(false)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Create Invoice</h2>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-muted-foreground">Guest / Vendor</label><input className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Name" /></div>
              <div><label className="text-sm font-medium text-muted-foreground">Amount</label><input type="number" className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="0.00" /></div>
              <div><label className="text-sm font-medium text-muted-foreground">Date</label><input type="date" className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm bg-secondary rounded-lg hover:bg-secondary/80">Cancel</button>
              <button onClick={() => setShowCreate(false)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DailyBalance() {
  const [date, setDate] = useState("2026-03-31");
  const items = [
    { label: "Room Revenue", value: "$8,240", positive: true },
    { label: "F&B Revenue", value: "$2,180", positive: true },
    { label: "Other Revenue", value: "$640", positive: true },
    { label: "Total Revenue", value: "$11,060", positive: true, bold: true },
    { label: "Total Expenses", value: "$4,320", positive: false },
    { label: "Net", value: "$6,740", positive: true, bold: true },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Daily Balance</h1>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 max-w-lg">
        <p className="text-sm text-muted-foreground mb-4">Daily Summary — {date}</p>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className={cn("flex items-center justify-between py-3", i < items.length - 1 && "border-b border-border")}>
              <span className={cn("text-sm", item.bold ? "font-semibold" : "text-muted-foreground")}>{item.label}</span>
              <span className={cn("font-mono font-semibold", item.bold ? "text-base" : "text-sm", item.positive ? "text-emerald-600" : "text-red-500")}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditLog() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Audit Log</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-lg">
          <Lock className="w-4 h-4 text-amber-500" />
          <span>This log is immutable and cannot be modified.</span>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Timestamp</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">User</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Action</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Category</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((entry, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{entry.time}</td>
                <td className="px-4 py-3 font-medium">{entry.user}</td>
                <td className="px-4 py-3 text-sm">{entry.action}</td>
                <td className="px-4 py-3"><span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">{entry.category}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Finance({ aiEnabled, activeSubmenu = "Overview" }: FinanceProps) {
  return (
    <div className="space-y-6">
      {activeSubmenu === "Overview" && <FinanceOverview />}
      {activeSubmenu === "Journal Entries" && <JournalEntries />}
      {activeSubmenu === "Invoices" && <Invoices />}
      {activeSubmenu === "Daily Balance" && <DailyBalance />}
      {activeSubmenu === "Audit Log" && <AuditLog />}
    </div>
  );
}
