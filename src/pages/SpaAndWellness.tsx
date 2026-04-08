import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { 
  Flower2, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Bed, 
  Users, 
  Clock,
  X,
  CheckCircle2
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";

interface SpaAndWellnessProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function SpaAndWellness({ aiEnabled, activeSubmenu }: SpaAndWellnessProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <SpaOverview />;
      case "Appointments":
        return <Appointments />;
      case "Treatment Rooms":
        return <TreatmentRooms />;
      case "Memberships":
        return <Memberships />;
      case "Settings":

        return <SpaAndWellnessSettings />;

      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Spa & Wellness</h2>
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

function SpaOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Today's Appointments" 
          value="24" 
          change="8 remaining" 
          trend="up" 
          icon={Calendar} 
          color="blue" 
        />
        <KPICard 
          label="Room Utilization" 
          value="85%" 
          change="+5% vs last week" 
          trend="up" 
          icon={Bed} 
          color="emerald" 
        />
        <KPICard 
          label="Active Memberships" 
          value="156" 
          change="+12 this month" 
          trend="up" 
          icon={Users} 
          color="purple" 
        />
        <KPICard 
          label="Avg Treatment Time" 
          value="65m" 
          change="On target" 
          trend="neutral" 
          icon={Clock} 
          color="amber" 
        />
      </div>
    </div>
  );
}

function Appointments() {
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Spa Appointments</h3>
        <button 
          onClick={() => setIsAddAppointmentModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Appointment
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center h-[30vh] text-center border border-dashed border-border rounded-2xl">
        <p className="text-muted-foreground">Appointments calendar will appear here.</p>
      </div>

      <AnimatePresence>
        {isAddAppointmentModalOpen && (
          <AddAppointmentModal onClose={() => setIsAddAppointmentModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddAppointmentModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">New Spa Appointment</h3>
            <p className="text-sm text-muted-foreground">Schedule a treatment for a guest.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Guest Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search guest or enter name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Treatment Type <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Swedish Massage (60m)</option>
                  <option>Deep Tissue Massage (90m)</option>
                  <option>Facial Rejuvenation (60m)</option>
                  <option>Hot Stone Therapy (90m)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Therapist</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Any Available</option>
                  <option>Sarah Jenkins</option>
                  <option>Michael Chen</option>
                  <option>Emma Watson</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time <span className="text-red-500">*</span></label>
                <input type="time" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Special Requests / Health Notes</label>
                <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Enter any allergies, injuries, or preferences..."></textarea>
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
            Book Appointment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TreatmentRooms() {
  return (
    <div className="flex flex-col items-center justify-center h-[40vh] text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Treatment Rooms</h2>
      <p className="text-muted-foreground">Manage room availability here.</p>
    </div>
  );
}

function Memberships() {
  return (
    <div className="flex flex-col items-center justify-center h-[40vh] text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Memberships</h2>
      <p className="text-muted-foreground">Manage spa memberships here.</p>
    </div>
  );
}



function SpaAndWellnessSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Spa And Wellness Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for SpaAndWellness will be available here.</p>
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
