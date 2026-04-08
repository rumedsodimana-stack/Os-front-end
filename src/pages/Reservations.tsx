import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarCheck, Plus, Users, Clock, TrendingUp, X, CheckCircle2 } from "lucide-react";
import { KPICard } from "../components/ui/KPICard";

interface ReservationsProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function Reservations({ aiEnabled, activeSubmenu }: ReservationsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <ReservationsOverview />;
      case "Direct Bookings":
        return <DirectBookings />;
      case "Settings":

        return <ReservationsSettings />;

      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Reservations</h2>
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

function ReservationsOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Total Bookings" value="1,245" change="+12% vs last month" trend="up" icon={CalendarCheck} color="blue" />
        <KPICard label="Occupancy Rate" value="84%" change="+4% vs last year" trend="up" icon={TrendingUp} color="emerald" />
        <KPICard label="Group Blocks" value="12" change="Active" trend="neutral" icon={Users} color="purple" />
        <KPICard label="Waitlist" value="8" change="Pending requests" trend="neutral" icon={Clock} color="amber" />
      </div>
    </div>
  );
}

function DirectBookings() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Direct Bookings</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Booking
        </button>
      </div>
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          <p>No recent bookings found.</p>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && <AddBookingModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function AddBookingModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
          <h3 className="text-lg font-bold">New Reservation</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Guest Name</label>
              <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-in</label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-out</label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Type</label>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Standard Room</option>
                <option>Deluxe Room</option>
                <option>Suite</option>
                <option>Presidential Suite</option>
              </select>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary">Cancel</button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Book</button>
        </div>
      </motion.div>
    </motion.div>
  );
}


function ReservationsSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Reservations Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for Reservations will be available here.</p>
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
