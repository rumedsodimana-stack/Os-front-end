import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  BarChart2, 
  Users,
  X,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';

interface SalesAndRevenueProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

const revenueData = [
  { name: 'Jan', revpar: 120, adr: 150, occupancy: 65 },
  { name: 'Feb', revpar: 132, adr: 155, occupancy: 70 },
  { name: 'Mar', revpar: 145, adr: 165, occupancy: 75 },
  { name: 'Apr', revpar: 155, adr: 175, occupancy: 82 },
  { name: 'May', revpar: 168, adr: 185, occupancy: 85 },
  { name: 'Jun', revpar: 180, adr: 195, occupancy: 90 },
  { name: 'Jul', revpar: 195, adr: 210, occupancy: 95 },
];

const channelData = [
  { name: 'Direct', value: 45 },
  { name: 'Booking.com', value: 25 },
  { name: 'Expedia', value: 15 },
  { name: 'Corporate', value: 10 },
  { name: 'Other', value: 5 },
];

export function SalesAndRevenue({ aiEnabled, activeSubmenu }: SalesAndRevenueProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <SalesOverview aiEnabled={aiEnabled} />;
      case "Rate Management":
        return <RateManagement />;
      case "Channel Manager":
        return <ChannelManager />;
      case "Contracts":
        return <Contracts />;
      case "Settings":
        return <SalesSettings />;
      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Sales & Revenue</h2>
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

function SalesOverview({ aiEnabled }: { aiEnabled: boolean }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="RevPAR" 
          value="$145.20" 
          change="+8.5% vs last year" 
          trend="up" 
          icon={TrendingUp} 
          color="emerald" 
        />
        <KPICard 
          label="ADR" 
          value="$185.00" 
          change="+2.1% vs last month" 
          trend="up" 
          icon={DollarSign} 
          color="blue" 
        />
        <KPICard 
          label="Occupancy" 
          value="78.5%" 
          change="+5.2% vs last year" 
          trend="up" 
          icon={BarChart2} 
          color="purple" 
        />
        <KPICard 
          label="Group Sales MTD" 
          value="$45,200" 
          change="-2% vs target" 
          trend="down" 
          icon={Users} 
          color="amber" 
        />
      </div>

      {aiEnabled && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Sparkles className="w-24 h-24 text-indigo-500" />
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                Revenue Insights
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase tracking-wider font-bold">AI Generated</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-3xl">
                Based on current booking velocity and historical data, we project a 12% increase in RevPAR for the upcoming weekend. Consider adjusting the "Summer Special" rate slightly upward to maximize yield.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  Review Rate Recommendations
                </button>
                <button className="px-4 py-2 bg-background border border-border hover:bg-secondary text-foreground text-sm font-medium rounded-lg transition-colors">
                  View Full Analysis
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-foreground">Revenue Trends (YTD)</h3>
              <p className="text-xs text-muted-foreground">RevPAR and ADR progression</p>
            </div>
            <select className="bg-secondary border-none text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/50">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevpar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAdr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="adr" name="ADR" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAdr)" />
                <Area type="monotone" dataKey="revpar" name="RevPAR" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevpar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-foreground">Channel Mix</h3>
              <p className="text-xs text-muted-foreground">Revenue by source</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="opacity-10" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} className="text-muted-foreground" />
                <Tooltip 
                  cursor={{ fill: 'currentColor', opacity: 0.05 }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(value) => [`${value}%`, 'Share']}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24}>
                  {
                    channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#8b5cf6' : index === 1 ? '#3b82f6' : index === 2 ? '#10b981' : index === 3 ? '#f59e0b' : '#64748b'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function RateManagement() {
  const [isAddRateModalOpen, setIsAddRateModalOpen] = useState(false);

  const rates = [
    { id: "BAR", name: "Best Available Rate", baseRate: "$185.00", policy: "Flexible (24h)", minStay: 1, maxStay: 30, status: "Active" },
    { id: "CORP", name: "Corporate Standard", baseRate: "$150.00", policy: "Flexible (24h)", minStay: 1, maxStay: 30, status: "Active" },
    { id: "ADV", name: "Advance Purchase", baseRate: "$145.00", policy: "Non-Refundable", minStay: 2, maxStay: 14, status: "Active" },
    { id: "SUM", name: "Summer Special", baseRate: "$210.00", policy: "Strict (7 days)", minStay: 3, maxStay: 14, status: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Rate Plans</h3>
        <button 
          onClick={() => setIsAddRateModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Rate Plan
        </button>
      </div>
      
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rate Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Base Rate</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Min/Max Stay</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell className="font-medium">{rate.id}</TableCell>
                <TableCell className="font-semibold text-foreground">{rate.name}</TableCell>
                <TableCell>{rate.baseRate}</TableCell>
                <TableCell className="text-muted-foreground">{rate.policy}</TableCell>
                <TableCell className="text-muted-foreground">{rate.minStay} / {rate.maxStay} nights</TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    rate.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-secondary text-muted-foreground"
                  )}>
                    {rate.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AnimatePresence>
        {isAddRateModalOpen && (
          <AddRateModal onClose={() => setIsAddRateModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddRateModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Add New Rate Plan</h3>
            <p className="text-sm text-muted-foreground">Configure pricing and restrictions.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Rate Plan Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Summer Special 2026" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Rate ($) <span className="text-red-500">*</span></label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cancellation Policy</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Flexible (24h)</option>
                  <option>Non-Refundable</option>
                  <option>Strict (7 days)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Stay (Nights)</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="1" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Stay (Nights)</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="30" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Min. Advance Booking (Days)</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max. Advance Booking (Days)</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="365" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Occupancy</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="1" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Occupancy</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="4" />
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
            Save Rate Plan
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ChannelManager() {
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);

  const channels = [
    { id: 1, name: "Booking.com", status: "Connected", sync: "2 mins ago", bookings: 145, revenue: "$42,500" },
    { id: 2, name: "Expedia", status: "Connected", sync: "5 mins ago", bookings: 89, revenue: "$28,100" },
    { id: 3, name: "Airbnb", status: "Connected", sync: "12 mins ago", bookings: 34, revenue: "$12,400" },
    { id: 4, name: "Agoda", status: "Disconnected", sync: "2 days ago", bookings: 0, revenue: "$0" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">OTA Connections</h3>
        <button 
          onClick={() => setIsAddChannelModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Channel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map(channel => (
          <div key={channel.id} className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-foreground">
                {channel.name.charAt(0)}
              </div>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                channel.status === "Connected" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
              )}>
                {channel.status}
              </span>
            </div>
            <h4 className="font-bold text-foreground mb-1">{channel.name}</h4>
            <p className="text-sm text-muted-foreground mb-4">Last sync: {channel.sync}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">MTD Bookings</p>
                <p className="font-semibold">{channel.bookings}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">MTD Revenue</p>
                <p className="font-semibold text-emerald-600">{channel.revenue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAddChannelModalOpen && (
          <AddChannelModal onClose={() => setIsAddChannelModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddChannelModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Add New Channel</h3>
            <p className="text-sm text-muted-foreground">Configure OTA or distribution channel connection.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Channel Name <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option value="">Select a channel...</option>
                  <option>Booking.com</option>
                  <option>Expedia</option>
                  <option>Airbnb</option>
                  <option>Agoda</option>
                  <option>TripAdvisor</option>
                  <option>Hotelbeds</option>
                  <option>Other / Custom XML</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Connection Type</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>2-Way XML API</option>
                  <option>iCal Sync</option>
                  <option>Manual Extranet</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Commission Rate (%)</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="15.0" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">API Key / Hotel ID <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Enter credentials provided by OTA" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Sync Frequency</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Real-time (Instant)</option>
                  <option>Every 5 minutes</option>
                  <option>Every 15 minutes</option>
                  <option>Hourly</option>
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
            Connect Channel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Contracts() {
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);

  const contracts = [
    { id: "C-2026-01", company: "TechCorp Inc.", type: "Corporate", rateCode: "CORP-TECH", expiry: "Dec 31, 2026", status: "Active" },
    { id: "C-2026-02", company: "Global Travel Agency", type: "Wholesale", rateCode: "WHL-GTA", expiry: "Mar 31, 2027", status: "Active" },
    { id: "C-2026-03", company: "Aviation Partners", type: "Crew", rateCode: "CREW-AP", expiry: "Jun 30, 2026", status: "Pending Renewal" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Corporate & Group Contracts</h3>
        <button 
          onClick={() => setIsNewContractModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Contract
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rate Code</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.id}</TableCell>
                <TableCell className="font-semibold text-foreground">{contract.company}</TableCell>
                <TableCell>{contract.type}</TableCell>
                <TableCell className="text-muted-foreground">{contract.rateCode}</TableCell>
                <TableCell className="text-muted-foreground">{contract.expiry}</TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    contract.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {contract.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AnimatePresence>
        {isNewContractModalOpen && (
          <NewContractModal onClose={() => setIsNewContractModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function NewContractModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">New Contract</h3>
            <p className="text-sm text-muted-foreground">Create a new corporate or group contract.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Company / Group Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. TechCorp Inc." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contract Type</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Corporate</option>
                  <option>Wholesale</option>
                  <option>Group / Event</option>
                  <option>Crew</option>
                  <option>Government</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rate Code <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. CORP-TECH" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount (%) or Fixed Rate</label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 15% or $120" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Room Nights (Annual)</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="100" />
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
            Save Contract
          </button>
        </div>
      </motion.div>
    </motion.div>
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

function SalesSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Sales & Revenue Settings</h3>
          <p className="text-sm text-muted-foreground">Configure global parameters for rates, channels, and contracts.</p>
        </div>
        <div className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Pricing & Revenue
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Dynamic Pricing Engine</p>
                  <p className="text-sm text-muted-foreground">Automatically adjust rates based on occupancy and demand.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Default Currency</p>
                  <p className="text-sm text-muted-foreground">Base currency for all rate plans and reporting.</p>
                </div>
                <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Channel Manager
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Auto-Sync Inventory</p>
                  <p className="text-sm text-muted-foreground">Push availability changes to OTAs immediately.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Overbooking Protection</p>
                  <p className="text-sm text-muted-foreground">Hold back a percentage of inventory to prevent overbooking.</p>
                </div>
                <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50">
                  <option>0% (Sell all)</option>
                  <option>2%</option>
                  <option>5%</option>
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
