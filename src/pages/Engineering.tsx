import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X,
  CheckCircle2,
  MoreVertical,
  User,
  Home,
  History,
  ArrowRight
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";

interface WorkOrder {
  id: string;
  title: string;
  location: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "To Do" | "In Progress" | "Waiting for Parts" | "Completed";
  assignedTo?: string;
  createdAt: string;
  hasGuest: boolean;
  description: string;
}

interface AssetHistory {
  id: string;
  date: string;
  action: string;
  technician: string;
  notes: string;
}

const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: "WO-101",
    title: "AC Unit Leaking",
    location: "Room 302",
    priority: "Critical",
    status: "In Progress",
    assignedTo: "Mike R.",
    createdAt: "2024-03-20 09:00",
    hasGuest: true,
    description: "Water dripping from the AC unit onto the carpet. Guest is in the room and very unhappy."
  },
  {
    id: "WO-102",
    title: "Light Bulb Replacement",
    location: "Room 405",
    priority: "Low",
    status: "To Do",
    createdAt: "2024-03-20 10:30",
    hasGuest: false,
    description: "Bathroom vanity light is flickering."
  },
  {
    id: "WO-103",
    title: "TV Remote Not Working",
    location: "Room 212",
    priority: "Medium",
    status: "Waiting for Parts",
    assignedTo: "Sarah K.",
    createdAt: "2024-03-19 14:20",
    hasGuest: true,
    description: "Remote buttons are unresponsive. Batteries replaced, still not working. Need new remote from stock."
  },
  {
    id: "WO-104",
    title: "Clogged Drain",
    location: "Room 118",
    priority: "High",
    status: "To Do",
    createdAt: "2024-03-20 08:15",
    hasGuest: false,
    description: "Shower drain is slow. Needs snaking."
  },
  {
    id: "WO-105",
    title: "Door Lock Battery Low",
    location: "Room 501",
    priority: "Medium",
    status: "Completed",
    assignedTo: "John D.",
    createdAt: "2024-03-19 09:00",
    hasGuest: false,
    description: "Battery alert received from IoT lock system."
  }
];

const ASSET_HISTORY_DATA: Record<string, AssetHistory[]> = {
  "Room 302": [
    { id: "H1", date: "2024-01-15", action: "AC Filter Clean", technician: "Mike R.", notes: "Routine maintenance." },
    { id: "H2", date: "2023-11-20", action: "Drain Unclogged", technician: "John D.", notes: "Bathroom sink." },
    { id: "H3", date: "2023-08-05", action: "AC Repair", technician: "Mike R.", notes: "Replaced capacitor." }
  ],
  "Room 405": [
    { id: "H4", date: "2024-02-10", action: "Paint Touch-up", technician: "Sarah K.", notes: "Near window." }
  ],
  "Room 212": [
    { id: "H5", date: "2024-03-01", action: "TV Setup", technician: "John D.", notes: "Re-tuned channels." }
  ]
};

interface EngineeringProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function Engineering({ aiEnabled, activeSubmenu }: EngineeringProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <EngineeringOverview />;
      case "Work Orders":
        return <WorkOrders />;
      case "Preventive Maintenance":
        return <PreventiveMaintenance />;
      case "Asset Management":
        return <AssetManagement />;
      case "Settings":

        return <EngineeringSettings />;

      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Engineering</h2>
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

function EngineeringOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Open Work Orders" 
          value="34" 
          change="12 high priority" 
          trend="up" 
          icon={Wrench} 
          color="amber" 
        />
        <KPICard 
          label="Avg Resolution Time" 
          value="2.4h" 
          change="-15m vs last week" 
          trend="down" 
          icon={Clock} 
          color="emerald" 
        />
        <KPICard 
          label="PM Completion" 
          value="92%" 
          change="+2% vs target" 
          trend="up" 
          icon={CheckCircle} 
          color="blue" 
        />
        <KPICard 
          label="Critical Alerts" 
          value="2" 
          change="HVAC System" 
          trend="neutral" 
          icon={AlertTriangle} 
          color="red" 
        />
      </div>
    </div>
  );
}

function WorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [isAddWOModalOpen, setIsAddWOModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const columns: WorkOrder["status"][] = ["To Do", "In Progress", "Waiting for Parts", "Completed"];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const moveTask = (id: string, newStatus: WorkOrder["status"]) => {
    setWorkOrders(prev => prev.map(wo => wo.id === id ? { ...wo, status: newStatus } : wo));
    showToast(`Work Order ${id} moved to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Engineering Kanban</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-red-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Urgent (Guest in Room)
            </span>
            <span className="flex items-center gap-1 text-muted-foreground font-medium">
              <span className="w-2 h-2 rounded-full bg-muted-foreground" /> Routine (Vacant)
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsAddWOModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Work Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-320px)] min-h-[500px]">
        {columns.map(column => (
          <div key={column} className="flex flex-col gap-3 bg-secondary/20 p-3 rounded-2xl border border-border/50">
            <div className="flex items-center justify-between px-2 py-1">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                {column}
                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full text-muted-foreground">
                  {workOrders.filter(wo => wo.status === column).length}
                </span>
              </h4>
              <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
              <AnimatePresence mode="popLayout">
                {workOrders
                  .filter(wo => wo.status === column)
                  .map(wo => (
                    <motion.div
                      key={wo.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        "bg-card p-4 rounded-xl border-l-4 shadow-sm group hover:shadow-md transition-all cursor-default",
                        wo.hasGuest ? "border-l-red-500" : "border-l-border",
                        "border-t border-r border-b border-border"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-muted-foreground">{wo.id}</span>
                        <div className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                          wo.priority === "Critical" ? "bg-red-100 text-red-700" :
                          wo.priority === "High" ? "bg-orange-100 text-orange-700" :
                          wo.priority === "Medium" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        )}>
                          {wo.priority}
                        </div>
                      </div>
                      
                      <h5 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {wo.title}
                      </h5>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Home className="w-3 h-3" />
                        <button 
                          onClick={() => setSelectedAsset(wo.location)}
                          className="hover:text-primary hover:underline flex items-center gap-1"
                        >
                          {wo.location}
                          <History className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          {wo.assignedTo ? (
                            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                              <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                <User className="w-3 h-3" />
                              </div>
                              {wo.assignedTo}
                            </div>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-medium italic">Unassigned</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {column !== "Completed" && (
                            <button 
                              onClick={() => moveTask(wo.id, columns[columns.indexOf(column) + 1])}
                              className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors"
                              title="Move to next stage"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAddWOModalOpen && (
          <AddWorkOrderModal 
            onClose={() => setIsAddWOModalOpen(false)} 
            onAdd={(wo) => {
              setWorkOrders(prev => [wo, ...prev]);
              showToast(`Work Order ${wo.id} created`);
            }}
          />
        )}
        {selectedAsset && (
          <AssetHistoryModal 
            assetId={selectedAsset} 
            onClose={() => setSelectedAsset(null)} 
          />
        )}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AssetHistoryModal({ assetId, onClose }: { assetId: string, onClose: () => void }) {
  const history = ASSET_HISTORY_DATA[assetId] || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Asset History: {assetId}
            </h3>
            <p className="text-xs text-muted-foreground">Maintenance logs and past work orders</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {history.length > 0 ? (
            <div className="space-y-6">
              {history.map((item, idx) => (
                <div key={item.id} className="relative pl-6 pb-6 border-l-2 border-border last:pb-0">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-card" />
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm">{item.action}</h4>
                    <span className="text-[10px] text-muted-foreground font-mono">{item.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{item.notes}</p>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-primary">
                    <User className="w-3 h-3" />
                    {item.technician}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No maintenance history found for this asset.</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddWorkOrderModal({ onClose, onAdd }: { onClose: () => void, onAdd: (wo: WorkOrder) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    priority: "Medium" as WorkOrder["priority"],
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWO: WorkOrder = {
      id: `WO-${Math.floor(Math.random() * 1000)}`,
      title: formData.title,
      location: formData.location,
      priority: formData.priority,
      status: "To Do",
      createdAt: new Date().toISOString().split('T')[0],
      hasGuest: false, // Default to false for new requests
      description: formData.description
    };
    onAdd(newWO);
    onClose();
  };

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
            <h3 className="text-lg font-bold text-foreground">Create Work Order</h3>
            <p className="text-sm text-muted-foreground">Report a maintenance issue.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="wo-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Issue Title <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="e.g. Broken AC in Room 302" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="e.g. Room 302" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select 
                  value={formData.priority}
                  onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" 
                  placeholder="Describe the issue in detail..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button 
            type="submit"
            form="wo-form"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Submit Work Order
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PreventiveMaintenance() {
  return (
    <div className="flex flex-col items-center justify-center h-[40vh] text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Preventive Maintenance</h2>
      <p className="text-muted-foreground">Manage PM schedules here.</p>
    </div>
  );
}

function AssetManagement() {
  return (
    <div className="flex flex-col items-center justify-center h-[40vh] text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Asset Management</h2>
      <p className="text-muted-foreground">Manage hotel assets here.</p>
    </div>
  );
}



function EngineeringSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Engineering Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for Engineering will be available here.</p>
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
