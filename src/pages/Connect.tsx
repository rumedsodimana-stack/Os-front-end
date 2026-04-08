import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  CheckSquare, 
  ShieldCheck, 
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  History,
  User,
  Clock4
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";

interface ConnectProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function Connect({ aiEnabled, activeSubmenu }: ConnectProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <ConnectOverview />;
      case "Messaging":
        return <Messaging />;
      case "Approvals":
        return <Approvals />;
      case "Authorizations":
        return <Authorizations />;
      case "Notifications":
        return <Notifications />;
      case "Incident Log":
        return <IncidentLog />;
      case "Settings":

        return <ConnectSettings />;

      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Connect</h2>
            <h1 className="text-2xl font-bold text-foreground">{activeSubmenu}</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and view {activeSubmenu.toLowerCase()} information.</p>
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubmenu}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ConnectOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Unread Messages" 
          value="12" 
          change="3 urgent" 
          trend="up" 
          icon={MessageSquare} 
          color="blue" 
        />
        <KPICard 
          label="Pending Approvals" 
          value="5" 
          change="Requires action" 
          trend="neutral" 
          icon={CheckSquare} 
          color="amber" 
        />
        <KPICard 
          label="Active Auth Requests" 
          value="2" 
          change="System access" 
          trend="neutral" 
          icon={ShieldCheck} 
          color="purple" 
        />
        <KPICard 
          label="System Alerts" 
          value="0" 
          change="All clear" 
          trend="down" 
          icon={Bell} 
          color="emerald" 
        />
      </div>
    </div>
  );
}

function Messaging() {
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

  const messages = [
    { id: 1, sender: "Alice Smith", subject: "Shift Swap Request", time: "10:30 AM", unread: true },
    { id: 2, sender: "Bob Johnson", subject: "Maintenance Update - Room 402", time: "Yesterday", unread: false },
    { id: 3, sender: "System", subject: "Weekly Report Available", time: "Mon", unread: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Internal Messaging</h3>
        <button 
          onClick={() => setIsNewMessageModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Message
        </button>
      </div>
      
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {messages.map(msg => (
            <div key={msg.id} className={cn("p-4 flex items-center gap-4 hover:bg-secondary/50 cursor-pointer transition-colors", msg.unread && "bg-primary/5")}>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <span className="font-semibold text-sm">{msg.sender.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={cn("text-sm truncate", msg.unread ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>{msg.sender}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{msg.time}</span>
                </div>
                <p className={cn("text-sm truncate", msg.unread ? "font-semibold text-foreground" : "text-muted-foreground")}>{msg.subject}</p>
              </div>
              {msg.unread && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isNewMessageModalOpen && (
          <NewMessageModal onClose={() => setIsNewMessageModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function NewMessageModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 sticky top-0 z-20">
          <div>
            <h3 className="text-lg font-bold text-foreground">New Message</h3>
            <p className="text-sm text-muted-foreground">Send a message to a colleague or department.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">To <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search users or departments..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Message subject" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message <span className="text-red-500">*</span></label>
                <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[150px]" placeholder="Type your message here..."></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Send Message
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Approvals() {
  const approvals = [
    { id: "APP-001", type: "Purchase Order", requester: "Sarah Jenkins", amount: "$1,250.00", status: "Pending", date: "Today" },
    { id: "APP-002", type: "PTO Request", requester: "Mike Ross", amount: "3 Days", status: "Pending", date: "Yesterday" },
    { id: "APP-003", type: "Expense Report", requester: "Jessica Pearson", amount: "$450.00", status: "Approved", date: "Mon" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Pending Approvals</h3>
        <div className="flex gap-2">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Requester</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {approvals.map((app) => (
                <tr key={app.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{app.id}</td>
                  <td className="px-6 py-4">{app.type}</td>
                  <td className="px-6 py-4">{app.requester}</td>
                  <td className="px-6 py-4">{app.amount}</td>
                  <td className="px-6 py-4 text-muted-foreground">{app.date}</td>
                  <td className="px-6 py-4 text-right">
                    {app.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <button className="px-3 py-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded-lg transition-colors font-medium">Approve</button>
                        <button className="px-3 py-1 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg transition-colors font-medium">Reject</button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                        {app.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Authorizations() {
  const auths = [
    { id: "AUTH-101", user: "David Lee", system: "PMS Access", level: "Manager", status: "Active" },
    { id: "AUTH-102", user: "Emma Watson", system: "POS System", level: "Staff", status: "Pending Review" },
    { id: "AUTH-103", user: "James Bond", system: "Security Cameras", level: "Admin", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">System Authorizations</h3>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Authorization
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auths.map(auth => (
          <div key={auth.id} className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {auth.user.charAt(0)}
              </div>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                auth.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
              )}>
                {auth.status}
              </span>
            </div>
            <h4 className="font-bold text-foreground mb-1">{auth.user}</h4>
            <p className="text-sm text-muted-foreground mb-4">{auth.system} • {auth.level}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-sm font-medium transition-colors">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl text-sm font-medium transition-colors">
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Notifications() {
  const notifs = [
    { id: 1, title: "System Update Scheduled", desc: "PMS will be down for maintenance on Sunday at 2 AM.", time: "2 hours ago", type: "system" },
    { id: 2, title: "New Policy Document", desc: "Please review the updated employee handbook.", time: "5 hours ago", type: "hr" },
    { id: 3, title: "VIP Arrival Alert", desc: "Mr. Smith (Room 501) is arriving in 30 minutes.", time: "Yesterday", type: "alert" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Notifications History</h3>
        <button className="text-sm text-primary hover:underline font-medium">
          Mark all as read
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {notifs.map(notif => (
            <div key={notif.id} className="p-5 hover:bg-secondary/30 transition-colors flex gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                notif.type === "system" ? "bg-blue-500/10 text-blue-600" :
                notif.type === "hr" ? "bg-purple-500/10 text-purple-600" :
                "bg-amber-500/10 text-amber-600"
              )}>
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{notif.title}</h4>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{notif.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IncidentLog() {
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);

  const incidents = [
    { id: "INC-2024-001", type: "Noise Complaint", location: "Room 304", reporter: "Housekeeping", time: "10:15 PM", status: "Resolved", severity: "Low" },
    { id: "INC-2024-002", type: "Water Leak", location: "Lobby Bathroom", reporter: "Guest", time: "08:45 AM", status: "In Progress", severity: "Medium" },
    { id: "INC-2024-003", type: "Medical Emergency", location: "Gym", reporter: "Security", time: "Yesterday", status: "Resolved", severity: "High" },
    { id: "INC-2024-004", type: "Lost Item", location: "Restaurant", reporter: "Guest", time: "Mon", status: "Pending", severity: "Low" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Incident Log</h3>
        <button 
          onClick={() => setIsNewIncidentModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Log Incident
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Reporter</th>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{inc.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn(
                        "w-4 h-4",
                        inc.severity === "High" ? "text-red-500" :
                        inc.severity === "Medium" ? "text-amber-500" :
                        "text-blue-500"
                      )} />
                      {inc.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">{inc.location}</td>
                  <td className="px-6 py-4">{inc.reporter}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      inc.severity === "High" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                      inc.severity === "Medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                      "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                    )}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      inc.status === "Resolved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                      inc.status === "In Progress" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{inc.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isNewIncidentModalOpen && (
          <NewIncidentModal onClose={() => setIsNewIncidentModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function NewIncidentModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-card w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 sticky top-0 z-20">
          <div>
            <h3 className="text-lg font-bold text-foreground">Log New Incident</h3>
            <p className="text-sm text-muted-foreground">Record a comprehensive security or operational incident report.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            {/* Basic Details */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Basic Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Incident Type <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Noise Complaint</option>
                    <option>Water Leak / Maintenance</option>
                    <option>Medical Emergency</option>
                    <option>Lost Item</option>
                    <option>Security Breach</option>
                    <option>Guest Conflict</option>
                    <option>Theft / Vandalism</option>
                    <option>Fire Alarm</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Severity <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date & Time of Incident <span className="text-red-500">*</span></label>
                  <input type="datetime-local" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Exact Location <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Room 304, Main Lobby near elevators" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reported By (Name/Dept)</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. John Doe, Housekeeping" />
                </div>
              </div>
            </div>

            {/* Involved Parties */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Involved Parties</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guest(s) Involved</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Guest names and room numbers" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Staff Involved</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Staff names and departments" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Witnesses (Names & Contact Info)</label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" placeholder="List any witnesses and how to contact them..."></textarea>
                </div>
              </div>
            </div>

            {/* Incident Description */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Incident Description</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Detailed Description <span className="text-red-500">*</span></label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]" placeholder="Provide a thorough, objective account of what happened..."></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sequence of Events</label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Chronological timeline of events leading up to and during the incident..."></textarea>
                </div>
              </div>
            </div>

            {/* Response & Actions */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Response & Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Immediate Actions Taken <span className="text-red-500">*</span></label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" placeholder="What was done immediately to address the situation?"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Emergency Services Contacted?</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-sm">Police</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-sm">Ambulance</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-sm">Fire Dept</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Official Report / Case Number</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Police Report #12345" />
                </div>
              </div>
            </div>

            {/* Media & Follow-up */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Evidence & Follow-up</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">CCTV Footage Reviewed?</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>No</option>
                    <option>Yes - Footage Saved</option>
                    <option>Yes - No Relevant Footage</option>
                    <option>Pending Review</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Attach Photos/Evidence</label>
                  <input type="file" multiple className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assigned To (Follow-up)</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Security Manager</option>
                    <option>General Manager</option>
                    <option>Duty Manager</option>
                    <option>HR Department</option>
                    <option>Engineering</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Resolution Date</label>
                  <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Submit Incident Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


function ConnectSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Connect Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for Connect will be available here.</p>
          </div>
        </div>
        <div className="p-6 border-t border-border bg-secondary/30 flex justify-end">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function GenericView({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">{title}</h3>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          <p>No {title.toLowerCase()} records found.</p>
        </div>
      </div>
    </div>
  );
}
