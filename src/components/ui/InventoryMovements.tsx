import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./Table";
import { InventoryMovement, MovementType, useInventory, InventoryDepartment } from "../../context/InventoryContext";
import { cn } from "../../lib/utils";
import { Plus, ArrowDownCircle, ArrowUpCircle, Trash2, Repeat, ShoppingCart, Edit } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Shared Inventory Movements ledger + "Post Manual Movement" modal.
 * Consumed by Mini Bar, Room Service and (read-only) Cost Control.
 */

interface InventoryMovementsProps {
  movements: InventoryMovement[];
  department: InventoryDepartment;
  allowPosting?: boolean;   // show "Post Movement" button
}

const TYPE_META: Record<MovementType, { label: string; icon: React.ElementType; className: string }> = {
  PURCHASE_IN:  { label: "Purchase In",  icon: ShoppingCart,    className: "bg-success-100 text-success-700" },
  TRANSFER_IN:  { label: "Transfer In",  icon: ArrowDownCircle, className: "bg-info-100 text-info-700" },
  TRANSFER_OUT: { label: "Transfer Out", icon: ArrowUpCircle,   className: "bg-info-100 text-info-700" },
  SALE:         { label: "Sale",         icon: Edit,            className: "bg-warning-100 text-warning-700" },
  SPOILAGE:     { label: "Spoilage",     icon: Trash2,          className: "bg-danger-100 text-danger-700" },
  MANUAL_IN:    { label: "Manual In",    icon: Repeat,          className: "bg-secondary text-secondary-foreground" },
  MANUAL_OUT:   { label: "Manual Out",   icon: Repeat,          className: "bg-secondary text-secondary-foreground" },
};

export function InventoryMovements({ movements, department, allowPosting = true }: InventoryMovementsProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      {allowPosting && (
        <div className="flex justify-end">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Post Manual Movement
          </button>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date / Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>From → To</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  No movements yet — post one to start tracking.
                </TableCell>
              </TableRow>
            ) : (
              movements.map((m) => {
                const meta = TYPE_META[m.type];
                const Icon = meta.icon;
                return (
                  <TableRow key={m.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(m.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", meta.className)}>
                        <Icon className="w-3 h-3" /> {meta.label}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{m.itemName}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{m.quantity}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {m.fromDepartment || "—"} → {m.toDepartment || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.reference || m.note || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.user}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AnimatePresence>
        {modalOpen && <PostMovementModal department={department} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function PostMovementModal({ department, onClose }: { department: InventoryDepartment; onClose: () => void }) {
  const { items, postMovement } = useInventory();
  const deptItems = items.filter((i) => i.department === department);

  const [itemId, setItemId] = useState(deptItems[0]?.id ?? "");
  const [type, setType] = useState<MovementType>("MANUAL_IN");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  async function handleSubmit() {
    const item = deptItems.find((i) => i.id === itemId);
    if (!item) return;
    await postMovement({
      itemId: item.id,
      itemName: item.name,
      type,
      quantity,
      note,
      user: "Current User",
      toDepartment: type.endsWith("_IN") ? department : undefined,
      fromDepartment: type.endsWith("_OUT") ? department : undefined,
    });
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border bg-secondary/30">
          <h3 className="text-lg font-bold text-foreground">Post Manual Movement</h3>
          <p className="text-sm text-muted-foreground">{department}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Item <span className="text-danger-500">*</span></label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
            >
              {deptItems.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.inStock} {i.unit})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Movement Type <span className="text-danger-500">*</span></label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MovementType)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
            >
              <option value="MANUAL_IN">Manual In (adjustment +)</option>
              <option value="MANUAL_OUT">Manual Out (adjustment −)</option>
              <option value="PURCHASE_IN">Purchase In</option>
              <option value="TRANSFER_IN">Transfer In</option>
              <option value="TRANSFER_OUT">Transfer Out</option>
              <option value="SALE">Sale</option>
              <option value="SPOILAGE">Spoilage</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Quantity <span className="text-danger-500">*</span></label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional comment or reference"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Post Movement
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
