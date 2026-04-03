/**
 * SectionHeader — standardised page / section title.
 * Occupies ~4% of page height. Used at the top of every department view.
 */
import React from "react";
import { cn } from "../../lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional right-side actions/badges */
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 min-h-[2rem]", className)}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-foreground leading-tight truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
