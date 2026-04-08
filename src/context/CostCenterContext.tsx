import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

/**
 * CostCenterContext — cost centers and inter-departmental cost transfers.
 * Used by the Cost Control department for budget tracking, CPOR analysis,
 * and month-end GL posting.
 */

export interface CostCenter {
  id: string;
  code: string;          // GL code, e.g. "51000-KIT"
  name: string;
  department: string;    // e.g. "Food & Beverage", "Housekeeping"
  owner: string;         // manager name
  budgetMtd: number;
  actualMtd: number;
  active: boolean;
}

export interface CostTransfer {
  id: string;
  date: string;          // ISO date
  reference: string;
  fromCostCenter: string; // cost center id
  toCostCenter: string;
  amount: number;
  reason: string;
  postedBy: string;
  status: "Draft" | "Posted" | "Reversed";
}

interface CostCenterContextType {
  costCenters: CostCenter[];
  transfers: CostTransfer[];
  addCostCenter: (cc: Omit<CostCenter, "id">) => void;
  updateCostCenter: (id: string, patch: Partial<CostCenter>) => void;
  postTransfer: (t: Omit<CostTransfer, "id" | "status">) => void;
  reverseTransfer: (id: string) => void;
}

const CostCenterContext = createContext<CostCenterContextType | undefined>(undefined);

// ─── Seed data ──────────────────────────────────────────────────────────────
const SEED_COST_CENTERS: CostCenter[] = [
  { id: "cc-001", code: "51000-KIT", name: "Main Kitchen",          department: "Food & Beverage",        owner: "Chef Marcus",      budgetMtd: 42000, actualMtd: 38400, active: true },
  { id: "cc-002", code: "51100-BAR", name: "Main Bar",              department: "Food & Beverage",        owner: "Bar Manager",      budgetMtd: 18000, actualMtd: 19850, active: true },
  { id: "cc-003", code: "52000-HK",  name: "Housekeeping",          department: "Housekeeping",           owner: "HK Manager",       budgetMtd: 24000, actualMtd: 22100, active: true },
  { id: "cc-004", code: "52100-LAU", name: "Laundry & Linen",       department: "Housekeeping",           owner: "Laundry Lead",     budgetMtd: 9500,  actualMtd: 10400, active: true },
  { id: "cc-005", code: "53000-ENG", name: "Engineering & Maintenance", department: "Engineering",        owner: "Chief Engineer",   budgetMtd: 15000, actualMtd: 13600, active: true },
  { id: "cc-006", code: "54000-MB",  name: "Mini Bar",              department: "Mini Bar",               owner: "Mini Bar Supervisor", budgetMtd: 7500, actualMtd: 6820, active: true },
  { id: "cc-007", code: "54100-RS",  name: "Room Service",          department: "Room Service",           owner: "RS Supervisor",    budgetMtd: 12000, actualMtd: 11450, active: true },
  { id: "cc-008", code: "55000-SPA", name: "Spa & Wellness",        department: "Spa & Wellness",         owner: "Spa Director",     budgetMtd: 11000, actualMtd: 9800, active: true },
];

const SEED_TRANSFERS: CostTransfer[] = [
  { id: "ct-001", date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10), reference: "TRF-2026-0408-01", fromCostCenter: "cc-001", toCostCenter: "cc-003", amount: 420,  reason: "Staff meal — HK team",         postedBy: "F&B Controller", status: "Posted" },
  { id: "ct-002", date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10), reference: "TRF-2026-0407-03", fromCostCenter: "cc-002", toCostCenter: "cc-006", amount: 180,  reason: "Bar stock transfer to Mini Bar", postedBy: "F&B Controller", status: "Posted" },
  { id: "ct-003", date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10), reference: "TRF-2026-0406-02", fromCostCenter: "cc-005", toCostCenter: "cc-003", amount: 650,  reason: "Maintenance labour — room 402 repair", postedBy: "Chief Engineer", status: "Posted" },
  { id: "ct-004", date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10), reference: "TRF-2026-0404-01", fromCostCenter: "cc-001", toCostCenter: "cc-007", amount: 240,  reason: "Kitchen prep for Room Service",  postedBy: "F&B Controller", status: "Posted" },
  { id: "ct-005", date: new Date(Date.now() - 0 * 86400000).toISOString().slice(0, 10), reference: "TRF-2026-0409-01", fromCostCenter: "cc-004", toCostCenter: "cc-008", amount: 95,   reason: "Spa linen supply",               postedBy: "HK Supervisor",  status: "Draft" },
];

export function CostCenterProvider({ children }: { children: ReactNode }) {
  const [costCenters, setCostCenters] = useState<CostCenter[]>(SEED_COST_CENTERS);
  const [transfers, setTransfers] = useState<CostTransfer[]>(SEED_TRANSFERS);

  const addCostCenter = useCallback((cc: Omit<CostCenter, "id">) => {
    setCostCenters((prev) => [...prev, { ...cc, id: `cc-${Date.now()}` }]);
  }, []);

  const updateCostCenter = useCallback((id: string, patch: Partial<CostCenter>) => {
    setCostCenters((prev) => prev.map((cc) => (cc.id === id ? { ...cc, ...patch } : cc)));
  }, []);

  const postTransfer = useCallback((t: Omit<CostTransfer, "id" | "status">) => {
    setTransfers((prev) => [{ ...t, id: `ct-${Date.now()}`, status: "Posted" }, ...prev]);
  }, []);

  const reverseTransfer = useCallback((id: string) => {
    setTransfers((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Reversed" } : t)));
  }, []);

  return (
    <CostCenterContext.Provider value={{ costCenters, transfers, addCostCenter, updateCostCenter, postTransfer, reverseTransfer }}>
      {children}
    </CostCenterContext.Provider>
  );
}

export function useCostCenters() {
  const ctx = useContext(CostCenterContext);
  if (!ctx) throw new Error("useCostCenters must be used within CostCenterProvider");
  return ctx;
}
