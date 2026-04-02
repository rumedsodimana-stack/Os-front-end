import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Shield, Eye, AlertTriangle, CheckCircle2, Clock, Search, Plus,
  Download, Edit2, Phone, Car, Key, Users, FileText, Bell,
  Camera, Lock, Unlock, RefreshCw, XCircle, Activity, MapPin,
} from "lucide-react";
import { cn } from "../lib/utils";

interface SecurityProps { aiEnabled: boolean; activeSubmenu?: string; }

interface SecurityIncident {
  id: string; type: string; location: string; reportedBy: string;
  description: string; date: string; time: string;
  status: "Open" | "Investigating" | "Resolved" | "Closed";
  severity: "Low" | "Medium" | "High" | "Critical";
}

interface Visitor {
  id: string; name: string; company: string; purpose: string;
  hostEmployee: string; checkIn: string; checkOut: string;
  idType: string; idNo: string; vehiclePlate: string;
  status: "In" | "Out" | "Overstay";
}

interface KeyRecord {
  id: string; keyType: string; keyCode: string; room: string;
  issuedTo: string; issuedAt: string; returnedAt: string;
  status: "Issued" | "Returned" | "Lost" | "Deactivated";
}

interface PatrolLog {
  id: string; officer: string; zone: string; checkTime: string;
  date: string; status: "Completed" | "Missed" | "Delayed"; notes: string;
}

const incidents: SecurityIncident[] = [
  { id: "INC001", type: "Noise Complaint", location: "Floor 3 Corridor", reportedBy: "Ahmed Al-Mansouri", description: "Loud music from room 312 at 01:30 AM. Guest warned twice.", date: "2026-04-02", time: "01:30", status: "Resolved", severity: "Low" },
  { id: "INC002", type: "Suspicious Person", location: "Lobby", reportedBy: "Hassan Farouk", description: "Unknown male loitering in lobby for 45 minutes. Escorted out politely.", date: "2026-04-01", time: "22:15", status: "Closed", severity: "Medium" },
  { id: "INC003", type: "Lost Key Card", location: "Room 215", reportedBy: "James Harrington", description: "Guest reports losing key card. Deactivated and reissued.", date: "2026-04-02", time: "09:05", status: "Resolved", severity: "Low" },
  { id: "INC004", type: "Medical Emergency", location: "Pool Area", reportedBy: "Hassan Farouk", description: "Guest fainted near pool. First aid administered. Ambulance called.", date: "2026-04-01", time: "15:40", status: "Closed", severity: "High" },
  { id: "INC005", type: "Theft Suspicion", location: "Room 405", reportedBy: "Sarah Al-Rashid", description: "Guest reports missing jewelry from room safe. CCTV review in progress.", date: "2026-04-02", time: "11:20", status: "Investigating", severity: "High" },
  { id: "INC006", type: "Fire Alarm", location: "Kitchen B2", reportedBy: "System", description: "False alarm triggered by steam from dishwasher. Reset after inspection.", date: "2026-04-02", time: "07:10", status: "Closed", severity: "Medium" },
];

const visitors: Visitor[] = [
  { id: "V001", name: "Tariq Al-Zain", company: "BAPCO", purpose: "Business Meeting", hostEmployee: "Elena Marchetti", checkIn: "09:30", checkOut: "11:15", idType: "CPR", idNo: "890123456", vehiclePlate: "BH 1234", status: "Out" },
  { id: "V002", name: "Dr. Nadia Hasan", company: "Bahrain Medical Society", purpose: "Site Inspection", hostEmployee: "Sarah Mitchell", checkIn: "10:00", checkOut: "", idType: "Passport", idNo: "P1234567", vehiclePlate: "", status: "In" },
  { id: "V003", name: "Ali Hassan", company: "GCC Contractors", purpose: "Engineering Work", hostEmployee: "Mohammed Al-Rashid", checkIn: "08:00", checkOut: "", idType: "CPR", idNo: "780987654", vehiclePlate: "BH 5678", status: "In" },
  { id: "V004", name: "Lisa Wong", company: "Booking.com", purpose: "Property Review", hostEmployee: "Ahmed Al-Mansouri", checkIn: "14:00", checkOut: "", idType: "Passport", idNo: "X8765432", vehiclePlate: "BH 9012", status: "Overstay" },
];

const keyRecords: KeyRecord[] = [
  { id: "K001", keyType: "Master Key", keyCode: "MK-001", room: "All", issuedTo: "Ling Wei", issuedAt: "07:00", returnedAt: "", status: "Issued" },
  { id: "K002", keyType: "Floor Master", keyCode: "FM-03", room: "Floor 3", issuedTo: "Sunita Rao", issuedAt: "07:00", returnedAt: "15:10", status: "Returned" },
  { id: "K003", keyType: "Guest Key", keyCode: "GK-215-A", room: "215", issuedTo: "James Harrington", issuedAt: "14:00", returnedAt: "", status: "Issued" },
  { id: "K004", keyType: "Guest Key", keyCode: "GK-215-B", room: "215", issuedTo: "James Harrington", issuedAt: "09:05", returnedAt: "09:05", status: "Deactivated" },
  { id: "K005", keyType: "Guest Key", keyCode: "GK-501-A", room: "501", issuedTo: "Elena Marchetti", issuedAt: "14:00", returnedAt: "", status: "Issued" },
  { id: "K006", keyType: "Engineering Key", keyCode: "EK-HVAC", room: "HVAC Rooms", issuedTo: "Mohammed Al-Rashid", issuedAt: "08:00", returnedAt: "", status: "Issued" },
];

const patrols: PatrolLog[] = [
  { id: "PT001", officer: "Hassan Farouk", zone: "All Floors", checkTime: "23:00", date: "2026-04-01", status: "Completed", notes: "" },
  { id: "PT002", officer: "Hassan Farouk", zone: "Parking & Perimeter", checkTime: "23:30", date: "2026-04-01", status: "Completed", notes: "" },
  { id: "PT003", officer: "Omar Saleh", zone: "Pool & Gym Area", checkTime: "00:00", date: "2026-04-02", status: "Completed", notes: "Ensured pool area locked." },
  { id: "PT004", officer: "Omar Saleh", zone: "All Floors", checkTime: "01:00", date: "2026-04-02", status: "Delayed", notes: "Delayed 15 mins — noise complaint handling." },
  { id: "PT005", officer: "Omar Saleh", zone: "Lobby & Entrances", checkTime: "02:00", date: "2026-04-02", status: "Completed", notes: "" },
  { id: "PT006", officer: "Omar Saleh", zone: "Back-of-house", checkTime: "03:00", date: "2026-04-02", status: "Missed", notes: "Not completed — radio malfunction." },
];

const getSeverityColor = (s: SecurityIncident["severity"]) => {
  switch (s) {
    case "Critical": return "bg-red-600 text-white";
    case "High": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "Medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "Low": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  }
};

export function Security({ aiEnabled, activeSubmenu = "Overview" }: SecurityProps) {
  const [incidentFilter, setIncidentFilter] = useState("All");
  const [visitorSearch, setVisitorSearch] = useState("");

  return (
    <div className="p-6 space-y-6">
      <AnimatePresence mode="wait">
        {activeSubmenu === "Overview" && (
          <motion.div key="Overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Security</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Live security operations — {new Date().toLocaleDateString("en-GB")}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Log Incident</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Incidents", value: incidents.filter(i => i.status === "Open" || i.status === "Investigating").length, icon: AlertTriangle, color: "from-red-400 to-red-500" },
                { label: "Visitors In-House", value: visitors.filter(v => v.status === "In" || v.status === "Overstay").length, icon: Users, color: "from-blue-400 to-blue-500" },
                { label: "Keys Outstanding", value: keyRecords.filter(k => k.status === "Issued").length, icon: Key, color: "from-amber-400 to-amber-500" },
                { label: "Patrols Today", value: patrols.filter(p => p.status === "Completed").length, icon: Shield, color: "from-emerald-400 to-emerald-500" },
              ].map(c => (
                <div key={c.label} className={`bg-gradient-to-r ${c.color} rounded-2xl p-4 text-white relative overflow-hidden`}>
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                  <div className="bg-white/20 rounded-lg w-8 h-8 flex items-center justify-center mb-2"><c.icon className="w-4 h-4 text-white" /></div>
                  <p className="text-2xl font-bold">{c.value}</p>
                  <p className="text-white/80 text-xs">{c.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Incidents */}
            <div className="bg-card rounded-2xl shadow-sm border border-border">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Recent Incidents</h3>
                <span className="text-xs text-muted-foreground">{incidents.filter(i => i.status === "Open" || i.status === "Investigating").length} active</span>
              </div>
              <div className="divide-y divide-border/50">
                {incidents.slice(0, 5).map(inc => (
                  <div key={inc.id} className="px-6 py-4 flex items-start gap-4 hover:bg-secondary/30 transition-colors">
                    <div className={cn("flex-shrink-0 w-2 h-2 rounded-full mt-2", inc.severity === "High" || inc.severity === "Critical" ? "bg-red-500" : inc.severity === "Medium" ? "bg-amber-500" : "bg-emerald-500")} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-foreground text-sm">{inc.type}</span>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getSeverityColor(inc.severity))}>{inc.severity}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{inc.location} · {inc.date} {inc.time}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{inc.description}</p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0", inc.status === "Resolved" || inc.status === "Closed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : inc.status === "Investigating" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>{inc.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Visitors */}
            <div className="bg-card rounded-2xl shadow-sm border border-border">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Visitors Currently On-Site</h3>
              </div>
              <div className="divide-y divide-border/50">
                {visitors.filter(v => v.status === "In" || v.status === "Overstay").map(vis => (
                  <div key={vis.id} className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors flex-wrap">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{vis.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{vis.name}</p>
                      <p className="text-xs text-muted-foreground">{vis.company} · {vis.purpose}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">In: {vis.checkIn}</span>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", vis.status === "Overstay" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400")}>{vis.status}</span>
                    <button className="px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary/50 transition-colors flex-shrink-0">Check Out</button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeSubmenu === "Incidents" && (
          <motion.div key="Incidents" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold text-foreground">Incident Log</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Log Incident</button>
            </div>
            <div className="flex gap-2">
              {["All", "Open", "Investigating", "Resolved", "Closed"].map(f => (
                <button key={f} onClick={() => setIncidentFilter(f)} className={cn("px-3 py-2 rounded-xl text-sm font-medium transition-colors", incidentFilter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-secondary/50")}>{f}</button>
              ))}
            </div>
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-secondary/50">
                  <tr>{["Ref", "Type", "Location", "Date/Time", "Reported By", "Severity", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {incidents.filter(i => incidentFilter === "All" || i.status === incidentFilter).map(inc => (
                    <tr key={inc.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{inc.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground text-sm">{inc.type}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{inc.location}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{inc.date} {inc.time}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{inc.reportedBy}</td>
                      <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getSeverityColor(inc.severity))}>{inc.severity}</span></td>
                      <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", inc.status === "Resolved" || inc.status === "Closed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : inc.status === "Investigating" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>{inc.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeSubmenu === "Visitor Management" && (
          <motion.div key="Visitor Management" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold text-foreground">Visitor Management</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Register Visitor</button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={visitorSearch} onChange={e => setVisitorSearch(e.target.value)} placeholder="Search visitor, company…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-secondary/50">
                  <tr>{["Name", "Company", "Purpose", "Host", "Check-In", "Check-Out", "ID", "Plate", "Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {visitors.filter(v => !visitorSearch || v.name.toLowerCase().includes(visitorSearch.toLowerCase()) || v.company.toLowerCase().includes(visitorSearch.toLowerCase())).map(vis => (
                    <tr key={vis.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground text-sm">{vis.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{vis.company}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{vis.purpose}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{vis.hostEmployee}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{vis.checkIn}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{vis.checkOut || "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{vis.idType}: {vis.idNo}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{vis.vehiclePlate || "—"}</td>
                      <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", vis.status === "In" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : vis.status === "Overstay" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400")}>{vis.status}</span></td>
                      <td className="px-4 py-3">
                        {vis.status === "In" && <button className="px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground text-xs hover:bg-secondary/80 transition-colors">Check Out</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeSubmenu === "Key Management" && (
          <motion.div key="Key Management" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold text-foreground">Key Management</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Issue Key</button>
            </div>
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-secondary/50">
                  <tr>{["Key Code", "Type", "Room/Area", "Issued To", "Issued At", "Returned At", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {keyRecords.map(k => (
                    <tr key={k.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{k.keyCode}</td>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">{k.keyType}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{k.room}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{k.issuedTo}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{k.issuedAt}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{k.returnedAt || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", k.status === "Issued" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : k.status === "Returned" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : k.status === "Lost" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")}>{k.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeSubmenu === "Patrol Log" && (
          <motion.div key="Patrol Log" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold text-foreground">Patrol & Checkpoint Log</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Add Patrol</button>
            </div>
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>{["Officer", "Zone", "Scheduled Time", "Date", "Status", "Notes"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {patrols.map(p => (
                    <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground text-sm">{p.officer}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.zone}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.checkTime}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.date}</td>
                      <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", p.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : p.status === "Delayed" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>{p.status}</span></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">{p.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
