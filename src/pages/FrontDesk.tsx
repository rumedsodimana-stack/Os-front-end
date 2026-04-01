import React, { useMemo } from "react";
import { Users, DoorOpen, Key, DollarSign, TrendingUp, TrendingDown, Bed, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion, AnimatePresence } from "motion/react";

const getBadgeColor = (status: string) => {
  switch (status) {
    case "Confirmed":
    case "Checked In":
    case "Checked Out":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Pending":
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

type RoomStatus = "Stay Over" | "Arrival" | "Departure" | "OOS" | "Vacant";
type HKStatus = "Clean" | "Dirty" | "Inspected";

interface Room {
  number: string;
  type: string;
  status: RoomStatus;
  hkStatus: HKStatus;
  guest?: string;
  notes?: string;
}

const mockRooms: Room[] = [
  { number: "101", type: "Standard King", status: "Stay Over", hkStatus: "Clean", guest: "John Doe" },
  { number: "102", type: "Standard Double", status: "Departure", hkStatus: "Dirty", guest: "Jane Smith" },
  { number: "103", type: "Suite", status: "Arrival", hkStatus: "Clean", guest: "Alice Johnson" },
  { number: "104", type: "Standard King", status: "Vacant", hkStatus: "Inspected" },
  { number: "105", type: "Standard Double", status: "OOS", hkStatus: "Dirty", notes: "AC broken" },
  { number: "106", type: "Suite", status: "Stay Over", hkStatus: "Clean", guest: "Robert Brown" },
  { number: "107", type: "Standard King", status: "Stay Over", hkStatus: "Dirty", guest: "Emily Davis" },
  { number: "108", type: "Standard Double", status: "Arrival", hkStatus: "Clean", guest: "Michael Wilson" },
  { number: "109", type: "Standard King", status: "Vacant", hkStatus: "Clean" },
  { number: "110", type: "Suite", status: "Departure", hkStatus: "Dirty", guest: "Sarah Miller" },
  { number: "201", type: "Standard King", status: "Stay Over", hkStatus: "Clean", guest: "David Garcia" },
  { number: "202", type: "Standard Double", status: "Vacant", hkStatus: "Inspected" },
  { number: "203", type: "Suite", status: "Arrival", hkStatus: "Clean", guest: "James Rodriguez" },
  { number: "204", type: "Standard King", status: "OOS", hkStatus: "Dirty", notes: "Plumbing issue" },
  { number: "205", type: "Standard Double", status: "Stay Over", hkStatus: "Clean", guest: "Maria Martinez" },
  { number: "206", type: "Suite", status: "Departure", hkStatus: "Dirty", guest: "William Hernandez" },
  { number: "207", type: "Standard King", status: "Vacant", hkStatus: "Clean" },
  { number: "208", type: "Standard Double", status: "Arrival", hkStatus: "Clean", guest: "Richard Lopez" },
];

function FrontDeskOverview({ aiEnabled }: { aiEnabled: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Analytic Overview</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Arrivals", value: "45", change: "+4% Last Month", icon: DoorOpen, bg: "bg-gradient-to-r from-pink-400 to-pink-500" },
          { label: "In-House", value: "128", change: "+1% Last Month", icon: Users, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
          { label: "Departures", value: "32", change: "-2% Last Month", icon: Key, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
          { label: "Revenue", value: "$12,896", change: "+8% Last Month", icon: DollarSign, bg: "bg-gradient-to-r from-yellow-400 to-yellow-500" },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-2xl p-6 shadow-sm text-white relative overflow-hidden", stat.bg)}>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-lg font-medium text-white/90">{stat.label}</p>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-white/80">{stat.change}</p>
            </div>
            {/* Decorative background shape */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        ))}
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
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-violet-600">60%</span>
              <span className="text-xs text-muted-foreground">Occupied</span>
            </div>
          </div>
          <div className="flex justify-between mt-4 border-t border-border pt-4">
            <div className="text-center">
              <p className="text-sm font-bold">1598</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
            </div>
            <div className="text-center border-l border-r border-border px-6">
              <p className="text-sm font-bold text-violet-600">958</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Occupied</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-400">640</p>
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
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Booking ID</th>
                  <th className="px-4 py-3 font-medium">Guest</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  { id: "#00458", name: "Kishor Behera", date: "9 Oct 2023", amount: "$165.80", status: "Confirmed" },
                  { id: "#00459", name: "Santosh Sahu", date: "9 Oct 2023", amount: "$210.50", status: "Pending" },
                  { id: "#00460", name: "Kishor Behera", date: "9 Oct 2023", amount: "$165.80", status: "Confirmed" },
                  { id: "#00461", name: "Kishor Behera", date: "9 Oct 2023", amount: "$165.80", status: "Confirmed" },
                  { id: "#00462", name: "Santosh Sahu", date: "9 Oct 2023", amount: "$210.50", status: "Pending" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{row.id}</td>
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                    <td className="px-4 py-3 font-medium">{row.amount}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getBadgeColor(row.status))}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
            <table className="w-full text-sm text-left">
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
  const [floorFilter, setFloorFilter] = React.useState("All Floors");
  const [statusFilter, setStatusFilter] = React.useState("All Statuses");

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "Stay Over": return "bg-blue-100/60 border-blue-200 text-blue-900 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300";
      case "Arrival": return "bg-emerald-100/60 border-emerald-200 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300";
      case "Departure": return "bg-amber-100/60 border-amber-200 text-amber-900 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300";
      case "OOS": return "bg-red-100/60 border-red-200 text-red-900 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300";
      case "Vacant": return "bg-card border-border text-foreground";
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
    return mockRooms.filter(room => {
      const floorMatch = floorFilter === "All Floors" || room.number.startsWith(floorFilter.replace("Floor ", ""));
      const statusMatch = statusFilter === "All Statuses" || room.status === statusFilter;
      return floorMatch && statusMatch;
    });
  }, [floorFilter, statusFilter]);

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Room List</h1>
        </div>

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {filteredRooms.map((room) => (
          <div 
            key={room.number} 
            className={cn(
              "p-4 rounded-2xl border shadow-sm flex flex-col gap-3 transition-all hover:shadow-md cursor-pointer", 
              getStatusColor(room.status)
            )}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold">{room.number}</h3>
              <div className="flex gap-1" title={`Housekeeping: ${room.hkStatus}`}>
                {room.hkStatus === 'Clean' || room.hkStatus === 'Inspected' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-semibold truncate" title={room.guest || room.notes || "Vacant"}>
                {room.guest || room.notes || "Vacant"}
              </p>
              <p className="text-xs opacity-70 truncate" title={room.type}>{room.type}</p>
            </div>
            
            <div className="mt-auto pt-2 flex justify-between items-center text-xs font-medium opacity-80 border-t border-current/10">
              <span>{room.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const mockArrivals = [
  { id: "ARR-001", guest: "Alice Johnson", roomType: "Suite", roomNumber: "103", eta: "14:00", vip: true, status: "Pending", hkStatus: "Clean" },
  { id: "ARR-002", guest: "Michael Wilson", roomType: "Standard Double", roomNumber: "108", eta: "15:30", vip: false, status: "Checked In", hkStatus: "Clean" },
  { id: "ARR-003", guest: "James Rodriguez", roomType: "Suite", roomNumber: "203", eta: "16:00", vip: true, status: "Pending", hkStatus: "Clean" },
  { id: "ARR-004", guest: "Richard Lopez", roomType: "Standard Double", roomNumber: "208", eta: "18:00", vip: false, status: "Pending", hkStatus: "Clean" },
  { id: "ARR-005", guest: "Emma Thompson", roomType: "Standard King", roomNumber: "Unassigned", eta: "19:30", vip: false, status: "Pending", hkStatus: "N/A" },
];

function FrontDeskArrivals() {
  const [statusFilter, setStatusFilter] = React.useState("All Arrivals");

  const filteredArrivals = useMemo(() => {
    return mockArrivals.filter(arr => {
      if (statusFilter === "All Arrivals") return true;
      if (statusFilter === "VIP Only") return arr.vip;
      return arr.status === statusFilter;
    });
  }, [statusFilter]);

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Arrival List</h1>
        </div>

        {/* Legend & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Checked In</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Pending</span>
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
              <option>Pending</option>
              <option>Checked In</option>
              <option>VIP Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Arrivals List */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
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
    </div>
  );
}

const mockDepartures = [
  { id: "DEP-001", guest: "Jane Smith", roomType: "Standard Double", roomNumber: "102", time: "10:30", vip: false, status: "Pending", balance: "$0.00" },
  { id: "DEP-002", guest: "Sarah Miller", roomType: "Suite", roomNumber: "110", time: "11:00", vip: true, status: "Checked Out", balance: "$0.00" },
  { id: "DEP-003", guest: "William Hernandez", roomType: "Suite", roomNumber: "206", time: "12:00", vip: false, status: "Pending", balance: "$45.50" },
];

function FrontDeskDepartures() {
  const [statusFilter, setStatusFilter] = React.useState("All Departures");

  const filteredDepartures = useMemo(() => {
    return mockDepartures.filter(dep => {
      if (statusFilter === "All Departures") return true;
      if (statusFilter === "VIP Only") return dep.vip;
      if (statusFilter === "Has Balance") return dep.balance !== "$0.00";
      return dep.status === statusFilter;
    });
  }, [statusFilter]);

  return (
    <div>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Departure List</h1>
        </div>

        {/* Legend & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Checked Out</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm font-medium text-muted-foreground">Pending</span>
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
              <option>Pending</option>
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
          <table className="w-full text-sm text-left">
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
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={departure.status === "Checked Out" || departure.balance !== "$0.00"}
                      title={departure.balance !== "$0.00" ? "Clear balance before checkout" : ""}
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
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Reservation List</h1>
        </div>

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
          <table className="w-full text-sm text-left">
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
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex-none sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Timeline</h1>
        </div>

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
            <button className="bg-secondary border-none rounded-lg px-3 py-2 text-sm outline-none cursor-pointer hover:bg-secondary/80 transition-colors">
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
          <table className="w-full border-collapse min-w-max">
            <thead>
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
            <tbody>
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

export function FrontDesk({ aiEnabled, activeSubmenu = "Overview" }: FrontDeskProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <FrontDeskOverview aiEnabled={aiEnabled} />;
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
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Front Desk - {activeSubmenu}</h2>
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

