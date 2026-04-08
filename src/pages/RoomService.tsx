import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { RoomProfileModal } from "./FrontDesk";
import type { Room } from "../context/RoomContext";
import { KPICard } from "../components/ui/KPICard";
import { InventoryTable } from "../components/ui/InventoryTable";
import { InventoryMovements } from "../components/ui/InventoryMovements";
import { useInventory } from "../context/InventoryContext";
import { useRooms } from "../context/RoomContext";
import { RoomCard, ROOM_GRID } from "../components/ui/RoomCard";
import { cn } from "../lib/utils";
import { BellRing, DollarSign, Clock, AlertTriangle, Package, CheckCircle2 } from "lucide-react";

interface RoomServiceProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

const DEPT = "Room Service" as const;

export function RoomService({ activeSubmenu }: RoomServiceProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":              return <Overview />;
      case "Orders Board":          return <OrdersBoard />;
      case "Room Plan":             return <RoomPlan />;
      case "Menu":                  return <Menu />;
      case "Inventory":             return <Inventory />;
      case "Item Expiry Tracking":  return <ExpiryTracking />;
      case "Inventory Movements":   return <Movements />;
      case "Settings":              return <Settings />;
      default:                      return <Overview />;
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Room Service</h2>
            <h1 className="text-2xl font-bold text-foreground">{activeSubmenu}</h1>
            <p className="text-sm text-muted-foreground mt-1">Live order board, delivery SLA, curated in-room menu and inventory.</p>
          </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

// ─── Overview ───────────────────────────────────────────────────────────────
function Overview() {
  const { getItemsByDepartment, getMovementsByDepartment } = useInventory();
  const items = getItemsByDepartment(DEPT);
  const movements = getMovementsByDepartment(DEPT);

  const salesToday = movements.filter((m) => m.type === "SALE").reduce((s, m) => s + m.quantity, 0);
  const revenueToday = movements
    .filter((m) => m.type === "SALE")
    .reduce((s, m) => {
      const item = items.find((i) => i.id === m.itemId);
      return s + (item?.sellingPrice ?? 0) * m.quantity;
    }, 0);
  const lowStock = items.filter((i) => i.inStock < i.parLevel).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Active Orders"    value="7"                       change="3 in prep · 4 en route" trend="neutral" icon={BellRing}     color="blue" />
        <KPICard label="Avg Delivery"     value="18 min"                  change="SLA target 25 min"       trend="up"      icon={Clock}        color="emerald" />
        <KPICard label="Revenue Today"    value={`$${revenueToday.toFixed(2)}`} change={`${salesToday} items`}  trend="up"      icon={DollarSign}   color="purple" />
        <KPICard label="Low Stock"        value={String(lowStock)}        change={`of ${items.length} items`} trend={lowStock > 0 ? "down" : "neutral"} icon={Package} color="amber" />
      </div>
    </div>
  );
}

// ─── Orders Board (Kanban) ──────────────────────────────────────────────────
function OrdersBoard() {
  const columns = [
    { key: "New",       color: "bg-info-100 text-info-700",         orders: [{ id: "RS-1204", room: "302", items: "Club Sandwich · OJ",         total: 30, time: "2m" }] },
    { key: "In Prep",   color: "bg-warning-100 text-warning-700",   orders: [
      { id: "RS-1202", room: "214", items: "Espresso × 2 · Croissant", total: 14, time: "6m" },
      { id: "RS-1203", room: "408", items: "Club Sandwich · Still Water", total: 24, time: "4m" },
    ]},
    { key: "En Route",  color: "bg-kpi-in-house text-white",        orders: [
      { id: "RS-1199", room: "101", items: "Burger · Fries · Coke",     total: 32, time: "12m" },
      { id: "RS-1200", room: "507", items: "Pasta Arrabiata · Wine",    total: 42, time: "9m" },
    ]},
    { key: "Delivered", color: "bg-success-100 text-success-700",   orders: [
      { id: "RS-1195", room: "208", items: "Breakfast Set",             total: 28, time: "23m" },
      { id: "RS-1196", room: "312", items: "Caesar Salad",              total: 18, time: "20m" },
    ]},
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => (
        <div key={col.key} className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", col.color)}>
              {col.key}
            </span>
            <span className="text-xs text-muted-foreground">{col.orders.length}</span>
          </div>
          <div className="space-y-2">
            {col.orders.map((o) => (
              <div key={o.id} className="bg-background border border-border rounded-lg p-3 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">Room {o.room}</span>
                  <span className="text-xs text-muted-foreground">{o.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{o.items}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">{o.id}</span>
                  <span className="font-bold">${o.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Room Plan ──────────────────────────────────────────────────────────────
function RoomPlan() {
  const { rooms } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Rooms with active room service orders are highlighted.</p>
      <div className={ROOM_GRID}>
        {rooms.map((r, idx) => {
          const hasOrder = idx % 5 === 0;
          return (
            <RoomCard
              key={r.number}
              room={r}
              tone={hasOrder ? "primary" : "neutral"}
              topRight={hasOrder
                ? <BellRing className="w-4 h-4 text-primary" />
                : <CheckCircle2 className="w-4 h-4 text-muted-foreground" />}
              subtitle={`Guest: ${r.guestName ?? "—"}`}
              badge={hasOrder
                ? { label: "Active Order", tone: "warning" }
                : { label: "Idle", tone: "success" }}
              onClick={() => setSelectedRoom(r)}
            />
          );
        })}
      </div>
      <AnimatePresence>
        {selectedRoom && <RoomProfileModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Menu ───────────────────────────────────────────────────────────────────
function Menu() {
  const { getItemsByDepartment } = useInventory();
  const items = getItemsByDepartment(DEPT);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Curated 24/7 in-room menu. Availability is driven by real-time inventory levels.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i) => {
          const available = i.inStock > 0;
          return (
            <div key={i.id} className={cn("bg-card border rounded-2xl p-4 transition-colors", available ? "border-border" : "border-danger-500/30 opacity-60")}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{i.name}</h4>
                  <p className="text-xs text-muted-foreground">{i.category}</p>
                </div>
                <span className="text-lg font-bold">${i.sellingPrice?.toFixed(2) ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Stock: {i.inStock} {i.unit}</span>
                <span className={cn("px-2 py-0.5 rounded-full font-bold uppercase", available ? "bg-success-100 text-success-700" : "bg-danger-100 text-danger-700")}>
                  {available ? "Available" : "Out of Stock"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Inventory ──────────────────────────────────────────────────────────────
function Inventory() {
  const { getItemsByDepartment } = useInventory();
  return <InventoryTable items={getItemsByDepartment(DEPT)} showExpiry showSellingPrice />;
}

// ─── Expiry Tracking ────────────────────────────────────────────────────────
function ExpiryTracking() {
  const { getItemsByDepartment } = useInventory();
  const items = getItemsByDepartment(DEPT).filter((i) => i.expiryDate);
  const buckets = {
    "Expired":    items.filter((i) => new Date(i.expiryDate!).getTime() < Date.now()),
    "≤ 7 days":   items.filter((i) => { const d = (new Date(i.expiryDate!).getTime() - Date.now()) / 86400000; return d >= 0 && d <= 7; }),
    "8–30 days":  items.filter((i) => { const d = (new Date(i.expiryDate!).getTime() - Date.now()) / 86400000; return d > 7 && d <= 30; }),
    "> 30 days":  items.filter((i) => { const d = (new Date(i.expiryDate!).getTime() - Date.now()) / 86400000; return d > 30; }),
  };
  return (
    <div className="space-y-6">
      {Object.entries(buckets).map(([label, bucket]) => (
        <div key={label}>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {label} <span className="text-foreground">({bucket.length})</span>
          </h3>
          {bucket.length > 0 ? (
            <InventoryTable items={bucket} showExpiry showSellingPrice />
          ) : (
            <p className="text-xs text-muted-foreground italic pl-2">None</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Movements ──────────────────────────────────────────────────────────────
function Movements() {
  const { getMovementsByDepartment } = useInventory();
  return <InventoryMovements movements={getMovementsByDepartment(DEPT)} department={DEPT} />;
}

// ─── Settings ───────────────────────────────────────────────────────────────
function Settings() {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Room Service Settings</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Service Hours</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
            <option>24/7</option>
            <option>06:00 – 23:00</option>
            <option>Breakfast only</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Delivery SLA Target (minutes)</label>
          <input type="number" defaultValue={25} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Auto-charge to Folio</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
            <option>Enabled (on delivery)</option>
            <option>Disabled (manual)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Expiry Warning Threshold (days)</label>
          <input type="number" defaultValue={7} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex justify-end pt-2">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Save Settings</button>
        </div>
      </div>
    </div>
  );
}
