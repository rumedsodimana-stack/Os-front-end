import React, { useState } from "react";
import { Shield, AlertTriangle, Key, Users, Clock, Lock, Plus, X } from "lucide-react";
import { cn } from "../lib/utils";

interface SecurityProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

const getIncidentStatus = (status: string) => {
  switch (status) {
    case "Open": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    case "Under Investigation": return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    case "Resolved": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Closed": return "bg-secondary text-secondary-foreground";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const getPriorityBadge = (p: string) => {
  switch (p) {
    case "Critical": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    case "High": return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400";
    case "Medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const getKeyCardStatus = (s: string) => {
  switch (s) {
    case "Active": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Returned": return "bg-secondary text-secondary-foreground";
    case "Lost": return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    case "Expired": return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const incidents = [
  { id: "INC-2026-041", type: "Disturbance", location: "Floor 3 Corridor", reportedBy: "Jose Rivera", datetime: "2026-03-31 22:14", status: "Under Investigation", priority: "High" },
  { id: "INC-2026-040", type: "Lost Property", location: "Lobby", reportedBy: "Front Desk", datetime: "2026-03-31 14:30", status: "Open", priority: "Low" },
  { id: "INC-2026-039", type: "Medical", location: "Room 208", reportedBy: "Housekeeping", datetime: "2026-03-30 09:45", status: "Resolved", priority: "Critical" },
  { id: "INC-2026-038", type: "Theft", location: "Parking Garage", reportedBy: "Guest — Amara Osei", datetime: "2026-03-29 18:20", status: "Under Investigation", priority: "High" },
  { id: "INC-2026-037", type: "Fire", location: "Kitchen B2", reportedBy: "Chef Moto", datetime: "2026-03-28 11:00", status: "Closed", priority: "Critical" },
  { id: "INC-2026-036", type: "Other", location: "Spa Level", reportedBy: "Sarah Kim", datetime: "2026-03-27 16:00", status: "Resolved", priority: "Medium" },
];

const accessLog = [
  { timestamp: "2026-03-31 23:58", door: "Server Room", person: "IT Admin", action: "Entry", method: "Biometric" },
  { timestamp: "2026-03-31 23:45", door: "Main Entrance", person: "James Whitfield (Guest)", action: "Entry", method: "Key Card" },
  { timestamp: "2026-03-31 22:30", door: "Floor 3 Fire Exit", person: "Unknown", action: "Denied", method: "Key Card" },
  { timestamp: "2026-03-31 22:15", door: "Staff Room B1", person: "Jose Rivera", action: "Entry", method: "PIN" },
  { timestamp: "2026-03-31 21:00", door: "Finance Office", person: "Maria Santos", action: "Exit", method: "Key Card" },
  { timestamp: "2026-03-31 20:30", door: "Kitchen B2", person: "Chef Moto", action: "Entry", method: "Key Card" },
];

const keyCards = [
  { id: "KC-00812", room: "501", guest: "James Whitfield", issuedAt: "2026-03-29 14:00", expiresAt: "2026-04-02 12:00", status: "Active" },
  { id: "KC-00811", room: "302", guest: "Amara Osei", issuedAt: "2026-03-28 15:30", expiresAt: "2026-04-01 12:00", status: "Active" },
  { id: "KC-00810", room: "204", guest: "Sophie Laurent", issuedAt: "2026-03-25 13:00", expiresAt: "2026-03-30 11:00", status: "Expired" },
  { id: "KC-00809", room: "107", guest: "Carlos Mendez", issuedAt: "2026-03-20 12:00", expiresAt: "2026-03-25 12:00", status: "Returned" },
  { id: "KC-00808", room: "410", guest: "Omar Al-Rashid", issuedAt: "2026-03-29 16:00", expiresAt: "2026-04-03 12:00", status: "Active" },
  { id: "KC-00807", room: "205", guest: "Priya Sharma", issuedAt: "2026-03-18 11:00", expiresAt: "2026-03-22 12:00", status: "Lost" },
];

const handovers = [
  { shift: "Night", date: "2026-03-31", submittedBy: "Officer Diaz", notes: "2 incidents logged. Extra patrol on Floor 3 requested.", acknowledged: true },
  { shift: "Evening", date: "2026-03-31", submittedBy: "Officer Park", notes: "All clear. Key card KC-00807 reported lost.", acknowledged: true },
  { shift: "Morning", date: "2026-03-31", submittedBy: "Officer Chen", notes: "Routine. Kitchen fire alarm tested — passed.", acknowledged: true },
];

const recentIncidents = [
  { time: "22:14", desc: "Noise complaint — Floor 3", priority: "High" },
  { time: "14:30", desc: "Lost item reported — Guest laptop in Lobby", priority: "Low" },
  { time: "09:45 (yesterday)", desc: "Medical emergency — Room 208, paramedics called", priority: "Critical" },
];

function SecurityOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Security Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Open Incidents", value: "2", change: "1 high priority", icon: AlertTriangle, bg: "bg-gradient-to-r from-red-400 to-red-500" },
          { label: "Key Cards Issued", value: "38", change: "3 issued today", icon: Key, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
          { label: "Shifts Today", value: "3", change: "All acknowledged", icon: Users, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
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
        <h2 className="font-semibold text-base mb-4">Recent Incidents</h2>
        <div className="space-y-3">
          {recentIncidents.map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium shrink-0 mt-0.5", getPriorityBadge(item.priority))}>{item.priority}</span>
              <p className="text-sm flex-1">{item.desc}</p>
              <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Incidents() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: "Disturbance", location: "", reportedBy: "", priority: "Medium" });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Incidents</h1>
        <button onClick={() => setShowModal(true)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Log Incident
        </button>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">ID</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Type</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Location</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Reported By</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Date/Time</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Priority</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-xs text-violet-600">{inc.id}</td>
                <td className="px-4 py-3 font-medium">{inc.type}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{inc.location}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{inc.reportedBy}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{inc.datetime}</td>
                <td className="px-4 py-3"><span className={cn("px-3 py-1 rounded-full text-xs font-medium", getIncidentStatus(inc.status))}>{inc.status}</span></td>
                <td className="px-4 py-3"><span className={cn("px-3 py-1 rounded-full text-xs font-medium", getPriorityBadge(inc.priority))}>{inc.priority}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Log Incident</h2>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-muted-foreground">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                  {["Theft", "Disturbance", "Medical", "Fire", "Lost Property", "Other"].map(t => <option key={t}>{t}</option>)}
                </select></div>
              <div><label className="text-sm font-medium text-muted-foreground">Location</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Floor 3 Corridor" /></div>
              <div><label className="text-sm font-medium text-muted-foreground">Reported By</label><input value={form.reportedBy} onChange={e => setForm({ ...form, reportedBy: e.target.value })} className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Name" /></div>
              <div><label className="text-sm font-medium text-muted-foreground">Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                  {["Low", "Medium", "High", "Critical"].map(p => <option key={p}>{p}</option>)}
                </select></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-secondary rounded-lg hover:bg-secondary/80">Cancel</button>
              <button onClick={() => setShowModal(false)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AccessLog() {
  const [search, setSearch] = useState("");
  const filtered = accessLog.filter(e =>
    e.person.toLowerCase().includes(search.toLowerCase()) ||
    e.door.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Access Log</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring w-52" placeholder="Search..." />
            <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          <input type="date" className="bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-2 rounded-lg"><Lock className="w-3.5 h-3.5" /><span>Read-only</span></div>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Timestamp</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Door / Area</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Person</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Action</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Method</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.timestamp}</td>
                <td className="px-4 py-3 font-medium">{e.door}</td>
                <td className="px-4 py-3">{e.person}</td>
                <td className="px-4 py-3">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium",
                    e.action === "Entry" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                    e.action === "Denied" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                    "bg-secondary text-secondary-foreground"
                  )}>{e.action}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{e.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KeyCards() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Key Cards</h1>
        <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Issue Card
        </button>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Card ID</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Room</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Guest</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Issued At</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Expires At</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {keyCards.map((kc, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-xs text-violet-600">{kc.id}</td>
                <td className="px-4 py-3 font-medium">{kc.room}</td>
                <td className="px-4 py-3">{kc.guest}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{kc.issuedAt}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{kc.expiresAt}</td>
                <td className="px-4 py-3"><span className={cn("px-3 py-1 rounded-full text-xs font-medium", getKeyCardStatus(kc.status))}>{kc.status}</span></td>
                <td className="px-4 py-3">
                  {kc.status === "Active" && (
                    <button className="text-xs px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors">Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ShiftHandover() {
  const [notes, setNotes] = useState("");
  const [shift, setShift] = useState("Morning");
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Shift Handover</h1>
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6 max-w-xl">
        <h2 className="font-semibold text-base mb-4">Submit Handover Notes</h2>
        <div className="space-y-4">
          <div><label className="text-sm font-medium text-muted-foreground">Shift</label>
            <select value={shift} onChange={e => setShift(e.target.value)} className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
              {["Morning", "Evening", "Night"].map(s => <option key={s}>{s}</option>)}
            </select></div>
          <div><label className="text-sm font-medium text-muted-foreground">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Summarize incidents, concerns, or items to watch..." /></div>
          <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium">Submit Handover</button>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <div className="bg-secondary/50 px-4 py-3"><h2 className="font-semibold text-sm">Past Handovers</h2></div>
        {handovers.map((h, i) => (
          <div key={i} className="px-4 py-4 border-t border-border">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{h.shift} Shift — {h.date}</span>
                {h.acknowledged && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">Acknowledged</span>}
              </div>
              <span className="text-xs text-muted-foreground">{h.submittedBy}</span>
            </div>
            <p className="text-sm text-muted-foreground">{h.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Security({ aiEnabled, activeSubmenu = "Overview" }: SecurityProps) {
  return (
    <div className="space-y-6">
      {activeSubmenu === "Overview" && <SecurityOverview />}
      {activeSubmenu === "Incidents" && <Incidents />}
      {activeSubmenu === "Access Log" && <AccessLog />}
      {activeSubmenu === "Key Cards" && <KeyCards />}
      {activeSubmenu === "Shift Handover" && <ShiftHandover />}
    </div>
  );
}
