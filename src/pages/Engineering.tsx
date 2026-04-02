import React, { useMemo } from "react";
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Zap,
  Droplets,
  Wind,
  Settings,
  ClipboardList,
  Database,
  TrendingUp,
  Package,
  FileText,
  Shield,
  BarChart2,
  Thermometer,
  Gauge,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EngineeringProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

// ---------------------------------------------------------------------------
// Data — Work Orders
// ---------------------------------------------------------------------------

const workOrdersData = [
  {
    id: "WO-2401",
    location: "Room 312",
    issue: "AC not cooling, thermostat unresponsive",
    category: "HVAC",
    priority: "Critical",
    tech: "Ivan Petrov",
    status: "In Progress",
    created: "2026-03-31",
  },
  {
    id: "WO-2402",
    location: "Lobby Bar",
    issue: "Faulty power outlet behind counter",
    category: "Electrical",
    priority: "High",
    tech: "Marcus Webb",
    status: "Open",
    created: "2026-04-01",
  },
  {
    id: "WO-2403",
    location: "Room 215",
    issue: "Leaking bathroom faucet",
    category: "Plumbing",
    priority: "Medium",
    tech: "Ravi Sharma",
    status: "Completed",
    created: "2026-03-30",
  },
  {
    id: "WO-2404",
    location: "Gym",
    issue: "Treadmill belt slipping — safety hazard",
    category: "General",
    priority: "Medium",
    tech: "Taiwo Adeyemi",
    status: "Open",
    created: "2026-04-01",
  },
  {
    id: "WO-2405",
    location: "Kitchen",
    issue: "Exhaust fan motor failure",
    category: "HVAC",
    priority: "Critical",
    tech: "Ivan Petrov",
    status: "In Progress",
    created: "2026-03-31",
  },
  {
    id: "WO-2406",
    location: "Basement B1",
    issue: "Sump pump alarm triggered",
    category: "Plumbing",
    priority: "Critical",
    tech: "Ravi Sharma",
    status: "In Progress",
    created: "2026-04-02",
  },
  {
    id: "WO-2407",
    location: "Conference Room A",
    issue: "Projector screen motor jammed",
    category: "General",
    priority: "Low",
    tech: "Marcus Webb",
    status: "Open",
    created: "2026-04-02",
  },
  {
    id: "WO-2408",
    location: "Room 520",
    issue: "Door lock battery replacement",
    category: "Electrical",
    priority: "Low",
    tech: "Taiwo Adeyemi",
    status: "Completed",
    created: "2026-03-31",
  },
  {
    id: "WO-2409",
    location: "Pool Area",
    issue: "Chemical dosing pump malfunction",
    category: "Plumbing",
    priority: "High",
    tech: "Ravi Sharma",
    status: "On Hold",
    created: "2026-03-29",
  },
  {
    id: "WO-2410",
    location: "Parking Level 2",
    issue: "Lighting strip out — bays 20-35",
    category: "Electrical",
    priority: "Medium",
    tech: "Marcus Webb",
    status: "In Progress",
    created: "2026-04-01",
  },
  {
    id: "WO-2411",
    location: "Room 101",
    issue: "Blocked shower drain",
    category: "Plumbing",
    priority: "Medium",
    tech: "Ravi Sharma",
    status: "Completed",
    created: "2026-04-02",
  },
  {
    id: "WO-2412",
    location: "Spa Level 3",
    issue: "Steam generator pressure low",
    category: "HVAC",
    priority: "High",
    tech: "Ivan Petrov",
    status: "Open",
    created: "2026-04-02",
  },
  {
    id: "WO-2413",
    location: "Roof Plant Room",
    issue: "Cooling tower fan bearing noise",
    category: "HVAC",
    priority: "High",
    tech: "Ivan Petrov",
    status: "On Hold",
    created: "2026-03-28",
  },
  {
    id: "WO-2414",
    location: "Penthouse Floor 15",
    issue: "Cracked ceiling tile — water stain",
    category: "Civil",
    priority: "Medium",
    tech: "Taiwo Adeyemi",
    status: "Open",
    created: "2026-04-01",
  },
  {
    id: "WO-2415",
    location: "Loading Bay",
    issue: "Roller shutter not closing fully",
    category: "Civil",
    priority: "Medium",
    tech: "Marcus Webb",
    status: "Completed",
    created: "2026-03-30",
  },
  {
    id: "WO-2416",
    location: "Elevator 3",
    issue: "Door sensor fault — doors reopening",
    category: "Electrical",
    priority: "Critical",
    tech: "Taiwo Adeyemi",
    status: "In Progress",
    created: "2026-04-02",
  },
  {
    id: "WO-2417",
    location: "Room 408",
    issue: "TV remote pairing issue",
    category: "General",
    priority: "Low",
    tech: "Marcus Webb",
    status: "Completed",
    created: "2026-04-02",
  },
  {
    id: "WO-2418",
    location: "Restaurant",
    issue: "Dishwasher not draining",
    category: "Plumbing",
    priority: "High",
    tech: "Ravi Sharma",
    status: "Open",
    created: "2026-04-02",
  },
  {
    id: "WO-2419",
    location: "Room 225",
    issue: "Noisy FCU blower — room complaint",
    category: "HVAC",
    priority: "Low",
    tech: "Ivan Petrov",
    status: "Open",
    created: "2026-04-02",
  },
  {
    id: "WO-2420",
    location: "Fire Escape Stair 2",
    issue: "Emergency lighting not activating",
    category: "Electrical",
    priority: "Critical",
    tech: "Taiwo Adeyemi",
    status: "Open",
    created: "2026-04-02",
  },
];

// ---------------------------------------------------------------------------
// Data — Preventive Maintenance
// ---------------------------------------------------------------------------

const pmData = [
  {
    id: "PM-001",
    equipment: "AC Unit AHU-01 (Lobby)",
    location: "Roof Plant Room",
    lastService: "2026-01-15",
    nextDue: "2026-04-15",
    frequency: "Quarterly",
    assigned: "Ivan Petrov",
    status: "Upcoming",
  },
  {
    id: "PM-002",
    equipment: "AC Unit AHU-02 (Floors 1-5)",
    location: "Roof Plant Room",
    lastService: "2026-01-10",
    nextDue: "2026-04-10",
    frequency: "Quarterly",
    assigned: "Ivan Petrov",
    status: "Overdue",
  },
  {
    id: "PM-003",
    equipment: "AC Unit AHU-03 (Floors 6-10)",
    location: "Roof Plant Room",
    lastService: "2026-02-01",
    nextDue: "2026-05-01",
    frequency: "Quarterly",
    assigned: "Ivan Petrov",
    status: "Upcoming",
  },
  {
    id: "PM-004",
    equipment: "Elevator 1 (Passenger)",
    location: "Lift Shaft A",
    lastService: "2026-03-01",
    nextDue: "2026-04-01",
    frequency: "Monthly",
    assigned: "Otis Services",
    status: "Overdue",
  },
  {
    id: "PM-005",
    equipment: "Elevator 2 (Passenger)",
    location: "Lift Shaft B",
    lastService: "2026-03-01",
    nextDue: "2026-04-01",
    frequency: "Monthly",
    assigned: "Otis Services",
    status: "Overdue",
  },
  {
    id: "PM-006",
    equipment: "Elevator 3 (Service)",
    location: "Lift Shaft C",
    lastService: "2026-03-15",
    nextDue: "2026-04-15",
    frequency: "Monthly",
    assigned: "Otis Services",
    status: "Upcoming",
  },
  {
    id: "PM-007",
    equipment: "Standby Generator 500kVA",
    location: "Basement B2",
    lastService: "2026-02-28",
    nextDue: "2026-05-28",
    frequency: "Quarterly",
    assigned: "Marcus Webb",
    status: "Upcoming",
  },
  {
    id: "PM-008",
    equipment: "Fire Suppression System",
    location: "Entire Building",
    lastService: "2025-10-01",
    nextDue: "2026-04-01",
    frequency: "Semi-Annual",
    assigned: "FireGuard Co.",
    status: "Overdue",
  },
  {
    id: "PM-009",
    equipment: "Pool Circulation Pump",
    location: "Pool Plant Room",
    lastService: "2026-03-10",
    nextDue: "2026-04-10",
    frequency: "Monthly",
    assigned: "Ravi Sharma",
    status: "Upcoming",
  },
  {
    id: "PM-010",
    equipment: "BMS / SCADA Server",
    location: "BMS Room L1",
    lastService: "2026-01-20",
    nextDue: "2026-07-20",
    frequency: "Semi-Annual",
    assigned: "BMS Tech Ltd.",
    status: "Upcoming",
  },
  {
    id: "PM-011",
    equipment: "Kitchen Exhaust Hood (Main)",
    location: "Main Kitchen",
    lastService: "2026-03-05",
    nextDue: "2026-04-05",
    frequency: "Monthly",
    assigned: "Ivan Petrov",
    status: "Upcoming",
  },
  {
    id: "PM-012",
    equipment: "Booster Pump Set #1",
    location: "Basement B1",
    lastService: "2026-02-15",
    nextDue: "2026-05-15",
    frequency: "Quarterly",
    assigned: "Ravi Sharma",
    status: "Upcoming",
  },
  {
    id: "PM-013",
    equipment: "Cooling Tower CT-01",
    location: "Roof",
    lastService: "2025-12-10",
    nextDue: "2026-03-10",
    frequency: "Quarterly",
    assigned: "Ivan Petrov",
    status: "Overdue",
  },
  {
    id: "PM-014",
    equipment: "Spa Steam Generators (x3)",
    location: "Spa Level 3",
    lastService: "2026-02-20",
    nextDue: "2026-04-20",
    frequency: "Bi-Monthly",
    assigned: "Ivan Petrov",
    status: "Upcoming",
  },
  {
    id: "PM-015",
    equipment: "UPS Systems (Critical loads)",
    location: "Server Room L1",
    lastService: "2025-10-15",
    nextDue: "2026-04-15",
    frequency: "Semi-Annual",
    assigned: "Marcus Webb",
    status: "Upcoming",
  },
];

// ---------------------------------------------------------------------------
// Data — Asset Registry
// ---------------------------------------------------------------------------

const assetsData = [
  {
    id: "AST-001",
    name: "Air Handling Unit AHU-01",
    category: "HVAC",
    location: "Roof Plant Room",
    condition: "Good",
    purchaseDate: "2020-06-01",
    warrantyExpiry: "2025-06-01",
    lastMaintained: "2026-01-15",
    capex: 85000,
  },
  {
    id: "AST-002",
    name: "Elevator 1 — Passenger",
    category: "Vertical Transport",
    location: "Lift Shaft A",
    condition: "Good",
    purchaseDate: "2019-03-15",
    warrantyExpiry: "2024-03-15",
    lastMaintained: "2026-03-01",
    capex: 220000,
  },
  {
    id: "AST-003",
    name: "Standby Generator 500kVA",
    category: "Power",
    location: "Basement B2",
    condition: "Good",
    purchaseDate: "2018-11-01",
    warrantyExpiry: "2023-11-01",
    lastMaintained: "2026-02-28",
    capex: 145000,
  },
  {
    id: "AST-004",
    name: "Cooling Tower CT-01",
    category: "HVAC",
    location: "Roof",
    condition: "Fair",
    purchaseDate: "2017-09-01",
    warrantyExpiry: "2022-09-01",
    lastMaintained: "2025-12-10",
    capex: 62000,
  },
  {
    id: "AST-005",
    name: "Pool Heater (Gas-fired)",
    category: "Plumbing",
    location: "Pool Plant Room",
    condition: "Good",
    purchaseDate: "2021-04-10",
    warrantyExpiry: "2026-04-10",
    lastMaintained: "2026-03-10",
    capex: 28000,
  },
  {
    id: "AST-006",
    name: "BMS Control Panel",
    category: "Building Management",
    location: "BMS Room L1",
    condition: "Good",
    purchaseDate: "2020-01-15",
    warrantyExpiry: "2025-01-15",
    lastMaintained: "2026-01-20",
    capex: 95000,
  },
  {
    id: "AST-007",
    name: "Fire Suppression Panels (x4)",
    category: "Fire Safety",
    location: "Various Floors",
    condition: "Good",
    purchaseDate: "2019-07-01",
    warrantyExpiry: "2024-07-01",
    lastMaintained: "2025-10-01",
    capex: 42000,
  },
  {
    id: "AST-008",
    name: "Booster Pump Set #1",
    category: "Plumbing",
    location: "Basement B1",
    condition: "Fair",
    purchaseDate: "2016-05-20",
    warrantyExpiry: "2021-05-20",
    lastMaintained: "2026-02-15",
    capex: 18500,
  },
  {
    id: "AST-009",
    name: "Main Electrical Switchboard",
    category: "Electrical",
    location: "Basement B2",
    condition: "Good",
    purchaseDate: "2018-02-01",
    warrantyExpiry: "2028-02-01",
    lastMaintained: "2025-11-10",
    capex: 135000,
  },
  {
    id: "AST-010",
    name: "Commercial Dish Washer",
    category: "Kitchen Equipment",
    location: "Main Kitchen",
    condition: "Fair",
    purchaseDate: "2020-09-01",
    warrantyExpiry: "2023-09-01",
    lastMaintained: "2026-02-01",
    capex: 22000,
  },
  {
    id: "AST-011",
    name: "UPS 80kVA (Critical Loads)",
    category: "Power",
    location: "Server Room L1",
    condition: "Good",
    purchaseDate: "2022-01-10",
    warrantyExpiry: "2027-01-10",
    lastMaintained: "2025-10-15",
    capex: 68000,
  },
  {
    id: "AST-012",
    name: "Chiller Unit CH-01",
    category: "HVAC",
    location: "Roof Plant Room",
    condition: "Good",
    purchaseDate: "2020-06-01",
    warrantyExpiry: "2025-06-01",
    lastMaintained: "2026-01-15",
    capex: 195000,
  },
  {
    id: "AST-013",
    name: "Laundry Washer x3",
    category: "Laundry",
    location: "Laundry L1",
    condition: "Good",
    purchaseDate: "2021-03-15",
    warrantyExpiry: "2024-03-15",
    lastMaintained: "2025-12-20",
    capex: 55000,
  },
  {
    id: "AST-014",
    name: "Spa Steam Generators",
    category: "Spa Equipment",
    location: "Spa Level 3",
    condition: "Good",
    purchaseDate: "2022-06-01",
    warrantyExpiry: "2027-06-01",
    lastMaintained: "2026-02-20",
    capex: 38000,
  },
  {
    id: "AST-015",
    name: "Roof Solar PV Array (60kWp)",
    category: "Renewable Energy",
    location: "Roof",
    condition: "Good",
    purchaseDate: "2023-01-20",
    warrantyExpiry: "2048-01-20",
    lastMaintained: "2026-01-05",
    capex: 78000,
  },
  {
    id: "AST-016",
    name: "CCTV System (128 cameras)",
    category: "Security",
    location: "Building-wide",
    condition: "Good",
    purchaseDate: "2021-08-01",
    warrantyExpiry: "2026-08-01",
    lastMaintained: "2025-11-01",
    capex: 45000,
  },
  {
    id: "AST-017",
    name: "Hydraulic Dumbwaiter",
    category: "Vertical Transport",
    location: "Kitchen Floor 2",
    condition: "Poor",
    purchaseDate: "2015-04-01",
    warrantyExpiry: "2020-04-01",
    lastMaintained: "2025-08-10",
    capex: 12000,
  },
  {
    id: "AST-018",
    name: "Gas Pressure Reducing Station",
    category: "Gas",
    location: "Basement B1",
    condition: "Fair",
    purchaseDate: "2017-11-01",
    warrantyExpiry: "2022-11-01",
    lastMaintained: "2025-09-15",
    capex: 9500,
  },
  {
    id: "AST-019",
    name: "Irrigation Pump System",
    category: "Landscaping",
    location: "Exterior Grounds",
    condition: "Good",
    purchaseDate: "2022-04-01",
    warrantyExpiry: "2025-04-01",
    lastMaintained: "2025-10-20",
    capex: 7200,
  },
  {
    id: "AST-020",
    name: "Elevator 2 — Passenger",
    category: "Vertical Transport",
    location: "Lift Shaft B",
    condition: "Fair",
    purchaseDate: "2019-03-15",
    warrantyExpiry: "2024-03-15",
    lastMaintained: "2026-03-01",
    capex: 220000,
  },
];

// ---------------------------------------------------------------------------
// Data — Energy Management
// ---------------------------------------------------------------------------

const energyChartData = Array.from({ length: 30 }, (_, i) => ({
  day: `Mar ${i + 1}`,
  kwh: Math.round(1800 + Math.sin(i * 0.4) * 300 + (i % 7) * 25),
}));

const utilityCostData = [
  { month: "Oct", electricity: 18400, water: 4200, gas: 3100 },
  { month: "Nov", electricity: 19200, water: 4000, gas: 3800 },
  { month: "Dec", electricity: 22000, water: 3800, gas: 4500 },
  { month: "Jan", electricity: 21500, water: 3600, gas: 4700 },
  { month: "Feb", electricity: 20100, water: 3700, gas: 4200 },
  { month: "Mar", electricity: 19800, water: 4100, gas: 3600 },
];

const meterReadings = [
  {
    id: "M-01",
    location: "Main Incomer (L1 Panel)",
    reading: "489,210",
    unit: "kWh",
    thisMonth: 14520,
    lastMonth: 14980,
    variance: -3.1,
    trend: "down",
  },
  {
    id: "M-02",
    location: "Solar PV Output",
    reading: "12,345",
    unit: "kWh",
    thisMonth: 2840,
    lastMonth: 2610,
    variance: 8.8,
    trend: "up",
  },
  {
    id: "M-03",
    location: "Kitchen Sub-Meter",
    reading: "98,540",
    unit: "kWh",
    thisMonth: 3120,
    lastMonth: 3250,
    variance: -4.0,
    trend: "down",
  },
  {
    id: "M-04",
    location: "HVAC Sub-Meter",
    reading: "255,680",
    unit: "kWh",
    thisMonth: 6890,
    lastMonth: 6720,
    variance: 2.5,
    trend: "up",
  },
  {
    id: "M-05",
    location: "Main Water Meter",
    reading: "84,231",
    unit: "m3",
    thisMonth: 1820,
    lastMonth: 1750,
    variance: 4.0,
    trend: "up",
  },
  {
    id: "M-06",
    location: "Pool Water Meter",
    reading: "9,480",
    unit: "m3",
    thisMonth: 185,
    lastMonth: 192,
    variance: -3.6,
    trend: "down",
  },
  {
    id: "M-07",
    location: "Gas Meter (Boiler)",
    reading: "31,120",
    unit: "m3",
    thisMonth: 920,
    lastMonth: 1020,
    variance: -9.8,
    trend: "down",
  },
  {
    id: "M-08",
    location: "Gas Meter (Kitchen)",
    reading: "18,770",
    unit: "m3",
    thisMonth: 640,
    lastMonth: 610,
    variance: 4.9,
    trend: "up",
  },
];

// ---------------------------------------------------------------------------
// Data — Vendors
// ---------------------------------------------------------------------------

const vendorsData = [
  {
    id: "V-001",
    name: "CoolTech HVAC Ltd.",
    category: "HVAC",
    contact: "Samuel Adeyemi",
    phone: "+971-4-551-2200",
    email: "s.adeyemi@cooltech.ae",
    contractExpiry: "2026-12-31",
    rating: 5,
    status: "Active",
    lastUsed: "2026-03-28",
  },
  {
    id: "V-002",
    name: "Otis Elevator Services",
    category: "Vertical Transport",
    contact: "Helen Marsh",
    phone: "+971-4-330-0100",
    email: "h.marsh@otis.com",
    contractExpiry: "2027-03-01",
    rating: 4,
    status: "Active",
    lastUsed: "2026-03-15",
  },
  {
    id: "V-003",
    name: "FireGuard Protection Co.",
    category: "Fire Safety",
    contact: "Ravi Nair",
    phone: "+971-4-882-7700",
    email: "r.nair@fireguard.ae",
    contractExpiry: "2026-09-30",
    rating: 5,
    status: "Active",
    lastUsed: "2025-10-01",
  },
  {
    id: "V-004",
    name: "ElectroMasters LLC",
    category: "Electrical",
    contact: "Petra Vogt",
    phone: "+971-4-445-6600",
    email: "p.vogt@electromasters.ae",
    contractExpiry: "2026-06-30",
    rating: 3,
    status: "Active",
    lastUsed: "2026-03-20",
  },
  {
    id: "V-005",
    name: "AquaFlow Plumbing",
    category: "Plumbing",
    contact: "Felix Okonkwo",
    phone: "+971-4-223-4400",
    email: "f.okonkwo@aquaflow.ae",
    contractExpiry: "2026-08-15",
    rating: 4,
    status: "Active",
    lastUsed: "2026-04-01",
  },
  {
    id: "V-006",
    name: "BMS Integrators UAE",
    category: "BMS / Automation",
    contact: "Yousef Al-Hassan",
    phone: "+971-4-780-3300",
    email: "y.hassan@bmsint.ae",
    contractExpiry: "2027-01-31",
    rating: 5,
    status: "Active",
    lastUsed: "2026-01-20",
  },
  {
    id: "V-007",
    name: "GreenSun Solar",
    category: "Renewable Energy",
    contact: "Amara Diallo",
    phone: "+971-4-990-1100",
    email: "a.diallo@greensun.ae",
    contractExpiry: "2033-01-20",
    rating: 4,
    status: "Active",
    lastUsed: "2026-01-05",
  },
  {
    id: "V-008",
    name: "SwiftLift Elevators",
    category: "Vertical Transport",
    contact: "Chen Jiawei",
    phone: "+971-4-555-8800",
    email: "c.jiawei@swiftlift.ae",
    contractExpiry: "2024-12-31",
    rating: 2,
    status: "Inactive",
    lastUsed: "2024-11-10",
  },
  {
    id: "V-009",
    name: "PureWater Pool Services",
    category: "Pool & Spa",
    contact: "Natasha Ivanova",
    phone: "+971-4-312-9900",
    email: "n.ivanova@purewater.ae",
    contractExpiry: "2026-10-31",
    rating: 4,
    status: "Active",
    lastUsed: "2026-03-10",
  },
  {
    id: "V-010",
    name: "Veolia Waste Management",
    category: "Waste & Sanitation",
    contact: "Omar Bilal",
    phone: "+971-4-660-5500",
    email: "o.bilal@veolia.ae",
    contractExpiry: "2026-12-31",
    rating: 4,
    status: "Active",
    lastUsed: "2026-04-01",
  },
  {
    id: "V-011",
    name: "Apex Security Systems",
    category: "Security / CCTV",
    contact: "Daniel Kowalski",
    phone: "+971-4-774-2200",
    email: "d.kowalski@apexsec.ae",
    contractExpiry: "2026-08-01",
    rating: 3,
    status: "Active",
    lastUsed: "2025-11-01",
  },
  {
    id: "V-012",
    name: "ProGas Services",
    category: "Gas",
    contact: "Layla Farouk",
    phone: "+971-4-440-7700",
    email: "l.farouk@progas.ae",
    contractExpiry: "2026-04-30",
    rating: 5,
    status: "Active",
    lastUsed: "2025-09-15",
  },
  {
    id: "V-013",
    name: "FastFix General Maint.",
    category: "General Maintenance",
    contact: "Bruno Ferreira",
    phone: "+971-4-335-6600",
    email: "b.ferreira@fastfix.ae",
    contractExpiry: "2023-12-31",
    rating: 1,
    status: "Blacklisted",
    lastUsed: "2023-10-20",
  },
  {
    id: "V-014",
    name: "Schneider Electric UAE",
    category: "Electrical / UPS",
    contact: "Priya Menon",
    phone: "+971-4-800-7624",
    email: "p.menon@se.com",
    contractExpiry: "2027-06-30",
    rating: 5,
    status: "Active",
    lastUsed: "2025-10-15",
  },
  {
    id: "V-015",
    name: "Legrand Wiring Systems",
    category: "Electrical",
    contact: "Kwame Boateng",
    phone: "+971-4-221-3300",
    email: "k.boateng@legrand.ae",
    contractExpiry: "2026-03-31",
    rating: 3,
    status: "Inactive",
    lastUsed: "2025-06-10",
  },
];

// ---------------------------------------------------------------------------
// Data — Spare Parts
// ---------------------------------------------------------------------------

const sparePartsData = [
  {
    id: "SP-001",
    name: "FCU Fan Motor 150W",
    equipment: "Fan Coil Units",
    stock: 3,
    minStock: 5,
    unit: "pcs",
    location: "Bin A-01",
    lastRestocked: "2026-01-10",
    status: "Low",
  },
  {
    id: "SP-002",
    name: "Air Filter G4 (500x500)",
    equipment: "AHU / FCU",
    stock: 24,
    minStock: 20,
    unit: "pcs",
    location: "Shelf B-02",
    lastRestocked: "2026-02-20",
    status: "Adequate",
  },
  {
    id: "SP-003",
    name: "Contactor 40A 3-Phase",
    equipment: "Electrical Panels",
    stock: 2,
    minStock: 4,
    unit: "pcs",
    location: "Bin C-03",
    lastRestocked: "2025-12-01",
    status: "Low",
  },
  {
    id: "SP-004",
    name: "MCB 32A Single Pole",
    equipment: "Distribution Boards",
    stock: 18,
    minStock: 10,
    unit: "pcs",
    location: "Bin C-04",
    lastRestocked: "2026-03-01",
    status: "Adequate",
  },
  {
    id: "SP-005",
    name: "Pump Mechanical Seal 32mm",
    equipment: "Booster Pumps / Pool",
    stock: 0,
    minStock: 3,
    unit: "pcs",
    location: "Bin D-01",
    lastRestocked: "2025-10-15",
    status: "Critical",
  },
  {
    id: "SP-006",
    name: "Refrigerant R-410A (10kg)",
    equipment: "Chillers / AC Units",
    stock: 2,
    minStock: 3,
    unit: "cylinders",
    location: "Cold Store E",
    lastRestocked: "2025-11-20",
    status: "Low",
  },
  {
    id: "SP-007",
    name: "Elevator Door Roller",
    equipment: "Elevators 1-3",
    stock: 6,
    minStock: 4,
    unit: "pcs",
    location: "Bin A-05",
    lastRestocked: "2026-01-25",
    status: "Adequate",
  },
  {
    id: "SP-008",
    name: "Fire Detector Optical",
    equipment: "Fire Alarm System",
    stock: 12,
    minStock: 10,
    unit: "pcs",
    location: "Bin F-01",
    lastRestocked: "2025-12-10",
    status: "Adequate",
  },
  {
    id: "SP-009",
    name: "Pool pH Sensor Probe",
    equipment: "Pool Dosing System",
    stock: 1,
    minStock: 2,
    unit: "pcs",
    location: "Bin D-03",
    lastRestocked: "2025-09-01",
    status: "Low",
  },
  {
    id: "SP-010",
    name: "V-Belt A-42 (HVAC)",
    equipment: "AHU Belt Drive",
    stock: 8,
    minStock: 6,
    unit: "pcs",
    location: "Shelf B-04",
    lastRestocked: "2026-02-05",
    status: "Adequate",
  },
  {
    id: "SP-011",
    name: "Bearing 6205-2RS",
    equipment: "Various Motors",
    stock: 0,
    minStock: 5,
    unit: "pcs",
    location: "Bin A-02",
    lastRestocked: "2025-08-20",
    status: "Critical",
  },
  {
    id: "SP-012",
    name: "BMS I/O Module",
    equipment: "BMS System",
    stock: 1,
    minStock: 2,
    unit: "pcs",
    location: "Secure Rack G",
    lastRestocked: "2025-07-10",
    status: "Low",
  },
  {
    id: "SP-013",
    name: "Condenser Coil Cleaner 5L",
    equipment: "AC Units",
    stock: 10,
    minStock: 5,
    unit: "bottles",
    location: "Chemical Store H",
    lastRestocked: "2026-03-10",
    status: "Adequate",
  },
  {
    id: "SP-014",
    name: "Emergency Light Battery 6V",
    equipment: "Emergency Lighting",
    stock: 4,
    minStock: 8,
    unit: "pcs",
    location: "Bin F-03",
    lastRestocked: "2025-11-05",
    status: "Low",
  },
  {
    id: "SP-015",
    name: "Solenoid Valve 3/4in 24V",
    equipment: "Irrigation / Water",
    stock: 3,
    minStock: 3,
    unit: "pcs",
    location: "Bin D-05",
    lastRestocked: "2026-01-30",
    status: "Adequate",
  },
  {
    id: "SP-016",
    name: "Fuse 100A HRC",
    equipment: "Main Switchboard",
    stock: 6,
    minStock: 4,
    unit: "pcs",
    location: "Bin C-01",
    lastRestocked: "2026-02-15",
    status: "Adequate",
  },
  {
    id: "SP-017",
    name: "Pressure Gauge 0-10 bar",
    equipment: "Booster Pumps",
    stock: 2,
    minStock: 3,
    unit: "pcs",
    location: "Bin D-02",
    lastRestocked: "2025-10-20",
    status: "Low",
  },
  {
    id: "SP-018",
    name: "Thermostat Room Digital",
    equipment: "FCU / Room Controls",
    stock: 7,
    minStock: 5,
    unit: "pcs",
    location: "Bin A-04",
    lastRestocked: "2026-03-18",
    status: "Adequate",
  },
];

// ---------------------------------------------------------------------------
// Data — CAPEX Requests
// ---------------------------------------------------------------------------

const capexData = [
  {
    id: "CX-2401",
    description: "Replace Cooling Tower CT-01 (end of life)",
    category: "HVAC",
    cost: 75000,
    priority: "High",
    requestedBy: "Ivan Petrov",
    dateSubmitted: "2026-01-15",
    status: "Approved",
  },
  {
    id: "CX-2402",
    description: "Upgrade Main Electrical Switchboard protection relays",
    category: "Electrical",
    cost: 42000,
    priority: "High",
    requestedBy: "Marcus Webb",
    dateSubmitted: "2026-01-20",
    status: "Approved",
  },
  {
    id: "CX-2403",
    description: "Solar PV Expansion — additional 40kWp panels",
    category: "Renewable Energy",
    cost: 55000,
    priority: "Medium",
    requestedBy: "Ivan Petrov",
    dateSubmitted: "2026-02-01",
    status: "Submitted",
  },
  {
    id: "CX-2404",
    description: "Pool heating replacement — gas to heat pump",
    category: "Plumbing",
    cost: 38000,
    priority: "Medium",
    requestedBy: "Ravi Sharma",
    dateSubmitted: "2026-02-10",
    status: "In Progress",
  },
  {
    id: "CX-2405",
    description: "BMS upgrade to cloud-connected platform",
    category: "Building Management",
    cost: 120000,
    priority: "High",
    requestedBy: "Marcus Webb",
    dateSubmitted: "2026-02-15",
    status: "Submitted",
  },
  {
    id: "CX-2406",
    description: "Elevator modernisation — Elevator 1 & 2 controls",
    category: "Vertical Transport",
    cost: 95000,
    priority: "High",
    requestedBy: "Taiwo Adeyemi",
    dateSubmitted: "2026-02-20",
    status: "Approved",
  },
  {
    id: "CX-2407",
    description: "CCTV system refresh — IP 4K cameras",
    category: "Security",
    cost: 52000,
    priority: "Medium",
    requestedBy: "Marcus Webb",
    dateSubmitted: "2026-03-01",
    status: "Draft",
  },
  {
    id: "CX-2408",
    description: "Hydraulic dumbwaiter replacement",
    category: "Vertical Transport",
    cost: 18000,
    priority: "Low",
    requestedBy: "Ravi Sharma",
    dateSubmitted: "2026-03-05",
    status: "Draft",
  },
  {
    id: "CX-2409",
    description: "EV charging stations — 10 points in parking",
    category: "Electrical",
    cost: 68000,
    priority: "Medium",
    requestedBy: "Ivan Petrov",
    dateSubmitted: "2026-03-10",
    status: "Submitted",
  },
  {
    id: "CX-2410",
    description: "Water treatment RO system upgrade",
    category: "Plumbing",
    cost: 35000,
    priority: "Medium",
    requestedBy: "Ravi Sharma",
    dateSubmitted: "2026-03-15",
    status: "Rejected",
  },
  {
    id: "CX-2411",
    description: "LED lighting retrofit — parking + back-of-house",
    category: "Electrical",
    cost: 24000,
    priority: "Low",
    requestedBy: "Marcus Webb",
    dateSubmitted: "2026-03-20",
    status: "Approved",
  },
  {
    id: "CX-2412",
    description: "Booster pump VFD drive replacements",
    category: "Plumbing",
    cost: 16000,
    priority: "Medium",
    requestedBy: "Ravi Sharma",
    dateSubmitted: "2026-03-28",
    status: "Submitted",
  },
];

// ---------------------------------------------------------------------------
// Data — Compliance & Safety
// ---------------------------------------------------------------------------

const complianceData = [
  {
    id: "CS-001",
    item: "Fire Alarm System Annual Inspection",
    regulation: "NFPA 72",
    lastInspected: "2025-10-01",
    expiry: "2026-10-01",
    inspector: "FireGuard Co.",
    result: "Pass",
    certificate: "FA-2025-881",
  },
  {
    id: "CS-002",
    item: "Fire Suppression (FM-200) System",
    regulation: "NFPA 2001",
    lastInspected: "2025-10-01",
    expiry: "2026-04-01",
    inspector: "FireGuard Co.",
    result: "Due Soon",
    certificate: "FS-2025-442",
  },
  {
    id: "CS-003",
    item: "Elevator 1 Safety Certificate",
    regulation: "Local Civil Def.",
    lastInspected: "2026-01-10",
    expiry: "2027-01-10",
    inspector: "Otis Services",
    result: "Pass",
    certificate: "ELV-1-2026-001",
  },
  {
    id: "CS-004",
    item: "Elevator 2 Safety Certificate",
    regulation: "Local Civil Def.",
    lastInspected: "2026-01-10",
    expiry: "2027-01-10",
    inspector: "Otis Services",
    result: "Pass",
    certificate: "ELV-2-2026-002",
  },
  {
    id: "CS-005",
    item: "Elevator 3 (Service) Certificate",
    regulation: "Local Civil Def.",
    lastInspected: "2025-12-15",
    expiry: "2026-06-15",
    inspector: "Otis Services",
    result: "Pass",
    certificate: "ELV-3-2025-003",
  },
  {
    id: "CS-006",
    item: "Pool Water Quality (Bathing)",
    regulation: "OSHA / Health Auth.",
    lastInspected: "2026-03-15",
    expiry: "2026-04-15",
    inspector: "PureWater Ltd.",
    result: "Pass",
    certificate: "PW-Q-2026-33",
  },
  {
    id: "CS-007",
    item: "Food Hygiene — Main Kitchen",
    regulation: "Municipality Health",
    lastInspected: "2026-02-20",
    expiry: "2026-08-20",
    inspector: "Municipality Inspector",
    result: "Pass",
    certificate: "FH-2026-118",
  },
  {
    id: "CS-008",
    item: "Food Hygiene — Staff Canteen",
    regulation: "Municipality Health",
    lastInspected: "2025-08-15",
    expiry: "2026-02-15",
    inspector: "Municipality Inspector",
    result: "Fail",
    certificate: "FH-2025-094",
  },
  {
    id: "CS-009",
    item: "Standby Generator Load Test",
    regulation: "Local Utility",
    lastInspected: "2026-02-28",
    expiry: "2027-02-28",
    inspector: "Marcus Webb",
    result: "Pass",
    certificate: "GEN-2026-010",
  },
  {
    id: "CS-010",
    item: "Gas Installation Safety Inspection",
    regulation: "OSHA / Gas Auth.",
    lastInspected: "2025-09-15",
    expiry: "2026-03-15",
    inspector: "ProGas Services",
    result: "Due Soon",
    certificate: "GAS-2025-057",
  },
  {
    id: "CS-011",
    item: "Electrical Installation (EICR)",
    regulation: "IEC 60364",
    lastInspected: "2024-06-01",
    expiry: "2029-06-01",
    inspector: "ElectroMasters LLC",
    result: "Pass",
    certificate: "EICR-2024-221",
  },
  {
    id: "CS-012",
    item: "Roof Lightning Protection",
    regulation: "IEC 62305",
    lastInspected: "2025-11-01",
    expiry: "2026-11-01",
    inspector: "ElectroMasters LLC",
    result: "Pass",
    certificate: "LP-2025-088",
  },
  {
    id: "CS-013",
    item: "Legionella Risk Assessment",
    regulation: "OSHA / WHO",
    lastInspected: "2025-12-01",
    expiry: "2026-12-01",
    inspector: "AquaFlow Plumbing",
    result: "Pass",
    certificate: "LEG-2025-044",
  },
  {
    id: "CS-014",
    item: "Pressure Vessel (Boiler) Inspection",
    regulation: "Local Eng. Auth.",
    lastInspected: "2025-07-10",
    expiry: "2026-07-10",
    inspector: "Authorised Inspector",
    result: "Pass",
    certificate: "PV-2025-019",
  },
  {
    id: "CS-015",
    item: "Emergency Lighting Test (Annual)",
    regulation: "NFPA 101",
    lastInspected: "2025-10-15",
    expiry: "2026-10-15",
    inspector: "Marcus Webb",
    result: "Pass",
    certificate: "EML-2025-067",
  },
];

// ---------------------------------------------------------------------------
// Shared UI helpers
// ---------------------------------------------------------------------------

const tw = {
  tableWrap: "bg-card rounded-2xl shadow-sm border border-border overflow-x-auto",
  thead: "bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider",
  td: "px-4 py-3 text-sm text-foreground",
  tr: "hover:bg-secondary/30 transition-colors",
};

function priorityBadge(p: string) {
  const colors: Record<string, string> = {
    Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    Low: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  };
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", colors[p] ?? "bg-secondary text-muted-foreground")}>
      {p}
    </span>
  );
}

function statusBadge(s: string) {
  const colors: Record<string, string> = {
    "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    Open: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    Completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    "On Hold": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    Active: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    Inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    Blacklisted: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    Upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    Overdue: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    Adequate: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    Low: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    Draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    Submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    Approved: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    Pass: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    Fail: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    "Due Soon": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    Good: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    Fair: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    Poor: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", colors[s] ?? "bg-secondary text-muted-foreground")}>
      {s}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-sm">
      {"★".repeat(rating)}
      <span className="text-muted-foreground/30">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  gradient: string;
}) {
  return (
    <div className={cn("rounded-2xl p-6 shadow-sm text-white relative overflow-hidden", gradient)}>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {sub && <p className="text-white/70 text-xs mt-1">{sub}</p>}
        </div>
        <div className="bg-white/20 rounded-lg p-3">{icon}</div>
      </div>
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
    </div>
  );
}

const selectCls =
  "text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

// ---------------------------------------------------------------------------
// Sub-view: Overview
// ---------------------------------------------------------------------------

function OverviewView() {
  const woCategoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    workOrdersData.forEach((w) => {
      cats[w.category] = (cats[w.category] ?? 0) + 1;
    });
    return Object.entries(cats).map(([name, count]) => ({ name, count }));
  }, []);

  const barColors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];
  const recent = workOrdersData.filter((w) => w.status !== "Completed").slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<ClipboardList className="w-6 h-6 text-white" />}
          label="Open Work Orders"
          value={workOrdersData.filter((w) => w.status === "Open").length}
          sub="Awaiting assignment"
          gradient="bg-gradient-to-r from-indigo-400 to-indigo-500"
        />
        <StatCard
          icon={<Wrench className="w-6 h-6 text-white" />}
          label="In Progress"
          value={workOrdersData.filter((w) => w.status === "In Progress").length}
          sub="Active technicians on site"
          gradient="bg-gradient-to-r from-blue-400 to-blue-500"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-white" />}
          label="Completed Today"
          value={workOrdersData.filter((w) => w.status === "Completed" && w.created === "2026-04-02").length}
          sub="Apr 2, 2026"
          gradient="bg-gradient-to-r from-emerald-400 to-emerald-500"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          label="PM Overdue"
          value={pmData.filter((p) => p.status === "Overdue").length}
          sub="Requires immediate attention"
          gradient="bg-gradient-to-r from-rose-400 to-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Work Orders by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={woCategoryData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {woCategoryData.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={tw.tableWrap}>
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-semibold text-foreground">Active Work Orders</h3>
          </div>
          <table className="w-full">
            <thead className={tw.thead}>
              <tr>
                <th className="px-4 py-3 text-left">WO ID</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Tech</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recent.map((w) => (
                <tr key={w.id} className={tw.tr}>
                  <td className={cn(tw.td, "font-mono text-xs text-muted-foreground")}>{w.id}</td>
                  <td className={cn(tw.td, "max-w-[120px] truncate")} title={w.location}>{w.location}</td>
                  <td className={tw.td}>{priorityBadge(w.priority)}</td>
                  <td className={tw.td}>{statusBadge(w.status)}</td>
                  <td className={cn(tw.td, "max-w-[100px] truncate")} title={w.tech}>{w.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-view: Work Orders
// ---------------------------------------------------------------------------

function WorkOrdersView() {
  const [catFilter, setCatFilter] = React.useState("All");
  const [priFilter, setPriFilter] = React.useState("All");
  const [statFilter, setStatFilter] = React.useState("All");
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());

  const filtered = useMemo(
    () =>
      workOrdersData.filter((w) => {
        if (catFilter !== "All" && w.category !== catFilter) return false;
        if (priFilter !== "All" && w.priority !== priFilter) return false;
        if (statFilter !== "All" && w.status !== statFilter) return false;
        return true;
      }),
    [catFilter, priFilter, statFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select className={selectCls} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          {["All", "HVAC", "Electrical", "Plumbing", "General", "Civil"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className={selectCls} value={priFilter} onChange={(e) => setPriFilter(e.target.value)}>
          {["All", "Critical", "High", "Medium", "Low"].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select className={selectCls} value={statFilter} onChange={(e) => setStatFilter(e.target.value)}>
          {["All", "Open", "In Progress", "Completed", "On Hold"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">{filtered.length} work orders</span>
      </div>

      <div className={tw.tableWrap}>
        <table className="w-full min-w-[900px]">
          <thead className={tw.thead}>
            <tr>
              <th className="px-4 py-3 text-left">WO ID</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Issue Description</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Assigned Tech</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map((w) => {
              const isDone = w.status === "Completed" || completed.has(w.id);
              return (
                <tr key={w.id} className={tw.tr}>
                  <td className={cn(tw.td, "font-mono text-xs text-muted-foreground whitespace-nowrap")}>{w.id}</td>
                  <td className={cn(tw.td, "max-w-[100px] truncate")} title={w.location}>{w.location}</td>
                  <td className={cn(tw.td, "max-w-[200px] truncate")} title={w.issue}>{w.issue}</td>
                  <td className={tw.td}>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {w.category}
                    </span>
                  </td>
                  <td className={tw.td}>{priorityBadge(w.priority)}</td>
                  <td className={cn(tw.td, "max-w-[110px] truncate")} title={w.tech}>{w.tech}</td>
                  <td className={tw.td}>{statusBadge(isDone ? "Completed" : w.status)}</td>
                  <td className={cn(tw.td, "whitespace-nowrap text-muted-foreground text-xs")}>{w.created}</td>
                  <td className={tw.td}>
                    <button
                      disabled={isDone}
                      onClick={() => setCompleted((prev) => new Set([...prev, w.id]))}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                        isDone
                          ? "bg-secondary text-muted-foreground cursor-not-allowed"
                          : "bg-emerald-500 text-white hover:bg-emerald-600"
                      )}
                    >
                      {isDone ? "Done" : "Complete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-view: Preventive Maintenance
// ---------------------------------------------------------------------------

function PMView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Calendar className="w-6 h-6 text-white" />}
          label="Upcoming PM"
          value={pmData.filter((p) => p.status === "Upcoming").length}
          sub="Next 30 days"
          gradient="bg-gradient-to-r from-blue-400 to-blue-500"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          label="Overdue PM"
          value={pmData.filter((p) => p.status === "Overdue").length}
          sub="Requires immediate action"
          gradient="bg-gradient-to-r from-rose-400 to-rose-500"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-white" />}
          label="Total Scheduled"
          value={pmData.length}
          sub="Active PM schedule"
          gradient="bg-gradient-to-r from-emerald-400 to-emerald-500"
        />
        <StatCard
          icon={<Settings className="w-6 h-6 text-white" />}
          label="Completion Rate"
          value="73%"
          sub="Last 90 days"
          gradient="bg-gradient-to-r from-violet-400 to-violet-500"
        />
      </div>

      <div className={tw.tableWrap}>
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Preventive Maintenance Schedule</h3>
        </div>
        <table className="w-full min-w-[900px]">
          <thead className={tw.thead}>
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Equipment</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Last Service</th>
              <th className="px-4 py-3 text-left">Next Due</th>
              <th className="px-4 py-3 text-left">Frequency</th>
              <th className="px-4 py-3 text-left">Assigned</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {pmData.map((p) => (
              <tr key={p.id} className={cn(tw.tr, p.status === "Overdue" && "bg-red-50/30 dark:bg-red-900/5")}>
                <td className={cn(tw.td, "font-mono text-xs text-muted-foreground")}>{p.id}</td>
                <td className={cn(tw.td, "max-w-[200px] truncate")} title={p.equipment}>{p.equipment}</td>
                <td className={cn(tw.td, "max-w-[140px] truncate")} title={p.location}>{p.location}</td>
                <td className={cn(tw.td, "whitespace-nowrap text-muted-foreground text-xs")}>{p.lastService}</td>
                <td className={cn(tw.td, "whitespace-nowrap text-xs font-medium", p.status === "Overdue" && "text-red-600")}>{p.nextDue}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground whitespace-nowrap")}>{p.frequency}</td>
                <td className={cn(tw.td, "max-w-[130px] truncate")} title={p.assigned}>{p.assigned}</td>
                <td className={tw.td}>{statusBadge(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-view: Asset Registry
// ---------------------------------------------------------------------------

function AssetRegistryView() {
  const [catFilter, setCatFilter] = React.useState("All");
  const [condFilter, setCondFilter] = React.useState("All");

  const cats = useMemo(() => ["All", ...Array.from(new Set(assetsData.map((a) => a.category)))], []);

  const filtered = useMemo(
    () =>
      assetsData.filter((a) => {
        if (catFilter !== "All" && a.category !== catFilter) return false;
        if (condFilter !== "All" && a.condition !== condFilter) return false;
        return true;
      }),
    [catFilter, condFilter]
  );

  const totalCapex = assetsData.reduce((s, a) => s + a.capex, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Database className="w-6 h-6 text-white" />}
          label="Total Assets"
          value={assetsData.length}
          sub="Registered assets"
          gradient="bg-gradient-to-r from-indigo-400 to-indigo-500"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          label="Total CAPEX Value"
          value={`$${(totalCapex / 1000).toFixed(0)}k`}
          sub="Combined book value"
          gradient="bg-gradient-to-r from-emerald-400 to-emerald-500"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          label="Poor Condition"
          value={assetsData.filter((a) => a.condition === "Poor").length}
          sub="Requires replacement planning"
          gradient="bg-gradient-to-r from-rose-400 to-rose-500"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select className={selectCls} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className={selectCls} value={condFilter} onChange={(e) => setCondFilter(e.target.value)}>
          {["All", "Good", "Fair", "Poor"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="text-sm text-muted-foreground">{filtered.length} assets</span>
      </div>

      <div className={tw.tableWrap}>
        <table className="w-full min-w-[1000px]">
          <thead className={tw.thead}>
            <tr>
              <th className="px-4 py-3 text-left">Asset ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Condition</th>
              <th className="px-4 py-3 text-left">Purchase Date</th>
              <th className="px-4 py-3 text-left">Warranty Expiry</th>
              <th className="px-4 py-3 text-left">Last Maintained</th>
              <th className="px-4 py-3 text-right">CAPEX Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map((a) => (
              <tr key={a.id} className={cn(tw.tr, a.condition === "Poor" && "bg-red-50/30 dark:bg-red-900/5")}>
                <td className={cn(tw.td, "font-mono text-xs text-muted-foreground")}>{a.id}</td>
                <td className={cn(tw.td, "max-w-[180px] truncate")} title={a.name}>{a.name}</td>
                <td className={cn(tw.td, "max-w-[140px] truncate text-xs text-muted-foreground")} title={a.category}>{a.category}</td>
                <td className={cn(tw.td, "max-w-[130px] truncate")} title={a.location}>{a.location}</td>
                <td className={tw.td}>{statusBadge(a.condition)}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground whitespace-nowrap")}>{a.purchaseDate}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground whitespace-nowrap")}>{a.warrantyExpiry}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground whitespace-nowrap")}>{a.lastMaintained}</td>
                <td className={cn(tw.td, "text-right font-medium whitespace-nowrap")}>${a.capex.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-view: Energy Management
// ---------------------------------------------------------------------------

function EnergyView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Zap className="w-6 h-6 text-white" />}
          label="kWh Today"
          value="1,842"
          sub="Down 4.2% vs yesterday"
          gradient="bg-gradient-to-r from-amber-400 to-amber-500"
        />
        <StatCard
          icon={<Droplets className="w-6 h-6 text-white" />}
          label="Water Today (m3)"
          value="62"
          sub="Up 2.1% vs yesterday"
          gradient="bg-gradient-to-r from-blue-400 to-blue-500"
        />
        <StatCard
          icon={<Thermometer className="w-6 h-6 text-white" />}
          label="Gas Today (m3)"
          value="51"
          sub="Boiler + Kitchen"
          gradient="bg-gradient-to-r from-orange-400 to-orange-500"
        />
        <StatCard
          icon={<Gauge className="w-6 h-6 text-white" />}
          label="Solar Contribution"
          value="16%"
          sub="of total electricity today"
          gradient="bg-gradient-to-r from-emerald-400 to-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Electricity Consumption — Last 30 Days (kWh)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={energyChartData}>
              <defs>
                <linearGradient id="eng-kwh-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 11 }} domain={[1200, 2400]} />
              <Tooltip />
              <Area type="monotone" dataKey="kwh" stroke="#f59e0b" fill="url(#eng-kwh-grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Monthly Utility Costs (AED)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={utilityCostData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="electricity" name="Electricity" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="water" name="Water" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gas" name="Gas" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={tw.tableWrap}>
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Meter Readings</h3>
        </div>
        <table className="w-full min-w-[800px]">
          <thead className={tw.thead}>
            <tr>
              <th className="px-4 py-3 text-left">Meter ID</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-right">Current Reading</th>
              <th className="px-4 py-3 text-left">Unit</th>
              <th className="px-4 py-3 text-right">This Month</th>
              <th className="px-4 py-3 text-right">Last Month</th>
              <th className="px-4 py-3 text-right">Variance %</th>
              <th className="px-4 py-3 text-left">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {meterReadings.map((m) => (
              <tr key={m.id} className={tw.tr}>
                <td className={cn(tw.td, "font-mono text-xs text-muted-foreground")}>{m.id}</td>
                <td className={cn(tw.td, "max-w-[180px] truncate")} title={m.location}>{m.location}</td>
                <td className={cn(tw.td, "text-right font-mono text-xs")}>{m.reading}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground")}>{m.unit}</td>
                <td className={cn(tw.td, "text-right text-xs font-medium")}>{m.thisMonth.toLocaleString()}</td>
                <td className={cn(tw.td, "text-right text-xs text-muted-foreground")}>{m.lastMonth.toLocaleString()}</td>
                <td className={cn(tw.td, "text-right text-xs font-semibold", m.variance > 0 ? "text-red-500" : "text-emerald-500")}>
                  {m.variance > 0 ? "+" : ""}{m.variance}%
                </td>
                <td className={tw.td}>
                  <span className={cn("text-sm font-bold", m.trend === "up" ? "text-red-500" : "text-emerald-500")}>
                    {m.trend === "up" ? "↑" : "↓"}
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

// ---------------------------------------------------------------------------
// Sub-view: Vendors & Contractors
// ---------------------------------------------------------------------------

function VendorsView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<FileText className="w-6 h-6 text-white" />}
          label="Active Vendors"
          value={vendorsData.filter((v) => v.status === "Active").length}
          sub="Under active contract"
          gradient="bg-gradient-to-r from-emerald-400 to-emerald-500"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          label="Blacklisted"
          value={vendorsData.filter((v) => v.status === "Blacklisted").length}
          sub="Do not engage"
          gradient="bg-gradient-to-r from-rose-400 to-rose-500"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-white" />}
          label="Expiring Soon"
          value={vendorsData.filter((v) => v.contractExpiry <= "2026-06-30" && v.status === "Active").length}
          sub="Contracts within 90 days"
          gradient="bg-gradient-to-r from-amber-400 to-amber-500"
        />
      </div>

      <div className={tw.tableWrap}>
        <table className="w-full min-w-[1000px]">
          <thead className={tw.thead}>
            <tr>
              <th className="px-4 py-3 text-left">Vendor Name</th>
              <th className="px-4 py-3 text-left">Service Category</th>
              <th className="px-4 py-3 text-left">Contact Person</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Contract Expiry</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Used</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {vendorsData.map((v) => (
              <tr key={v.id} className={cn(tw.tr, v.status === "Blacklisted" && "bg-red-50/30 dark:bg-red-900/5")}>
                <td className={cn(tw.td, "font-medium max-w-[150px] truncate")} title={v.name}>{v.name}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground max-w-[130px] truncate")} title={v.category}>{v.category}</td>
                <td className={cn(tw.td, "max-w-[120px] truncate")} title={v.contact}>{v.contact}</td>
                <td className={cn(tw.td, "text-xs whitespace-nowrap")}>{v.phone}</td>
                <td className={cn(tw.td, "text-xs max-w-[160px] truncate")} title={v.email}>{v.email}</td>
                <td
                  className={cn(
                    tw.td,
                    "text-xs whitespace-nowrap",
                    v.contractExpiry <= "2026-06-30" && v.status === "Active" && "text-amber-600 font-medium"
                  )}
                >
                  {v.contractExpiry}
                </td>
                <td className={tw.td}><StarRating rating={v.rating} /></td>
                <td className={tw.td}>{statusBadge(v.status)}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground whitespace-nowrap")}>{v.lastUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-view: Spare Parts Inventory
// ---------------------------------------------------------------------------

function SparePartsView() {
  const criticalCount = sparePartsData.filter((s) => s.status === "Critical").length;
  const lowCount = sparePartsData.filter((s) => s.status === "Low").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Package className="w-6 h-6 text-white" />}
          label="Total Part Types"
          value={sparePartsData.length}
          sub="In engineering store"
          gradient="bg-gradient-to-r from-indigo-400 to-indigo-500"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          label="Reorder Alerts"
          value={criticalCount + lowCount}
          sub={`${criticalCount} critical · ${lowCount} low`}
          gradient="bg-gradient-to-r from-rose-400 to-rose-500"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-white" />}
          label="Adequate Stock"
          value={sparePartsData.filter((s) => s.status === "Adequate").length}
          sub="Above minimum threshold"
          gradient="bg-gradient-to-r from-emerald-400 to-emerald-500"
        />
        <StatCard
          icon={<Database className="w-6 h-6 text-white" />}
          label="Out of Stock"
          value={sparePartsData.filter((s) => s.stock === 0).length}
          sub="Immediate procurement needed"
          gradient="bg-gradient-to-r from-amber-400 to-amber-500"
        />
      </div>

      <div className={tw.tableWrap}>
        <table className="w-full min-w-[900px]">
          <thead className={tw.thead}>
            <tr>
              <th className="px-4 py-3 text-left">Part ID</th>
              <th className="px-4 py-3 text-left">Part Name</th>
              <th className="px-4 py-3 text-left">Equipment Applicable</th>
              <th className="px-4 py-3 text-right">Current Stock</th>
              <th className="px-4 py-3 text-right">Min Stock</th>
              <th className="px-4 py-3 text-left">Unit</th>
              <th className="px-4 py-3 text-left">Location (Bin)</th>
              <th className="px-4 py-3 text-left">Last Restocked</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sparePartsData.map((s) => (
              <tr
                key={s.id}
                className={cn(
                  tw.tr,
                  s.status === "Critical" && "bg-red-50/40 dark:bg-red-900/10",
                  s.status === "Low" && "bg-amber-50/30 dark:bg-amber-900/5"
                )}
              >
                <td className={cn(tw.td, "font-mono text-xs text-muted-foreground")}>{s.id}</td>
                <td className={cn(tw.td, "max-w-[180px] truncate")} title={s.name}>{s.name}</td>
                <td className={cn(tw.td, "max-w-[160px] truncate text-xs text-muted-foreground")} title={s.equipment}>{s.equipment}</td>
                <td
                  className={cn(
                    tw.td,
                    "text-right font-bold",
                    s.stock === 0 ? "text-red-600" : s.status === "Low" ? "text-amber-600" : ""
                  )}
                >
                  {s.stock}
                </td>
                <td className={cn(tw.td, "text-right text-muted-foreground text-xs")}>{s.minStock}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground")}>{s.unit}</td>
                <td className={cn(tw.td, "text-xs")}>{s.location}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground whitespace-nowrap")}>{s.lastRestocked}</td>
                <td className={tw.td}>{statusBadge(s.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-view: CAPEX Requests
// ---------------------------------------------------------------------------

function CapexView() {
  const approved = capexData.filter((c) => c.status === "Approved").reduce((s, c) => s + c.cost, 0);
  const inProgress = capexData.filter((c) => c.status === "In Progress").reduce((s, c) => s + c.cost, 0);
  const pending = capexData.filter((c) => c.status === "Submitted").reduce((s, c) => s + c.cost, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          label="Total Approved Budget"
          value={`$${(approved / 1000).toFixed(0)}k`}
          sub="Approved CAPEX 2026"
          gradient="bg-gradient-to-r from-emerald-400 to-emerald-500"
        />
        <StatCard
          icon={<Wrench className="w-6 h-6 text-white" />}
          label="Spent / In Progress"
          value={`$${(inProgress / 1000).toFixed(0)}k`}
          sub="Active works"
          gradient="bg-gradient-to-r from-blue-400 to-blue-500"
        />
        <StatCard
          icon={<ClipboardList className="w-6 h-6 text-white" />}
          label="Pending Approval"
          value={`$${(pending / 1000).toFixed(0)}k`}
          sub={`${capexData.filter((c) => c.status === "Submitted").length} requests awaiting`}
          gradient="bg-gradient-to-r from-amber-400 to-amber-500"
        />
      </div>

      <div className={tw.tableWrap}>
        <table className="w-full min-w-[900px]">
          <thead className={tw.thead}>
            <tr>
              <th className="px-4 py-3 text-left">Request ID</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Est. Cost</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Requested By</th>
              <th className="px-4 py-3 text-left">Date Submitted</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {capexData.map((c) => (
              <tr key={c.id} className={tw.tr}>
                <td className={cn(tw.td, "font-mono text-xs text-muted-foreground")}>{c.id}</td>
                <td className={cn(tw.td, "max-w-[220px] truncate")} title={c.description}>{c.description}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground max-w-[130px] truncate")} title={c.category}>{c.category}</td>
                <td className={cn(tw.td, "text-right font-semibold whitespace-nowrap")}>${c.cost.toLocaleString()}</td>
                <td className={tw.td}>{priorityBadge(c.priority)}</td>
                <td className={cn(tw.td, "max-w-[120px] truncate")} title={c.requestedBy}>{c.requestedBy}</td>
                <td className={cn(tw.td, "text-xs text-muted-foreground whitespace-nowrap")}>{c.dateSubmitted}</td>
                <td className={tw.td}>{statusBadge(c.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-view: Compliance & Safety
// ---------------------------------------------------------------------------

function ComplianceView() {
  const passed = complianceData.filter((c) => c.result === "Pass").length;
  const failed = complianceData.filter((c) => c.result === "Fail").length;
  const dueSoon = complianceData.filter((c) => c.result === "Due Soon").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Shield className="w-6 h-6 text-white" />}
          label="Total Inspections"
          value={complianceData.length}
          sub="Tracked compliance items"
          gradient="bg-gradient-to-r from-indigo-400 to-indigo-500"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-white" />}
          label="Passed"
          value={passed}
          sub="Currently compliant"
          gradient="bg-gradient-to-r from-emerald-400 to-emerald-500"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          label="Due Soon"
          value={dueSoon}
          sub="Renewal within 30 days"
          gradient="bg-gradient-to-r from-amber-400 to-amber-500"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          label="Failed / Action Needed"
          value={failed}
          sub="Immediate attention required"
          gradient="bg-gradient-to-r from-rose-400 to-rose-500"
        />
      </div>

      <div className={tw.tableWrap}>
        <table className="w-full min-w-[1000px]">
          <thead className={tw.thead}>
            <tr>
              <th className="px-4 py-3 text-left">Inspection Item</th>
              <th className="px-4 py-3 text-left">Regulation</th>
              <th className="px-4 py-3 text-left">Last Inspected</th>
              <th className="px-4 py-3 text-left">Expiry</th>
              <th className="px-4 py-3 text-left">Inspector</th>
              <th className="px-4 py-3 text-left">Result</th>
              <th className="px-4 py-3 text-left">Certificate No.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {complianceData.map((c) => (
              <tr
                key={c.id}
                className={cn(
                  tw.tr,
                  c.result === "Fail" && "bg-red-50/40 dark:bg-red-900/10",
                  c.result === "Due Soon" && "bg-amber-50/30 dark:bg-amber-900/5"
                )}
              >
                <td className={cn(tw.td, "max-w-[220px] truncate")} title={c.item}>{c.item}</td>
                <td className={cn(tw.td, "text-xs whitespace-nowrap")}>
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                    {c.regulation}
                  </span>
                </td>
                <td className={cn(tw.td, "text-xs text-muted-foreground whitespace-nowrap")}>{c.lastInspected}</td>
                <td className={cn(tw.td, "text-xs whitespace-nowrap font-medium", c.result !== "Pass" && "text-amber-600")}>{c.expiry}</td>
                <td className={cn(tw.td, "max-w-[140px] truncate text-xs")} title={c.inspector}>{c.inspector}</td>
                <td className={tw.td}>{statusBadge(c.result)}</td>
                <td className={cn(tw.td, "font-mono text-xs text-muted-foreground max-w-[130px] truncate")} title={c.certificate}>{c.certificate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page header metadata
// ---------------------------------------------------------------------------

const pageConfig: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
  overview: {
    label: "Engineering Overview",
    icon: <BarChart2 className="w-5 h-5" />,
    description: "Live snapshot of work orders, PM status, and asset health",
  },
  "work-orders": {
    label: "Work Orders",
    icon: <Wrench className="w-5 h-5" />,
    description: "Full CRUD management of reactive maintenance tasks",
  },
  "preventive-maintenance": {
    label: "Preventive Maintenance",
    icon: <Calendar className="w-5 h-5" />,
    description: "Schedule and track planned maintenance across all equipment",
  },
  "asset-registry": {
    label: "Asset Registry",
    icon: <Database className="w-5 h-5" />,
    description: "Complete hotel asset register with CAPEX and condition tracking",
  },
  "energy-management": {
    label: "Energy Management",
    icon: <Zap className="w-5 h-5" />,
    description: "Utility consumption monitoring — electricity, water, gas, solar",
  },
  "vendors-contractors": {
    label: "Vendors & Contractors",
    icon: <FileText className="w-5 h-5" />,
    description: "Contracted service providers and performance ratings",
  },
  "spare-parts": {
    label: "Spare Parts Inventory",
    icon: <Package className="w-5 h-5" />,
    description: "Engineering store inventory with reorder alerts",
  },
  "capex-requests": {
    label: "CAPEX Requests",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Capital expenditure pipeline — approvals and budget tracking",
  },
  "compliance-safety": {
    label: "Compliance & Safety",
    icon: <Shield className="w-5 h-5" />,
    description: "Regulatory inspections, certificates, and expiry management",
  },
};

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function Engineering({ aiEnabled, activeSubmenu }: EngineeringProps) {
  const submenu = activeSubmenu ?? "overview";
  const page = pageConfig[submenu] ?? pageConfig["overview"];

  const renderContent = () => {
    switch (submenu) {
      case "overview":
        return <OverviewView />;
      case "work-orders":
        return <WorkOrdersView />;
      case "preventive-maintenance":
        return <PMView />;
      case "asset-registry":
        return <AssetRegistryView />;
      case "energy-management":
        return <EnergyView />;
      case "vendors-contractors":
        return <VendorsView />;
      case "spare-parts":
        return <SparePartsView />;
      case "capex-requests":
        return <CapexView />;
      case "compliance-safety":
        return <ComplianceView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={submenu}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-muted-foreground">{page.icon}</span>
              <h1 className="text-2xl font-bold text-foreground">{page.label}</h1>
            </div>
            <p className="text-muted-foreground text-sm">{page.description}</p>
          </div>
          {aiEnabled && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium">
              <Wind className="w-3.5 h-3.5" />
              AI Insights Active
            </div>
          )}
        </div>

        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}
