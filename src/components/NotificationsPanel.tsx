import React, { useState } from "react";
import { X, Bell, CheckCheck, AlertTriangle, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

type NotifType = "info" | "warning" | "alert" | "success";
type Tab = "All" | "Unread" | "Alerts";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", type: "warning", title: "Room 204 — Maintenance Request", message: "A maintenance request has been submitted for Room 204 (plumbing issue). Assigned to Engineering.", time: "2 min ago", read: false },
  { id: "2", type: "info", title: "VIP Arrival in 2 hours", message: "Alice Johnson arriving at 14:00 — Suite 103. Ensure room is prepped and welcome amenities are in place.", time: "15 min ago", read: false },
  { id: "3", type: "alert", title: "Housekeeping Task Overdue", message: "Room 108 checkout cleaning is 45 minutes overdue. Guest checking in at 15:00.", time: "32 min ago", read: false },
  { id: "4", type: "success", title: "F&B Order #1042 Delivered", message: "Order successfully delivered to Room 214. Guest satisfaction confirmed.", time: "1 hr ago", read: true },
  { id: "5", type: "warning", title: "Low Inventory Alert", message: "Shampoo is below par level. Current stock: 12 units (par: 50). Reorder needed.", time: "2 hr ago", read: true },
];

const borderColors: Record<NotifType, string> = {
  info: "border-l-violet-500",
  warning: "border-l-amber-500",
  alert: "border-l-red-500",
  success: "border-l-emerald-500",
};

function NotifIcon({ type }: { type: NotifType }) {
  const base = "p-2 rounded-full shrink-0";
  switch (type) {
    case "info":
      return <div className={cn(base, "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400")}><Info className="w-4 h-4" /></div>;
    case "warning":
      return <div className={cn(base, "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400")}><AlertTriangle className="w-4 h-4" /></div>;
    case "alert":
      return <div className={cn(base, "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400")}><AlertCircle className="w-4 h-4" /></div>;
    case "success":
      return <div className={cn(base, "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400")}><CheckCircle2 className="w-4 h-4" /></div>;
  }
}

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(n => n.map(item => ({ ...item, read: true })));
  const markRead = (id: string) => setNotifications(n => n.map(item => item.id === id ? { ...item, read: true } : item));

  const filtered = notifications.filter(n => {
    if (activeTab === "Unread") return !n.read;
    if (activeTab === "Alerts") return n.type === "alert" || n.type === "warning";
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed top-4 right-4 z-50 w-[380px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden animate-in slide-in-from-top-2 duration-200">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-base">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex border-b border-border shrink-0">
          {(["All", "Unread", "Alerts"] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn("flex-1 py-2.5 text-sm font-medium transition-colors", activeTab === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground")}
            >
              {tab}
              {tab === "Unread" && unreadCount > 0 && (
                <span className="ml-1.5 bg-destructive/20 text-destructive text-xs px-1.5 rounded-full">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={cn("flex gap-3 p-4 border-l-4 hover:bg-secondary/30 transition-colors cursor-pointer", borderColors[notif.type], !notif.read && "bg-secondary/20")}
              >
                <div className="mt-0.5"><NotifIcon type={notif.type} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight">{notif.title}</p>
                    {!notif.read && <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notif.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1.5">{notif.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-3 border-t border-border shrink-0 text-center">
          <button className="text-sm text-primary hover:underline font-medium">View all notifications</button>
        </div>
      </div>
    </>
  );
}
