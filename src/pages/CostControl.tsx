import React, { useState } from "react";
import { KPICard } from "../components/ui/KPICard";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { InventoryTable } from "../components/ui/InventoryTable";
import { useInventory, InventoryDepartment } from "../context/InventoryContext";
import { useCostCenters } from "../context/CostCenterContext";
import { cn } from "../lib/utils";
import {
  DollarSign, TrendingUp, TrendingDown, Scale, Plus, Lock,
  ClipboardCheck, Coins, ArrowLeftRight, Calculator
} from "lucide-react";

interface CostControlProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function CostControl({ activeSubmenu }: CostControlProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":                   return <Overview />;
      case "Cost Centers":               return <CostCenters />;
      case "Cost Transfers":             return <CostTransfers />;
      case "Master Inventory":           return <MasterInventory />;
      case "Physical Inventory":         return <PhysicalInventory />;
      case "Month-End Valuation":        return <MonthEndValuation />;
      case "Settings":                   return <Settings />;
      default:                           return <Overview />;
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Cost Control</h2>
            <h1 className="text-2xl font-bold text-foreground">{activeSubmenu}</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitor, allocate, and reconcile costs across all departments.</p>
          </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

// ─── Overview ───────────────────────────────────────────────────────────────
function Overview() {
  const { costCenters, transfers } = useCostCenters();
  const { items } = useInventory();

  const totalBudget = costCenters.reduce((s, c) => s + c.budgetMtd, 0);
  const totalActual = costCenters.reduce((s, c) => s + c.actualMtd, 0);
  const variance = totalBudget - totalActual;
  const variancePct = totalBudget ? (variance / totalBudget) * 100 : 0;
  const totalInventoryValue = items.reduce((s, i) => s + i.inStock * i.unitCost, 0);
  const transfersToday = transfers.filter((t) => t.date === new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Spend MTD"          value={`$${totalActual.toLocaleString()}`} change={`Budget $${totalBudget.toLocaleString()}`} trend="neutral" icon={DollarSign} color="blue" />
        <KPICard label="Budget Variance"    value={`${variancePct >= 0 ? "+" : ""}${variancePct.toFixed(1)}%`} change={variance >= 0 ? "Under budget" : "Over budget"} trend={variance >= 0 ? "up" : "down"} icon={variance >= 0 ? TrendingUp : TrendingDown} color={variance >= 0 ? "emerald" : "rose"} />
        <KPICard label="Inventory Value"    value={`$${totalInventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} change={`${items.length} items across departments`} trend="neutral" icon={Scale} color="purple" />
        <KPICard label="Transfers Today"    value={String(transfersToday)} change="Inter-dept cost moves" trend="neutral" icon={ArrowLeftRight} color="amber" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Spend by Department</h3>
        <div className="space-y-3">
          {costCenters.map((cc) => {
            const pct = cc.budgetMtd ? (cc.actualMtd / cc.budgetMtd) * 100 : 0;
            const over = pct > 100;
            return (
              <div key={cc.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div>
                    <span className="font-medium text-foreground">{cc.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{cc.code}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${cc.actualMtd.toLocaleString()} / ${cc.budgetMtd.toLocaleString()}
                    <span className={cn("ml-2 font-bold", over ? "text-danger-700" : "text-success-700")}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", over ? "bg-danger-500" : "bg-success-500")}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Cost Centers ───────────────────────────────────────────────────────────
function CostCenters() {
  const { costCenters } = useCostCenters();
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Cost Center
        </button>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Budget MTD</TableHead>
              <TableHead className="text-right">Actual MTD</TableHead>
              <TableHead className="text-right">Variance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costCenters.map((cc) => {
              const variance = cc.budgetMtd - cc.actualMtd;
              return (
                <TableRow key={cc.id}>
                  <TableCell className="font-mono text-xs">{cc.code}</TableCell>
                  <TableCell className="font-medium">{cc.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cc.department}</TableCell>
                  <TableCell className="text-muted-foreground">{cc.owner}</TableCell>
                  <TableCell className="text-right tabular-nums">${cc.budgetMtd.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">${cc.actualMtd.toLocaleString()}</TableCell>
                  <TableCell className={cn("text-right tabular-nums font-medium", variance >= 0 ? "text-success-700" : "text-danger-700")}>
                    {variance >= 0 ? "+" : ""}${variance.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", cc.active ? "bg-success-100 text-success-700" : "bg-secondary text-secondary-foreground")}>
                      {cc.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Cost Transfers ─────────────────────────────────────────────────────────
function CostTransfers() {
  const { transfers, costCenters } = useCostCenters();
  const ccName = (id: string) => costCenters.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Post Cost Transfer
        </button>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{t.date}</TableCell>
                <TableCell className="font-mono text-xs">{t.reference}</TableCell>
                <TableCell>{ccName(t.fromCostCenter)}</TableCell>
                <TableCell>{ccName(t.toCostCenter)}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">${t.amount.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.reason}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.postedBy}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    t.status === "Posted"   ? "bg-success-100 text-success-700" :
                    t.status === "Draft"    ? "bg-warning-100 text-warning-700" :
                                              "bg-danger-100 text-danger-700"
                  )}>
                    {t.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Master Inventory ───────────────────────────────────────────────────────
function MasterInventory() {
  const { items } = useInventory();
  const [filter, setFilter] = useState<string>("All");
  const departments = ["All", ...Array.from(new Set(items.map((i) => i.department)))];
  const filtered = filter === "All" ? items : items.filter((i) => i.department === filter);
  const totalValue = filtered.reduce((s, i) => s + i.inStock * i.unitCost, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                filter === d ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Total value: <span className="font-bold text-foreground">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          <span className="mx-2">·</span>
          {filtered.length} items
        </div>
      </div>
      <InventoryTable items={filtered} showDepartment showExpiry />
    </div>
  );
}

// ─── Physical Inventory ─────────────────────────────────────────────────────
function PhysicalInventory() {
  const { items } = useInventory();
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-primary" /> Physical Count Sheet</h3>
        <p className="text-sm text-muted-foreground mb-4">Enter a physical count for each item. Variance vs book value posts an adjustment movement.</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Book Stock</TableHead>
              <TableHead className="text-right">Physical Count</TableHead>
              <TableHead className="text-right">Variance</TableHead>
              <TableHead className="text-right">Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.slice(0, 10).map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.name}</TableCell>
                <TableCell className="text-muted-foreground">{i.department}</TableCell>
                <TableCell className="text-right tabular-nums">{i.inStock} {i.unit}</TableCell>
                <TableCell className="text-right">
                  <input
                    type="number"
                    defaultValue={i.inStock}
                    className="w-20 bg-background border border-border rounded-lg px-2 py-1 text-sm text-right outline-none focus:border-primary"
                  />
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">0</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">$0.00</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors">Save Draft</button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Post Adjustments</button>
        </div>
      </div>
    </div>
  );
}

// ─── Month-End Valuation ────────────────────────────────────────────────────
function MonthEndValuation() {
  const { items } = useInventory();
  const byDept = items.reduce<Record<string, { qty: number; value: number }>>((acc, i) => {
    const key = i.department;
    if (!acc[key]) acc[key] = { qty: 0, value: 0 };
    acc[key].qty += i.inStock;
    acc[key].value += i.inStock * i.unitCost;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Closing stock value as of <strong className="text-foreground">{new Date().toLocaleDateString()}</strong></p>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Lock className="w-4 h-4" /> Lock Period & Export
        </button>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Total Items</TableHead>
              <TableHead className="text-right">Closing Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(byDept).map(([dept, v]) => (
              <TableRow key={dept}>
                <TableCell className="font-medium">{dept}</TableCell>
                <TableCell className="text-right tabular-nums">{v.qty}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">${v.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Settings ───────────────────────────────────────────────────────────────
function Settings() {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Cost Control Settings</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Default Budget Period</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Quarterly</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Variance Alert Threshold</label>
          <input type="number" defaultValue={10} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          <p className="text-xs text-muted-foreground">Alert when a cost center exceeds budget by this % or more.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">GL Integration</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
            <option>None</option>
            <option>QuickBooks</option>
            <option>SAP</option>
            <option>Oracle NetSuite</option>
          </select>
        </div>
        <div className="flex justify-end pt-2">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Save Settings</button>
        </div>
      </div>
    </div>
  );
}
