import React, { useState } from "react";
import { CalendarDays, Users, DollarSign, TrendingUp, Plus, X } from "lucide-react";
import { cn } from "../lib/utils";

interface EventsProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

const getEventStatus = (s: string) => {
  switch (s) {
    case "Confirmed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "In Progress": return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    case "Inquiry": return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    case "Completed": return "bg-secondary text-secondary-foreground";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const getFunctionStatus = (s: string) => {
  switch (s) {
    case "Confirmed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "Sent": return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    case "Draft": return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const eventBookings = [
  { id: "EVT-001", name: "Al-Rashid Wedding Reception", client: "Omar Al-Rashid", date: "2026-04-12", venue: "Grand Ballroom", type: "Wedding", pax: 320, status: "Confirmed", revenue: "$48,000" },
  { id: "EVT-002", name: "TechVenture Summit 2026", client: "TechVenture Inc.", date: "2026-04-18", venue: "Conference Hall A", type: "Conference", pax: 150, status: "Confirmed", revenue: "$22,500" },
  { id: "EVT-003", name: "Rossi 50th Birthday Gala", client: "Luca Rossi", date: "2026-04-25", venue: "Rooftop Terrace", type: "Birthday", pax: 80, status: "Inquiry", revenue: "$12,000" },
  { id: "EVT-004", name: "Annual Partners Dinner", client: "Singularity Corp.", date: "2026-05-03", venue: "Private Dining Room", type: "Corporate", pax: 40, status: "Confirmed", revenue: "$8,500" },
  { id: "EVT-005", name: "Horizon Charity Gala", client: "Horizon Foundation", date: "2026-05-15", venue: "Grand Ballroom", type: "Gala", pax: 280, status: "In Progress", revenue: "$35,000" },
];

const functionSheets = [
  { event: "Al-Rashid Wedding Reception", date: "2026-04-12", setup: "Banquet", startTime: "18:00", endTime: "23:00", av: "PA System, Projector, LED Uplighting", catering: "Set Menu A + Halal options", status: "Confirmed" },
  { event: "TechVenture Summit 2026", date: "2026-04-18", setup: "Theater", startTime: "09:00", endTime: "17:00", av: "PA System, Stage Screen x2, Microphones", catering: "Coffee Breaks + Buffet Lunch", status: "Sent" },
  { event: "Rossi 50th Birthday Gala", date: "2026-04-25", setup: "Cocktail", startTime: "19:00", endTime: "23:30", av: "DJ Setup, Uplighting", catering: "Canapés + Cocktail Menu", status: "Draft" },
  { event: "Annual Partners Dinner", date: "2026-05-03", setup: "Banquet", startTime: "19:30", endTime: "22:00", av: "Background Music, Microphone", catering: "Set Menu C — Chef's Selection", status: "Confirmed" },
];

const banquetOrders = [
  { event: "Al-Rashid Wedding Reception", menu: "Set Menu A", dietary: "Halal, Nut-free options", serving: "Plated", beverage: "Premium Open Bar", total: "$28,800" },
  { event: "TechVenture Summit 2026", menu: "Conference Package B", dietary: "Vegetarian options available", serving: "Buffet", beverage: "Non-alcoholic, Coffee Station", total: "$9,750" },
  { event: "Annual Partners Dinner", menu: "Set Menu C", dietary: "Vegan on request", serving: "Plated", beverage: "House Wine + Soft Drinks", total: "$4,200" },
];

const calendarDays = Array.from({ length: 14 }, (_, i) => {
  const d = new Date("2026-04-01");
  d.setDate(d.getDate() + i);
  return {
    day: d.getDate(),
    label: d.toLocaleDateString("en-US", { weekday: "short" }),
    events: eventBookings.filter(e => e.date === d.toISOString().split("T")[0]),
  };
});

const setupStyles = [
  {
    name: "Theater",
    desc: "Rows of chairs facing a stage/screen",
    diagram: (
      <svg viewBox="0 0 200 150" className="w-full h-full" fill="none">
        {[0, 1, 2, 3, 4].map(row => (
          [0, 1, 2, 3, 4, 5, 6].map(col => (
            <rect key={`${row}-${col}`} x={10 + col * 26} y={10 + row * 22} width={20} height={16} rx={3} fill="#8b5cf6" opacity={0.7} />
          ))
        ))}
        <rect x={60} y={125} width={80} height={12} rx={4} fill="#374151" />
        <text x={100} y={134} textAnchor="middle" fontSize="7" fill="white">STAGE</text>
      </svg>
    ),
  },
  {
    name: "Banquet",
    desc: "Round tables for dining",
    diagram: (
      <svg viewBox="0 0 200 150" className="w-full h-full" fill="none">
        {[[50, 40], [150, 40], [100, 95], [50, 120], [150, 120]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={22} fill="#8b5cf6" opacity={0.2} stroke="#8b5cf6" strokeWidth={1.5} />
            <circle cx={cx} cy={cy} r={8} fill="#8b5cf6" opacity={0.5} />
            {[0, 60, 120, 180, 240, 300].map(deg => (
              <circle key={deg} cx={cx + 17 * Math.cos(deg * Math.PI / 180)} cy={cy + 17 * Math.sin(deg * Math.PI / 180)} r={4} fill="#6366f1" opacity={0.8} />
            ))}
          </g>
        ))}
      </svg>
    ),
  },
  {
    name: "Cocktail",
    desc: "High tables, open standing space",
    diagram: (
      <svg viewBox="0 0 200 150" className="w-full h-full" fill="none">
        {[[40, 40], [100, 30], [160, 45], [60, 100], [140, 95], [100, 120]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={14} fill="#8b5cf6" opacity={0.15} stroke="#8b5cf6" strokeWidth={1.5} />
            <circle cx={cx} cy={cy} r={5} fill="#8b5cf6" opacity={0.6} />
          </g>
        ))}
        <text x={100} y={148} textAnchor="middle" fontSize="8" fill="#9ca3af">Open Floor Plan</text>
      </svg>
    ),
  },
  {
    name: "U-Shape",
    desc: "Three-sided table arrangement",
    diagram: (
      <svg viewBox="0 0 200 150" className="w-full h-full" fill="none">
        {[0,1,2,3,4].map(i => <rect key={`b${i}`} x={20 + i * 34} y={115} width={28} height={12} rx={2} fill="#8b5cf6" opacity={0.5} />)}
        {[0,1,2].map(i => <rect key={`l${i}`} x={10} y={50 + i * 26} width={28} height={12} rx={2} fill="#8b5cf6" opacity={0.5} />)}
        {[0,1,2].map(i => <rect key={`r${i}`} x={162} y={50 + i * 26} width={28} height={12} rx={2} fill="#8b5cf6" opacity={0.5} />)}
        <path d="M 30 115 L 30 45 L 170 45 L 170 115" stroke="#6366f1" strokeWidth={3} fill="none" strokeLinecap="round" />
        <text x={100} y={90} textAnchor="middle" fontSize="9" fill="#9ca3af">Open End</text>
      </svg>
    ),
  },
];

function EventsOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Events Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Events This Month", value: "8", change: "3 confirmed, 1 inquiry", icon: CalendarDays, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
          { label: "Revenue", value: "$126,000", change: "+22% vs last month", icon: DollarSign, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
          { label: "Upcoming This Week", value: "2", change: "Next: Apr 12 — Wedding", icon: TrendingUp, bg: "bg-gradient-to-r from-pink-400 to-pink-500" },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-2xl p-6 shadow-sm text-white relative overflow-hidden", stat.bg)}>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/20 rounded-lg"><stat.icon className="w-6 h-6 text-white" /></div>
                <p className="text-lg font-medium text-white/90">{stat.label}</p>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-white/80">{stat.change}</p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <h2 className="font-semibold text-base mb-4">April 2026 — Event Calendar</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {calendarDays.map((d, i) => (
            <div key={i} className={cn(
              "shrink-0 flex flex-col items-center w-14 rounded-xl p-2 border",
              d.events.length > 0 ? "bg-violet-50 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/30" : "bg-secondary/30 border-transparent"
            )}>
              <span className="text-xs text-muted-foreground">{d.label}</span>
              <span className="text-sm font-semibold mt-0.5">{d.day}</span>
              {d.events.length > 0 && (
                <div className="flex flex-col items-center gap-0.5 mt-1.5">
                  {d.events.map((_, ei) => <div key={ei} className="w-1.5 h-1.5 rounded-full bg-violet-500" />)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventBookings() {
  const [showNew, setShowNew] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Event Bookings</h1>
        <button onClick={() => setShowNew(true)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Event</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Client</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Date</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Venue</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Type</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Pax</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {eventBookings.map((e, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 font-medium max-w-[180px] truncate">{e.name}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{e.client}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{e.date}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{e.venue}</td>
                <td className="px-4 py-3"><span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">{e.type}</span></td>
                <td className="px-4 py-3 hidden sm:table-cell"><div className="flex items-center gap-1"><Users className="w-3 h-3 text-muted-foreground" />{e.pax}</div></td>
                <td className="px-4 py-3"><span className={cn("px-3 py-1 rounded-full text-xs font-medium", getEventStatus(e.status))}>{e.status}</span></td>
                <td className="px-4 py-3 font-semibold text-emerald-600 hidden md:table-cell">{e.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowNew(false)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Event</h2>
              <button onClick={() => setShowNew(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-sm font-medium text-muted-foreground">Event Name</label><input className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
              <div><label className="text-sm font-medium text-muted-foreground">Client</label><input className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium text-muted-foreground">Date</label><input type="date" className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
                <div><label className="text-sm font-medium text-muted-foreground">Pax</label><input type="number" className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
              </div>
              <div><label className="text-sm font-medium text-muted-foreground">Type</label>
                <select className="mt-1 w-full bg-secondary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                  {["Wedding", "Conference", "Birthday", "Corporate", "Gala"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm bg-secondary rounded-lg">Cancel</button>
              <button onClick={() => setShowNew(false)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FunctionSheets() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Function Sheets</h1>
      <div className="space-y-4">
        {functionSheets.map((fs, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{fs.event}</h3>
                <p className="text-sm text-muted-foreground">{fs.date} · {fs.startTime} – {fs.endTime}</p>
              </div>
              <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getFunctionStatus(fs.status))}>{fs.status}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-secondary/50 rounded-xl p-3"><p className="text-xs text-muted-foreground">Setup Style</p><p className="text-sm font-medium mt-0.5">{fs.setup}</p></div>
              <div className="bg-secondary/50 rounded-xl p-3 col-span-1 md:col-span-1"><p className="text-xs text-muted-foreground">AV Requirements</p><p className="text-sm font-medium mt-0.5 truncate">{fs.av}</p></div>
              <div className="bg-secondary/50 rounded-xl p-3 col-span-2"><p className="text-xs text-muted-foreground">Catering Notes</p><p className="text-sm font-medium mt-0.5">{fs.catering}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BanquetOrders() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Banquet Orders</h1>
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Event</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium">Menu Package</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Dietary Notes</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Serving Style</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Beverage</th>
              <th className="text-right px-4 py-3 text-muted-foreground font-medium">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {banquetOrders.map((o, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/30">
                <td className="px-4 py-3 font-medium max-w-[160px] truncate">{o.event}</td>
                <td className="px-4 py-3"><span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">{o.menu}</span></td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{o.dietary}</td>
                <td className="px-4 py-3 hidden lg:table-cell">{o.serving}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell truncate max-w-[160px]">{o.beverage}</td>
                <td className="px-4 py-3 text-right font-semibold text-emerald-600">{o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoomSetup() {
  const [selected, setSelected] = useState(setupStyles[0]);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Room Setup Diagrams</h1>
      <div className="flex flex-wrap gap-2">
        {setupStyles.map(s => (
          <button
            key={s.name}
            onClick={() => setSelected(s)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
              selected.name === s.name
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-card border-border hover:bg-secondary/50"
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-lg">{selected.name}</h2>
            <p className="text-sm text-muted-foreground">{selected.desc}</p>
          </div>
        </div>
        <div className="h-[300px] w-full max-w-lg mx-auto">
          {selected.diagram}
        </div>
      </div>
    </div>
  );
}

export function Events({ aiEnabled, activeSubmenu = "Overview" }: EventsProps) {
  return (
    <div className="space-y-6">
      {activeSubmenu === "Overview" && <EventsOverview />}
      {activeSubmenu === "Event Bookings" && <EventBookings />}
      {activeSubmenu === "Function Sheets" && <FunctionSheets />}
      {activeSubmenu === "Banquet Orders" && <BanquetOrders />}
      {activeSubmenu === "Room Setup" && <RoomSetup />}
    </div>
  );
}
