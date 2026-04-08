import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./Table";
import { InventoryItem } from "../../context/InventoryContext";
import { cn } from "../../lib/utils";
import { AlertTriangle, Package } from "lucide-react";

/**
 * Shared Inventory table used by Cost Control (Master Inventory),
 * Mini Bar, Room Service, Housekeeping and F&B. Pure presentational —
 * all data is passed in as props.
 */

interface InventoryTableProps {
  items: InventoryItem[];
  showDepartment?: boolean;      // set true on Master Inventory aggregate
  showExpiry?: boolean;          // set true for Mini Bar / Room Service
  showSellingPrice?: boolean;    // set true for Mini Bar / Room Service
  emptyLabel?: string;
}

function statusOf(item: InventoryItem): { label: string; className: string } {
  if (item.inStock === 0) return { label: "Out", className: "bg-danger-100 text-danger-700" };
  if (item.inStock < item.parLevel * 0.5) return { label: "Critical", className: "bg-danger-100 text-danger-700" };
  if (item.inStock < item.parLevel) return { label: "Low", className: "bg-warning-100 text-warning-700" };
  return { label: "Optimal", className: "bg-success-100 text-success-700" };
}

function expiryBadge(expiryDate?: string): { label: string; className: string } | null {
  if (!expiryDate) return null;
  const days = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / 86400000);
  if (days < 0) return { label: "Expired", className: "bg-danger-100 text-danger-700" };
  if (days <= 7) return { label: `${days}d`, className: "bg-danger-100 text-danger-700" };
  if (days <= 30) return { label: `${days}d`, className: "bg-warning-100 text-warning-700" };
  return { label: `${days}d`, className: "bg-secondary text-secondary-foreground" };
}

export function InventoryTable({
  items,
  showDepartment = false,
  showExpiry = false,
  showSellingPrice = false,
  emptyLabel = "No inventory items found",
}: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <Package className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            {showDepartment && <TableHead>Department</TableHead>}
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Par</TableHead>
            <TableHead className="text-right">Unit Cost</TableHead>
            <TableHead className="text-right">Value</TableHead>
            {showSellingPrice && <TableHead className="text-right">Sell</TableHead>}
            {showExpiry && <TableHead>Expiry</TableHead>}
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const s = statusOf(item);
            const e = expiryBadge(item.expiryDate);
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.id}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                {showDepartment && <TableCell className="text-muted-foreground">{item.department}</TableCell>}
                <TableCell className="text-right font-medium">{item.inStock} {item.unit}</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.parLevel}</TableCell>
                <TableCell className="text-right tabular-nums">${item.unitCost.toFixed(2)}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">${(item.inStock * item.unitCost).toFixed(2)}</TableCell>
                {showSellingPrice && (
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {item.sellingPrice ? `$${item.sellingPrice.toFixed(2)}` : "—"}
                  </TableCell>
                )}
                {showExpiry && (
                  <TableCell>
                    {e ? (
                      <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1", e.className)}>
                        {e.label === "Expired" && <AlertTriangle className="w-3 h-3" />}
                        {e.label}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", s.className)}>
                    {s.label}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
