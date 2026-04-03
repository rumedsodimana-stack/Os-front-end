/**
 * LegendBar — compact single-row colour legend.
 * Occupies ~4% of page height. Each item is a small colour swatch + label.
 * Used inside floor plan cards, timeline views, and any status-coded grid.
 */
import { cn } from "../../lib/utils";

export interface LegendItem {
  /**
   * Two Tailwind classes: bg + border, e.g. "bg-emerald-100 border-emerald-200"
   * The component renders a w-4 h-4 rounded swatch using these classes.
   */
  color: string;
  label: string;
}

interface LegendBarProps {
  items: LegendItem[];
  className?: string;
}

export function LegendBar({ items, className }: LegendBarProps) {
  return (
    <div className={cn("flex flex-wrap gap-x-5 gap-y-2 items-center text-xs", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded border-2 shrink-0", item.color)} />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
