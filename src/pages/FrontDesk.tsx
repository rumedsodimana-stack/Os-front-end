import React, { useMemo, useState } from "react";
import { Users, DoorOpen, Key, DollarSign, TrendingUp, TrendingDown, Bed, CheckCircle2, AlertCircle, Plus, X, Star, CalendarCheck, History, Box, Wrench, Wine, Receipt, Lightbulb, Thermometer, Wifi, Tv, MoreHorizontal, Clock, Search, Filter, Phone, Mail, MapPin, Car, Plane, Coffee, MessageSquare, Info, Crown, Calendar } from "lucide-react";
import { cn } from "../lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { KPICard } from "../components/ui/KPICard";
import { RoomCard, ROOM_GRID } from "../components/ui/RoomCard";
import { useRooms, Room, RoomStatus, HKStatus } from "../context/RoomContext";
import { useGuests } from "../context/GuestContext";
import { useBookings, Booking } from "../context/BookingContext";
import { useFolios, Folio, FolioItem } from "../context/FolioContext";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";

// Semantic tone helper for room status badges — no hardcoded palette colours.
export function statusBadgeTone(status: string): string {
  switch (status) {
    case "Stay Over":
      return "bg-info-100 text-info-700 border-info-200";
    case "Arrival":
      return "bg-success-100 text-success-700 border-success-200";
    case "Departure":
      return "bg-warning-100 text-warning-700 border-warning-200";
    case "OOS":
      return "bg-danger-100 text-danger-700 border-danger-200";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
}

const getBadgeColor = (status: string) => {
  switch (status) {
    case "Confirmed":
    case "Checked In":
    case "Checked Out":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Pending":
    case "Due In":
    case "Due Out":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    case "Cancelled":
    case "OOS":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

interface FrontDeskProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

const revenueData = [
  { name: "Jan", income: 4000, outcome: 2400 },
  { name: "Feb", income: 3000, outcome: 1398 },
  { name: "Mar", income: 2000, outcome: 9800 },
  { name: "Apr", income: 2780, outcome: 3908 },
  { name: "May", income: 1890, outcome: 4800 },
  { name: "Jun", income: 2390, outcome: 3800 },
  { name: "Jul", income: 3490, outcome: 4300 },
];

const statusData = [
  { name: "Occupied", value: 60, color: "#8b5cf6" },
  { name: "Vacant", value: 40, color: "#e5e7eb" },
];

const mockRooms: Room[] = [
  { number: "101", type: "Standard King", status: "Stay Over", hkStatus: "Clean", guestName: "John Doe" },
  { number: "102", type: "Standard Double", status: "Departure", hkStatus: "Dirty", guestName: "Jane Smith" },
  { number: "103", type: "Suite", status: "Arrival", hkStatus: "Clean", guestName: "Alice Johnson" },
  { number: "104", type: "Standard King", status: "Vacant", hkStatus: "Inspected" },
  { number: "105", type: "Standard Double", status: "OOS", hkStatus: "Dirty", notes: "AC broken" },
  { number: "106", type: "Suite", status: "Stay Over", hkStatus: "Clean", guestName: "Robert Brown" },
  { number: "107", type: "Standard King", status: "Stay Over", hkStatus: "Dirty", guestName: "Emily Davis" },
  { number: "108", type: "Standard Double", status: "Arrival", hkStatus: "Clean", guestName: "Michael Wilson" },
  { number: "109", type: "Standard King", status: "Vacant", hkStatus: "Clean" },
  { number: "110", type: "Suite", status: "Departure", hkStatus: "Dirty", guestName: "Sarah Miller" },
  { number: "201", type: "Standard King", status: "Stay Over", hkStatus: "Clean", guestName: "David Garcia" },
  { number: "202", type: "Standard Double", status: "Vacant", hkStatus: "Inspected" },
  { number: "203", type: "Suite", status: "Arrival", hkStatus: "Clean", guestName: "James Rodriguez" },
  { number: "204", type: "Standard King", status: "OOS", hkStatus: "Dirty", notes: "Plumbing issue" },
  { number: "205", type: "Standard Double", status: "Stay Over", hkStatus: "Clean", guestName: "Maria Martinez" },
  { number: "206", type: "Suite", status: "Departure", hkStatus: "Dirty", guestName: "William Hernandez" },
  { number: "207", type: "Standard King", status: "Vacant", hkStatus: "Clean" },
  { number: "208", type: "Standard Double", status: "Arrival", hkStatus: "Clean", guestName: "Richard Lopez" },
];

function FrontDeskOverview({ aiEnabled }: { aiEnabled: boolean }) {
  const { rooms } = useRooms();
  const { guests } = useGuests();
  const { bookings } = useBookings();

  const arrivals = rooms.filter(r => r.status === "Arrival").length;
  const inHouse = guests.length; // Simplified
  const departures = rooms.filter(r => r.status === "Departure").length;
  
  const occupiedCount = rooms.filter(r => r.status !== "Vacant").length;
  const vacantCount = rooms.length - occupiedCount;
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0;

  const dynamicStatusData = [
    { name: "Occupied", value: occupiedCount, color: "#8b5cf6" },
    { name: "Vacant", value: vacantCount, color: "#e5e7eb" },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Arrivals" 
          value={arrivals.toString()} 
          change="Today" 
          trend="up" 
          icon={DoorOpen} 
          color="rose" 
        />
        <KPICard 
          label="In-House" 
          value={inHouse.toString()} 
          change="Total Guests" 
          trend="up" 
          icon={Users} 
          color="purple" 
        />
        <KPICard 
          label="Departures" 
          value={departures.toString()} 
          change="Today" 
          trend="down" 
          icon={Key} 
          color="emerald" 
        />
        <KPICard 
          label="Occupancy" 
          value={`${occupancyRate}%`} 
          change="Real-time" 
          trend="up" 
          icon={TrendingUp} 
          color="amber" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-lg">Revenue</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                <span className="text-muted-foreground">Room Rev</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-muted-foreground">F&B Rev</span>
              </div>
              <select className="bg-secondary text-secondary-foreground border-none rounded-md px-3 py-1.5 outline-none cursor-pointer text-xs font-medium ml-2">
                <option>This Month</option>
              </select>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="outcome" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOutcome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">Status</h2>
            <select className="bg-secondary text-secondary-foreground border-none rounded-md px-3 py-1.5 outline-none cursor-pointer text-xs font-medium">
              <option>Today</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dynamicStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {dynamicStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-violet-600">{occupancyRate}%</span>
              <span className="text-xs text-muted-foreground">Occupied</span>
            </div>
          </div>
          <div className="flex justify-between mt-4 border-t border-border pt-4">
            <div className="text-center">
              <p className="text-sm font-bold">{rooms.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
            </div>
            <div className="text-center border-l border-r border-border px-6">
              <p className="text-sm font-bold text-violet-600">{occupiedCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Occupied</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-400">{vacantCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Vacant</p>
            </div>
          </div>
        </div>

      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Table */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-lg">Recent Bookings</h2>
            <select className="bg-secondary text-secondary-foreground border-none rounded-md px-3 py-1.5 outline-none cursor-pointer text-xs font-medium">
              <option>This Week</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Booking ID</th>
                  <th className="px-4 py-3 font-medium">Guest</th>
                  <th className="px-4 py-3 font-medium">Check-In</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-4 py-3 text-muted-foreground">#{booking.id.slice(-5).toUpperCase()}</td>
                    <td className="px-4 py-3 font-medium">{booking.guestName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{booking.checkIn}</td>
                    <td className="px-4 py-3 text-right font-bold">${booking.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getBadgeColor(booking.status))}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground italic">
                      No recent bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Secondary Table */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-lg">Top Regions</h2>
            <select className="bg-secondary text-secondary-foreground border-none rounded-md px-3 py-1.5 outline-none cursor-pointer text-xs font-medium">
              <option>This Year</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Region</th>
                  <th className="px-4 py-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  { region: "North America", amount: "$15,000" },
                  { region: "Europe", amount: "$12,500" },
                  { region: "Asia Pacific", amount: "$9,800" },
                  { region: "Latin America", amount: "$4,200" },
                  { region: "Middle East", amount: "$3,100" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{row.region}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function FrontDeskRooms() {
  const { rooms } = useRooms();
  const [floorFilter, setFloorFilter] = React.useState("All Floors");
  const [statusFilter, setStatusFilter] = React.useState("All Statuses");
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);

  const statusTone = (status: RoomStatus): "info" | "success" | "warning" | "danger" | "neutral" => {
    switch (status) {
      case "Stay Over": return "info";
      case "Arrival":   return "success";
      case "Departure": return "warning";
      case "OOS":       return "danger";
      case "Vacant":    return "neutral";
    }
  };

  const getLegendColor = (status: RoomStatus) => {
    switch (status) {
      case "Stay Over": return "bg-blue-400";
      case "Arrival": return "bg-emerald-400";
      case "Departure": return "bg-amber-400";
      case "OOS": return "bg-red-400";
      case "Vacant": return "bg-gray-300 dark:bg-gray-600";
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const floorMatch = floorFilter === "All Floors" || room.number.startsWith(floorFilter.replace("Floor ", ""));
      const statusMatch = statusFilter === "All Statuses" || room.status === statusFilter;
      return floorMatch && statusMatch;
    });
  }, [floorFilter, statusFilter, rooms]);

  return (
    <div>
      <div className="mb-6">
        {/* Legend & Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            {(["Stay Over", "Arrival", "Departure", "Vacant", "OOS"] as RoomStatus[]).map((status) => (
              <div key={status} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", getLegendColor(status))}></div>
                <span className="text-sm font-medium text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select 
              className="bg-secondary border-none rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
            >
              <option>All Floors</option>
              <option>Floor 1</option>
              <option>Floor 2</option>
            </select>
            <select 
              className="bg-secondary border-none rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Stay Over</option>
              <option>Arrival</option>
              <option>Departure</option>
              <option>Vacant</option>
              <option>OOS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className={ROOM_GRID}>
        {filteredRooms.map((room) => {
          const tone = statusTone(room.status);
          const hkOk = room.hkStatus === "Clean" || room.hkStatus === "Inspected";
          return (
            <RoomCard
              key={room.number}
              room={room}
              tone={tone}
              onClick={() => setSelectedRoom(room)}
              topRight={hkOk
                ? <CheckCircle2 className="w-4 h-4 text-success-500" />
                : <AlertCircle className="w-4 h-4 text-danger-500" />}
              subtitle={room.guestName || room.notes || "Vacant"}
              badge={{ label: room.status, tone }}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {selectedRoom && (
          <RoomProfileModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailField({ label, value, className }: { label: string, value?: string | number, className?: string }) {
  return (
    <div className="flex flex-col bg-secondary/10 p-2 rounded-md border border-border/50">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5 font-semibold">{label}</span>
      <span className={cn("font-medium text-sm truncate", className)} title={String(value || "-")}>{value || "-"}</span>
    </div>
  );
}

function ActionButton({ label, color, onClick }: { label: string, color: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={cn("px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95", color)}>
      {label}
    </button>
  );
}

function WakeUpCallForm({ onClose, showToast }: { onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto w-full text-left">
      <div className="bg-secondary/20 p-4 rounded-xl border border-border mb-6 flex items-start gap-4">
        <div className="p-3 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-foreground">Scheduled Calls</h4>
          <p className="text-sm text-muted-foreground mt-1">No wake-up calls currently scheduled for this room.</p>
        </div>
      </div>
      <h4 className="font-bold mb-4">Schedule New Wake-up Call</h4>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Date</label>
          <input type="date" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" defaultValue="2026-10-13" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Time</label>
          <input type="time" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" defaultValue="07:00" />
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-muted-foreground">Notes (Optional)</label>
          <input type="text" placeholder="e.g., Guest requested coffee after call" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast("Wake-up call scheduled"); onClose(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Schedule Call</button>
      </div>
    </div>
  );
}

function AlertsForm({ onClose, showToast }: { onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto w-full text-left">
      <div className="space-y-3 mb-6">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <h5 className="font-bold text-red-800 dark:text-red-300 text-sm">Allergic to Feathers</h5>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">Ensure foam pillows only. Housekeeping notified.</p>
          </div>
        </div>
      </div>
      <h4 className="font-bold mb-4">Add New Alert</h4>
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Alert Area</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Front Desk</option>
            <option>Housekeeping</option>
            <option>Food & Beverage</option>
            <option>General</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Alert Message</label>
          <textarea rows={3} placeholder="Enter alert details..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"></textarea>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast("Alert added successfully"); onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">Save Alert</button>
      </div>
    </div>
  );
}

function TracesForm({ onClose, showToast }: { onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto w-full text-left">
      <div className="bg-secondary/20 p-4 rounded-xl border border-border mb-6">
        <h4 className="font-bold text-foreground mb-3">Active Traces</h4>
        <div className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
          No active traces for this reservation.
        </div>
      </div>
      <h4 className="font-bold mb-4">Create New Trace</h4>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Department</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Housekeeping</option>
            <option>Maintenance</option>
            <option>Room Service</option>
            <option>Concierge</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Action Date</label>
          <input type="date" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" defaultValue="2026-10-12" />
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-muted-foreground">Trace Text</label>
          <textarea rows={3} placeholder="Enter instructions for the department..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"></textarea>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast("Trace created successfully"); onClose(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Save Trace</button>
      </div>
    </div>
  );
}

function RoutingForm({ onClose, showToast }: { onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-3xl mx-auto w-full text-left">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <h4 className="font-bold mb-2 flex items-center justify-between">
            Window 1 (Guest)
            <span className="text-xs font-normal px-2 py-1 bg-secondary rounded-md">Default</span>
          </h4>
          <p className="text-sm text-muted-foreground mb-4">All incidental charges route here.</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span>Payment:</span> <span className="font-medium">Visa ending in 4242</span></div>
            <div className="flex justify-between text-sm"><span>Name:</span> <span className="font-medium">David Lee</span></div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm border-primary/50">
          <h4 className="font-bold mb-2 flex items-center justify-between">
            Window 2 (Company)
            <span className="text-xs font-normal px-2 py-1 bg-primary/10 text-primary rounded-md">Routed</span>
          </h4>
          <p className="text-sm text-muted-foreground mb-4">Room & Tax charges route here.</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span>Payment:</span> <span className="font-medium">Direct Bill</span></div>
            <div className="flex justify-between text-sm"><span>Name:</span> <span className="font-medium">Acme Corp</span></div>
          </div>
        </div>
      </div>
      <h4 className="font-bold mb-4">Setup New Routing</h4>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Route To</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Window 2</option>
            <option>Window 3</option>
            <option>Window 4</option>
            <option>Another Room</option>
          </select>
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-muted-foreground">Transaction Codes</label>
          <input type="text" placeholder="e.g., RM, TAX, F&B" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" defaultValue="RM, TAX" />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast("Routing instructions updated"); onClose(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Save Routing</button>
      </div>
    </div>
  );
}

function MessagesForm({ onClose, showToast }: { onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto w-full text-left">
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Recipient</label>
          <input type="text" className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm outline-none" value="Guest in Room" disabled />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Message</label>
          <textarea rows={4} placeholder="Type message for guest..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"></textarea>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Delivery Method</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Front Desk Screen</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> In-Room TV</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> SMS</label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast("Message sent to guest"); onClose(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Send Message</button>
      </div>
    </div>
  );
}

function RoomMoveForm({ onClose, showToast }: { onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto w-full text-left">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-secondary/20 p-4 rounded-xl border border-border">
          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Current Room</h5>
          <div className="text-2xl font-bold">Current <span className="text-sm font-normal text-muted-foreground">(Assigned)</span></div>
        </div>
        <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
          <h5 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">New Room</h5>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary font-bold">
            <option>Select Room...</option>
            <option>205 (Suite) - Clean</option>
            <option>310 (Suite) - Inspected</option>
          </select>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Reason for Move</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Guest Request</option>
            <option>Maintenance Issue</option>
            <option>Upgrade</option>
            <option>Downgrade</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Move Status</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="moveStatus" defaultChecked /> Move Now</label>
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="moveStatus" /> Schedule for Later</label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast("Room move completed"); onClose(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Execute Move</button>
      </div>
    </div>
  );
}

function HousekeepingForm({ onClose, showToast }: { onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto w-full text-left">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Room Status</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Clean</option>
            <option>Dirty</option>
            <option>Inspected</option>
            <option>Out of Service</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Turndown Service</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Required</option>
            <option>Not Required</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-muted-foreground">Housekeeping Notes</label>
          <textarea rows={3} placeholder="e.g., Extra towels requested..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"></textarea>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast("Housekeeping status updated"); onClose(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Update Status</button>
      </div>
    </div>
  );
}

function CreditCardsForm({ onClose, showToast }: { onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto w-full text-left">
      <div className="bg-secondary/20 p-4 rounded-xl border border-border mb-6">
        <h4 className="font-bold text-foreground mb-3 flex items-center justify-between">
          Attached Cards
          <button className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md">Add Card</button>
        </h4>
        <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-6 bg-blue-100 text-blue-800 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
            <div>
              <div className="text-sm font-medium">•••• •••• •••• 4242</div>
              <div className="text-xs text-muted-foreground">Exp: 12/28</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-emerald-600">Auth: $500.00</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </div>
      </div>
      <h4 className="font-bold mb-4">Manual Authorization</h4>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Amount</label>
          <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" placeholder="$0.00" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Approval Code (Manual)</label>
          <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Optional" />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast("Authorization processed"); onClose(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Authorize</button>
      </div>
    </div>
  );
}

function GenericOptionForm({ title, onClose, showToast }: { title: string, onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-3xl mx-auto w-full text-left">
      <div className="bg-secondary/20 p-4 rounded-xl border border-border mb-6">
        <h4 className="font-bold text-foreground mb-3">Active {title} Records</h4>
        <div className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg bg-card">
          No active records found for {title}.
        </div>
      </div>
      <h4 className="font-bold mb-4">Add New {title}</h4>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-muted-foreground">Description / Details</label>
          <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" placeholder={`Enter ${title.toLowerCase()} details...`} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Reference</label>
          <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Optional reference code" />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast(`${title} updated successfully`); onClose(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Save {title}</button>
      </div>
    </div>
  );
}

function PostChargeForm({ onClose, showToast }: { onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto w-full text-left">
      <div className="bg-secondary/20 p-4 rounded-xl border border-border mb-6">
        <h4 className="font-bold text-foreground mb-1">Post Charge to Folio</h4>
        <p className="text-sm text-muted-foreground">Select a transaction code and enter the amount to post a manual charge.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-muted-foreground">Transaction Code</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Select Code...</option>
            <option>REST - Restaurant</option>
            <option>BAR - Lobby Bar</option>
            <option>SPA - Spa Services</option>
            <option>MINI - Mini Bar</option>
            <option>LNDY - Laundry</option>
            <option>MISC - Miscellaneous</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Amount</label>
          <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" placeholder="$0.00" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Quantity</label>
          <input type="number" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" defaultValue={1} min={1} />
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-muted-foreground">Supplement / Reference</label>
          <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Optional details (e.g., Ticket #1234)" />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast("Charge posted successfully"); onClose(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Post Charge</button>
      </div>
    </div>
  );
}

function CreateTicketForm({ onClose, showToast }: { onClose: () => void, showToast: (msg: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto w-full text-left">
      <div className="bg-secondary/20 p-4 rounded-xl border border-border mb-6">
        <h4 className="font-bold text-foreground mb-1">Create Maintenance Ticket</h4>
        <p className="text-sm text-muted-foreground">Report an issue for this room to the engineering team.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Category</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>HVAC</option>
            <option>Furniture/Fixtures</option>
            <option>Technology/TV</option>
            <option>Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Priority</label>
          <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent (Guest Waiting)</option>
          </select>
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-muted-foreground">Issue Description</label>
          <textarea rows={4} placeholder="Describe the problem in detail..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"></textarea>
        </div>
        <div className="space-y-2 col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked /> Permission to enter room if guest is not present
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">Cancel</button>
        <button onClick={() => { showToast("Maintenance ticket created"); onClose(); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Submit Ticket</button>
      </div>
    </div>
  );
}

function CheckInWizard({ room, onClose, showToast }: { room: Room, onClose: () => void, showToast: (msg: string) => void }) {
  const { guests } = useGuests();
  const { assignGuest } = useRooms();
  const { addFolio } = useFolios();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [keysEncoded, setKeysEncoded] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const steps = ["Guest Selection", "Stay Details", "Payment", "Key Encoding"];

  const selectedGuest = guests.find(g => g.id === selectedGuestId);

  const handleCheckIn = async () => {
    if (!selectedGuest) {
      showToast("Please select a guest first");
      return;
    }
    setIsProcessing(true);
    try {
      await assignGuest(room.number, selectedGuest.id, `${selectedGuest.firstName} ${selectedGuest.lastName}`);
      
      // Create Folio
      await addFolio({
        guestId: selectedGuest.id,
        bookingId: `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, // Mock booking ID if not present
        roomNumber: room.number,
        status: "Open"
      });

      showToast(`Guest ${selectedGuest.firstName} checked in to Room ${room.number}`);
      onClose();
    } catch (error) {
      showToast("Error during check-in");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAuthorize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsAuthorized(true);
      showToast("Payment authorized successfully");
    }, 1500);
  };

  const handleEncode = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setKeysEncoded(true);
      showToast("Keys encoded successfully");
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto w-full text-left py-4">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary -translate-y-1/2 z-0"></div>
        {steps.map((s, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors border-2",
              step > i + 1 ? "bg-emerald-500 border-emerald-500 text-white" : 
              step === i + 1 ? "bg-primary border-primary text-primary-foreground" : 
              "bg-card border-border text-muted-foreground"
            )}>
              {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", step === i + 1 ? "text-primary" : "text-muted-foreground")}>{s}</span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-bold">Select Guest</h4>
              <button onClick={() => showToast("Scanning ID...")} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20 transition-colors flex items-center gap-2">
                <Box className="w-3 h-3" /> Scan ID
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Search Guest</label>
                <select 
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary"
                  value={selectedGuestId}
                  onChange={(e) => setSelectedGuestId(e.target.value)}
                >
                  <option value="">Select a guest...</option>
                  {guests.map(g => (
                    <option key={g.id} value={g.id}>{g.firstName} {g.lastName} ({g.loyaltyStatus})</option>
                  ))}
                </select>
              </div>
              
              {selectedGuest && (
                <div className="p-4 bg-secondary/20 rounded-xl border border-border space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{selectedGuest.firstName} {selectedGuest.lastName}</p>
                      <p className="text-sm text-muted-foreground">{selectedGuest.location}</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider">
                      {selectedGuest.loyaltyStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Stays</p>
                      <p className="font-semibold">{selectedGuest.totalStays}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Loyalty Points</p>
                      <p className="font-semibold">{selectedGuest.loyaltyPoints}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">Ensure guest identification matches the profile before proceeding.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h4 className="text-xl font-bold">Confirm Stay Details</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-secondary/20 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Dates</p>
                  <p className="font-bold">Oct 12 - Oct 16, 2026 (4 Nights)</p>
                </div>
                <div className="p-4 bg-secondary/20 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Room Type & Rate</p>
                  <p className="font-bold">{room.type} • $250.00/night</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Rate Code</label>
                  <select className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary">
                    <option>BAR (Best Available Rate)</option>
                    <option>CORP (Corporate Standard)</option>
                    <option>GOV (Government Rate)</option>
                    <option>PROMO (Seasonal Offer)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Special Requests</label>
                  <div className="p-3 bg-card border border-border rounded-lg text-sm italic text-muted-foreground">
                    "High floor, away from elevator if possible. Foam pillows only."
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Market Segment</label>
                  <select className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary">
                    <option>Corporate</option>
                    <option>Leisure</option>
                    <option>Group</option>
                    <option>OTA (Online Travel Agent)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Source of Business</label>
                  <select className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary">
                    <option>Direct Call</option>
                    <option>Website</option>
                    <option>GDS</option>
                    <option>Walk-in</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h4 className="text-xl font-bold">Payment & Authorization</h4>
            <div className={cn(
              "p-6 rounded-2xl text-center border transition-colors",
              isAuthorized ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30" : "bg-secondary/20 border-border"
            )}>
              {isAuthorized ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              ) : (
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              )}
              <h5 className={cn("text-lg font-bold", isAuthorized ? "text-emerald-800 dark:text-emerald-300" : "text-foreground")}>
                {isAuthorized ? "Authorization Successful" : "Total Estimated Charges: $1,145.00"}
              </h5>
              <p className="text-sm text-muted-foreground mt-1">Includes Room, Tax, and $200.00 Incidentals Deposit</p>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                <button className="p-4 border-2 border-primary bg-primary/5 rounded-xl flex flex-col items-center gap-2">
                  <div className="w-8 h-5 bg-blue-600 rounded text-[8px] text-white flex items-center justify-center font-bold">VISA</div>
                  <span className="text-xs font-bold">•••• 4242</span>
                </button>
                <button className="p-4 border border-border bg-card rounded-xl flex flex-col items-center gap-2 hover:bg-secondary transition-colors">
                  <DollarSign className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs font-bold">Cash/Other</span>
                </button>
                <button className="p-4 border border-border bg-card rounded-xl flex flex-col items-center gap-2 hover:bg-secondary transition-colors">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs font-bold">Add New</span>
                </button>
              </div>
            </div>
            {!isAuthorized && (
              <>
                <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-border">
                  <input type="checkbox" id="incidental-auth" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <label htmlFor="incidental-auth" className="text-sm">Authorize for incidentals ($50.00/night)</label>
                </div>
                <button 
                  onClick={handleAuthorize} 
                  disabled={isProcessing}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Authorize $1,145.00"
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col items-center justify-center text-center">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors",
              keysEncoded ? "bg-emerald-100 text-emerald-600" : "bg-violet-100 text-violet-600 animate-pulse"
            )}>
              {keysEncoded ? <CheckCircle2 className="w-10 h-10" /> : <Key className="w-10 h-10" />}
            </div>
            <h4 className="text-2xl font-bold">{keysEncoded ? "Keys Ready" : "Encode Room Keys"}</h4>
            <p className="text-muted-foreground max-w-xs mx-auto mb-8">
              {keysEncoded ? "All keys have been successfully prepared." : `Place 2 keycards on the encoder for Room ${room.number}.`}
            </p>
            <div className="flex gap-4 w-full max-w-sm">
              <button 
                onClick={handleEncode} 
                disabled={isProcessing || keysEncoded}
                className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Encoding...
                  </>
                ) : keysEncoded ? "Keys Encoded" : "Encode Keys"}
              </button>
              <button onClick={() => showToast("Mobile key sent to guest")} className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-bold hover:bg-secondary/80 transition-colors">
                Send Mobile Key
              </button>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 flex justify-between">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()} 
            className="px-6 py-2 bg-secondary text-foreground rounded-xl text-sm font-bold hover:bg-secondary/80 transition-colors"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)} 
              className="px-8 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleCheckIn} 
              disabled={isProcessing}
              className="px-8 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              {isProcessing && <Clock className="w-4 h-4 animate-spin" />}
              Complete Check-In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckOutWizard({ room, onClose, showToast }: { room: Room, onClose: () => void, showToast: (msg: string) => void }) {
  const { checkoutGuest } = useRooms();
  const { folios, closeFolio } = useFolios();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const steps = ["Folio Review", "Payment", "Departure"];

  const currentFolio = folios.find(f => f.roomNumber === room.number && f.status === "Open");

  const handleFinalCheckout = async () => {
    setIsProcessing(true);
    try {
      await checkoutGuest(room.number);
      if (currentFolio) {
        await closeFolio(currentFolio.id);
      }
      showToast(`Guest ${room.guestName} has been checked out`);
      onClose();
    } catch (error) {
      showToast("Error during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      showToast("Payment processed successfully");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto w-full text-left py-4">
      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-12 mb-8 relative">
        <div className="absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-secondary -translate-y-1/2 z-0"></div>
        {steps.map((s, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors border-2",
              step > i + 1 ? "bg-emerald-500 border-emerald-500 text-white" : 
              step === i + 1 ? "bg-primary border-primary text-primary-foreground" : 
              "bg-card border-border text-muted-foreground"
            )}>
              {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", step === i + 1 ? "text-primary" : "text-muted-foreground")}>{s}</span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-bold">Review Guest Folio</h4>
              <button onClick={() => showToast("Opening Post Charge...")} className="text-xs bg-secondary px-3 py-1.5 rounded-lg font-bold hover:bg-secondary/80 flex items-center gap-2">
                <Plus className="w-3 h-3" /> Post Charge
              </button>
            </div>
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {currentFolio ? (
                    <>
                      {currentFolio.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            {item.description}
                            <span className="ml-2 text-[10px] text-muted-foreground uppercase">{item.category}</span>
                          </td>
                          <td className={cn(
                            "px-4 py-2 text-right",
                            item.type === "Charge" ? "text-rose-600" : "text-emerald-600"
                          )}>
                            {item.type === "Charge" ? "" : "-"}${item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-secondary/10 font-bold">
                        <td className="px-4 py-3 text-right">Total Balance Due:</td>
                        <td className={cn(
                          "px-4 py-3 text-right",
                          currentFolio.totalBalance > 0 ? "text-rose-600" : "text-emerald-600"
                        )}>
                          ${currentFolio.totalBalance.toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground italic">
                        No folio found for this room.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h4 className="text-xl font-bold">Process Payment</h4>
            <div className={cn(
              "p-6 rounded-2xl border flex justify-between items-center transition-colors",
              isPaid ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30" : "bg-secondary/20 border-border"
            )}>
              <div>
                <p className="text-sm text-muted-foreground">{isPaid ? "Balance Settled" : "Amount to Settle"}</p>
                <p className={cn("text-3xl font-bold", isPaid ? "text-emerald-600" : "text-foreground")}>
                  {isPaid ? "$0.00" : `$${currentFolio?.totalBalance.toFixed(2) || "0.00"}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-bold flex items-center gap-2 justify-end">
                  <span className="w-8 h-5 bg-blue-600 rounded text-[8px] text-white flex items-center justify-center font-bold">VISA</span>
                  •••• 4242
                </p>
              </div>
            </div>
            {!isPaid && (
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="p-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm flex flex-col items-center gap-2"
                >
                  {isProcessing ? (
                    <Clock className="w-6 h-6 animate-spin" />
                  ) : (
                    <DollarSign className="w-6 h-6" />
                  )}
                  <span>{isProcessing ? "Processing..." : "Pay Full Balance"}</span>
                </button>
                <button onClick={() => showToast("Opening split payment...")} className="p-4 bg-secondary text-foreground rounded-xl font-bold hover:bg-secondary/80 transition-colors flex flex-col items-center gap-2">
                  <Users className="w-6 h-6" />
                  <span>Split Payment</span>
                </button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold">Checkout Complete</h4>
            <p className="text-muted-foreground max-w-xs mx-auto mb-8">
              Guest {room.guestName} has been successfully checked out of Room {room.number}.
            </p>
            <div className="flex gap-4 w-full max-w-sm">
              <button onClick={() => showToast("Receipt printed")} className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-bold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                <Receipt className="w-5 h-5" /> Print Receipt
              </button>
              <button onClick={() => showToast("Receipt emailed to guest")} className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-bold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                <DoorOpen className="w-5 h-5" /> Email Receipt
              </button>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 flex justify-between">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()} 
            className="px-6 py-2 bg-secondary text-foreground rounded-xl text-sm font-bold hover:bg-secondary/80 transition-colors"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 3 ? (
            <button 
              onClick={() => setStep(step + 1)} 
              className="px-8 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleFinalCheckout} 
              disabled={isProcessing}
              className="px-8 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {isProcessing && <Clock className="w-4 h-4 animate-spin" />}
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function RoomProfileModal({ room, onClose, initialWizard = null }: { room: Room; onClose: () => void; initialWizard?: string | null }) {
  const hasGuest = room.status === "Stay Over" || room.status === "Arrival" || room.status === "Departure";
  const [activeTab, setActiveTab] = useState("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeOptionModal, setActiveOptionModal] = useState<string | null>(initialWizard);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ─── Live data from shared contexts ──────────────────────────────────────
  const { guests } = useGuests();
  const { bookings } = useBookings();
  const { folios, addFolioItem } = useFolios();
  const { getItemsByDepartment, postMovement } = useInventory();

  const guest = useMemo(() => {
    if (!room.guestId && !room.guestName) return undefined;
    return guests.find(g =>
      (room.guestId && g.id === room.guestId) ||
      (room.guestName && `${g.firstName} ${g.lastName}`.toLowerCase() === room.guestName.toLowerCase())
    );
  }, [guests, room.guestId, room.guestName]);

  const activeBooking = useMemo(() => {
    return bookings.find(b =>
      b.roomNumber === room.number &&
      (b.status === "Checked In" || b.status === "Confirmed")
    );
  }, [bookings, room.number]);

  const folio = useMemo(() => {
    if (!activeBooking) return undefined;
    return folios.find(f => f.bookingId === activeBooking.id);
  }, [folios, activeBooking]);

  const guestHistory = useMemo(() => {
    if (!guest) return [];
    const name = `${guest.firstName} ${guest.lastName}`;
    return bookings.filter(b => b.guestName === name);
  }, [bookings, guest]);

  const minibarItems = useMemo(() => getItemsByDepartment("Mini Bar"), [getItemsByDepartment]);

  const nights = useMemo(() => {
    if (!activeBooking) return 0;
    const inD = new Date(activeBooking.checkIn).getTime();
    const outD = new Date(activeBooking.checkOut).getTime();
    if (Number.isNaN(inD) || Number.isNaN(outD)) return 0;
    return Math.max(0, Math.round((outD - inD) / 86400000));
  }, [activeBooking]);

  const fmtDate = (s?: string) => {
    if (!s) return "—";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };
  const fmtMoney = (n?: number) => typeof n === "number" ? `$${n.toFixed(2)}` : "—";

  // ─── Smart Controls local state ──────────────────────────────────────────
  const [masterLights, setMasterLights] = useState(true);
  const [dnd, setDnd] = useState(false);
  const [mur, setMur] = useState(false);
  const [targetTemp, setTargetTemp] = useState(22);

  // ─── Footer note modals (Accompany / Comments / Profile Notes / No Post) ──
  const [noteModal, setNoteModal] = useState<null | "Accompany" | "Comments" | "Profile Notes" | "No Post">(null);
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [noPostActive, setNoPostActive] = useState(false);

  // ─── Folio charge handler ────────────────────────────────────────────────
  const postCharge = async (description: string, amount: number, category: FolioItem["category"] = "Other") => {
    if (!folio) {
      showToast("No open folio — charge not posted");
      return;
    }
    try {
      await addFolioItem(folio.id, { description, amount, type: "Charge", category });
      showToast(`${description} posted ($${amount.toFixed(2)})`);
    } catch {
      showToast("Failed to post charge");
    }
  };

  const postMinibarSale = async (item: ReturnType<typeof getItemsByDepartment>[number]) => {
    const price = item.sellingPrice ?? item.unitCost;
    try {
      await postMovement({
        itemId: item.id,
        itemName: item.name,
        type: "SALE",
        quantity: 1,
        toDepartment: "Mini Bar",
        reference: folio ? `Folio-${folio.id}` : `Room-${room.number}`,
        user: "Front Desk",
      });
      await postCharge(`Mini Bar — ${item.name}`, price, "F&B");
    } catch {
      showToast("Failed to post mini bar sale");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "options", label: "Options", icon: MoreHorizontal },
    { id: "charges", label: "Folio & Charges", icon: Receipt },
    { id: "minibar", label: "Mini Bar", icon: Wine },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "assets", label: "Assets", icon: Box },
    { id: "history", label: "Room History", icon: History },
    { id: "smart", label: "Smart Controls", icon: Lightbulb },
  ];

  const operaOptions = [
    "Accompanying", "Add On", "Agent/Company", "Alerts", "Attachments", "Billing",
    "Changes", "Confirmation", "Credit Cards", "Delete", "Deposit/CXL", "Fixed Charges",
    "History", "Housekeeping", "Locator", "Messages", "Package Option", "Party",
    "Privileges", "Pro-Forma Folio", "Rate Info", "Register Card", "Resync", "Room Move",
    "Routing", "Scheduled Activities", "Shares", "Traces", "Track It", "Waitlist",
    "Wake-up Call", "Web Links"
  ];

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
        className="bg-card w-full max-w-6xl h-[90vh] rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-success-500" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 sticky top-0 z-20">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              Room {room.number} Profile
              <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", statusBadgeTone(room.status))}>
                {room.status}
              </span>
            </h3>
            <p className="text-sm text-muted-foreground">{room.type}</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex gap-2 px-6 pt-4 border-b border-border overflow-x-auto custom-scrollbar sticky top-[73px] bg-card z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-muted/10">
          {activeTab === "overview" && (
            hasGuest ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Profile */}
                <div className="space-y-6">
                  <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                    <h4 className="font-semibold mb-4 border-b border-border pb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> Guest Profile
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <DetailField label="Name" value={guest ? `${guest.firstName} ${guest.lastName}` : (room.guestName || "—")} className="col-span-2 text-base" />
                      <DetailField label="Phone" value={guest?.phone || "—"} />
                      <DetailField label="Language" value={(guest as any)?.language || "—"} />
                      <DetailField label="Nationality" value={guest?.location || "—"} />
                      <DetailField label="VIP" value={guest ? (guest.vip ? `${guest.loyaltyStatus} Member` : guest.loyaltyStatus) : "—"} className={guest?.vip ? "text-warning-700" : undefined} />
                      <DetailField label="Company" value={(guest as any)?.company || "—"} className="col-span-2" />
                    </div>
                  </div>
                </div>

                {/* Column 2: Stay Details */}
                <div className="space-y-6">
                  <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                    <h4 className="font-semibold mb-4 border-b border-border pb-2 flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-primary" /> Stay Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <DetailField label="Res. ID" value={activeBooking ? `RES-${activeBooking.id.slice(0, 6).toUpperCase()}` : "—"} className="col-span-2 text-primary font-bold" />
                      <DetailField label="Arrival" value={fmtDate(activeBooking?.checkIn)} />
                      <DetailField label="Departure" value={fmtDate(activeBooking?.checkOut)} />
                      <DetailField label="Nights" value={activeBooking ? nights : "—"} />
                      <DetailField label="Adults/Child" value={(activeBooking as any)?.adults ? `${(activeBooking as any).adults} / ${(activeBooking as any).children || 0}` : "—"} />
                      <DetailField label="Room Type" value={room.type} />
                      <DetailField label="Room" value={room.number} />
                      <DetailField label="Rate Code" value={(activeBooking as any)?.rateCode || "—"} />
                      <DetailField label="Rate" value={fmtMoney(activeBooking?.amount)} />
                    </div>
                  </div>
                </div>

                {/* Column 3: Payment & Routing */}
                <div className="space-y-6">
                  <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                    <h4 className="font-semibold mb-4 border-b border-border pb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" /> Payment & Routing
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <DetailField label="Res. Type" value={activeBooking?.status || "—"} />
                      <DetailField label="Market" value={(activeBooking as any)?.market || "—"} />
                      <DetailField label="Payment" value={(activeBooking as any)?.payment || "—"} className="col-span-2" />
                      <DetailField label="Guest Balance" value={fmtMoney(folio?.totalBalance ?? 0)} className="text-success-700 font-bold col-span-2 text-lg" />
                      <DetailField label="Comments" value={room.notes || savedNotes["Comments"] || "—"} className="col-span-2" />
                      <DetailField label="Billing Info" value={savedNotes["Billing"] || "—"} className="col-span-2" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-card rounded-xl border border-dashed border-border">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                  <DoorOpen className="w-10 h-10 text-muted-foreground opacity-50" />
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-2">Room {room.number} is Vacant</h4>
                <p className="text-muted-foreground max-w-md mb-6">
                  There is no active reservation or guest profile associated with this room currently.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => showToast("Opening Walk-in wizard...")} className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
                    Create Walk-in
                  </button>
                  <button onClick={() => showToast("Opening Status Change dialog...")} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors">
                    Change Status
                  </button>
                </div>
              </div>
            )
          )}

          {activeTab === "options" && (
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 h-full overflow-y-auto">
              <h4 className="font-semibold mb-6 text-lg border-b border-border pb-2">Reservation Options</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {operaOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => {
                      if (["Billing", "Wake-up Call", "Traces", "Alerts", "Routing"].includes(opt)) {
                        setActiveOptionModal(opt);
                      } else {
                        showToast(`Opened ${opt} module`);
                      }
                    }}
                    className="p-3 text-sm font-medium bg-secondary/50 hover:bg-secondary border border-border/50 rounded-lg transition-all active:scale-95 text-center flex items-center justify-center min-h-[60px]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "charges" && (
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h4 className="font-semibold">Folio Transactions</h4>
                <button onClick={() => setActiveOptionModal("Post Charge")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Post Charge</button>
              </div>
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {folio && folio.items.length > 0 ? (
                    <>
                      {folio.items.map(item => (
                        <tr key={item.id} className="hover:bg-secondary/30">
                          <td className="px-4 py-3">{item.timestamp.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</td>
                          <td className="px-4 py-3">{item.category}</td>
                          <td className="px-4 py-3">{item.description}</td>
                          <td className={cn("px-4 py-3 text-right", item.type === "Payment" ? "text-success-700" : "text-foreground")}>
                            {item.type === "Payment" ? "-" : ""}{fmtMoney(item.amount)}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-medium bg-secondary/10">
                        <td colSpan={3} className="px-4 py-3 text-right">Total Balance:</td>
                        <td className="px-4 py-3 text-right text-success-700">{fmtMoney(folio.totalBalance)}</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No folio items yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "minibar" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Mini Bar Inventory</h4>
                <p className="text-sm text-muted-foreground">{minibarItems.length} items tracked</p>
              </div>
              {minibarItems.length === 0 ? (
                <div className="p-12 text-center bg-card rounded-xl border border-dashed border-border text-muted-foreground">
                  <Wine className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No mini bar items configured.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {minibarItems.map(item => (
                    <div key={item.id} className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center text-center gap-2">
                      <Wine className="w-8 h-8 text-muted-foreground opacity-50 mb-2" />
                      <span className="font-medium text-sm">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{fmtMoney(item.sellingPrice)} • {item.inStock} in stock</span>
                      <button
                        disabled={item.inStock <= 0}
                        onClick={() => postMinibarSale(item)}
                        className="mt-2 w-full px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Charge
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h4 className="font-semibold">Work Orders</h4>
                <button onClick={() => setActiveOptionModal("Create Ticket")} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80">Create Ticket</button>
              </div>
              {/* TODO: wire to a MaintenanceContext when one is introduced (no such context exists yet — do not invent one). */}
              <div className="p-6 text-center text-muted-foreground">
                <Wrench className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No active work orders for Room {room.number}.</p>
                <p className="text-sm mt-1">Use "Create Ticket" to log a new maintenance request.</p>
              </div>
            </div>
          )}

          {activeTab === "assets" && (
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border">
                <h4 className="font-semibold">Room Assets</h4>
                <p className="text-xs text-muted-foreground mt-1">Static reference list — no asset-by-room context exists yet.</p>
              </div>
              <ul className="divide-y divide-border/50">
                {[
                  { item: "Samsung 55' Smart TV", serial: "SN-9823471", installed: "Jan 2024" },
                  { item: "Nespresso Machine", serial: "NES-10293", installed: "Mar 2025" },
                  { item: "Dometic Minibar Fridge", serial: "DOM-4412", installed: "Jan 2024" },
                  { item: "Elsafe In-Room Safe", serial: "ELS-9912", installed: "Jan 2024" },
                ].map((asset, i) => (
                  <li key={i} className="p-4 flex justify-between items-center hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Tv className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{asset.item}</p>
                        <p className="text-xs text-muted-foreground">S/N: {asset.serial}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Installed: {asset.installed}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border">
                <h4 className="font-semibold">Recent Stays</h4>
              </div>
              {guestHistory.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <History className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No prior stays on file for this guest.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">Guest</th>
                      <th className="px-4 py-3 font-medium">Dates</th>
                      <th className="px-4 py-3 font-medium">Room</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {guestHistory.map(b => {
                      const ni = Math.max(0, Math.round((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / 86400000));
                      return (
                        <tr key={b.id} className="hover:bg-secondary/30">
                          <td className="px-4 py-3 font-medium">{b.guestName}</td>
                          <td className="px-4 py-3">{fmtDate(b.checkIn)} – {fmtDate(b.checkOut)} ({ni}n)</td>
                          <td className="px-4 py-3">{b.roomNumber}</td>
                          <td className="px-4 py-3">{b.status}</td>
                          <td className="px-4 py-3 text-right">{fmtMoney(b.amount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "smart" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold flex items-center gap-2"><Thermometer className="w-5 h-5 text-primary" /> Climate Control</h4>
                  <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-[10px] font-bold uppercase tracking-wider">ONLINE</span>
                </div>
                <div className="flex flex-col items-center justify-center py-4">
                  <span className="text-5xl font-light mb-2">{targetTemp}°C</span>
                  <span className="text-sm text-muted-foreground">Target: {targetTemp}°C • Mode: Auto</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setTargetTemp(t => Math.max(16, t - 1)); showToast("Decreased target temperature"); }} className="flex-1 py-2 bg-secondary rounded-lg font-medium hover:bg-secondary/80 transition-colors">-</button>
                  <button onClick={() => { setTargetTemp(t => Math.min(30, t + 1)); showToast("Increased target temperature"); }} className="flex-1 py-2 bg-secondary rounded-lg font-medium hover:bg-secondary/80 transition-colors">+</button>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary" /> Lighting & Status</h4>
                  <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-[10px] font-bold uppercase tracking-wider">ONLINE</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Master Lights", value: masterLights, set: setMasterLights },
                    { label: "Do Not Disturb (DND)", value: dnd, set: setDnd },
                    { label: "Make Up Room (MUR)", value: mur, set: setMur },
                  ].map(tog => (
                    <div key={tog.label} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                      <span className="font-medium text-sm">{tog.label}</span>
                      <button
                        type="button"
                        onClick={() => { tog.set(!tog.value); showToast(`Toggled ${tog.label}`); }}
                        className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors", tog.value ? "bg-primary" : "bg-secondary border border-border")}
                        aria-pressed={tog.value}
                      >
                        <div className={cn("w-4 h-4 bg-card rounded-full absolute top-0.5 shadow-sm transition-all", tog.value ? "right-0.5" : "left-0.5")}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
          {hasGuest ? (
            <div className="flex flex-wrap gap-2">
              <ActionButton onClick={() => setNoteModal("Accompany")} label="Accompany" color="bg-card border border-border hover:bg-secondary text-foreground" />
              <ActionButton onClick={() => setNoteModal("Comments")} label="Comments" color="bg-card border border-border hover:bg-secondary text-foreground" />
              <ActionButton onClick={() => setNoteModal("Profile Notes")} label="Profile Notes" color="bg-card border border-border hover:bg-secondary text-foreground" />
              <ActionButton
                onClick={() => { setNoPostActive(v => !v); showToast(`No Post ${!noPostActive ? "enabled" : "cleared"}`); }}
                label={noPostActive ? "No Post ✓" : "No Post"}
                color={noPostActive ? "bg-warning-100 text-warning-700 border border-warning-200" : "bg-card border border-border hover:bg-secondary text-foreground"}
              />
              <ActionButton onClick={() => setActiveOptionModal("Alerts")} label="Alerts" color="bg-danger-100 text-danger-700 border border-danger-200 hover:bg-danger-100/80" />
            </div>
          ) : <div />}
          <div className="flex gap-3 w-full sm:w-auto justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-bold hover:bg-secondary transition-colors">
              Close
            </button>
            {room.status === "Arrival" && (
              <button onClick={() => setActiveOptionModal("Check In")} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors">
                Check In
              </button>
            )}
            {(room.status === "Departure" || room.status === "Stay Over") && (
              <button onClick={() => setActiveOptionModal("Check Out")} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors">
                Check Out
              </button>
            )}
            {hasGuest && (
              <button onClick={() => showToast("Saved")} className="px-8 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors">
                Save
              </button>
            )}
          </div>
        </div>

        {/* Sub-Modal for specific options */}
        <AnimatePresence>
          {activeOptionModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 bg-card flex flex-col"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
                <h3 className="text-lg font-bold text-foreground">{activeOptionModal} Module</h3>
                <button onClick={() => setActiveOptionModal(null)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto flex flex-col">
                {activeOptionModal === "Wake-up Call" ? (
                  <WakeUpCallForm onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Alerts" ? (
                  <AlertsForm onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Traces" ? (
                  <TracesForm onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Routing" || activeOptionModal === "Billing" ? (
                  <RoutingForm onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Messages" ? (
                  <MessagesForm onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Room Move" ? (
                  <RoomMoveForm onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Housekeeping" ? (
                  <HousekeepingForm onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Credit Cards" ? (
                  <CreditCardsForm onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Post Charge" ? (
                  <PostChargeForm onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Create Ticket" ? (
                  <CreateTicketForm onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Check In" ? (
                  <CheckInWizard room={room} onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : activeOptionModal === "Check Out" ? (
                  <CheckOutWizard room={room} onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                ) : (
                  <GenericOptionForm title={activeOptionModal} onClose={() => setActiveOptionModal(null)} showToast={showToast} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note sub-modal for Accompany / Comments / Profile Notes */}
        <AnimatePresence>
          {noteModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 bg-card flex flex-col"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
                <h3 className="text-lg font-bold text-foreground">{noteModal}</h3>
                <button onClick={() => setNoteModal(null)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <label className="text-sm font-medium text-muted-foreground">Note</label>
                <textarea
                  defaultValue={savedNotes[noteModal] || ""}
                  id={`note-textarea-${noteModal}`}
                  rows={6}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder={`Add ${noteModal.toLowerCase()}…`}
                />
              </div>
              <div className="px-6 py-4 border-t border-border bg-secondary/30 flex justify-end gap-3">
                <button onClick={() => setNoteModal(null)} className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
                <button
                  onClick={() => {
                    const el = document.getElementById(`note-textarea-${noteModal}`) as HTMLTextAreaElement | null;
                    const val = el?.value || "";
                    setSavedNotes(prev => ({ ...prev, [noteModal!]: val }));
                    showToast(`${noteModal} saved`);
                    setNoteModal(null);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
}

const mockArrivals = [
  { id: "ARR-001", guest: "Alice Johnson", roomType: "Suite", roomNumber: "103", eta: "14:00", vip: true, status: "Due In", hkStatus: "Clean" },
  { id: "ARR-002", guest: "Michael Wilson", roomType: "Standard Double", roomNumber: "108", eta: "15:30", vip: false, status: "Checked In", hkStatus: "Clean" },
  { id: "ARR-003", guest: "James Rodriguez", roomType: "Suite", roomNumber: "203", eta: "16:00", vip: true, status: "Due In", hkStatus: "Clean" },
  { id: "ARR-004", guest: "Richard Lopez", roomType: "Standard Double", roomNumber: "208", eta: "18:00", vip: false, status: "Due In", hkStatus: "Clean" },
  { id: "ARR-005", guest: "Emma Thompson", roomType: "Standard King", roomNumber: "Unassigned", eta: "19:30", vip: false, status: "Due In", hkStatus: "N/A" },
];

function FrontDeskArrivals() {
  const [statusFilter, setStatusFilter] = React.useState("All Arrivals");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [selectedArrival, setSelectedArrival] = React.useState<any | null>(null);
  const [wizardMode, setWizardMode] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (arrival: any) => {
    const room: Room = {
      number: arrival.roomNumber,
      type: arrival.roomType,
      status: "Arrival",
      hkStatus: arrival.hkStatus as HKStatus,
      guestName: arrival.guest
    };
    setSelectedArrival(room);
    setWizardMode("Check In");
  };

  const filteredArrivals = useMemo(() => {
    return mockArrivals.filter(arr => {
      if (statusFilter === "All Arrivals") return true;
      if (statusFilter === "VIP Only") return arr.vip;
      return arr.status === statusFilter;
    });
  }, [statusFilter]);

  return (
    <div className="relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-6">
        {/* Legend & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Checked In</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Due In</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span className="text-sm font-medium text-muted-foreground">VIP</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="bg-secondary border-none rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Arrivals</option>
              <option>Due In</option>
              <option>Checked In</option>
              <option>VIP Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Arrivals List */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">ETA</th>
                <th className="px-6 py-4 font-medium">HK Status</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredArrivals.map((arrival, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{arrival.guest}</span>
                      {arrival.vip && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider">VIP</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{arrival.roomNumber}</span>
                      <span className="text-xs text-muted-foreground">{arrival.roomType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{arrival.eta}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {arrival.hkStatus === 'Clean' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : arrival.hkStatus === 'Dirty' ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span className="text-muted-foreground">{arrival.hkStatus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getBadgeColor(arrival.status)
                    )}>
                      {arrival.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleAction(arrival)}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={arrival.status === "Checked In"}
                    >
                      {arrival.status === "Checked In" ? "Checked In" : "Check In"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedArrival && (
          <RoomProfileModal 
            room={selectedArrival} 
            onClose={() => { setSelectedArrival(null); setWizardMode(null); }} 
            initialWizard={wizardMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const mockDepartures = [
  { id: "DEP-001", guest: "Jane Smith", roomType: "Standard Double", roomNumber: "102", time: "10:30", vip: false, status: "Due Out", balance: "$0.00" },
  { id: "DEP-002", guest: "Sarah Miller", roomType: "Suite", roomNumber: "110", time: "11:00", vip: true, status: "Checked Out", balance: "$0.00" },
  { id: "DEP-003", guest: "William Hernandez", roomType: "Suite", roomNumber: "206", time: "12:00", vip: false, status: "Due Out", balance: "$45.50" },
];

function FrontDeskDepartures() {
  const [statusFilter, setStatusFilter] = React.useState("All Departures");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [selectedDeparture, setSelectedDeparture] = React.useState<any | null>(null);
  const [wizardMode, setWizardMode] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (departure: any) => {
    const room: Room = {
      number: departure.roomNumber,
      type: departure.roomType,
      status: "Departure",
      hkStatus: "Clean", // Default for departure view
      guestName: departure.guest
    };
    setSelectedDeparture(room);
    setWizardMode("Check Out");
  };

  const filteredDepartures = useMemo(() => {
    return mockDepartures.filter(dep => {
      if (statusFilter === "All Departures") return true;
      if (statusFilter === "VIP Only") return dep.vip;
      if (statusFilter === "Has Balance") return dep.balance !== "$0.00";
      return dep.status === statusFilter;
    });
  }, [statusFilter]);

  return (
    <div className="relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-6">
        {/* Legend & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Checked Out</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Due Out</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Has Balance</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="bg-secondary border-none rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Departures</option>
              <option>Due Out</option>
              <option>Checked Out</option>
              <option>Has Balance</option>
              <option>VIP Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Departures List */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Balance</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredDepartures.map((departure, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{departure.guest}</span>
                      {departure.vip && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider">VIP</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{departure.roomNumber}</span>
                      <span className="text-xs text-muted-foreground">{departure.roomType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{departure.time}</td>
                  <td className="px-6 py-4">
                    <span className={cn("font-medium", departure.balance !== "$0.00" ? "text-red-500" : "text-emerald-500")}>
                      {departure.balance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getBadgeColor(departure.status)
                    )}>
                      {departure.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleAction(departure)}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={departure.status === "Checked Out"}
                    >
                      {departure.status === "Checked Out" ? "Checked Out" : "Check Out"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedDeparture && (
          <RoomProfileModal 
            room={selectedDeparture} 
            onClose={() => { setSelectedDeparture(null); setWizardMode(null); }} 
            initialWizard={wizardMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const mockReservations = [
  { id: "RES-1042", guest: "David Lee", roomType: "Standard King", checkIn: "Oct 12", checkOut: "Oct 15", status: "Confirmed", amount: "$450.00", source: "Direct" },
  { id: "RES-1043", guest: "Emma Watson", roomType: "Suite", checkIn: "Oct 14", checkOut: "Oct 18", status: "Pending", amount: "$1200.00", source: "Booking.com" },
  { id: "RES-1044", guest: "Oliver Twist", roomType: "Standard Double", checkIn: "Oct 15", checkOut: "Oct 16", status: "Cancelled", amount: "$150.00", source: "Expedia" },
  { id: "RES-1045", guest: "Sophia Loren", roomType: "Suite", checkIn: "Oct 16", checkOut: "Oct 20", status: "Confirmed", amount: "$1500.00", source: "Direct" },
];

function FrontDeskReservations() {
  const [statusFilter, setStatusFilter] = React.useState("All Reservations");

  const filteredReservations = useMemo(() => {
    return mockReservations.filter(res => {
      if (statusFilter === "All Reservations") return true;
      return res.status === statusFilter;
    });
  }, [statusFilter]);

  return (
    <div>
      <div className="mb-6">
        {/* Legend & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Cancelled</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="bg-secondary border-none rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Reservations</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room Type</th>
                <th className="px-6 py-4 font-medium">Check In</th>
                <th className="px-6 py-4 font-medium">Check Out</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredReservations.map((res, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-muted-foreground">{res.id}</td>
                  <td className="px-6 py-4 font-medium">{res.guest}</td>
                  <td className="px-6 py-4 text-muted-foreground">{res.roomType}</td>
                  <td className="px-6 py-4">{res.checkIn}</td>
                  <td className="px-6 py-4">{res.checkOut}</td>
                  <td className="px-6 py-4 text-muted-foreground">{res.source}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getBadgeColor(res.status)
                    )}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{res.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FrontDeskTimeline() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const dates = useMemo(() => {
    const today = new Date();
    // Generate next 14 days
    return Array.from({length: 14}, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        date: d,
        dayStr: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    });
  }, []);

  const rooms = ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "201", "202", "203", "204", "205", "206", "207", "208"];

  // Mock bookings with start index (0-13) and duration
  const bookings = useMemo(() => [
    { room: "101", guest: "John Doe", startIdx: 0, duration: 3, status: "Stay Over", color: "bg-blue-500" },
    { room: "101", guest: "Alice Smith", startIdx: 4, duration: 2, status: "Confirmed", color: "bg-emerald-500" },
    { room: "102", guest: "Jane Smith", startIdx: 0, duration: 1, status: "Departure", color: "bg-amber-500" },
    { room: "103", guest: "Alice Johnson", startIdx: 0, duration: 4, status: "Arrival", color: "bg-emerald-500" },
    { room: "105", guest: "OOS - Maintenance", startIdx: 0, duration: 2, status: "OOS", color: "bg-red-500" },
    { room: "106", guest: "Robert Brown", startIdx: 0, duration: 5, status: "Stay Over", color: "bg-blue-500" },
    { room: "108", guest: "Michael Wilson", startIdx: 0, duration: 3, status: "Arrival", color: "bg-emerald-500" },
    { room: "110", guest: "Sarah Miller", startIdx: 0, duration: 1, status: "Departure", color: "bg-amber-500" },
    { room: "201", guest: "David Garcia", startIdx: 0, duration: 2, status: "Stay Over", color: "bg-blue-500" },
    { room: "203", guest: "James Rodriguez", startIdx: 0, duration: 4, status: "Arrival", color: "bg-emerald-500" },
    { room: "204", guest: "OOS - Plumbing", startIdx: 0, duration: 3, status: "OOS", color: "bg-red-500" },
    { room: "205", guest: "Maria Martinez", startIdx: 0, duration: 6, status: "Stay Over", color: "bg-blue-500" },
    { room: "206", guest: "William Hernandez", startIdx: 0, duration: 1, status: "Departure", color: "bg-amber-500" },
    { room: "208", guest: "Richard Lopez", startIdx: 0, duration: 3, status: "Arrival", color: "bg-emerald-500" },
    
    // Future bookings
    { room: "102", guest: "Tom Clark", startIdx: 2, duration: 3, status: "Confirmed", color: "bg-emerald-500" },
    { room: "104", guest: "Lucy Liu", startIdx: 1, duration: 4, status: "Confirmed", color: "bg-emerald-500" },
    { room: "107", guest: "Emily Davis", startIdx: 0, duration: 2, status: "Stay Over", color: "bg-blue-500" },
    { room: "107", guest: "Mark Taylor", startIdx: 3, duration: 5, status: "Confirmed", color: "bg-emerald-500" },
    { room: "110", guest: "Anna White", startIdx: 2, duration: 4, status: "Confirmed", color: "bg-emerald-500" },
    { room: "201", guest: "Chris Evans", startIdx: 3, duration: 2, status: "Confirmed", color: "bg-emerald-500" },
    { room: "202", guest: "Paul Rudd", startIdx: 1, duration: 5, status: "Confirmed", color: "bg-emerald-500" },
    { room: "206", guest: "Brie Larson", startIdx: 2, duration: 3, status: "Confirmed", color: "bg-emerald-500" },
  ], []);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-none mb-6">
        {/* Legend & Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-muted-foreground">Stay Over</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-muted-foreground">Arrival / Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm font-medium text-muted-foreground">Departure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-muted-foreground">Out of Order</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => showToast("Timeline reset to today")} className="bg-secondary border-none rounded-lg px-3 py-2 text-sm outline-none cursor-pointer hover:bg-secondary/80 transition-colors">
              Today
            </button>
            <select className="bg-secondary border-none rounded-lg px-3 py-2 text-sm outline-none cursor-pointer">
              <option>14 Days</option>
              <option>7 Days</option>
              <option>30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 bg-card rounded-2xl shadow-sm border border-border overflow-hidden relative">
        <div className="absolute inset-0 overflow-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="sticky top-0 left-0 z-30 bg-secondary/90 backdrop-blur border-b border-r border-border p-4 min-w-[120px] text-left font-semibold shadow-[2px_2px_0_0_rgba(0,0,0,0.05)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.02)]">
                  Room
                </th>
                {dates.map((d, i) => (
                  <th key={i} className={cn(
                    "sticky top-0 z-20 bg-secondary/90 backdrop-blur border-b border-r border-border p-3 min-w-[120px] text-center font-medium shadow-[0_2px_0_0_rgba(0,0,0,0.05)] dark:shadow-[0_2px_0_0_rgba(255,255,255,0.02)]",
                    i === 0 && "bg-violet-100/50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                  )}>
                    <div className="text-xs uppercase tracking-wider opacity-70">{d.dayStr}</div>
                    <div className="text-sm">{d.dateStr}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rooms.map(room => {
                const roomBookings = bookings.filter(b => b.room === room);
                return (
                  <tr key={room} className="hover:bg-secondary/20 transition-colors">
                    <td className="sticky left-0 z-20 bg-card border-b border-r border-border p-4 font-medium shadow-[2px_0_0_0_rgba(0,0,0,0.05)] dark:shadow-[2px_0_0_0_rgba(255,255,255,0.02)]">
                      {room}
                    </td>
                    {dates.map((_, i) => {
                      // Check if a booking starts on this day
                      const booking = roomBookings.find(b => b.startIdx === i);
                      
                      return (
                        <td key={i} className={cn(
                          "border-b border-r border-border relative h-14 p-1",
                          i === 0 && "bg-violet-50/30 dark:bg-violet-900/10"
                        )}>
                          {booking && (
                            <div 
                              className={cn(
                                "absolute top-1.5 bottom-1.5 left-1 rounded-md px-3 py-1.5 text-xs text-white font-medium shadow-sm flex items-center overflow-hidden z-10 cursor-pointer hover:brightness-110 transition-all",
                                booking.color
                              )}
                              style={{ 
                                width: `calc(${booking.duration * 100}% - 8px)`,
                              }}
                              title={`${booking.guest} (${booking.status})`}
                            >
                              <span className="truncate">{booking.guest}</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FrontDeskBilling() {
  const { folios, addFolioItem, closeFolio } = useFolios();
  const { bookings } = useBookings();
  const [selectedFolio, setSelectedFolio] = useState<Folio | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    description: "",
    amount: 0,
    type: "Charge" as const,
    category: "Other" as const
  });

  const handleAddItem = async () => {
    if (!selectedFolio) return;
    await addFolioItem(selectedFolio.id, newItem);
    setIsAddingItem(false);
    setNewItem({ description: "", amount: 0, type: "Charge", category: "Other" });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Folio List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold">Active Folios</h3>
          <div className="space-y-2">
            {folios.filter(f => f.status === "Open").map(folio => {
              const booking = bookings.find(b => b.id === folio.bookingId);
              return (
                <button
                  key={folio.id}
                  onClick={() => setSelectedFolio(folio)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all",
                    selectedFolio?.id === folio.id 
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]" 
                      : "bg-card text-card-foreground border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">{booking?.guestName || "Unknown Guest"}</span>
                    <span className="text-xs opacity-80">Room {folio.roomNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Balance</span>
                    <span className="text-lg font-bold">${folio.totalBalance.toFixed(2)}</span>
                  </div>
                </button>
              );
            })}
            {folios.filter(f => f.status === "Open").length === 0 && (
              <div className="p-8 text-center text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border">
                No active folios found.
              </div>
            )}
          </div>
        </div>

        {/* Folio Details */}
        <div className="lg:col-span-2">
          {selectedFolio ? (
            <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden flex flex-col h-[70vh]">
              <div className="p-6 border-b border-border bg-secondary/10 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Folio Details</h3>
                  <p className="text-sm text-muted-foreground">ID: {selectedFolio.id}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsAddingItem(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                  <button 
                    onClick={() => closeFolio(selectedFolio.id)}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-secondary/80 transition-all"
                  >
                    Close Folio
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr className="text-muted-foreground border-b border-border">
                      <th className="pb-4 font-bold text-left">Date</th>
                      <th className="pb-4 font-bold text-left">Description</th>
                      <th className="pb-4 font-bold text-left">Category</th>
                      <th className="pb-4 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {selectedFolio.items.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-4 text-muted-foreground">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="font-medium">{item.description}</div>
                          <div className="text-[10px] uppercase tracking-wider font-bold opacity-50">{item.type}</div>
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-wider">
                            {item.category}
                          </span>
                        </td>
                        <td className={cn(
                          "py-4 text-right font-bold",
                          item.type === "Charge" ? "text-rose-500" : "text-emerald-500"
                        )}>
                          {item.type === "Charge" ? "+" : "-"}${item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-secondary/10 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Balance</span>
                  <span className={cn(
                    "text-3xl font-black",
                    selectedFolio.totalBalance > 0 ? "text-rose-500" : "text-emerald-500"
                  )}>
                    ${selectedFolio.totalBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[70vh] flex flex-col items-center justify-center bg-card rounded-3xl border border-border border-dashed text-muted-foreground">
              <Receipt className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a folio to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-xl font-bold">Add Folio Item</h3>
                <button onClick={() => setIsAddingItem(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                  <input 
                    type="text" 
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 transition-all"
                    placeholder="e.g. Mini Bar Charge"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</label>
                    <input 
                      type="number" 
                      value={newItem.amount}
                      onChange={(e) => setNewItem({...newItem, amount: parseFloat(e.target.value)})}
                      className="w-full bg-secondary border-none rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</label>
                    <select 
                      value={newItem.type}
                      onChange={(e) => setNewItem({...newItem, type: e.target.value as any})}
                      className="w-full bg-secondary border-none rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 transition-all"
                    >
                      <option value="Charge">Charge</option>
                      <option value="Payment">Payment</option>
                      <option value="Adjustment">Adjustment</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value as any})}
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50 transition-all"
                  >
                    <option value="Room">Room</option>
                    <option value="F&B">F&B</option>
                    <option value="Tax">Tax</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-secondary/10 border-t border-border flex gap-3">
                <button 
                  onClick={() => setIsAddingItem(false)}
                  className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddItem}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all"
                >
                  Add Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FrontDesk({ aiEnabled, activeSubmenu = "Overview" }: FrontDeskProps) {
  const { loading: roomsLoading } = useRooms();
  const { loading: guestsLoading } = useGuests();
  const { loading: bookingsLoading } = useBookings();
  const { loading: foliosLoading } = useFolios();

  if (roomsLoading || guestsLoading || bookingsLoading || foliosLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <FrontDeskOverview aiEnabled={aiEnabled} />;
      case "VIP Arrivals":
        return <VIPArrivals />;
      case "Guest Profiles":
        return <GuestProfiles />;
      case "Concierge Desk":
        return <ConciergeDesk />;
      case "Rooms":
        return <FrontDeskRooms />;
      case "Arrivals":
        return <FrontDeskArrivals />;
      case "Departures":
        return <FrontDeskDepartures />;
      case "Reservations":
        return <FrontDeskReservations />;
      case "Timeline":
        return <FrontDeskTimeline />;
      case "Billing":
        return <FrontDeskBilling />;
      case "Settings":
        return <FrontDeskSettings />;
      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Front Desk</h2>
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



function FrontDeskSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Front Desk Settings</h3>
          <p className="text-sm text-muted-foreground">Configure global parameters for check-in, billing, and guest profiles.</p>
        </div>
        <div className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-primary" />
              Check-In & Check-Out
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Mobile Check-In</p>
                  <p className="text-sm text-muted-foreground">Allow guests to check in via the mobile app.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Default Check-Out Time</p>
                  <p className="text-sm text-muted-foreground">Standard time guests are expected to depart.</p>
                </div>
                <input type="time" defaultValue="11:00" className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              Billing & Folios
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Auto-Email Folio</p>
                  <p className="text-sm text-muted-foreground">Automatically send folio to guest email upon check-out.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Pre-Authorization Amount</p>
                  <p className="text-sm text-muted-foreground">Default hold amount for incidentals per night.</p>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input type="number" defaultValue="50" className="bg-background border border-border rounded-lg pl-7 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 w-24" />
                </div>
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

function GenericView({ title }: { title: string }) {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">{title}</h3>
        <button onClick={() => showToast(`Opening Add New ${title} dialog...`)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
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

function VIPArrivals() {
  const vipArrivals = [
    { id: "VIP-001", name: "Alexander Wright", level: "Diamond", eta: "14:30", flight: "BA 112", room: "Penthouse Suite", host: "Sarah Jenkins", requests: "Feather-free room, chilled champagne" },
    { id: "VIP-002", name: "Elena Rostova", level: "Platinum", eta: "16:00", flight: "AF 009", room: "Suite 402", host: "Michael Chen", requests: "Extra hangers, late checkout requested" },
    { id: "VIP-003", name: "David & Emma Thompson", level: "Gold", eta: "11:15", flight: "Private", room: "Suite 310", host: "Unassigned", requests: "Anniversary setup, rose petals" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search VIP arrivals..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vipArrivals.map((vip) => (
          <div key={vip.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{vip.name}</h3>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 mt-1">
                  <Crown className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{vip.level}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{vip.eta}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                  <Plane className="w-3 h-3" /> {vip.flight}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 flex-1 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <DoorOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assigned Room</p>
                  <p className="font-medium">{vip.room}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assigned Host/Butler</p>
                  <p className={cn("font-medium", vip.host === "Unassigned" ? "text-red-500" : "")}>{vip.host}</p>
                </div>
              </div>
              <div className="p-3 bg-secondary/30 rounded-xl border border-border/50 text-sm mt-2">
                <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Special Requests</p>
                <p className="italic">{vip.requests}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-auto pt-4 border-t border-border">
              <button className="flex-1 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                View Profile
              </button>
              <button className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                {vip.host === "Unassigned" ? "Assign Host" : "Update Status"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuestProfiles() {
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  const guests = [
    { id: "G-10042", name: "Eleanor Rigby", email: "eleanor.r@example.com", phone: "+44 7700 900077", loyalty: "Platinum", points: 145000, stays: 24, lastStay: "2025-11-12", preferences: ["High Floor", "Extra Pillows", "Earl Grey Tea"], allergies: ["Peanuts"] },
    { id: "G-10043", name: "Marcus Johnson", email: "mjohnson@example.com", phone: "+1 555 0198", loyalty: "Gold", points: 45000, stays: 8, lastStay: "2026-01-05", preferences: ["Near Elevator", "Late Checkout"], allergies: [] },
    { id: "G-10044", name: "Sophia Martinez", email: "smartinez@example.com", phone: "+34 600 123 456", loyalty: "Silver", points: 12000, stays: 3, lastStay: "2026-03-20", preferences: ["Sparkling Water", "Firm Mattress"], allergies: ["Gluten"] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New Profile
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Guest Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Loyalty Status</th>
                <th className="px-4 py-3 font-medium">Total Stays</th>
                <th className="px-4 py-3 font-medium">Last Stay</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {guests.map((guest) => (
                <tr key={guest.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold">{guest.name}</div>
                    <div className="text-xs text-muted-foreground">{guest.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{guest.email}</div>
                    <div className="text-xs text-muted-foreground">{guest.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      guest.loyalty === "Platinum" ? "bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800" :
                      guest.loyalty === "Gold" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}>
                      {guest.loyalty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{guest.stays}</td>
                  <td className="p-4 text-muted-foreground text-sm">{guest.lastStay}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => setSelectedGuest(guest)}
                      className="px-3 py-1.5 bg-secondary text-foreground rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedGuest && (
          <GuestProfileModal guest={selectedGuest} onClose={() => setSelectedGuest(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function GuestProfileModal({ guest, onClose }: { guest: any, onClose: () => void }) {
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
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
              {guest.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                {guest.name}
                <span className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                  guest.loyalty === "Platinum" ? "bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800" :
                  guest.loyalty === "Gold" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                  "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}>
                  {guest.loyalty}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">{guest.id} • {guest.points.toLocaleString()} Points</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6">
              <div className="bg-secondary/20 p-4 rounded-xl border border-border">
                <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{guest.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{guest.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>London, United Kingdom</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/20 p-4 rounded-xl border border-border">
                <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Stay Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">{guest.stays}</p>
                    <p className="text-xs text-muted-foreground">Total Stays</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">42</p>
                    <p className="text-xs text-muted-foreground">Total Nights</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-lg font-bold text-foreground">$18,450</p>
                    <p className="text-xs text-muted-foreground">Lifetime Spend</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" /> Preferences
                  </h4>
                  <ul className="space-y-2">
                    {guest.preferences.map((pref: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm bg-secondary/30 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {pref}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-red-800 dark:text-red-300">
                    <AlertCircle className="w-4 h-4" /> Allergies & Alerts
                  </h4>
                  {guest.allergies.length > 0 ? (
                    <ul className="space-y-2">
                      {guest.allergies.map((allergy: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 font-medium bg-red-100/50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                          {allergy}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No known allergies.</p>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border bg-secondary/30">
                  <h4 className="font-bold text-sm">Recent Stay History</h4>
                </div>
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">Dates</th>
                      <th className="px-4 py-3 font-medium">Room</th>
                      <th className="px-4 py-2 font-medium text-right">Rate</th>
                      <th className="px-4 py-2 font-medium text-right">Total Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="hover:bg-secondary/30 transition-colors group">
                      <td className="px-4 py-3">Nov 12 - Nov 15, 2025</td>
                      <td className="px-4 py-3">Penthouse Suite</td>
                      <td className="px-4 py-3 text-right">$850</td>
                      <td className="px-4 py-3 text-right font-medium">$3,240</td>
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors group">
                      <td className="px-4 py-3">Aug 05 - Aug 08, 2025</td>
                      <td className="px-4 py-3">Suite 402</td>
                      <td className="px-4 py-3 text-right">$650</td>
                      <td className="px-4 py-3 text-right font-medium">$2,100</td>
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors group">
                      <td className="px-4 py-3">Mar 10 - Mar 12, 2025</td>
                      <td className="px-4 py-3">Suite 310</td>
                      <td className="px-4 py-3 text-right">$650</td>
                      <td className="px-4 py-3 text-right font-medium">$1,450</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Close
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            Edit Profile
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ConciergeDesk() {
  const [isLogRequestModalOpen, setIsLogRequestModalOpen] = useState(false);

  const requests = [
    { id: "REQ-101", guest: "Alexander Wright", room: "Penthouse", type: "Restaurant", details: "Reservation at Le Bernardin for 2 at 20:00", status: "Confirmed", time: "Today, 10:00 AM" },
    { id: "REQ-102", guest: "Elena Rostova", room: "402", type: "Transportation", details: "Airport transfer to JFK tomorrow at 08:00 AM", status: "Pending", time: "Today, 11:30 AM" },
    { id: "REQ-103", guest: "David Thompson", room: "310", type: "Tickets", details: "2 Tickets for Hamilton tonight", status: "In Progress", time: "Today, 12:15 PM" },
    { id: "REQ-104", guest: "Sarah Miller", room: "110", type: "Amenities", details: "Extra feather pillows and chamomile tea", status: "Completed", time: "Yesterday, 21:00 PM" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
      case "Completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Pending":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "In Progress":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Restaurant": return <Coffee className="w-4 h-4" />;
      case "Transportation": return <Car className="w-4 h-4" />;
      case "Tickets": return <Star className="w-4 h-4" />;
      case "Amenities": return <Bed className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search requests..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsLogRequestModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Log Request
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Request ID</th>
                <th className="px-4 py-3 font-medium">Guest & Room</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Details</th>
                <th className="px-4 py-3 font-medium">Logged At</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium text-muted-foreground">{req.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold">{req.guest}</div>
                    <div className="text-xs text-muted-foreground">Room {req.room}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="p-1.5 bg-secondary rounded-md text-muted-foreground">
                        {getTypeIcon(req.type)}
                      </div>
                      {req.type}
                    </div>
                  </td>
                  <td className="p-4 text-sm max-w-xs truncate" title={req.details}>{req.details}</td>
                  <td className="p-4 text-muted-foreground text-sm">{req.time}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      getStatusColor(req.status)
                    )}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-3 py-1.5 bg-secondary text-foreground rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isLogRequestModalOpen && (
          <LogConciergeRequestModal onClose={() => setIsLogRequestModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function LogConciergeRequestModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Log Concierge Request</h3>
            <p className="text-sm text-muted-foreground">Record a new request or inquiry from a guest.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Guest Name / Room <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select Guest...</option>
                  <option value="1">Alexander Wright (Penthouse)</option>
                  <option value="2">Elena Rostova (402)</option>
                  <option value="3">David Thompson (310)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Request Type <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select Type...</option>
                  <option value="restaurant">Restaurant Reservation</option>
                  <option value="transportation">Transportation / Car Service</option>
                  <option value="tickets">Tickets / Entertainment</option>
                  <option value="amenities">Room Amenities</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Request Details <span className="text-red-500">*</span></label>
                <textarea 
                  rows={4} 
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                  placeholder="Provide full details of the guest's request..."
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Required</label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Required</label>
                <input type="time" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Initial Status</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="pending">Pending (Needs Action)</option>
                  <option value="in-progress">In Progress (Working on it)</option>
                  <option value="confirmed">Confirmed (Action Completed)</option>
                </select>
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
            Save Request
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
