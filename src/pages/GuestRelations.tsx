import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useGuests, Guest } from "../context/GuestContext";
import { useRooms } from "../context/RoomContext";
import { 
  HeartHandshake, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Award, 
  MessageCircle, 
  Crown,
  X,
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Coffee,
  Info,
  Clock,
  Users,
  TrendingDown
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

interface GuestRelationsProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

export function GuestRelations({ aiEnabled, activeSubmenu }: GuestRelationsProps) {
  const { guests, loading } = useGuests();
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

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
        return <GuestRelationsOverview onSelectGuest={setSelectedGuest} />;
      case "Feedback":
        return <FeedbackView />;
      case "VIP Tracking":
        return <VIPTracking onSelectGuest={setSelectedGuest} />;
      case "Loyalty Program":
        return <LoyaltyProgramView />;
      case "Settings":

        return <GuestRelationsSettings />;

      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Guest Relations</h2>
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

      <AnimatePresence>
        {selectedGuest && (
          <GuestProfileModal 
            guest={selectedGuest} 
            onClose={() => setSelectedGuest(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}


function GuestRelationsOverview({ onSelectGuest }: { onSelectGuest: (guest: Guest) => void }) {
  const { guests } = useGuests();
  const { rooms } = useRooms();
  const vipsInHouse = guests.filter(g => g.vip).slice(0, 5);
  
  const avgSatisfaction = "4.8/5"; 
  const vipCount = guests.filter(g => g.vip).length;
  const loyaltyMembers = guests.filter(g => g.loyaltyStatus !== "Standard").length;

  const getGuestRoom = (guestId: string) => {
    const room = rooms.find(r => r.guestId === guestId);
    return room ? `Room ${room.number}` : "Not checked in";
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Guest Satisfaction" 
          value={avgSatisfaction} 
          change="+0.2 vs last month" 
          trend="up" 
          icon={Star} 
          color="emerald" 
        />
        <KPICard 
          label="VIPs In-House" 
          value={vipCount.toString()} 
          change="Real-time" 
          trend="up" 
          icon={Crown} 
          color="purple" 
        />
        <KPICard 
          label="Loyalty Members" 
          value={loyaltyMembers.toString()} 
          change="Total" 
          trend="up" 
          icon={Award} 
          color="blue" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-500" />
                VIPs In-House
              </h3>
              <button className="text-sm text-primary font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {vipsInHouse.map(guest => (
                <div 
                  key={guest.id} 
                  onClick={() => onSelectGuest(guest)}
                  className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {guest.firstName[0]}{guest.lastName[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{guest.firstName} {guest.lastName}</h4>
                      <p className="text-xs text-muted-foreground">{guest.loyaltyStatus} Member • {getGuestRoom(guest.id)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-foreground">Last Request</p>
                      <p className="text-[10px] text-muted-foreground">Extra pillows (Fulfilled)</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Loyalty Trends
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Diamond Members</span>
                  <span className="font-bold">12%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "12%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Platinum Members</span>
                  <span className="font-bold">28%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "28%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Gold Members</span>
                  <span className="font-bold">60%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feedback() {
  return (
    <div className="flex flex-col items-center justify-center h-[40vh] text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Guest Feedback</h2>
      <p className="text-muted-foreground">Manage guest reviews and feedback here.</p>
    </div>
  );
}

function VIPTracking({ onSelectGuest }: { onSelectGuest: (guest: Guest) => void }) {
  const { guests } = useGuests();
  const [isAddVIPModalOpen, setIsAddVIPModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuests = useMemo(() => {
    return guests.filter(g => g.vip).filter(g => 
      `${g.firstName} ${g.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [guests, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search VIP guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
        <button 
          onClick={() => setIsAddVIPModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add VIP Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuests.map(guest => (
          <motion.div
            key={guest.id}
            layoutId={guest.id}
            onClick={() => onSelectGuest(guest)}
            className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                guest.loyaltyStatus === "Diamond" ? "bg-purple-100 text-purple-700" :
                guest.loyaltyStatus === "Platinum" ? "bg-blue-100 text-blue-700" :
                guest.loyaltyStatus === "Gold" ? "bg-amber-100 text-amber-700" :
                "bg-gray-100 text-gray-700"
              )}>
                {guest.loyaltyStatus}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-primary">
                {guest.firstName[0]}{guest.lastName[0]}
              </div>
              <div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {guest.firstName} {guest.lastName}
                </h4>
                <p className="text-xs text-muted-foreground">{guest.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-secondary/30 p-2 rounded-xl">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Stays</p>
                <p className="text-sm font-bold">{guest.totalStays}</p>
              </div>
              <div className="bg-secondary/30 p-2 rounded-xl">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Spend</p>
                <p className="text-sm font-bold">${guest.totalSpend?.toLocaleString() || '0'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground">Last stay: {guest.lastStay ? new Date(guest.lastStay).toLocaleDateString() : 'N/A'}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAddVIPModalOpen && (
          <AddVIPModal onClose={() => setIsAddVIPModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function GuestProfileModal({ guest, onClose }: { guest: Guest, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "preferences">("overview");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        className="bg-card w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-border bg-secondary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
              {guest.firstName[0]}{guest.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold text-foreground">{guest.firstName} {guest.lastName}</h3>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                  guest.loyaltyStatus === "Diamond" ? "bg-purple-100 text-purple-700" :
                  guest.loyaltyStatus === "Platinum" ? "bg-blue-100 text-blue-700" :
                  guest.loyaltyStatus === "Gold" ? "bg-amber-100 text-amber-700" :
                  "bg-gray-100 text-gray-700"
                )}>
                  {guest.loyaltyStatus} Member
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {guest.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {guest.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {guest.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-8 bg-card">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "history", label: "Stay History", icon: Calendar },
            { id: "preferences", label: "Preferences", icon: HeartHandshake }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative",
                activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-secondary/5">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <KPICard 
                    label="Loyalty Points" 
                    value={guest.loyaltyPoints?.toLocaleString() || '0'} 
                    change="Next tier: 2,460 pts away" 
                    trend="neutral" 
                    icon={Award} 
                    color="amber" 
                  />
                  <KPICard 
                    label="Lifetime Spend" 
                    value={`$${guest.totalSpend?.toLocaleString() || '0'}`} 
                    change="+15% from last year" 
                    trend="up" 
                    icon={DollarSign} 
                    color="emerald" 
                  />
                  <KPICard 
                    label="Total Stays" 
                    value={guest.totalStays || '0'} 
                    change="Member since 2021" 
                    trend="neutral" 
                    icon={Calendar} 
                    color="blue" 
                  />
                </div>

                {/* Spend Chart */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                  <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Spending Trends (Last 6 Months)
                  </h4>
                  <div className="h-64 w-full flex items-center justify-center text-muted-foreground italic text-sm">
                    Spending data visualization coming soon...
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
              >
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr className="bg-secondary/30 border-b border-border">
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Stay Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Room Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground italic">
                        Stay history visualization coming soon...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div 
                key="preferences"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      Guest Preferences
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {guest.preferences?.map(pref => (
                        <span key={pref} className="px-3 py-1.5 bg-secondary/50 text-foreground rounded-xl text-xs font-medium flex items-center gap-2">
                          <ShieldCheck className="w-3 h-3 text-primary" />
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-primary" />
                      F&B Preferences
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Loves sparkling water in the room. Prefers breakfast at 8:30 AM. Allergic to peanuts.
                    </p>
                  </div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
                  <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    Internal Notes
                  </h4>
                  <div className="flex-1 bg-secondary/20 p-4 rounded-xl border border-border/50 text-xs text-muted-foreground italic leading-relaxed">
                    "{guest.notes}"
                  </div>
                  <button className="mt-4 w-full py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-xs font-medium transition-colors">
                    Edit Notes
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border bg-secondary/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            Last updated: Today at 09:15 AM
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-xs font-medium hover:bg-secondary transition-colors">
              Export Profile
            </button>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm">
              Edit Guest Details
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddVIPModal({ onClose }: { onClose: () => void }) {
  const { addGuest } = useGuests();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    loyaltyStatus: "Standard" as const,
    vip: true,
    preferences: [] as string[],
    totalStays: 0,
    totalSpend: 0,
    loyaltyPoints: 0,
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGuest(formData);
      onClose();
    } catch (error) {
      console.error("Failed to add VIP:", error);
    }
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
            <h3 className="text-lg font-bold text-foreground">Add VIP Profile</h3>
            <p className="text-sm text-muted-foreground">Register a new VIP guest.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="add-vip-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="First Name" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="Last Name" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="Email" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">VIP Level</label>
                <select 
                  value={formData.loyaltyStatus}
                  onChange={(e) => setFormData({...formData, loyaltyStatus: e.target.value as any})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="Standard">Standard</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Diamond">Diamond</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Preferences & Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" 
                  placeholder="Enter guest preferences, allergies, special requests..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="add-vip-form"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeedbackView() {
  const [feedbacks] = useState([
    { id: 1, guest: "Sarah Miller", rating: 5, comment: "Exceptional service at the rooftop bar!", date: "2 hours ago", status: "Resolved" },
    { id: 2, guest: "Robert Chen", rating: 4, comment: "Room was great, but check-in was a bit slow.", date: "5 hours ago", status: "Pending" },
    { id: 3, guest: "Elena Rodriguez", rating: 5, comment: "The spa treatment was world-class.", date: "Yesterday", status: "Resolved" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Guest Feedback</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            Filter
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Export Report
          </button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {feedbacks.map(fb => (
          <motion.div 
            key={fb.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {fb.guest.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{fb.guest}</h4>
                  <p className="text-xs text-muted-foreground">{fb.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < fb.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
                ))}
              </div>
            </div>
            <p className="text-sm text-foreground mb-4 italic">"{fb.comment}"</p>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                fb.status === "Resolved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              )}>
                {fb.status}
              </span>
              <button className="text-xs font-bold text-primary hover:underline">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LoyaltyProgramView() {
  const { guests } = useGuests();
  const loyaltyMembers = guests.filter(g => g.loyaltyStatus !== "Standard");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Total Members" 
          value={loyaltyMembers.length.toString()} 
          change="+12 this month" 
          trend="up" 
          icon={Users} 
          color="emerald" 
        />
        <KPICard 
          label="Avg Points" 
          value="4,250" 
          change="Across all tiers" 
          trend="neutral" 
          icon={Award} 
          color="amber" 
        />
        <KPICard 
          label="Redemption Rate" 
          value="24%" 
          change="-2% from last month" 
          trend="down" 
          icon={TrendingDown} 
          color="rose" 
        />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-secondary/30">
          <h3 className="font-bold">Loyalty Members</h3>
        </div>
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
            <tr className="bg-secondary/10 border-b border-border">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Tier</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Points</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {loyaltyMembers.map(member => (
              <tr key={member.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{member.firstName} {member.lastName}</p>
                      <p className="text-[10px] text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                    member.loyaltyStatus === "Diamond" ? "bg-purple-100 text-purple-700" :
                    member.loyaltyStatus === "Platinum" ? "bg-blue-100 text-blue-700" :
                    member.loyaltyStatus === "Gold" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-700"
                  )}>
                    {member.loyaltyStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold">{member.loyaltyPoints?.toLocaleString() || '0'}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold uppercase">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



function GuestRelationsSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Guest Relations Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for GuestRelations will be available here.</p>
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
