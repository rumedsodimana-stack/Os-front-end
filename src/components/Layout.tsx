import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  User, 
  Menu,
  X,
  Hotel,
  Sparkles,
  ConciergeBell,
  Brush,
  UtensilsCrossed,
  TrendingUp,
  Users,
  Wrench,
  LineChart,
  Settings,
  LogOut,
  ChevronDown,
  MapPin,
  Flower2,
  CalendarDays,
  Shield,
  Cpu,
  Calculator,
  Megaphone,
  ShoppingBag,
  CalendarCheck,
  Scale,
  Sliders,
  HeartHandshake,
  MessageSquare,
  Settings2,
  Command,
  BookOpen
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "../lib/utils";
import { AgenticAIPanel } from "./AgenticAIPanel";
import { motion, AnimatePresence } from "motion/react";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { CommandPalette } from "./CommandPalette";
import { formatDistanceToNow } from "date-fns";

type Department = 
  | "Front Desk" 
  | "Housekeeping" 
  | "Food & Beverage" 
  | "Sales & Revenue" 
  | "Human Resources" 
  | "Engineering" 
  | "Executive"
  | "Concierge"
  | "Spa & Wellness"
  | "Events & Banquets"
  | "Security"
  | "IT & Systems"
  | "Finance & Accounting"
  | "Marketing & PR"
  | "Purchasing & Procurement"
  | "Reservations"
  | "Legal & Compliance"
  | "Configuration"
  | "Guest Relations"
  | "Connect"
  | "Readme";

interface LayoutProps {
  children: React.ReactNode;
  activeDepartment: Department;
  setActiveDepartment: (dept: Department) => void;
  activeSubmenu: string;
  setActiveSubmenu: (sub: string) => void;
  aiEnabled: boolean;
  setAiEnabled: (enabled: boolean) => void;
}

const DEPARTMENTS: { name: Department; icon: React.ElementType; submenus: string[] }[] = [
  { name: "Front Desk", icon: ConciergeBell, submenus: ["Overview", "VIP Arrivals", "Guest Profiles", "Concierge Desk", "Rooms", "Arrivals", "Departures", "Reservations", "Timeline", "Billing"] },
  { name: "Housekeeping", icon: Brush, submenus: ["Overview", "Room Status", "Task List", "Lost & Found", "Inventory"] },
  { name: "Food & Beverage", icon: UtensilsCrossed, submenus: ["Overview", "Smart Menu (4D)", "POS", "Table Management", "Room Service", "Inventory"] },
  { name: "Sales & Revenue", icon: TrendingUp, submenus: ["Overview", "Rate Management", "Channel Manager", "Contracts"] },
  { name: "Human Resources", icon: Users, submenus: ["Overview", "Employee Directory", "Attendance", "Leave Management", "Payroll", "L&D", "Compliances", "Expense Management", "Recruiting", "Reports"] },
  { name: "Engineering", icon: Wrench, submenus: ["Overview", "Work Orders", "Preventive Maintenance", "Asset Management"] },
  { name: "Executive", icon: LineChart, submenus: ["Overview", "High-level KPIs", "Financials", "Strategic Planning"] },
  { name: "Concierge", icon: MapPin, submenus: ["Overview", "Guest Requests", "Local Info", "Transport", "Concierge Kiosk"] },
  { name: "Spa & Wellness", icon: Flower2, submenus: ["Overview", "Appointments", "Treatment Rooms", "Memberships"] },
  { name: "Events & Banquets", icon: CalendarDays, submenus: ["Overview", "Bookings", "Floor Plans", "AV Setup"] },
  { name: "Security", icon: Shield, submenus: ["Overview", "Surveillance", "Incident Logs", "Access Control"] },
  { name: "IT & Systems", icon: Cpu, submenus: ["Overview", "Network Status", "Support Tickets", "Hardware Inventory"] },
  { name: "Finance & Accounting", icon: Calculator, submenus: ["Overview", "Daily Revenue", "Accounts Payable", "Accounts Receivable", "General Ledger", "Budget & Forecast", "Tax & Compliance", "Audit Logs"] },
  { name: "Marketing & PR", icon: Megaphone, submenus: ["Overview", "Campaigns", "Social Media", "Brand Assets"] },
  { name: "Purchasing & Procurement", icon: ShoppingBag, submenus: ["Overview", "Purchase Orders", "Requisitions", "Receiving (GRN)", "Inventory", "Suppliers", "Contracts", "Bids"] },
  { name: "Reservations", icon: CalendarCheck, submenus: ["Overview", "Direct Bookings", "Group Blocks", "Waitlists"] },
  { name: "Legal & Compliance", icon: Scale, submenus: ["Overview", "Contracts", "Permits", "Safety Standards"] },
  { name: "Configuration", icon: Sliders, submenus: ["Overview", "Appearance", "System Parameters", "User Roles", "Integrations"] },
  { name: "Guest Relations", icon: HeartHandshake, submenus: ["Overview", "Feedback", "VIP Tracking", "Loyalty Program"] },
  { name: "Connect", icon: MessageSquare, submenus: ["Overview", "Messaging", "Approvals", "Authorizations", "Notifications", "Incident Log"] },
  { name: "Readme", icon: BookOpen, submenus: ["About", "User Guide", "UI Assets"] },
];

export function Layout({ 
  children, 
  activeDepartment, 
  setActiveDepartment,
  activeSubmenu,
  setActiveSubmenu,
  aiEnabled,
  setAiEnabled
}: LayoutProps) {
  const { theme, setTheme, config } = useTheme();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const displayDeptName = activeDepartment;
  const displayDept = DEPARTMENTS.find(d => d.name === displayDeptName)!;

  const isGlass = config.sidebarStyle === "glass";

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      
      {/* Left Sidebar */}
      <aside 
        className={cn(
          "flex h-full w-[340px] flex-shrink-0 transition-all duration-300 z-20 relative rounded-r-3xl overflow-hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-24"
        )}
      >
        {/* Darker Left Strip (Main Menu) */}
        <div className={cn(
          "w-24 h-full rounded-r-3xl z-20 flex flex-col items-center py-6 shadow-[4px_0_24px_rgba(0,0,0,0.1)] absolute left-0 top-0 border-r border-white/10 transition-all duration-500",
          isGlass 
            ? "bg-violet-700/80 backdrop-blur-xl" 
            : "bg-violet-800"
        )}>
          {/* Logo */}
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white font-bold text-xl shadow-inner shrink-0">
            O
          </div>

          {/* Main Menu Icons - 2 Columns for compactness but with good spacing */}
          <div className="grid grid-cols-2 gap-2 w-full px-3 overflow-y-auto scrollbar-hide flex-1">
            {DEPARTMENTS.filter(d => d.name !== "Readme").map(dept => {
              const isActive = activeDepartment === dept.name;
              return (
                <button
                  key={dept.name}
                  onClick={() => {
                    setActiveDepartment(dept.name);
                    setActiveSubmenu(dept.submenus[0]);
                  }}
                  className={cn(
                    "w-full aspect-square rounded-xl flex items-center justify-center transition-all relative group shrink-0",
                    isActive ? "bg-violet-500/90 shadow-md text-white border border-white/10" : "text-violet-300 hover:text-white hover:bg-white/10"
                  )}
                  title={dept.name}
                >
                  <dept.icon className="w-5 h-5" />
                  {/* Tooltip */}
                  <span className="absolute left-14 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity border border-white/10">
                    {dept.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Readme Button at the bottom */}
          <div className="w-full px-3 pt-4 pb-2 mt-auto border-t border-white/10">
            {DEPARTMENTS.filter(d => d.name === "Readme").map(dept => {
              const isActive = activeDepartment === dept.name;
              return (
                <button
                  key={dept.name}
                  onClick={() => {
                    setActiveDepartment(dept.name);
                    setActiveSubmenu(dept.submenus[0]);
                  }}
                  className={cn(
                    "w-full aspect-square rounded-xl flex items-center justify-center transition-all relative group shrink-0",
                    isActive ? "bg-violet-500/90 shadow-md text-white border border-white/10" : "text-violet-300 hover:text-white hover:bg-white/10"
                  )}
                  title={dept.name}
                >
                  <dept.icon className="w-5 h-5" />
                  {/* Tooltip */}
                  <span className="absolute left-14 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity border border-white/10">
                    {dept.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Submenu Area */}
        <div className={cn(
          "w-full h-full pl-24 flex flex-col z-10 py-6 transition-all duration-500 rounded-r-3xl",
          isGlass 
            ? "bg-violet-500/70 backdrop-blur-lg" 
            : "bg-violet-600"
        )}>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 px-6 mb-8 text-white">
            <div className="w-10 h-10 rounded-full bg-violet-400/80 flex items-center justify-center overflow-hidden border-2 border-violet-300/50 shrink-0 shadow-sm">
              <img src={user?.photoURL || "https://i.pravatar.cc/150?u=a042581f4e29026024d"} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className={cn("flex flex-col", !sidebarOpen && "md:hidden")}>
              <span className="font-medium text-sm whitespace-nowrap truncate max-w-[150px]">{user?.displayName || "User"}</span>
              <span className="text-xs text-violet-200 truncate max-w-[120px]">{displayDept.name}</span>
            </div>
            <button className={cn("ml-auto text-violet-200 hover:text-white", !sidebarOpen && "md:hidden")}>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Submenu Title */}
          <div className="px-6 mb-4">
            <h3 className="text-violet-200 text-xs font-bold uppercase tracking-wider">{displayDept.name}</h3>
          </div>

          {/* Submenu Links */}
          <nav className="flex-1 flex flex-col gap-4 pl-6 py-6 overflow-y-auto scrollbar-hide relative">
            {displayDept.submenus.map(sub => {
              const isSubActive = activeSubmenu === sub && activeDepartment === displayDept.name;
              return (
                <button 
                  key={sub}
                  onClick={() => {
                    setActiveDepartment(displayDept.name);
                    setActiveSubmenu(sub);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-l-full transition-colors relative group text-left outline-none",
                    isSubActive ? "text-violet-700 dark:text-violet-300 font-medium" : "text-white hover:bg-white/10"
                  )}
                >
                  {isSubActive && (
                    <motion.div
                      layoutId="activeSubmenuBg"
                      className="absolute top-0 bottom-0 left-0 right-0 bg-background rounded-l-full z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {/* Top curve */}
                      <svg className="absolute -top-[16px] right-0 w-[16px] h-[16px] pointer-events-none" viewBox="0 0 16 16">
                        <path d="M 0 16 A 16 16 0 0 0 16 0 L 16 16 Z" fill="var(--background)" />
                      </svg>
                      {/* Bottom curve */}
                      <svg className="absolute -bottom-[16px] right-0 w-[16px] h-[16px] pointer-events-none" viewBox="0 0 16 16">
                        <path d="M 0 0 A 16 16 0 0 1 16 16 L 16 0 Z" fill="var(--background)" />
                      </svg>
                    </motion.div>
                  )}
                  <span className={cn("text-sm whitespace-nowrap relative z-10", !sidebarOpen && "md:hidden")}>{sub}</span>
                </button>
              )
            })}
          </nav>

          {/* Bottom Links */}
          <div className="mt-auto pl-6 flex flex-col gap-2 pt-4 border-t border-violet-400/50">
            <button 
              onClick={() => {
                setActiveSubmenu("Settings");
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-l-full transition-colors relative group text-left outline-none",
                activeSubmenu === "Settings" ? "text-violet-700 dark:text-violet-300 font-medium" : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              {activeSubmenu === "Settings" && (
                <motion.div
                  layoutId="activeSubmenuBg"
                  className="absolute top-0 bottom-0 left-0 right-0 bg-background rounded-l-full z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Top curve */}
                  <svg className="absolute -top-[16px] right-0 w-[16px] h-[16px] pointer-events-none" viewBox="0 0 16 16">
                    <path d="M 0 16 A 16 16 0 0 0 16 0 L 16 16 Z" fill="var(--background)" />
                  </svg>
                  {/* Bottom curve */}
                  <svg className="absolute -bottom-[16px] right-0 w-[16px] h-[16px] pointer-events-none" viewBox="0 0 16 16">
                    <path d="M 0 0 A 16 16 0 0 1 16 16 L 16 0 Z" fill="var(--background)" />
                  </svg>
                </motion.div>
              )}
              <Settings className="w-5 h-5 shrink-0 relative z-10" />
              <span className={cn("text-sm font-medium relative z-10", !sidebarOpen && "md:hidden")}>Settings</span>
            </button>
            <button 
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className={cn("text-sm font-medium", !sidebarOpen && "md:hidden")}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Center Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-8 shrink-0">
          <button 
            className="md:hidden text-muted-foreground hover:text-foreground mr-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 flex justify-center max-w-3xl mx-auto">
            <button 
              onClick={() => setCommandPaletteOpen(true)}
              className="bg-card rounded-full shadow-sm flex items-center px-4 py-2 w-full border border-border hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground pr-4 border-r border-border hidden sm:flex cursor-pointer">
                <Command className="w-4 h-4" />
                <span>Search</span>
              </div>
              <div className="flex-1 px-4 text-sm text-muted-foreground text-left group-hover:text-foreground transition-colors">
                Search guests, rooms, or commands...
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md border border-border text-[10px] font-bold text-muted-foreground">
                <span className="opacity-70">⌘</span>
                <span>K</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 ml-4 sm:ml-8">
            {/* AI Toggle */}
            <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full shadow-sm">
              <Sparkles className={cn("h-4 w-4", aiEnabled ? "text-primary" : "text-muted-foreground")} />
              <span className="text-sm font-medium hidden sm:inline-block">Agentic AI</span>
              <button 
                onClick={() => setAiEnabled(!aiEnabled)}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                  aiEnabled ? "bg-primary" : "bg-input"
                )}
              >
                <span 
                  className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                    aiEnabled ? "translate-x-4" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            <button 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button 
                className="text-muted-foreground hover:text-foreground relative p-2 rounded-full hover:bg-secondary transition-colors"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white border-2 border-background">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
                        <h3 className="font-bold">Notifications</h3>
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-muted-foreground">
                            <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-border">
                            {notifications.map((n) => (
                              <div 
                                key={n.id} 
                                className={cn(
                                  "p-4 hover:bg-secondary/50 transition-colors cursor-pointer group relative",
                                  !n.read && "bg-primary/5"
                                )}
                                onClick={() => markAsRead(n.id)}
                              >
                                <div className="flex gap-3">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                    !n.read ? "bg-primary" : "bg-transparent"
                                  )} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                      <h4 className="text-sm font-bold truncate">{n.title}</h4>
                                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                                    {n.department && (
                                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-wider">
                                        {n.department}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t border-border bg-secondary/10 text-center">
                        <button 
                          onClick={() => {
                            setActiveDepartment("Connect");
                            setActiveSubmenu("Notifications");
                            setNotificationsOpen(false);
                          }}
                          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border hidden sm:block">
              <img src={user?.photoURL || "https://i.pravatar.cc/150?u=a042581f4e29026024d"} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-auto px-[1.5cm] pb-8">
          {children}
        </main>
      </div>

      {/* Right AI Sidebar */}
      {aiEnabled && (
        <AgenticAIPanel department={activeDepartment} onClose={() => setAiEnabled(false)} />
      )}

      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />
    </div>
  );
}


