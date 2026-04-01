import React, { useMemo, useState } from "react";
import { Sparkles, Bed, Brush, AlertTriangle, CheckCircle, Thermometer, Droplets, Search, Filter, Plus, Package, Search as SearchIcon, MapPin, Calendar, Clock, User, Wrench, Bell } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface HousekeepingProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function Housekeeping({ aiEnabled, activeSubmenu }: HousekeepingProps) {
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
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Housekeeping - {activeSubmenu}</h2>
            <p className="text-muted-foreground max-w-md">
              The {activeSubmenu} view is currently under construction.
            </p>
          </div>
        );
    }
  };

  return (
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
  );
}

function HousekeepingOverview({ aiEnabled }: { aiEnabled: boolean }) {
  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Housekeeping Overview</h1>
          <div className="flex gap-2">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
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
                  <div className="bg-card border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-amber-500" />
                        Energy Waste Detected
                      </p>
                      <p className="text-xs text-muted-foreground">AC is running in 5 vacant rooms (301, 305, 412, 415, 501).</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                        Auto-Shutoff
                      </button>
                      <button className="text-xs px-3 py-1.5 border border-border rounded hover:bg-secondary">
                        Ignore
                      </button>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        Predictive Maintenance
                      </p>
                      <p className="text-xs text-muted-foreground">Room 210 shower flow rate dropped 15%. Likely mineral buildup.</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                        Create Work Order
                      </button>
                      <button className="text-xs px-3 py-1.5 border border-border rounded hover:bg-secondary">
                        Review Manually
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Dirty Rooms", value: "42", sub: "15 priority (Arrivals)", icon: Brush, color: "text-red-500" },
            { label: "Clean / Inspected", value: "86", sub: "Ready for guests", icon: CheckCircle, color: "text-green-500" },
            { label: "Out of Order", value: "3", sub: "Maintenance required", icon: AlertTriangle, color: "text-amber-500" },
            { label: "Occupied", value: "115", sub: "Do not disturb: 12", icon: Bed, color: "text-blue-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                </div>
                <div className={cn("p-2 rounded-lg bg-secondary", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoomStatus() {
  const [filterFloor, setFilterFloor] = useState("All Floors");
  const [filterStatus, setFilterStatus] = useState("All Statuses");

  const rooms = useMemo(() => [
    { room: "101", type: "Standard", condition: "Dirty", occ: "Vacant", iot: "Normal", assignee: "Maria G." },
    { room: "102", type: "Suite", condition: "Clean", occ: "Occupied", iot: "DND Active", assignee: "Unassigned" },
    { room: "103", type: "Standard", condition: "Inspected", occ: "Vacant", iot: "Normal", assignee: "Unassigned" },
    { room: "104", type: "Deluxe", condition: "Dirty", occ: "Occupied", iot: "AC Left On", assignee: "John D." },
    { room: "105", type: "Out of Order", condition: "Maintenance", occ: "Vacant", iot: "Water Leak", assignee: "Engineering" },
    { room: "201", type: "Standard", condition: "Clean", occ: "Vacant", iot: "Normal", assignee: "Maria G." },
    { room: "202", type: "Suite", condition: "Dirty", occ: "Occupied", iot: "Normal", assignee: "John D." },
    { room: "203", type: "Standard", condition: "Inspected", occ: "Vacant", iot: "Normal", assignee: "Unassigned" },
  ], []);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      if (filterFloor !== "All Floors" && !room.room.startsWith(filterFloor.replace("Floor ", ""))) return false;
      if (filterStatus !== "All Statuses" && room.condition !== filterStatus) return false;
      return true;
    });
  }, [rooms, filterFloor, filterStatus]);

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Room Status Board</h1>
        </div>

        {/* Legend & Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {filteredRooms.map((room) => (
          <div 
            key={room.room} 
            className={cn(
              "p-4 rounded-2xl border shadow-sm flex flex-col gap-3 transition-all hover:shadow-md cursor-pointer", 
              room.condition === "Clean" || room.condition === "Inspected" ? "bg-emerald-100/60 border-emerald-200 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300" :
              room.condition === "Dirty" ? "bg-red-100/60 border-red-200 text-red-900 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300" :
              "bg-amber-100/60 border-amber-200 text-amber-900 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300"
            )}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold">{room.room}</h3>
              <div className="flex gap-1" title={`IoT: ${room.iot}`}>
                {room.iot !== 'Normal' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 opacity-50" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-semibold truncate" title={room.assignee}>
                {room.assignee}
              </p>
              <p className="text-xs opacity-70 truncate" title={room.type}>{room.type} • {room.occ}</p>
            </div>
            
            <div className="mt-auto pt-2 flex justify-between items-center text-xs font-medium opacity-80 border-t border-current/10">
              <span>{room.condition}</span>
              {room.iot !== 'Normal' && <span className="truncate max-w-[80px] text-right">{room.iot}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskList() {
  const tasks = [
    { id: "TSK-001", room: "104", type: "Cleaning", priority: "High", status: "In Progress", assignee: "John D.", time: "10:30 AM" },
    { id: "TSK-002", room: "210", type: "Maintenance", priority: "Medium", status: "Pending", assignee: "Engineering", time: "11:00 AM" },
    { id: "TSK-003", room: "305", type: "Guest Request", priority: "High", status: "Pending", assignee: "Maria G.", time: "11:15 AM", notes: "Extra towels" },
    { id: "TSK-004", room: "101", type: "Cleaning", priority: "Normal", status: "Completed", assignee: "Maria G.", time: "09:00 AM" },
  ];

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Task List</h1>
        </div>

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
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
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
  const items = [
    { id: "LF-1029", item: "Gold Watch", location: "Room 305", date: "2023-10-25", status: "Stored", finder: "Maria G." },
    { id: "LF-1030", item: "Laptop Charger", location: "Lobby", date: "2023-10-26", status: "Claimed", finder: "John D." },
    { id: "LF-1031", item: "Sunglasses", location: "Pool Area", date: "2023-10-26", status: "Stored", finder: "Security" },
  ];

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Lost & Found</h1>
        </div>

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
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Log Item
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Item Description</th>
                <th className="px-5 py-3 font-medium">Location Found</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Finder</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item, i) => (
                <tr key={i} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4 font-medium text-muted-foreground">{item.id}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{item.item}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{item.finder}</td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      item.status === "Claimed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">View</button>
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

function Inventory() {
  const inventory = [
    { item: "Bath Towels", category: "Linens", stock: 450, par: 500, status: "Low Stock" },
    { item: "Hand Towels", category: "Linens", stock: 600, par: 600, status: "Optimal" },
    { item: "Shampoo (Mini)", category: "Amenities", stock: 1200, par: 1000, status: "Optimal" },
    { item: "Soap Bars", category: "Amenities", stock: 150, par: 800, status: "Critical" },
    { item: "Glass Cleaner", category: "Cleaning", stock: 25, par: 30, status: "Low Stock" },
  ];

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Housekeeping Inventory</h1>
        </div>

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
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Package className="w-4 h-4" /> Order Supplies
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium text-right">Current Stock</th>
                <th className="px-5 py-3 font-medium text-right">Par Level</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventory.map((item, i) => (
                <tr key={i} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4 font-medium text-foreground">{item.item}</td>
                  <td className="px-5 py-4 text-muted-foreground">{item.category}</td>
                  <td className="px-5 py-4 text-right font-medium">{item.stock}</td>
                  <td className="px-5 py-4 text-right text-muted-foreground">{item.par}</td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      item.status === "Optimal" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                      item.status === "Low Stock" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">Update</button>
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

