import React, { useState } from "react";
import { MessageSquare, Bell, Megaphone, Send, Plus, X, Check } from "lucide-react";
import { cn } from "../lib/utils";

interface CommsProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

const conversations = [
  { id: 1, name: "Maria Santos", dept: "Finance", avatar: "MS", lastMsg: "Can you confirm the invoice for Room 501?", time: "2m", unread: 2 },
  { id: 2, name: "Jose Rivera", dept: "Security", avatar: "JR", lastMsg: "Shift handover submitted.", time: "15m", unread: 0 },
  { id: 3, name: "Chef Moto", dept: "F&B", avatar: "CM", lastMsg: "Banquet order confirmed for Saturday.", time: "1h", unread: 1 },
  { id: 4, name: "Sarah Kim", dept: "Housekeeping", avatar: "SK", lastMsg: "Room 302 is ready for inspection.", time: "2h", unread: 0 },
  { id: 5, name: "Tom Harris", dept: "Engineering", avatar: "TH", lastMsg: "AC unit in 105 has been replaced.", time: "3h", unread: 0 },
];

type Message = { id: number; text: string; sent: boolean; time: string };

const threadMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Hi Jane, can you confirm the invoice for Room 501?", sent: false, time: "14:32" },
    { id: 2, text: "Sure, looking it up now!", sent: true, time: "14:33" },
    { id: 3, text: "INV-2026-0087 — $3,200 — Status: Paid ✓", sent: true, time: "14:34" },
    { id: 4, text: "Perfect, thank you!", sent: false, time: "14:35" },
  ],
  2: [
    { id: 1, text: "Evening shift handover submitted.", sent: false, time: "22:05" },
    { id: 2, text: "Received. All clear?", sent: true, time: "22:06" },
    { id: 3, text: "Shift handover submitted.", sent: false, time: "22:07" },
  ],
  3: [
    { id: 1, text: "Banquet order confirmed for Saturday.", sent: false, time: "11:00" },
    { id: 2, text: "Great! How many covers?", sent: true, time: "11:02" },
    { id: 3, text: "220 pax, set menu A + vegan option.", sent: false, time: "11:04" },
  ],
  4: [
    { id: 1, text: "Room 302 is ready for inspection.", sent: false, time: "09:30" },
  ],
  5: [
    { id: 1, text: "AC unit in Room 105 has been replaced.", sent: false, time: "08:45" },
    { id: 2, text: "Thanks Tom. Log the work order please.", sent: true, time: "08:47" },
  ],
};

const announcements = [
  { id: 1, title: "Fire Drill — April 3rd, 10:00 AM", dept: "All Departments", postedBy: "GM Office", date: "2026-03-31", reads: 38 },
  { id: 2, title: "Updated Breakfast Service Hours", dept: "F&B, Front Desk", postedBy: "Chef Moto", date: "2026-03-30", reads: 24 },
  { id: 3, title: "New Revenue Target — Q2 2026", dept: "Sales & Revenue, Executive", postedBy: "Maria Santos", date: "2026-03-28", reads: 12 },
  { id: 4, title: "Maintenance Window — Server Room", dept: "Engineering, IT", postedBy: "Tom Harris", date: "2026-03-27", reads: 8 },
];

const notificationLog = [
  { type: "Alert", recipient: "Security Team", message: "Incident INC-2026-041 logged — Floor 3", sentAt: "2026-03-31 22:15", status: "Delivered" },
  { type: "Reminder", recipient: "All Staff", message: "Fire Drill tomorrow at 10:00 AM", sentAt: "2026-03-31 09:00", status: "Delivered" },
  { type: "Broadcast", recipient: "Housekeeping", message: "VIP arriving in 30 minutes — Room 501", sentAt: "2026-03-31 13:30", status: "Delivered" },
  { type: "System", recipient: "Finance", message: "Invoice INV-2026-0084 overdue — FreshFarm", sentAt: "2026-03-30 08:00", status: "Delivered" },
  { type: "Alert", recipient: "Front Desk", message: "Guest complaint — Room 202 noise", sentAt: "2026-03-29 21:45", status: "Failed" },
  { type: "Reminder", recipient: "Engineering", message: "Preventive maintenance — Boiler Room", sentAt: "2026-03-29 08:00", status: "Pending" },
];

const getNotifStatus = (s: string) => {
  switch (s) {
    case "Delivered": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Failed": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    default: return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
  }
};

function CommsOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Communications Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Unread Messages", value: "3", change: "Across 2 conversations", icon: MessageSquare, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
          { label: "Announcements", value: "4", change: "1 posted today", icon: Megaphone, bg: "bg-gradient-to-r from-pink-400 to-pink-500" },
          { label: "Active Broadcasts", value: "2", change: "3 sent this week", icon: Bell, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-2xl p-6 shadow-sm text-white relative overflow-hidden", stat.bg)}>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/20 rounded-lg"><stat.icon className="w-6 h-6 text-white" /></div>
                <p className="text-lg font-medium text-white/90">{stat.label}</p>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-white/80">{stat.change}</p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <h2 className="font-semibold text-base mb-4">Recent Announcements</h2>
        <div className="space-y-3">
          {announcements.slice(0, 3).map(a => (
            <div key={a.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.dept} · {a.postedBy}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-xs text-muted-foreground">{a.date}</p>
                <p className="text-xs text-violet-600">{a.reads} reads</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Messages() {
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [input, setInput] = useState("");
  const [threads, setThreads] = useState(threadMessages);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setThreads(prev => ({
      ...prev,
      [activeConv.id]: [...(prev[activeConv.id] || []), { id: Date.now(), text: input.trim(), sent: true, time }],
    }));
    setInput("");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Messages</h1>
      <div className="flex gap-4 h-[560px] bg-card rounded-2xl border border-border overflow-hidden">
        {/* Conversation list */}
        <div className="w-72 shrink-0 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <input className="w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Search..." />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 border-b border-border text-left transition-colors",
                  activeConv.id === conv.id ? "bg-violet-50 dark:bg-violet-500/10" : "hover:bg-secondary/50"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{conv.name}</p>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{conv.dept}</p>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMsg}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center shrink-0">{conv.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {activeConv.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold">{activeConv.name}</p>
              <p className="text-xs text-muted-foreground">{activeConv.dept}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
            {(threads[activeConv.id] || []).map(msg => (
              <div key={msg.id} className={cn("flex", msg.sent ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-xs px-4 py-2.5 rounded-2xl text-sm",
                  msg.sent
                    ? "bg-violet-600 text-white rounded-br-sm"
                    : "bg-secondary text-foreground rounded-bl-sm"
                )}>
                  <p>{msg.text}</p>
                  <p className={cn("text-xs mt-1 text-right", msg.sent ? "text-violet-200" : "text-muted-foreground")}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border flex items-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              className="flex-1 bg-secondary rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Type a message..."
            />
            <button onClick={handleSend} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg p-2 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Announcements() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <button onClick={() => setShowCreate(true)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Announcement
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map(a => (
          <div key={a.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm">{a.title}</h3>
              <span className="px-2 py-0.5 bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400 text-xs rounded-full shrink-0 ml-2">{a.reads} reads</span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Target: {a.dept}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground">By {a.postedBy}</p>
              <p className="text-xs text-muted-foreground">{a.date}</p>
            </div>
          </div>
        ))}
      </div>
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCreate(false)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Announcement</h2>
              <button onClick={() => setShowCreate(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-muted-foreground">Title</label><input className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Announcement title" /></div>
              <div><label className="text-sm font-medium text-muted-foreground">Message</label><textarea rows={3} className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Message content..." /></div>
              <div><label className="text-sm font-medium text-muted-foreground">Target Departments</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["All", "Front Desk", "Housekeeping", "F&B", "Security", "Finance", "HR"].map(d => (
                    <button key={d} className="px-3 py-1 bg-secondary hover:bg-violet-100 hover:text-violet-700 text-xs rounded-full transition-colors">{d}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm bg-secondary rounded-lg hover:bg-secondary/80">Cancel</button>
              <button onClick={() => setShowCreate(false)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationLog() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Notification Log</h1>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Type</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Recipient</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Message</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Sent At</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {notificationLog.map((n, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3"><span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">{n.type}</span></td>
                <td className="px-4 py-3 font-medium">{n.recipient}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{n.message}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">{n.sentAt}</td>
                <td className="px-4 py-3"><span className={cn("px-3 py-1 rounded-full text-xs font-medium", getNotifStatus(n.status))}>{n.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Comms({ aiEnabled, activeSubmenu = "Overview" }: CommsProps) {
  return (
    <div className="space-y-6">
      {activeSubmenu === "Overview" && <CommsOverview />}
      {activeSubmenu === "Messages" && <Messages />}
      {activeSubmenu === "Announcements" && <Announcements />}
      {activeSubmenu === "Notification Log" && <NotificationLog />}
    </div>
  );
}
