import React, { useState } from "react";
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Plus, Star, X } from "lucide-react";
import { cn } from "../lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProcurementProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

const getPOStatus = (s: string) => {
  switch (s) {
    case "Approved": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Submitted": return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    case "Draft": return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    case "Received": return "bg-secondary text-secondary-foreground";
    case "Cancelled": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const getStockStatus = (s: string) => {
  switch (s) {
    case "OK": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Low": return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    case "Critical": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const purchaseOrders = [
  { id: "PO-2026-0058", supplier: "FreshFarm Suppliers", items: 12, total: "$6,300", created: "2026-03-28", delivery: "2026-04-02", status: "Approved" },
  { id: "PO-2026-0057", supplier: "CleanPro Chemicals", items: 5, total: "$1,240", created: "2026-03-27", delivery: "2026-04-01", status: "Received" },
  { id: "PO-2026-0056", supplier: "TechSupply Ltd.", items: 3, total: "$4,800", created: "2026-03-25", delivery: "2026-04-05", status: "Submitted" },
  { id: "PO-2026-0055", supplier: "LinenWorld", items: 20, total: "$3,600", created: "2026-03-20", delivery: "2026-03-30", status: "Received" },
  { id: "PO-2026-0054", supplier: "FreshFarm Suppliers", items: 8, total: "$2,100", created: "2026-03-15", delivery: "2026-03-22", status: "Cancelled" },
  { id: "PO-2026-0053", supplier: "MaintainMax", items: 4, total: "$920", created: "2026-03-10", delivery: "2026-03-18", status: "Received" },
];

const suppliers = [
  { name: "FreshFarm Suppliers", category: "Food & Beverage", contact: "sales@freshfarm.com", terms: "Net 30", rating: 4, active: true },
  { name: "CleanPro Chemicals", category: "Housekeeping", contact: "orders@cleanpro.com", terms: "Net 15", rating: 5, active: true },
  { name: "TechSupply Ltd.", category: "Engineering", contact: "techsupply@email.com", terms: "Net 45", rating: 3, active: true },
  { name: "LinenWorld", category: "Housekeeping", contact: "linen@world.com", terms: "Net 30", rating: 5, active: true },
  { name: "MaintainMax", category: "Engineering", contact: "info@maintainmax.com", terms: "COD", rating: 4, active: true },
  { name: "OldEquip Co.", category: "Engineering", contact: "oldequip@email.com", terms: "Net 60", rating: 2, active: false },
];

const inventory = [
  { item: "Bath Towels", category: "Housekeeping", dept: "Housekeeping", stock: 420, par: 500, unit: "pcs", lastCounted: "2026-03-30", status: "Low" },
  { item: "Shampoo Bottles", category: "Housekeeping", dept: "Housekeeping", stock: 680, par: 600, unit: "pcs", lastCounted: "2026-03-30", status: "OK" },
  { item: "Chicken Breast (kg)", category: "F&B", dept: "Kitchen", stock: 8, par: 25, unit: "kg", lastCounted: "2026-03-31", status: "Critical" },
  { item: "Coffee Beans (kg)", category: "F&B", dept: "Kitchen", stock: 12, par: 20, unit: "kg", lastCounted: "2026-03-31", status: "Low" },
  { item: "Cleaning Solution (L)", category: "Housekeeping", dept: "Housekeeping", stock: 45, par: 40, unit: "L", lastCounted: "2026-03-29", status: "OK" },
  { item: "Light Bulbs (LED)", category: "Engineering", dept: "Engineering", stock: 3, par: 20, unit: "pcs", lastCounted: "2026-03-28", status: "Critical" },
  { item: "Bed Sheets (King)", category: "Housekeeping", dept: "Housekeeping", stock: 85, par: 100, unit: "sets", lastCounted: "2026-03-30", status: "Low" },
  { item: "Wine (Chardonnay)", category: "F&B", dept: "F&B", stock: 24, par: 48, unit: "bottles", lastCounted: "2026-03-31", status: "Low" },
];

const reorderAlerts = inventory.filter(i => i.status !== "OK");

const stockByCategory = [
  { cat: "Housekeeping", pct: 78 },
  { cat: "F&B", pct: 45 },
  { cat: "Engineering", pct: 22 },
  { cat: "Stationery", pct: 91 },
];

const recentPOActivity = [
  { time: "2h ago", text: "PO-2026-0058 approved — FreshFarm Suppliers" },
  { time: "1d ago", text: "PO-2026-0057 received — CleanPro Chemicals" },
  { time: "2d ago", text: "PO-2026-0056 submitted to TechSupply Ltd." },
];

function ProcurementOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Procurement Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Open POs", value: "3", change: "1 pending approval", icon: ShoppingCart, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
          { label: "Pending Delivery", value: "2", change: "Expected this week", icon: Package, bg: "bg-gradient-to-r from-blue-400 to-blue-500" },
          { label: "Low Stock Items", value: "5", change: "2 critical", icon: AlertTriangle, bg: "bg-gradient-to-r from-red-400 to-red-500" },
          { label: "Spend This Month", value: "$18,960", change: "+4% vs last month", icon: TrendingUp, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
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
        <h2 className="font-semibold text-base mb-4">Recent PO Activity</h2>
        <div className="space-y-3">
          {recentPOActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
              <p className="text-sm flex-1">{a.text}</p>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PurchaseOrders() {
  const [showNew, setShowNew] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Purchase Orders</h1>
        <button onClick={() => setShowNew(true)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> New PO
        </button>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">PO #</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Supplier</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Items</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Total</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Created</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Delivery</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-xs text-violet-600">{po.id}</td>
                <td className="px-4 py-3 font-medium">{po.supplier}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{po.items}</td>
                <td className="px-4 py-3 text-right font-semibold">{po.total}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{po.created}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{po.delivery}</td>
                <td className="px-4 py-3"><span className={cn("px-3 py-1 rounded-full text-xs font-medium", getPOStatus(po.status))}>{po.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowNew(false)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Purchase Order</h2>
              <button onClick={() => setShowNew(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-sm font-medium text-muted-foreground">Supplier</label>
                <select className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                  {suppliers.filter(s => s.active).map(s => <option key={s.name}>{s.name}</option>)}
                </select></div>
              <div><label className="text-sm font-medium text-muted-foreground">Expected Delivery</label><input type="date" className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
              <div><label className="text-sm font-medium text-muted-foreground">Notes</label><textarea rows={2} className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm bg-secondary rounded-lg">Cancel</button>
              <button onClick={() => setShowNew(false)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium">Create PO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Suppliers() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Suppliers</h1>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Supplier</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Category</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Contact</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Payment Terms</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Rating</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3"><span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">{s.category}</span></td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{s.contact}</td>
                <td className="px-4 py-3 hidden lg:table-cell">{s.terms}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={cn("w-3.5 h-3.5", n <= s.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button className={cn("px-3 py-1 rounded-full text-xs font-medium transition-colors",
                    s.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-secondary text-muted-foreground"
                  )}>
                    {s.active ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryView() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Inventory</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Item</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Stock</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Par</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, i) => (
                <tr key={i} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{item.item}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{item.category}</td>
                  <td className="px-4 py-3">{item.stock} {item.unit}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{item.par}</td>
                  <td className="px-4 py-3"><span className={cn("px-3 py-1 rounded-full text-xs font-medium", getStockStatus(item.status))}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h2 className="font-semibold text-sm mb-4">Stock % by Category</h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockByCategory} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="cat" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={90} />
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="pct" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReorderAlerts() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Reorder Alerts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reorderAlerts.map((item, i) => {
          const suggested = item.par - item.stock + Math.round(item.par * 0.2);
          const supplier = suppliers.find(s => s.category === item.category && s.active) || suppliers[0];
          return (
            <div key={i} className={cn(
              "bg-card rounded-2xl border shadow-sm p-5",
              item.status === "Critical" ? "border-red-200 dark:border-red-500/30" : "border-amber-200 dark:border-amber-500/30"
            )}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.item}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getStockStatus(item.status))}>{item.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.dept} · {item.category}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-secondary/50 rounded-xl p-2 text-center">
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="font-bold text-sm">{item.stock} {item.unit}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-2 text-center">
                  <p className="text-xs text-muted-foreground">Par Level</p>
                  <p className="font-bold text-sm">{item.par}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-2 text-center">
                  <p className="text-xs text-muted-foreground">Suggested</p>
                  <p className="font-bold text-sm text-violet-600">+{suggested}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Preferred: {supplier.name}</p>
                <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5">
                  <Plus className="w-3 h-3" /> Create PO
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Procurement({ aiEnabled, activeSubmenu = "Overview" }: ProcurementProps) {
  return (
    <div className="space-y-6">
      {activeSubmenu === "Overview" && <ProcurementOverview />}
      {activeSubmenu === "Purchase Orders" && <PurchaseOrders />}
      {activeSubmenu === "Suppliers" && <Suppliers />}
      {activeSubmenu === "Inventory" && <InventoryView />}
      {activeSubmenu === "Reorder Alerts" && <ReorderAlerts />}
    </div>
  );
}
