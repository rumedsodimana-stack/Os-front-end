import React, { useState } from "react";
import { KPICard } from "../components/ui/KPICard";
import { InventoryTable } from "../components/ui/InventoryTable";
import { InventoryMovements } from "../components/ui/InventoryMovements";
import { useInventory } from "../context/InventoryContext";
import { useRooms } from "../context/RoomContext";
import { RoomCard, ROOM_GRID, type RoomCardTone } from "../components/ui/RoomCard";
import { RoomProfileModal } from "./FrontDesk";
import { AnimatePresence } from "motion/react";
import type { Room } from "../context/RoomContext";
import { Wine, DollarSign, AlertTriangle, Package, Activity, Clock } from "lucide-react";

interface MiniBarProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

const DEPT = "Mini Bar" as const;

export function MiniBar({ activeSubmenu }: MiniBarProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":              return <Overview />;
      case "Room Plan":             return <RoomPlan />;
      case "Mini Bar Inventory":    return <Inventory />;
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
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Mini Bar</h2>
            <h1 className="text-2xl font-bold text-foreground">{activeSubmenu}</h1>
            <p className="text-sm text-muted-foreground mt-1">In-room consumption tracking, synced with Front Desk, Housekeeping and Room Service.</p>
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
  const expiringSoon = items.filter((i) => {
    if (!i.expiryDate) return false;
    const days = Math.ceil((new Date(i.expiryDate).getTime() - Date.now()) / 86400000);
    return days <= 14;
  }).length;
  const lowStock = items.filter((i) => i.inStock < i.parLevel).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Revenue Today"    value={`$${revenueToday.toFixed(2)}`} change={`${salesToday} items sold`} trend="up" icon={DollarSign} color="emerald" />
        <KPICard label="Items Consumed"   value={String(salesToday)} change="In the last 24h" trend="neutral" icon={Activity} color="blue" />
        <KPICard label="Expiring ≤ 14d"   value={String(expiringSoon)} change="Requires attention" trend={expiringSoon > 0 ? "down" : "neutral"} icon={AlertTriangle} color="amber" />
        <KPICard label="Low Stock Items"  value={String(lowStock)} change={`of ${items.length} total`} trend={lowStock > 0 ? "down" : "neutral"} icon={Package} color="rose" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Wine className="w-5 h-5 text-primary" /> Top Items by Stock Value</h3>
        <div className="space-y-2">
          {items
            .slice()
            .sort((a, b) => b.inStock * b.unitCost - a.inStock * a.unitCost)
            .slice(0, 5)
            .map((i) => (
              <div key={i.id} className="flex items-center justify-between text-sm">
                <span className="font-medium">{i.name}</span>
                <span className="text-muted-foreground">{i.inStock} {i.unit} · ${(i.inStock * i.unitCost).toFixed(2)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ─── Room Plan ──────────────────────────────────────────────────────────────
function RoomPlan() {
  const { rooms } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Derive a mock mini bar status per room — in production this would come from a MiniBarStockContext
  const statusOf = (roomNum: string): { label: string; tone: RoomCardTone } => {
    const n = parseInt(roomNum, 10);
    if (n % 5 === 0) return { label: "Needs Restock", tone: "danger" };
    if (n % 4 === 0) return { label: "Needs Check",   tone: "warning" };
    if (n % 3 === 0) return { label: "Consumed",      tone: "info" };
    return { label: "Stocked", tone: "success" };
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Synchronised with Front Desk occupancy and Housekeeping restock tasks. Click a room to post consumption.
      </p>
      <div className={ROOM_GRID}>
        {rooms.map((r) => {
          const s = statusOf(r.number);
          return (
            <RoomCard
              key={r.number}
              room={r}
              tone={s.tone}
              topRight={<Wine className="w-4 h-4 text-muted-foreground" />}
              subtitle={`Guest: ${r.guestName ?? "—"}`}
              badge={{ label: s.label, tone: s.tone }}
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
    "Expired":       items.filter((i) => new Date(i.expiryDate!).getTime() < Date.now()),
    "≤ 7 days":      items.filter((i) => { const d = (new Date(i.expiryDate!).getTime() - Date.now()) / 86400000; return d >= 0 && d <= 7; }),
    "8–30 days":     items.filter((i) => { const d = (new Date(i.expiryDate!).getTime() - Date.now()) / 86400000; return d > 7 && d <= 30; }),
    "> 30 days":     items.filter((i) => { const d = (new Date(i.expiryDate!).getTime() - Date.now()) / 86400000; return d > 30; }),
  };

  return (
    <div className="space-y-6">
      {Object.entries(buckets).map(([label, bucket]) => (
        <div key={label}>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> {label} <span className="text-foreground">({bucket.length})</span>
          </h3>
          {bucket.length > 0 ? (
            <InventoryTable items={bucket} showExpiry showSellingPrice emptyLabel={`No items ${label.toLowerCase()}`} />
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
        <h3 className="text-lg font-semibold">Mini Bar Settings</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Default Par Level per Room</label>
          <input type="number" defaultValue={15} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Expiry Warning Threshold (days)</label>
          <input type="number" defaultValue={14} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Auto-charge to Folio</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
            <option>Enabled (post on consumption)</option>
            <option>Disabled (manual posting)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Auto-generate HK Restock Task</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
            <option>On check-out</option>
            <option>Daily at 10:00</option>
            <option>Disabled</option>
          </select>
        </div>
        <div className="flex justify-end pt-2">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Save Settings</button>
        </div>
      </div>
    </div>
  );
}
