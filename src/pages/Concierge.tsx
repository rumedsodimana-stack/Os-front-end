import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Car, 
  Ticket, 
  Info,
  X,
  CheckCircle2,
  MoreVertical,
  Bot,
  Send,
  Sparkles,
  Utensils,
  ShoppingBag,
  Coffee
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";

interface ConciergeProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function Concierge({ aiEnabled, activeSubmenu }: ConciergeProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <ConciergeOverview />;
      case "Guest Requests":
        return <GuestRequests />;
      case "Local Info":
        return <LocalInfo />;
      case "Transport":
        return <Transport />;
      case "Concierge Kiosk":
        return <ConciergeKiosk />;
      case "Settings":

        return <ConciergeSettings />;

      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Concierge</h2>
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

function ConciergeOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Active Requests" 
          value="18" 
          change="5 pending" 
          trend="up" 
          icon={MessageSquare} 
          color="blue" 
        />
        <KPICard 
          label="Transport Bookings" 
          value="12" 
          change="3 today" 
          trend="neutral" 
          icon={Car} 
          color="emerald" 
        />
        <KPICard 
          label="Tickets/Tours" 
          value="8" 
          change="$1,200 revenue" 
          trend="up" 
          icon={Ticket} 
          color="purple" 
        />
        <KPICard 
          label="Local Info Queries" 
          value="45" 
          change="Top: Restaurants" 
          trend="neutral" 
          icon={Info} 
          color="amber" 
        />
      </div>
    </div>
  );
}

function GuestRequests() {
  const [isAddRequestModalOpen, setIsAddRequestModalOpen] = useState(false);

  const requests = [
    { id: "REQ-001", guest: "John Doe", room: "305", type: "Restaurant Reservation", status: "Pending", time: "10:30 AM" },
    { id: "REQ-002", guest: "Sarah Smith", room: "412", type: "Tour Booking", status: "In Progress", time: "09:15 AM" },
    { id: "REQ-003", guest: "Mike Johnson", room: "208", type: "Transportation", status: "Completed", time: "Yesterday" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Guest Requests</h3>
        <button 
          onClick={() => setIsAddRequestModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>
      
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Req ID</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{req.id}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{req.guest}</td>
                  <td className="px-6 py-4">{req.room}</td>
                  <td className="px-6 py-4 text-muted-foreground">{req.type}</td>
                  <td className="px-6 py-4 text-muted-foreground">{req.time}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      req.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" : 
                      req.status === "In Progress" ? "bg-blue-500/10 text-blue-600" :
                      "bg-amber-500/10 text-amber-600"
                    )}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isAddRequestModalOpen && (
          <AddRequestModal onClose={() => setIsAddRequestModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddRequestModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">New Guest Request</h3>
            <p className="text-sm text-muted-foreground">Log a new request or inquiry.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Guest Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Number <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 305" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Request Type</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Restaurant Reservation</option>
                  <option>Tour Booking</option>
                  <option>Transportation</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Guests</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 4" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Details</label>
                <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Enter request details..."></textarea>
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

function LocalInfo() {
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);

  const places = [
    { id: 1, name: "The Grand Theater", category: "Attraction", distance: "0.5 miles", rating: "4.8", icon: Ticket },
    { id: 2, name: "Oceanview Seafood", category: "Restaurant", distance: "1.2 miles", rating: "4.6", icon: Utensils },
    { id: 3, name: "City Center Mall", category: "Shopping", distance: "2.0 miles", rating: "4.3", icon: ShoppingBag },
    { id: 4, name: "Historical Museum", category: "Attraction", distance: "0.8 miles", rating: "4.7", icon: MapPin },
    { id: 5, name: "Artisan Coffee Roasters", category: "Cafe", distance: "0.3 miles", rating: "4.9", icon: Coffee },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Local Recommendations</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search places..." 
              className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button 
            onClick={() => setIsAddPlaceModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Place
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map(place => (
          <div key={place.id} className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <place.icon className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                {place.category}
              </span>
            </div>
            <h4 className="font-bold text-foreground mb-1">{place.name}</h4>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <span>{place.distance}</span>
              <span>•</span>
              <span className="text-amber-500 font-medium flex items-center gap-1">★ {place.rating}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-sm font-medium transition-colors">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-medium transition-colors">
                Share with Guest
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAddPlaceModalOpen && (
          <AddPlaceModal onClose={() => setIsAddPlaceModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Transport() {
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  const bookings = [
    { id: "TR-101", guest: "Emma Watson", room: "502", type: "Airport Transfer", time: "Today, 14:00", driver: "Mike T.", status: "Confirmed" },
    { id: "TR-102", guest: "James Bond", room: "707", type: "Luxury Sedan", time: "Today, 19:30", driver: "Unassigned", status: "Pending" },
    { id: "TR-103", guest: "Sarah Jenkins", room: "215", type: "City Tour", time: "Tomorrow, 09:00", driver: "David L.", status: "Confirmed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Transportation Bookings</h3>
        <button 
          onClick={() => setIsNewBookingModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Booking
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Driver</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{booking.guest}</div>
                    <div className="text-xs text-muted-foreground">Room {booking.room}</div>
                  </td>
                  <td className="px-6 py-4">{booking.type}</td>
                  <td className="px-6 py-4 text-muted-foreground">{booking.time}</td>
                  <td className="px-6 py-4 text-muted-foreground">{booking.driver}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      booking.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    )}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isNewBookingModalOpen && (
          <NewTransportBookingModal onClose={() => setIsNewBookingModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddPlaceModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Add New Place</h3>
            <p className="text-sm text-muted-foreground">Add a new local recommendation.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Place Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. The Grand Theater" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Attraction</option>
                  <option>Restaurant</option>
                  <option>Shopping</option>
                  <option>Cafe</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Distance</label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 0.5 miles" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Capacity</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Enter place details..."></textarea>
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
            Save Place
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NewTransportBookingModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">New Transport Booking</h3>
            <p className="text-sm text-muted-foreground">Schedule a new transportation service.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Guest Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Emma Watson" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Number</label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 502" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Transport Type</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Airport Transfer</option>
                  <option>Luxury Sedan</option>
                  <option>City Tour</option>
                  <option>Shuttle Bus</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Time</label>
                <input type="datetime-local" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Passengers</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 4" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Luggage Pieces</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 2" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Special Requests</label>
                <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Child seat, wheelchair access, etc..."></textarea>
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
            Save Booking
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ConciergeKiosk() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome to OmniStay! I am your AI Concierge. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages([...newMessages, { 
        role: "assistant", 
        content: "I can certainly help with that! Let me check the available options for you. Is there anything else you need?" 
      }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* GenAI Chat Interface */}
      <div className="flex-1 bg-card rounded-3xl border border-border shadow-sm flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"></div>
        <div className="p-6 border-b border-border flex items-center gap-4 bg-secondary/20">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              Omni AI Concierge <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-sm text-muted-foreground">Always here to help</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4 max-w-[80%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.role === "user" ? "bg-secondary" : "bg-primary text-primary-foreground"
              )}>
                {msg.role === "user" ? "G" : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm",
                msg.role === "user" 
                  ? "bg-secondary text-foreground rounded-tr-sm" 
                  : "bg-primary/10 text-foreground rounded-tl-sm border border-primary/20"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              className="w-full pl-6 pr-14 py-4 bg-secondary/50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick Services */}
      <div className="w-80 flex flex-col gap-4">
        <div className="bg-card rounded-3xl border border-border shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">Quick Services</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors text-left group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">Order Room Service</div>
                <div className="text-xs text-muted-foreground">View menu & order</div>
              </div>
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors text-left group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">Request Items</div>
                <div className="text-xs text-muted-foreground">Towels, toiletries, etc.</div>
              </div>
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors text-left group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">Book Transport</div>
                <div className="text-xs text-muted-foreground">Taxi or airport transfer</div>
              </div>
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors text-left group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">Local Guide</div>
                <div className="text-xs text-muted-foreground">Explore the city</div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="bg-primary text-primary-foreground rounded-3xl shadow-sm p-6 flex-1 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
          <h3 className="font-bold text-xl mb-2 relative z-10">Need human assistance?</h3>
          <p className="text-primary-foreground/80 text-sm mb-6 relative z-10">Our concierge team is available 24/7 to help you with any special requests.</p>
          <button className="w-full py-3 bg-background text-foreground rounded-xl font-bold text-sm hover:bg-secondary transition-colors shadow-lg relative z-10">
            Call Concierge Desk
          </button>
        </div>
      </div>
    </div>
  );
}



function ConciergeSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Concierge Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for Concierge will be available here.</p>
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
