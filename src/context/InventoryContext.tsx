import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

/**
 * InventoryContext — unified inventory + movements ledger shared across
 * Cost Control, Mini Bar, Room Service, Housekeeping, F&B, Purchasing.
 *
 * Each item is tagged with a `department` (the operational owner) so the
 * Master Inventory view in Cost Control can aggregate across all departments
 * and per-department pages can filter to their own stock.
 *
 * Movement types cover every real-world posting an employee needs:
 *   PURCHASE_IN   — Goods receipt from Purchasing
 *   TRANSFER_IN   — Inter-department transfer received
 *   TRANSFER_OUT  — Inter-department transfer issued
 *   SALE          — Consumed by a guest (posts to folio elsewhere)
 *   SPOILAGE      — Write-off (expired, damaged, breakage)
 *   MANUAL_IN     — Manual adjustment in (count variance, correction)
 *   MANUAL_OUT    — Manual adjustment out (count variance, correction)
 */

export type InventoryDepartment =
  | "Mini Bar"
  | "Room Service"
  | "Housekeeping"
  | "Food & Beverage"
  | "Engineering"
  | "Spa & Wellness"
  | "Purchasing & Procurement";

export type MovementType =
  | "PURCHASE_IN"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "SALE"
  | "SPOILAGE"
  | "MANUAL_IN"
  | "MANUAL_OUT";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  department: InventoryDepartment;
  costCenterId?: string;
  unit: string;            // e.g. "btl", "can", "pc", "kg"
  inStock: number;
  parLevel: number;
  unitCost: number;        // in local currency
  sellingPrice?: number;   // for sale items (mini bar, room service)
  expiryDate?: string;     // ISO date
  batchNumber?: string;
  supplier?: string;
  lastUpdated: string;     // ISO date
}

export interface InventoryMovement {
  id: string;
  timestamp: string;
  itemId: string;
  itemName: string;
  type: MovementType;
  quantity: number;
  fromDepartment?: InventoryDepartment;
  toDepartment?: InventoryDepartment;
  reference?: string;      // PO number, folio number, etc.
  user: string;
  note?: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  movements: InventoryMovement[];
  loading: boolean;
  getItemsByDepartment: (dept: InventoryDepartment) => InventoryItem[];
  getMovementsByDepartment: (dept: InventoryDepartment) => InventoryMovement[];
  postMovement: (movement: Omit<InventoryMovement, "id" | "timestamp">) => Promise<void>;
  addItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// ─── Mock seed data ─────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const SEED_ITEMS: InventoryItem[] = [
  // Mini Bar
  { id: "mb-001", name: "Heineken 330ml",         category: "Beverage",   department: "Mini Bar", unit: "btl", inStock: 120, parLevel: 150, unitCost: 2.50, sellingPrice: 8.00, expiryDate: daysFromNow(180), batchNumber: "HK2601", supplier: "Brewers Inc", lastUpdated: today },
  { id: "mb-002", name: "Coca-Cola 330ml",        category: "Beverage",   department: "Mini Bar", unit: "can", inStock: 220, parLevel: 200, unitCost: 0.80, sellingPrice: 5.00, expiryDate: daysFromNow(240), batchNumber: "CC2602", supplier: "Coca-Cola Co", lastUpdated: today },
  { id: "mb-003", name: "Pringles Original",      category: "Snack",      department: "Mini Bar", unit: "pc",  inStock: 80,  parLevel: 120, unitCost: 1.80, sellingPrice: 6.00, expiryDate: daysFromNow(90),  batchNumber: "PR2603", supplier: "Mondelez", lastUpdated: today },
  { id: "mb-004", name: "Snickers Bar",           category: "Snack",      department: "Mini Bar", unit: "pc",  inStock: 45,  parLevel: 100, unitCost: 1.20, sellingPrice: 5.00, expiryDate: daysFromNow(12),  batchNumber: "SN2604", supplier: "Mars", lastUpdated: today },
  { id: "mb-005", name: "Red Wine Mini 187ml",    category: "Alcohol",    department: "Mini Bar", unit: "btl", inStock: 60,  parLevel: 75,  unitCost: 4.20, sellingPrice: 15.00, expiryDate: daysFromNow(720), batchNumber: "RW2605", supplier: "Wine Dist", lastUpdated: today },
  { id: "mb-006", name: "Johnnie Walker 50ml",    category: "Alcohol",    department: "Mini Bar", unit: "btl", inStock: 30,  parLevel: 50,  unitCost: 5.80, sellingPrice: 18.00, expiryDate: daysFromNow(1095), batchNumber: "JW2606", supplier: "Diageo", lastUpdated: today },
  { id: "mb-007", name: "Evian Water 500ml",      category: "Beverage",   department: "Mini Bar", unit: "btl", inStock: 180, parLevel: 200, unitCost: 0.90, sellingPrice: 4.00, expiryDate: daysFromNow(365), batchNumber: "EV2607", supplier: "Nestlé Waters", lastUpdated: today },
  { id: "mb-008", name: "KitKat 4-Finger",        category: "Snack",      department: "Mini Bar", unit: "pc",  inStock: 15,  parLevel: 80,  unitCost: 1.00, sellingPrice: 4.50, expiryDate: daysFromNow(5),   batchNumber: "KK2608", supplier: "Nestlé", lastUpdated: today },

  // Room Service
  { id: "rs-001", name: "Espresso Pods (Lavazza)", category: "Beverage",  department: "Room Service", unit: "pc",  inStock: 350, parLevel: 400, unitCost: 0.40, sellingPrice: 4.50, expiryDate: daysFromNow(180), lastUpdated: today },
  { id: "rs-002", name: "Fresh Orange Juice 1L",   category: "Beverage",  department: "Room Service", unit: "btl", inStock: 22,  parLevel: 40,  unitCost: 3.50, sellingPrice: 12.00, expiryDate: daysFromNow(4),   lastUpdated: today },
  { id: "rs-003", name: "Club Sandwich (prep)",    category: "Food",      department: "Room Service", unit: "pc",  inStock: 0,   parLevel: 0,   unitCost: 3.00, sellingPrice: 18.00, lastUpdated: today },
  { id: "rs-004", name: "Chocolate Cake Slice",    category: "Food",      department: "Room Service", unit: "pc",  inStock: 18,  parLevel: 30,  unitCost: 2.40, sellingPrice: 10.00, expiryDate: daysFromNow(3), lastUpdated: today },
  { id: "rs-005", name: "Mineral Water 750ml",     category: "Beverage",  department: "Room Service", unit: "btl", inStock: 96,  parLevel: 100, unitCost: 1.10, sellingPrice: 6.00, expiryDate: daysFromNow(300), lastUpdated: today },
  { id: "rs-006", name: "Fresh Milk 1L",           category: "Beverage",  department: "Room Service", unit: "btl", inStock: 14,  parLevel: 30,  unitCost: 1.80, sellingPrice: 5.00, expiryDate: daysFromNow(6),   lastUpdated: today },

  // Housekeeping (for Master Inventory aggregation)
  { id: "hk-001", name: "Bath Towel",              category: "Linen",     department: "Housekeeping", unit: "pc",  inStock: 820, parLevel: 1000, unitCost: 8.00, lastUpdated: today },
  { id: "hk-002", name: "Shampoo 30ml",            category: "Amenity",   department: "Housekeeping", unit: "btl", inStock: 450, parLevel: 600,  unitCost: 0.70, lastUpdated: today },
  { id: "hk-003", name: "Bed Sheet Queen",         category: "Linen",     department: "Housekeeping", unit: "pc",  inStock: 380, parLevel: 500,  unitCost: 18.00, lastUpdated: today },

  // F&B Kitchen (for Master Inventory aggregation)
  { id: "fb-001", name: "Beef Tenderloin",         category: "Protein",   department: "Food & Beverage", unit: "kg",  inStock: 14, parLevel: 25, unitCost: 48.00, lastUpdated: today },
  { id: "fb-002", name: "Arborio Rice",            category: "Dry Goods", department: "Food & Beverage", unit: "kg",  inStock: 32, parLevel: 40, unitCost: 4.20, lastUpdated: today },
];

const SEED_MOVEMENTS: InventoryMovement[] = [
  { id: "mv-001", timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), itemId: "mb-001", itemName: "Heineken 330ml",      type: "PURCHASE_IN", quantity: 48, reference: "PO-2026-0412", user: "Sarah K.", note: "GRN received" },
  { id: "mv-002", timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), itemId: "mb-002", itemName: "Coca-Cola 330ml",     type: "SALE",        quantity: 2, reference: "Folio-10234", user: "Mini Bar Attendant", toDepartment: "Mini Bar" },
  { id: "mv-003", timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), itemId: "rs-002", itemName: "Fresh Orange Juice 1L", type: "SPOILAGE",  quantity: 3, user: "RS Supervisor", note: "Past expiry" },
  { id: "mv-004", timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), itemId: "mb-004", itemName: "Snickers Bar",        type: "TRANSFER_OUT", quantity: 10, fromDepartment: "Mini Bar", toDepartment: "Room Service", user: "Store Keeper" },
  { id: "mv-005", timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), itemId: "rs-001", itemName: "Espresso Pods (Lavazza)", type: "PURCHASE_IN", quantity: 200, reference: "PO-2026-0408", user: "Sarah K." },
  { id: "mv-006", timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), itemId: "mb-008", itemName: "KitKat 4-Finger",    type: "MANUAL_OUT",  quantity: 5, user: "Mini Bar Attendant", note: "Breakage in transit" },
  { id: "mv-007", timestamp: new Date(Date.now() - 30 * 3600 * 1000).toISOString(), itemId: "hk-001", itemName: "Bath Towel",         type: "TRANSFER_OUT", quantity: 40, fromDepartment: "Housekeeping", toDepartment: "Spa & Wellness", user: "HK Supervisor" },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(SEED_ITEMS);
  const [movements, setMovements] = useState<InventoryMovement[]>(SEED_MOVEMENTS);
  const [loading] = useState(false);

  const getItemsByDepartment = useCallback(
    (dept: InventoryDepartment) => items.filter((i) => i.department === dept),
    [items]
  );

  const getMovementsByDepartment = useCallback(
    (dept: InventoryDepartment) =>
      movements.filter((m) => m.fromDepartment === dept || m.toDepartment === dept || items.find((i) => i.id === m.itemId)?.department === dept),
    [movements, items]
  );

  const postMovement = useCallback(async (m: Omit<InventoryMovement, "id" | "timestamp">) => {
    const newMovement: InventoryMovement = {
      ...m,
      id: `mv-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setMovements((prev) => [newMovement, ...prev]);

    // Update item stock
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== m.itemId) return it;
        const delta =
          m.type === "PURCHASE_IN" || m.type === "TRANSFER_IN" || m.type === "MANUAL_IN"
            ? m.quantity
            : -m.quantity;
        return { ...it, inStock: Math.max(0, it.inStock + delta), lastUpdated: today };
      })
    );
  }, []);

  const addItem = useCallback(async (item: Omit<InventoryItem, "id" | "lastUpdated">) => {
    const newItem: InventoryItem = {
      ...item,
      id: `${item.department.slice(0, 2).toLowerCase()}-${Date.now()}`,
      lastUpdated: today,
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  return (
    <InventoryContext.Provider
      value={{ items, movements, loading, getItemsByDepartment, getMovementsByDepartment, postMovement, addItem }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
