import React from "react";
import { cn } from "../../lib/utils";
import type { Room } from "../../context/RoomContext";

/**
 * RoomCard — the ONE canonical room tile.
 *
 * Used by Front Desk, Housekeeping, Mini Bar, Room Service (and anywhere else
 * that needs a room grid). The shape, rhythm, and status-badge style are
 * fixed; departments customise CONTENT via props (topRight icon, subtitle,
 * badge, footer slot) — not visual language.
 *
 * Rule: never fork this. If a department needs a new piece of info, add it
 * via one of the existing slots (topRight / subtitle / footer). If that is
 * not enough, extend RoomCardProps here and update every consumer in the
 * same commit (§2 of CLAUDE.md — reuse before you build).
 */

export type RoomCardTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary";

const TONE_BADGE: Record<RoomCardTone, string> = {
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  danger:  "bg-danger-100 text-danger-700",
  info:    "bg-info-100 text-info-700",
  neutral: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/10 text-primary",
};

const TONE_BORDER: Record<RoomCardTone, string> = {
  success: "border-success-500/30",
  warning: "border-warning-500/30",
  danger:  "border-danger-500/30",
  info:    "border-info-500/30",
  neutral: "border-border",
  primary: "border-primary/50",
};

export interface RoomCardBadge {
  label: string;
  tone: RoomCardTone;
}

export interface RoomCardProps {
  room: Room;
  /** Pill badge in the card body — the primary departmental status signal. */
  badge?: RoomCardBadge;
  /** Top-right slot (icon, VIP star, alert dot). */
  topRight?: React.ReactNode;
  /** Secondary line under the room type (guest name, note, last updated). */
  subtitle?: React.ReactNode;
  /** Optional footer row (HK condition buttons, assignee dropdown, etc.). */
  footer?: React.ReactNode;
  /** Whole-card border tint. Defaults to neutral. */
  tone?: RoomCardTone;
  onClick?: (room: Room) => void;
  className?: string;
}

export function RoomCard({
  room,
  badge,
  topRight,
  subtitle,
  footer,
  tone = "neutral",
  onClick,
  className,
}: RoomCardProps) {
  const interactive = Boolean(onClick);
  const Tag: any = interactive ? "button" : "div";
  return (
    <Tag
      {...(interactive
        ? { type: "button", onClick: () => onClick!(room) }
        : {})}
      className={cn(
        "bg-card border rounded-2xl p-4 text-left flex flex-col gap-3 shadow-sm transition-all",
        "hover:shadow-md hover:border-primary/50",
        interactive && "cursor-pointer",
        TONE_BORDER[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-lg font-bold text-foreground leading-tight">
            {room.number}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {room.type}
          </div>
        </div>
        {topRight && <div className="shrink-0">{topRight}</div>}
      </div>

      {subtitle && (
        <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
      )}

      {badge && (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block w-fit",
            TONE_BADGE[badge.tone],
          )}
        >
          {badge.label}
        </span>
      )}

      {footer && <div className="pt-1">{footer}</div>}
    </Tag>
  );
}

/** Canonical responsive grid for room cards — copy exactly in every page. */
export const ROOM_GRID =
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4";
