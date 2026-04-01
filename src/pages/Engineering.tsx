import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bmsService, WorkOrder, PMSchedule, Asset } from "../services/bms";
import { cn } from "../lib/utils";
import {
  Wrench, AlertTriangle, CheckCircle2, Clock, Plus, Filter,
  Package, Cpu, BarChart2, Calendar, MapPin, User, ArrowRight
} from "lucide-react";

// lucide-react might not have "Tool" directly, using Wrench as fallback
interface EngineeringProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

// Mock fallback data
const mockWorkOrders: WorkOrder[] = [
  { id: "WO-001", title: "HVAC Filter Replacement - Room 210", description: "Replace air filter, reduced airflow detected", department: "Engineering", status: "IN_PROGRESS", priority: "HIGH", assignedTo: "Robert Brown", location: "Room 210", createdAt: "2026-04-01T08:00:00Z", dueDate: "2026-04-01" },
  { id: "WO-002", title: "Elevator B Annual Inspection", description: "Scheduled annual safety inspection for elevator B", department: "Engineering", status: "OPEN", priority: "CRITICAL", assignedTo: "External Vendor", location: "Main Elevator", createdAt: "2026-03-30T10:00:00Z", dueDate: "2026-04-02" },
  { id: "WO-003", title: "Lobby Lighting Fix", description: "Two spotlights out in main lobby", department: "Engineering", status: "OPEN", priority: "MEDIUM", assignedTo: "James Lee", location: "Main Lobby", createdAt: "2026-04-01T09:30:00Z", dueDate: "2026-04-03" },
  { id: "WO-004", title: "Pool Pump Maintenance", description: "Monthly pool pump check and chemical balance", department: "Engineering", status: "COMPLETED", priority: "MEDIUM", assignedTo: "Robert Brown", location: "Pool Area", createdAt: "2026-03-28T08:00:00Z" },
];
const mockPMSchedules: PMSchedule[] = [
  { id: "PM-001", assetId: "A-01", assetName: "Elevator A", frequency: "Monthly", lastDone: "2026-03-01", nextDue: "2026-04-01", assignedTo: "Otis Service", status: "OVERDUE" },
  { id: "PM-002", assetId: "A-02", assetName: "Boiler System", frequency: "Quarterly", lastDone: "2026-01-15", nextDue: "2026-04-15", assignedTo: "Engineering Team", status: "UPCOMING" },
  { id: "PM-003", assetId: "A-03", assetName: "Fire Suppression System", frequency: "Annual", lastDone: "2025-04-20", nextDue: "2026-04-20", assignedTo: "Safety Vendor", status: "UPCOMING" },
  { id: "PM-004", assetId: "A-04", assetName: "Generator", frequency: "Monthly", lastDone: "2026-03-05", nextDue: "2026-04-05", assignedTo: "Engineering Team", status: "COMPLETED" },
];
const mockAssets: Asset[] = [
  { id: "A-01", name: "Elevator A", category: "Vertical Transport", location: "Main Building", status: "OPERATIONAL", lastMaintenance: "2026-03-01", purchaseDate: "2018-06-01", value: 85000 },
  { id: "A-02", name: "Boiler System", category: "HVAC", location: "Basement", status: "OPERATIONAL", lastMaintenance: "2026-01-15", purchaseDate: "2015-03-10", value: 45000 },
  { id: "A-03", name: "Fire Suppression", category: "Safety", location: "All Floors", status: "OPERATIONAL", lastMaintenance: "2025-04-20", purchaseDate: "2016-08-22", value: 62000 },
  { id: "A-04", name: "Generator", category: "Power", location: "Utility Room", status: "NEEDS_ATTENTION", lastMaintenance: "2026-03-05", purchaseDate: "2019-11-15", value: 35000 },
  { id: "A-05", name: "Pool Pump System", category: "Recreation", location: "Pool Area", status: "OPERATIONAL", lastMaintenance: "2026-03-28", purchaseDate: "2020-05-12", value: 18000 },
];

function SkeletonCard() {
  return <div className="bg-card border border-border rounded-xl p-5 animate-pulse h-24" />;
}

function EngineeringOverview() {
  const { data: workOrders } = useQuery({ queryKey: ['workOrders'], queryFn: () => bmsService.getWorkOrders(), retry: false });
  const { data: pmSchedules } = useQuery({ queryKey: ['pmSchedules'], queryFn: bmsService.getPMSchedules, retry: false });
  const { data: assets } = useQuery({ queryKey: ['assets'], queryFn: bmsService.getAssets, retry: false });

  const wo = workOrders ?? mockWorkOrders;
  const pm = pmSchedules ?? mockPMSchedules;
  const ast = assets ?? mockAssets;

  const openWO = wo.filter(w => w.status === 'OPEN' || w.status === 'IN_PROGRESS').length;
  const overdueWO = wo.filter(w => w.dueDate && new Date(w.dueDate) < new Date() && w.status !== 'COMPLETED').length;
  const overduepm = pm.filter(p => p.status === 'OVERDUE').length;
  const needsAttention = ast.filter(a => a.status !== 'OPERATIONAL').length;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Engineering Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open Work Orders", value: openWO, sub: "Active issues", icon: Wrench, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
          { label: "Overdue Tasks", value: overdueWO, sub: "Past due date", icon: AlertTriangle, bg: "bg-gradient-to-r from-red-400 to-red-500" },
          { label: "PM Overdue", value: overduepm, sub: "Scheduled maintenance", icon: Clock, bg: "bg-gradient-to-r from-amber-400 to-amber-500" },
          { label: "Assets — Attention", value: needsAttention, sub: "Needs service", icon: Cpu, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
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
        ))}
      </div>

      {/* Recent work orders */}
      <div className="bg-card border border-border rounded-2xl shadow-sm">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Recent Work Orders</h2>
          <button className="text-primary text-sm hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
        </div>
        <div className="p-5 space-y-3">
          {wo.slice(0, 4).map(order => (
            <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full",
                  order.priority === "CRITICAL" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                  order.priority === "HIGH" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                  "bg-secondary text-muted-foreground"
                )}>
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{order.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {order.location}
                    {order.assignedTo && <><span className="mx-1">•</span><User className="w-3 h-3" /> {order.assignedTo}</>}
                  </p>
                </div>
              </div>
              <span className={cn("px-2 py-1 rounded-full text-xs font-medium shrink-0",
                order.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                order.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                "bg-secondary text-muted-foreground"
              )}>
                {order.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkOrders() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("ALL");
  const { data: workOrders, isLoading } = useQuery({ queryKey: ['workOrders'], queryFn: () => bmsService.getWorkOrders(), retry: false });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => bmsService.updateWorkOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workOrders'] }),
  });

  const display = (workOrders ?? mockWorkOrders).filter(w => filter === "ALL" || w.status === filter);

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Work Orders</h1>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Create Work Order
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", "OPEN", "IN_PROGRESS", "COMPLETED", "ON_HOLD"].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) :
          display.map(order => (
            <div key={order.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn("p-2 rounded-xl shrink-0 mt-1",
                    order.priority === "CRITICAL" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                    order.priority === "HIGH" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-secondary text-muted-foreground"
                  )}>
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{order.title}</h3>
                      <span className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded",
                        order.priority === "CRITICAL" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        order.priority === "HIGH" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-secondary text-muted-foreground"
                      )}>
                        {order.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{order.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      {order.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {order.location}</span>}
                      {order.assignedTo && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {order.assignedTo}</span>}
                      {order.dueDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due {order.dueDate}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border",
                    order.status === "COMPLETED" ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400" :
                    order.status === "IN_PROGRESS" ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400" :
                    "bg-secondary border-border text-muted-foreground"
                  )}>
                    {order.status.replace("_", " ")}
                  </span>
                  {order.status !== "COMPLETED" && (
                    <button
                      onClick={() => updateMutation.mutate({ id: order.id, status: order.status === "OPEN" ? "IN_PROGRESS" : "COMPLETED" })}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      {order.status === "OPEN" ? "Start" : "Complete"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function PreventiveMaintenance() {
  const { data: schedules, isLoading } = useQuery({ queryKey: ['pmSchedules'], queryFn: bmsService.getPMSchedules, retry: false });
  const display = schedules ?? mockPMSchedules;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Preventive Maintenance</h1>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Schedule PM
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Asset</th>
                <th className="px-5 py-3 font-medium">Frequency</th>
                <th className="px-5 py-3 font-medium">Last Done</th>
                <th className="px-5 py-3 font-medium">Next Due</th>
                <th className="px-5 py-3 font-medium">Assigned To</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-4 bg-secondary animate-pulse rounded" /></td></tr>
              )) : display.map(pm => (
                <tr key={pm.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4 font-medium">{pm.assetName}</td>
                  <td className="px-5 py-4 text-muted-foreground">{pm.frequency}</td>
                  <td className="px-5 py-4 text-muted-foreground">{pm.lastDone ?? "Never"}</td>
                  <td className="px-5 py-4">{pm.nextDue}</td>
                  <td className="px-5 py-4 text-muted-foreground">{pm.assignedTo ?? "Unassigned"}</td>
                  <td className="px-5 py-4">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium",
                      pm.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      pm.status === "OVERDUE" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                      {pm.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">Log</button>
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

function AssetManagement() {
  const { data: assets, isLoading } = useQuery({ queryKey: ['assets'], queryFn: bmsService.getAssets, retry: false });
  const display = assets ?? mockAssets;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Asset Management</h1>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Assets", value: display.length, icon: Package, color: "text-violet-600" },
          { label: "Operational", value: display.filter(a => a.status === 'OPERATIONAL').length, icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Needs Attention", value: display.filter(a => a.status !== 'OPERATIONAL').length, icon: AlertTriangle, color: "text-amber-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-xl bg-secondary", stat.color)}><stat.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) :
          display.map(asset => (
            <div key={asset.id} className={cn("bg-card border rounded-2xl p-5 shadow-sm",
              asset.status === "OPERATIONAL" ? "border-border" :
              asset.status === "NEEDS_ATTENTION" ? "border-amber-200 dark:border-amber-800" :
              "border-red-200 dark:border-red-800"
            )}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{asset.name}</h3>
                  <p className="text-xs text-muted-foreground">{asset.category} — {asset.location}</p>
                </div>
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium shrink-0",
                  asset.status === "OPERATIONAL" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  asset.status === "NEEDS_ATTENTION" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {asset.status.replace("_", " ")}
                </span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                {asset.value && <p>Value: <span className="font-semibold text-foreground">${asset.value.toLocaleString()}</span></p>}
                {asset.lastMaintenance && <p>Last Service: <span className="font-medium text-foreground">{asset.lastMaintenance}</span></p>}
                {asset.purchaseDate && <p>Acquired: {asset.purchaseDate}</p>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export function Engineering({ activeSubmenu }: EngineeringProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview": return <EngineeringOverview />;
      case "Work Orders": return <WorkOrders />;
      case "Preventive Maintenance": return <PreventiveMaintenance />;
      case "Asset Management": return <AssetManagement />;
      default: return <EngineeringOverview />;
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
