import React, { useMemo, useState } from "react";
import { Sparkles, Bed, Brush, AlertTriangle, CheckCircle, Thermometer, Droplets, Search, Filter, Plus, Package, Search as SearchIcon, MapPin, Calendar, Clock, User, Wrench, Bell, X } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { KPICard } from "../components/ui/KPICard";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { useRooms, Room, RoomStatus as RoomStatusType, HKStatus } from "../context/RoomContext";

interface HousekeepingProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function Housekeeping({ aiEnabled, activeSubmenu }: HousekeepingProps) {
  const { loading } = useRooms();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <HousekeepingOverview aiEnabled={aiEnabled} />;
      case "Room Status":
        return <RoomStatus />;
      case "Task List":
        return <TaskList />;
      case "Lost & Found":
        return <LostAndFound />;
      case "Inventory":
        return <Inventory />;
      case "Settings":
        return <HousekeepingSettings />;
      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Housekeeping</h2>
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
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HousekeepingOverview({ aiEnabled }: { aiEnabled: boolean }) {
  const { rooms } = useRooms();
  const [actions, setActions] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const handleAction = (id: string, message: string) => {
    setActions(prev => ({ ...prev, [id]: true }));
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const dirtyCount = rooms.filter(r => r.hkStatus === "Dirty").length;
  const cleanCount = rooms.filter(r => r.hkStatus === "Clean" || r.hkStatus === "Inspected").length;
  const oosCount = rooms.filter(r => r.status === "OOS").length;
  const occupiedCount = rooms.filter(r => r.status !== "Vacant").length;

  return (
    <div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-6">
        <div className="flex justify-end">
          <div className="flex gap-2">
            <button onClick={() => handleAction("assign", "Rooms assigned to staff automatically")} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Assign Rooms
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* AI Suggestions Panel */}
        {aiEnabled && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-primary" />
            </div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-primary/20 p-2 rounded-full mt-1">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Agentic AI Insights</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  I've analyzed IoT sensors and PMS data. Here are automated actions ready for your approval.
                </p>
                
                <div className="space-y-3">
                  {!actions.energy && (
                    <motion.div 
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-card border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-amber-500" />
                          Energy Waste Detected
                        </p>
                        <p className="text-xs text-muted-foreground">AC is running in 5 vacant rooms (301, 305, 412, 415, 501).</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAction("energy", "AC units shut off in vacant rooms")}
                          className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                        >
                          Auto-Shutoff
                        </button>
                        <button onClick={() => setActions(prev => ({ ...prev, energy: true }))} className="text-xs px-3 py-1.5 border border-border rounded hover:bg-secondary">
                          Ignore
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {!actions.maintenance && (
                    <motion.div 
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-card border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          Predictive Maintenance
                        </p>
                        <p className="text-xs text-muted-foreground">Room 210 shower flow rate dropped 15%. Likely mineral buildup.</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAction("maintenance", "Work order #WO-992 created for Room 210")}
                          className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                        >
                          Create Work Order
                        </button>
                        <button onClick={() => setActions(prev => ({ ...prev, maintenance: true }))} className="text-xs px-3 py-1.5 border border-border rounded hover:bg-secondary">
                          Review Manually
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {actions.energy && actions.maintenance && (
                    <p className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> All AI suggestions processed for today.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            label="Dirty Rooms" 
            value={dirtyCount.toString()} 
            change="Action required" 
            trend="down" 
            icon={Brush} 
            color="rose" 
          />
          <KPICard 
            label="Clean / Inspected" 
            value={cleanCount.toString()} 
            change="Ready for guests" 
            trend="up" 
            icon={CheckCircle} 
            color="emerald" 
          />
          <KPICard 
            label="Out of Order" 
            value={oosCount.toString()} 
            change="Maintenance required" 
            trend="neutral" 
            icon={AlertTriangle} 
            color="amber" 
          />
          <KPICard 
            label="Occupied" 
            value={occupiedCount.toString()} 
            change="In-house guests" 
            trend="up" 
            icon={Bed} 
            color="blue" 
          />
        </div>
      </div>
    </div>
  );
}

function RoomStatus() {
  const { rooms, updateHKStatus } = useRooms();
  const [filterFloor, setFilterFloor] = useState("All Floors");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [toast, setToast] = useState<string | null>(null);

  const staff = ["Unassigned", "Maria G.", "John D.", "Sarah L.", "Engineering"];

  const handleUpdateHK = async (roomNum: string, status: HKStatus) => {
    try {
      await updateHKStatus(roomNum, status);
      setToast(`Room ${roomNum} status updated to ${status}`);
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error("Error updating HK status:", error);
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      if (filterFloor !== "All Floors" && !room.number.startsWith(filterFloor.replace("Floor ", ""))) return false;
      if (filterStatus !== "All Statuses" && room.hkStatus !== filterStatus) return false;
      return true;
    });
  }, [rooms, filterFloor, filterStatus]);

  return (
    <div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-6">
        {/* Legend & Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Clean / Inspected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Dirty</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Out of Order</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="bg-secondary border-none rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
            >
              <option>All Floors</option>
              <option>Floor 1</option>
              <option>Floor 2</option>
              <option>Floor 3</option>
            </select>
            <select 
              className="bg-secondary border-none rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Dirty</option>
              <option>Clean</option>
              <option>Inspected</option>
              <option>Out of Order</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {filteredRooms.map((room) => (
          <div 
            key={room.number} 
            className={cn(
              "p-5 rounded-2xl border shadow-sm flex flex-col gap-4 transition-all hover:shadow-md", 
              room.hkStatus === "Clean" || room.hkStatus === "Inspected" ? "bg-emerald-100/40 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300" :
              room.hkStatus === "Dirty" ? "bg-red-100/40 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" :
              "bg-amber-100/40 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300"
            )}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  {room.number}
                  {room.status === "Arrival" && <span className="px-1.5 py-0.5 bg-purple-500 text-white text-[10px] rounded uppercase tracking-wider font-bold">VIP</span>}
                </h3>
                <p className="text-xs opacity-70 font-medium">{room.type} • {room.status}</p>
              </div>
              <div className="flex gap-1">
                {room.hkStatus === "Inspected" && <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                {room.hkStatus !== "Inspected" && <CheckCircle className="w-4 h-4 opacity-30" />}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-bold opacity-50">Assignee</p>
                <select 
                  className="w-full bg-background/50 border border-current/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-current/20"
                >
                  {staff.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-bold opacity-50">Condition</p>
                <div className="flex flex-wrap gap-1">
                  {["Dirty", "Clean", "Inspected"].map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateHK(room.number, status as HKStatus)}
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold transition-all border",
                        room.hkStatus === status 
                          ? "bg-foreground text-background border-foreground" 
                          : "bg-transparent border-current/20 hover:border-current/40"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-3 flex justify-between items-center text-[10px] font-bold opacity-60 border-t border-current/10">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Updated 5m ago
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskList() {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const tasks = [
    { id: "TSK-001", room: "104", type: "Cleaning", priority: "High", status: "In Progress", assignee: "John D.", time: "10:30 AM" },
    { id: "TSK-002", room: "210", type: "Maintenance", priority: "Medium", status: "Pending", assignee: "Engineering", time: "11:00 AM" },
    { id: "TSK-003", room: "305", type: "Guest Request", priority: "High", status: "Pending", assignee: "Maria G.", time: "11:15 AM", notes: "Extra towels" },
    { id: "TSK-004", room: "101", type: "Cleaning", priority: "Normal", status: "Completed", assignee: "Maria G.", time: "09:00 AM" },
  ];

  return (
    <div>
      <AnimatePresence>
        {isNewTaskModalOpen && <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} />}
      </AnimatePresence>
      <div className="mb-6">
        {/* Legend & Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Cleaning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Guest Request</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsNewTaskModalOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> New Task
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 grid gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-full mt-1",
                  task.type === "Cleaning" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                  task.type === "Maintenance" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                  "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                )}>
                  {task.type === "Cleaning" && <Brush className="w-5 h-5" />}
                  {task.type === "Maintenance" && <Wrench className="w-5 h-5" />}
                  {task.type === "Guest Request" && <Bell className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Room {task.room} - {task.type}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      task.priority === "High" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      task.priority === "Medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="inline-flex items-center gap-1 mr-3"><Clock className="w-3 h-3" /> {task.time}</span>
                    <span className="inline-flex items-center gap-1"><User className="w-3 h-3" /> {task.assignee}</span>
                  </p>
                  {task.notes && <p className="text-sm mt-2 text-foreground/80 bg-secondary/50 p-2 rounded">{task.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-center">
                 <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                    task.status === "Completed" ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400" :
                    task.status === "In Progress" ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400" :
                    "bg-secondary border-border text-muted-foreground"
                  )}>
                    {task.status}
                  </span>
                  <button className="text-sm font-medium text-primary hover:underline">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LostAndFound() {
  const [isLogItemModalOpen, setIsLogItemModalOpen] = useState(false);
  const items = [
    { id: "LF-1029", item: "Gold Watch", location: "Room 305", date: "2023-10-25", status: "Stored", finder: "Maria G." },
    { id: "LF-1030", item: "Laptop Charger", location: "Lobby", date: "2023-10-26", status: "Claimed", finder: "John D." },
    { id: "LF-1031", item: "Sunglasses", location: "Pool Area", date: "2023-10-26", status: "Stored", finder: "Security" },
  ];

  return (
    <div>
      <AnimatePresence>
        {isLogItemModalOpen && <LogItemModal onClose={() => setIsLogItemModalOpen(false)} />}
      </AnimatePresence>
      <div className="mb-6">
        {/* Legend & Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Stored</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Claimed</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search items..." 
                className="pl-9 pr-4 py-2 text-sm bg-secondary border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button onClick={() => setIsLogItemModalOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Log Item
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Item Description</TableHead>
              <TableHead>Location Found</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Finder</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-muted-foreground">{item.id}</TableCell>
                <TableCell className="font-medium text-foreground">{item.item}</TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.finder}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    item.status === "Claimed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-primary hover:underline font-medium text-sm">View</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Inventory() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const inventory = [
    { item: "Bath Towels", category: "Linens", stock: 450, par: 500, status: "Low Stock" },
    { item: "Hand Towels", category: "Linens", stock: 600, par: 600, status: "Optimal" },
    { item: "Shampoo (Mini)", category: "Amenities", stock: 1200, par: 1000, status: "Optimal" },
    { item: "Soap Bars", category: "Amenities", stock: 150, par: 800, status: "Critical" },
    { item: "Glass Cleaner", category: "Cleaning", stock: 25, par: 30, status: "Low Stock" },
  ];

  return (
    <div>
      <AnimatePresence>
        {isOrderModalOpen && <OrderSuppliesModal onClose={() => setIsOrderModalOpen(false)} />}
      </AnimatePresence>
      <div className="mb-6">
        {/* Legend & Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Optimal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Low Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Critical</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button onClick={() => setIsOrderModalOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Package className="w-4 h-4" /> Order Supplies
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Par Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-foreground">{item.item}</TableCell>
                <TableCell className="text-muted-foreground">{item.category}</TableCell>
                <TableCell className="text-right font-medium">{item.stock}</TableCell>
                <TableCell className="text-right text-muted-foreground">{item.par}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    item.status === "Optimal" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    item.status === "Low Stock" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-primary hover:underline font-medium text-sm">Update</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

function HousekeepingSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Housekeeping Settings</h3>
          <p className="text-sm text-muted-foreground">Configure global parameters for room status, tasks, and inventory.</p>
        </div>
        <div className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Brush className="w-4 h-4 text-primary" />
              Room Assignments
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Auto-Assign Rooms</p>
                  <p className="text-sm text-muted-foreground">Automatically distribute dirty rooms to available staff.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Max Rooms per Attendant</p>
                  <p className="text-sm text-muted-foreground">Limit the number of rooms assigned to a single staff member.</p>
                </div>
                <input type="number" defaultValue="15" className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 w-24" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Inventory & Alerts
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Receive notifications when items fall below par level.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Auto-Reorder Threshold</p>
                  <p className="text-sm text-muted-foreground">Automatically generate purchase requests at this percentage of par.</p>
                </div>
                <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Never</option>
                  <option>10%</option>
                  <option>20%</option>
                  <option>30%</option>
                </select>
              </div>
            </div>
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

// --- Modals ---

export function NewTaskModal({ onClose }: { onClose: () => void }) {
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
        className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 sticky top-0 z-20">
          <div>
            <h3 className="text-lg font-bold text-foreground">Create New Task</h3>
            <p className="text-sm text-muted-foreground">Assign a task to housekeeping or maintenance.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Room Number <span className="text-red-500">*</span></label>
              <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" placeholder="e.g. 104" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Task Type <span className="text-red-500">*</span></label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                <option>Cleaning</option>
                <option>Maintenance</option>
                <option>Guest Request</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Priority</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                <option>Normal</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Assignee</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                <option>Unassigned</option>
                <option>Maria G.</option>
                <option>John D.</option>
                <option>Engineering Dept</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Notes / Details</label>
            <textarea className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all min-h-[100px]" placeholder="Add any specific instructions..."></textarea>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function LogItemModal({ onClose }: { onClose: () => void }) {
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
        className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 sticky top-0 z-20">
          <div>
            <h3 className="text-lg font-bold text-foreground">Log Lost Item</h3>
            <p className="text-sm text-muted-foreground">Record an item found on the property.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Item Description <span className="text-red-500">*</span></label>
            <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" placeholder="e.g. Gold Watch, Black iPhone 13" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Location Found <span className="text-red-500">*</span></label>
              <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" placeholder="e.g. Room 305, Pool Area" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Date Found <span className="text-red-500">*</span></label>
              <input type="date" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Finder Name</label>
            <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" placeholder="e.g. Maria G." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
            <textarea className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all min-h-[80px]" placeholder="Any identifying marks, brand names, etc."></textarea>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Log Item
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function OrderSuppliesModal({ onClose }: { onClose: () => void }) {
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
        className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 sticky top-0 z-20">
          <div>
            <h3 className="text-lg font-bold text-foreground">Order Supplies</h3>
            <p className="text-sm text-muted-foreground">Create a purchase request for housekeeping inventory.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          <div className="bg-amber-100/50 border border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Critical Low Stock Alerts</h4>
              <p className="text-xs mt-1 opacity-80">Soap Bars are below par level (150 / 800). Glass Cleaner is below par level (25 / 30).</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm border-b border-border pb-2">Order Items</h4>
            
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Item</label>
                <select className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                  <option>Soap Bars</option>
                  <option>Glass Cleaner</option>
                  <option>Bath Towels</option>
                </select>
              </div>
              <div className="col-span-4">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</label>
                <input type="number" defaultValue="1000" className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" />
              </div>
              <div className="col-span-2 flex justify-end mt-5">
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6">
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all">
                  <option>Glass Cleaner</option>
                  <option>Soap Bars</option>
                  <option>Bath Towels</option>
                </select>
              </div>
              <div className="col-span-4">
                <input type="number" defaultValue="20" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" />
              </div>
              <div className="col-span-2 flex justify-end">
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mt-2">
              <Plus className="w-4 h-4" /> Add Another Item
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Vendor / Supplier Notes</label>
            <textarea className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all min-h-[80px]" placeholder="Optional instructions for purchasing department..."></textarea>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Package className="w-4 h-4" />
            Submit Request
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
