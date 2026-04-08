import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Plus, Server, Wifi, HardDrive, X, CheckCircle2 } from "lucide-react";
import { KPICard } from "../components/ui/KPICard";

interface ITAndSystemsProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function ITAndSystems({ aiEnabled, activeSubmenu }: ITAndSystemsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <ITOverview />;
      case "Support Tickets":
        return <SupportTickets />;
      case "Settings":

        return <ITAndSystemsSettings />;

      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">IT & Systems</h2>
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

function ITOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Network Uptime" value="99.99%" change="Optimal" trend="neutral" icon={Wifi} color="emerald" />
        <KPICard label="Open Tickets" value="24" change="-5 vs yesterday" trend="down" icon={Server} color="blue" />
        <KPICard label="Server Load" value="42%" change="Normal" trend="neutral" icon={Cpu} color="purple" />
        <KPICard label="Storage Used" value="68%" change="+2% this week" trend="up" icon={HardDrive} color="amber" />
      </div>
    </div>
  );
}

function SupportTickets() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Support Tickets</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          <p>No open tickets found.</p>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && <AddTicketModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function AddTicketModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
          <h3 className="text-lg font-bold">Create Support Ticket</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Issue Category</label>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Hardware</option>
                <option>Software</option>
                <option>Network</option>
                <option>Access/Permissions</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Describe the issue..."></textarea>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary">Cancel</button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Submit</button>
        </div>
      </motion.div>
    </motion.div>
  );
}


function ITAndSystemsSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">I T And Systems Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for ITAndSystems will be available here.</p>
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
