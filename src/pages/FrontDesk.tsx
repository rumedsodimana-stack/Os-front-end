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
  const [selectedFloor, setSelectedFloor] = React.useState("Ground");
  const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null);

  const floors = ["Ground", "Floor 1", "Floor 2", "Floor 3"];
  
  const getRoomStatusColor = (status: RoomStatus, hkStatus: HKStatus) => {
    if (status === "Vacant" && hkStatus === "Clean") {
      return "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800";
    }
    if (status === "Vacant" && hkStatus === "Dirty") {
      return "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800";
    }
    if (status === "Stay Over") {
      return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
    }
    if (status === "Arrival") {
      return "bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800";
    }
    if (status === "Departure") {
      return "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800";
    }
    if (status === "OOS") {
      return "bg-gray-100 border-gray-300 dark:bg-gray-900/20 dark:border-gray-800";
    }
    return "bg-card border-border";
  };

  const getStatusLabel = (status: RoomStatus, hkStatus: HKStatus) => {
    if (status === "Vacant" && hkStatus === "Clean") return "Available - Clean";
    if (status === "Vacant" && hkStatus === "Dirty") return "Available - Dirty";
    if (status === "Stay Over") return "Occupied";
    if (status === "Arrival") return "Arriving Today";
    if (status === "Departure") return "Departing Today";
    if (status === "OOS") return "Out of Service";
    return status;
  };

  const floorRooms = useMemo(() => {
    const floorNum = floors.indexOf(selectedFloor);
    return mockRooms.filter(room => {
      const roomFloor = parseInt(room.number.charAt(0)) || 0;
      return roomFloor === floorNum;
    });
  }, [selectedFloor]);

  const stats = useMemo(() => {
    const total = mockRooms.length;
    const available = mockRooms.filter(r => r.status === "Vacant" && r.hkStatus === "Clean").length;
    const occupied = mockRooms.filter(r => r.status === "Stay Over").length;
    const arrivals = mockRooms.filter(r => r.status === "Arrival").length;
    const departures = mockRooms.filter(r => r.status === "Departure").length;
    return {
      total,
      available,
      occupied,
      availablePercent: Math.round((available / total) * 100),
      arrivals,
      departures,
    };
  }, []);

  const selectedRoomData = selectedRoom ? mockRooms.find(r => r.number === selectedRoom) : null;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-foreground">Room Plan</h1>
        </div>

        {/* Summary stats bar */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Rooms</p>
            <p className="text-lg font-bold">{stats.total}</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Available</p>
            <p className="text-lg font-bold">{stats.available}</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Occupied %</p>
            <p className="text-lg font-bold">{stats.occupiedPercent || 0}%</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Arriving Today</p>
            <p className="text-lg font-bold text-violet-600">{stats.arrivals}</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Departing Today</p>
            <p className="text-lg font-bold text-orange-600">{stats.departures}</p>
          </div>
        </div>

        {/* Floor tabs */}
        <div className="flex gap-2">
          {floors.map(floor => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                selectedFloor === floor
                  ? "bg-violet-600 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-4 items-center text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-emerald-200 bg-emerald-50"></div>
          <span className="text-muted-foreground">Available (Clean)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-amber-200 bg-amber-50"></div>
          <span className="text-muted-foreground">Available (Dirty)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-blue-200 bg-blue-50"></div>
          <span className="text-muted-foreground">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-violet-200 bg-violet-50"></div>
          <span className="text-muted-foreground">Arriving Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-orange-200 bg-orange-50"></div>
          <span className="text-muted-foreground">Departing Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-100"></div>
          <span className="text-muted-foreground">Out of Service</span>
        </div>
      </div>

      {/* Room grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {floorRooms.map(room => (
          <motion.button
            key={room.number}
            onClick={() => setSelectedRoom(room.number)}
            className={cn(
              "p-4 rounded-xl border-2 text-left transition-all hover:shadow-md",
              getRoomStatusColor(room.status, room.hkStatus),
              selectedRoom === room.number && "ring-2 ring-violet-500"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl font-bold mb-1">{room.number}</div>
            <div className="text-xs text-muted-foreground mb-2 line-clamp-1">{room.type}</div>
            {room.guest && <div className="text-xs font-medium mb-2 line-clamp-1">{room.guest}</div>}
            <div className="text-xs font-medium text-muted-foreground">{getStatusLabel(room.status, room.hkStatus)}</div>
          </motion.button>
        ))}
      </div>

      {/* Room detail panel */}
      <AnimatePresence>
        {selectedRoomData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRoom(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              onClick={e => e.stopPropagation()}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-card rounded-l-3xl shadow-2xl border-l border-border overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Room {selectedRoomData.number}</h2>
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Room Type</p>
                    <p className="font-semibold">{selectedRoomData.type}</p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="font-semibold">{getStatusLabel(selectedRoomData.status, selectedRoomData.hkStatus)}</p>
                  </div>

                  {selectedRoomData.guest && (
                    <div className="bg-secondary/30 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Guest Name</p>
                      <p className="font-semibold">{selectedRoomData.guest}</p>
                    </div>
                  )}

                  <div className="bg-secondary/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Housekeeping Status</p>
                    <p className="font-semibold">{selectedRoomData.hkStatus}</p>
                  </div>

                  {selectedRoomData.notes && (
                    <div className="bg-secondary/30 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="font-semibold text-orange-600">{selectedRoomData.notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border space-y-2">
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors">
                      Check In
                    </button>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
                      Check Out
                    </button>
                    <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 rounded-lg transition-colors">
                      Assign Guest
                    </button>
                    <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 rounded-lg transition-colors">
                      Raise Issue
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  const [showNewBooking, setShowNewBooking] = React.useState(false);
  const [bookingStep, setBookingStep] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState("All Reservations");

  const [searchParams, setSearchParams] = React.useState({
    checkIn: "2024-10-12",
    checkOut: "2024-10-15",
    adults: 1,
    children: 0,
    roomType: "Suite",
  });

  const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null);
  const [guestDetails, setGuestDetails] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    idType: "Passport",
    idNumber: "",
    specialRequests: "",
  });

  const [paymentMethod, setPaymentMethod] = React.useState("Room Account");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [bookingNumber, setBookingNumber] = React.useState("");

  const mockAvailableRooms = [
    { id: "suite-101", type: "Suite", amenities: ["WiFi", "Mini Bar", "Jacuzzi"], nightly: 250, total: 750, photos: "🏨" },
    { id: "deluxe-102", type: "Deluxe Room", amenities: ["WiFi", "Mini Bar", "Balcony"], nightly: 180, total: 540, photos: "🏨" },
    { id: "standard-103", type: "Standard Room", amenities: ["WiFi", "Air-Con"], nightly: 120, total: 360, photos: "🏨" },
    { id: "family-104", type: "Family Suite", amenities: ["WiFi", "Kitchen", "2 Bathrooms"], nightly: 300, total: 900, photos: "🏨" },
  ];

  const filteredReservations = React.useMemo(() => {
    return mockReservations.filter(res => {
      if (statusFilter === "All Reservations") return true;
      return res.status === statusFilter;
    });
  }, [statusFilter]);

  const handleNewBooking = () => {
    setShowNewBooking(true);
    setBookingStep(1);
  };

  const handleCheckAvailability = () => {
    setBookingStep(2);
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoom(roomId);
    setBookingStep(3);
  };

  const handleGuestDetailsSubmit = () => {
    setBookingStep(4);
  };

  const handleConfirmBooking = () => {
    const newBookingNumber = `BK-2024-${Math.floor(Math.random() * 9000) + 1000}`;
    setBookingNumber(newBookingNumber);
    setShowSuccess(true);
    setTimeout(() => {
      setShowNewBooking(false);
      setShowSuccess(false);
      setBookingStep(1);
    }, 2000);
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "Direct": return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300";
      case "Booking.com": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300";
      case "Expedia": return "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Reservations</h1>
          <button
            onClick={handleNewBooking}
            className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-medium px-6 py-2 rounded-lg transition-all"
          >
            New Booking
          </button>
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

      {/* Reservations Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room Type</th>
                <th className="px-6 py-4 font-medium">Nights</th>
                <th className="px-6 py-4 font-medium">Check In</th>
                <th className="px-6 py-4 font-medium">Check Out</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredReservations.map((res, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-muted-foreground">{res.id}</td>
                  <td className="px-6 py-4 font-medium">{res.guest}</td>
                  <td className="px-6 py-4 text-muted-foreground">{res.roomType}</td>
                  <td className="px-6 py-4 text-muted-foreground">3</td>
                  <td className="px-6 py-4">{res.checkIn}</td>
                  <td className="px-6 py-4">{res.checkOut}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getSourceBadgeColor(res.source))}>
                      {res.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getBadgeColor(res.status))}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{res.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-violet-600 hover:text-violet-700 font-medium text-xs mr-3">Modify</button>
                    <button className="text-red-600 hover:text-red-700 font-medium text-xs">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Booking Modal */}
      <AnimatePresence>
        {showNewBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewBooking(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                {!showSuccess ? (
                  <>
                    {/* Progress indicator */}
                    <div className="mb-8">
                      <div className="flex justify-between mb-4">
                        {[1, 2, 3, 4].map(step => (
                          <div
                            key={step}
                            className={cn(
                              "h-2 flex-1 rounded-full mx-1 transition-colors",
                              step <= bookingStep ? "bg-violet-600" : "bg-secondary"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Step {bookingStep} of 4: {
                          bookingStep === 1 ? "Search" :
                          bookingStep === 2 ? "Select Room" :
                          bookingStep === 3 ? "Guest Details" :
                          "Confirm Booking"
                        }
                      </p>
                    </div>

                    {/* Step 1: Search */}
                    {bookingStep === 1 && (
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-6">Search Availability</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Check-In Date</label>
                            <input
                              type="date"
                              value={searchParams.checkIn}
                              onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                              className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Check-Out Date</label>
                            <input
                              type="date"
                              value={searchParams.checkOut}
                              onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                              className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Adults</label>
                            <input
                              type="number"
                              min="1"
                              value={searchParams.adults}
                              onChange={(e) => setSearchParams({...searchParams, adults: parseInt(e.target.value)})}
                              className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Children</label>
                            <input
                              type="number"
                              min="0"
                              value={searchParams.children}
                              onChange={(e) => setSearchParams({...searchParams, children: parseInt(e.target.value)})}
                              className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Room Type</label>
                          <select
                            value={searchParams.roomType}
                            onChange={(e) => setSearchParams({...searchParams, roomType: e.target.value})}
                            className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none cursor-pointer"
                          >
                            <option>Suite</option>
                            <option>Deluxe Room</option>
                            <option>Standard Room</option>
                            <option>Family Suite</option>
                          </select>
                        </div>
                        <button
                          onClick={handleCheckAvailability}
                          className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-medium py-3 rounded-lg mt-6 transition-all"
                        >
                          Check Availability
                        </button>
                      </div>
                    )}

                    {/* Step 2: Select Room */}
                    {bookingStep === 2 && (
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-6">Select Room</h2>
                        <div className="space-y-3">
                          {mockAvailableRooms.map(room => (
                            <motion.div
                              key={room.id}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => handleSelectRoom(room.id)}
                              className="bg-secondary/30 rounded-2xl p-4 border-2 border-border hover:border-violet-500 cursor-pointer transition-all"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-bold text-lg">{room.type}</h3>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {room.amenities.map(amenity => (
                                      <span key={amenity} className="text-xs bg-card rounded-full px-2 py-1">{amenity}</span>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-violet-600">${room.nightly}</p>
                                  <p className="text-xs text-muted-foreground">per night</p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">Total: <span className="font-bold text-lg">${room.total}</span></p>
                                <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-1 rounded-lg text-sm font-medium">
                                  Select
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Guest Details */}
                    {bookingStep === 3 && (
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-6">Guest Details</h2>
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name</label>
                          <input
                            type="text"
                            value={guestDetails.fullName}
                            onChange={(e) => setGuestDetails({...guestDetails, fullName: e.target.value})}
                            className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                              type="email"
                              value={guestDetails.email}
                              onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                              className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Phone</label>
                            <input
                              type="tel"
                              value={guestDetails.phone}
                              onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
                              className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Nationality</label>
                            <input
                              type="text"
                              value={guestDetails.nationality}
                              onChange={(e) => setGuestDetails({...guestDetails, nationality: e.target.value})}
                              className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">ID Type</label>
                            <select
                              value={guestDetails.idType}
                              onChange={(e) => setGuestDetails({...guestDetails, idType: e.target.value})}
                              className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none cursor-pointer"
                            >
                              <option>Passport</option>
                              <option>Drivers License</option>
                              <option>National ID</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">ID Number</label>
                          <input
                            type="text"
                            value={guestDetails.idNumber}
                            onChange={(e) => setGuestDetails({...guestDetails, idNumber: e.target.value})}
                            className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Special Requests</label>
                          <textarea
                            value={guestDetails.specialRequests}
                            onChange={(e) => setGuestDetails({...guestDetails, specialRequests: e.target.value})}
                            className="w-full bg-secondary border-none rounded-lg px-4 py-2 outline-none resize-none"
                            rows={3}
                            placeholder="Any special requests..."
                          />
                        </div>
                        <button
                          onClick={handleGuestDetailsSubmit}
                          className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-medium py-3 rounded-lg mt-6 transition-all"
                        >
                          Continue to Confirmation
                        </button>
                      </div>
                    )}

                    {/* Step 4: Confirm */}
                    {bookingStep === 4 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Confirm Booking</h2>

                        {/* Summary */}
                        <div className="bg-secondary/30 rounded-2xl p-6 space-y-3">
                          <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Guest:</span>
                            <span className="font-medium">{guestDetails.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-In:</span>
                            <span className="font-medium">{searchParams.checkIn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-Out:</span>
                            <span className="font-medium">{searchParams.checkOut}</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-border">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-bold text-lg">$750</span>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                          <label className="block text-sm font-medium mb-3">Payment Method</label>
                          <div className="grid grid-cols-2 gap-2">
                            {["Room Account", "Credit Card", "Corporate Account", "OTA Collect"].map(method => (
                              <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={cn(
                                  "p-3 rounded-lg border-2 transition-all text-sm font-medium",
                                  paymentMethod === method
                                    ? "border-violet-600 bg-violet-50 dark:bg-violet-900/20 text-violet-600"
                                    : "border-border bg-secondary/30 text-muted-foreground hover:border-violet-300"
                                )}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleConfirmBooking}
                          className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-bold py-3 rounded-lg transition-all text-lg"
                        >
                          Confirm Booking
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Booking Confirmed</p>
                      <p className="text-2xl font-bold">{bookingNumber}</p>
                    </div>
                  </div>
                )}

                {/* Close button */}
                {!showSuccess && (
                  <button
                    onClick={() => setShowNewBooking(false)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

