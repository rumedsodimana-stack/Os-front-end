import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { hcmService, StaffMember, AttendanceRecord, PayrollRun } from "../services/hcm";
import { cn } from "../lib/utils";
import {
  Users, UserCheck, UserX, Clock, DollarSign, Calendar,
  Search, Plus, Mail, Phone, Download, CheckCircle2, AlertCircle, Filter
} from "lucide-react";

interface HumanResourcesProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

// Mock fallback data
const mockStaff: StaffMember[] = [
  { id: "1", name: "Maria Garcia", role: "Housekeeping Supervisor", department: "Housekeeping", status: "ACTIVE", email: "m.garcia@hotel.com", phone: "+1-555-0101", hireDate: "2021-03-15" },
  { id: "2", name: "John Doe", role: "Front Desk Agent", department: "Front Office", status: "ACTIVE", email: "j.doe@hotel.com", phone: "+1-555-0102", hireDate: "2022-06-01" },
  { id: "3", name: "Alice Johnson", role: "F&B Manager", department: "Food & Beverage", status: "ACTIVE", email: "a.johnson@hotel.com", phone: "+1-555-0103", hireDate: "2020-09-12" },
  { id: "4", name: "Robert Brown", role: "Engineer", department: "Engineering", status: "ON_LEAVE", email: "r.brown@hotel.com", phone: "+1-555-0104", hireDate: "2023-01-20" },
  { id: "5", name: "Emily Davis", role: "Sales Manager", department: "Sales", status: "ACTIVE", email: "e.davis@hotel.com", phone: "+1-555-0105", hireDate: "2019-11-08" },
  { id: "6", name: "Michael Wilson", role: "Concierge", department: "Front Office", status: "ACTIVE", email: "m.wilson@hotel.com", phone: "+1-555-0106", hireDate: "2022-02-14" },
];
const mockAttendance: AttendanceRecord[] = [
  { id: "1", staffId: "1", staffName: "Maria Garcia", date: "2026-04-01", checkIn: "08:00", checkOut: "17:00", status: "PRESENT" },
  { id: "2", staffId: "2", staffName: "John Doe", date: "2026-04-01", checkIn: "09:05", checkOut: "18:10", status: "LATE" },
  { id: "3", staffId: "3", staffName: "Alice Johnson", date: "2026-04-01", checkIn: "08:00", checkOut: "17:00", status: "PRESENT" },
  { id: "4", staffId: "4", staffName: "Robert Brown", date: "2026-04-01", status: "ABSENT" },
  { id: "5", staffId: "5", staffName: "Emily Davis", date: "2026-04-01", checkIn: "08:00", checkOut: "13:00", status: "HALF_DAY" },
  { id: "6", staffId: "6", staffName: "Michael Wilson", date: "2026-04-01", checkIn: "08:00", checkOut: "17:00", status: "PRESENT" },
];
const mockPayroll: PayrollRun[] = [
  { id: "1", period: "March 2026", status: "PAID", totalAmount: 148500, employeeCount: 42, processedAt: "2026-04-01" },
  { id: "2", period: "February 2026", status: "PAID", totalAmount: 145200, employeeCount: 41, processedAt: "2026-03-01" },
  { id: "3", period: "April 2026", status: "DRAFT", totalAmount: 0, employeeCount: 42 },
];

function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-secondary animate-pulse rounded" />
        </td>
      ))}
    </tr>
  );
}

function HROverview() {
  const { data: staff } = useQuery({ queryKey: ['staff'], queryFn: hcmService.getStaff, retry: false });
  const { data: attendance } = useQuery({ queryKey: ['attendance'], queryFn: () => hcmService.getAttendance(), retry: false });
  const { data: payroll } = useQuery({ queryKey: ['payrollRuns'], queryFn: hcmService.getPayrollRuns, retry: false });

  const displayStaff = staff ?? mockStaff;
  const displayAttendance = attendance ?? mockAttendance;
  const displayPayroll = payroll ?? mockPayroll;

  const active = displayStaff.filter(s => s.status === 'ACTIVE').length;
  const onLeave = displayStaff.filter(s => s.status === 'ON_LEAVE').length;
  const presentToday = displayAttendance.filter(a => a.status === 'PRESENT').length;
  const latestPayroll = displayPayroll[0];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Human Resources Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: displayStaff.length, sub: "Across all departments", icon: Users, bg: "bg-gradient-to-r from-violet-400 to-violet-500" },
          { label: "Active Today", value: presentToday, sub: "Present & checked in", icon: UserCheck, bg: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
          { label: "On Leave", value: onLeave, sub: "Approved absences", icon: UserX, bg: "bg-gradient-to-r from-amber-400 to-amber-500" },
          { label: "Payroll (Last)", value: latestPayroll ? `$${latestPayroll.totalAmount.toLocaleString()}` : "—", sub: latestPayroll?.period ?? "N/A", icon: DollarSign, bg: "bg-gradient-to-r from-pink-400 to-pink-500" },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-2xl p-6 shadow-sm text-white relative overflow-hidden", stat.bg)}>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/20 rounded-lg"><stat.icon className="w-5 h-5 text-white" /></div>
                <p className="text-sm font-medium text-white/90">{stat.label}</p>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-xs text-white/80">{stat.sub}</p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          </div>
        ))}
      </div>

      {/* Department breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Staff by Department</h2>
          <div className="space-y-3">
            {Object.entries(
              displayStaff.reduce((acc, s) => { acc[s.department] = (acc[s.department] || 0) + 1; return acc; }, {} as Record<string, number>)
            ).map(([dept, count]) => (
              <div key={dept} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-40 truncate">{dept}</span>
                <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(count / displayStaff.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Today's Attendance Summary</h2>
          <div className="space-y-3">
            {[
              { label: "Present", count: displayAttendance.filter(a => a.status === 'PRESENT').length, color: "bg-emerald-500" },
              { label: "Late", count: displayAttendance.filter(a => a.status === 'LATE').length, color: "bg-amber-500" },
              { label: "Absent", count: displayAttendance.filter(a => a.status === 'ABSENT').length, color: "bg-red-500" },
              { label: "Half Day", count: displayAttendance.filter(a => a.status === 'HALF_DAY').length, color: "bg-blue-500" },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between p-3 bg-secondary/40 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", row.color)} />
                  <span className="text-sm font-medium">{row.label}</span>
                </div>
                <span className="text-sm font-bold">{row.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeList() {
  const [search, setSearch] = useState("");
  const { data: staff, isLoading } = useQuery({ queryKey: ['staff'], queryFn: hcmService.getStaff, retry: false });
  const displayStaff = (staff ?? mockStaff).filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-4 px-4 md:-mx-8 md:px-8 -mt-4 pt-4 md:-mt-8 md:pt-8 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Employee List</h1>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
        <div className="flex gap-3 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-secondary border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Hire Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />) :
                displayStaff.map(emp => (
                  <tr key={emp.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{emp.role}</td>
                    <td className="px-5 py-4 text-muted-foreground">{emp.department}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        {emp.email && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3 h-3" /> {emp.email}</span>}
                        {emp.phone && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="w-3 h-3" /> {emp.phone}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{emp.hireDate ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium",
                        emp.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        emp.status === "ON_LEAVE" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-secondary text-muted-foreground"
                      )}>
                        {emp.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Attendance() {
  const { data: attendance, isLoading } = useQuery({ queryKey: ['attendance'], queryFn: () => hcmService.getAttendance(), retry: false });
  const display = attendance ?? mockAttendance;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Attendance — {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h1>
        <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Check In</th>
                <th className="px-5 py-3 font-medium">Check Out</th>
                <th className="px-5 py-3 font-medium">Hours</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={5} />) :
                display.map(rec => {
                  let hours = "—";
                  if (rec.checkIn && rec.checkOut) {
                    const [ih, im] = rec.checkIn.split(":").map(Number);
                    const [oh, om] = rec.checkOut.split(":").map(Number);
                    const diff = (oh * 60 + om) - (ih * 60 + im);
                    hours = `${Math.floor(diff / 60)}h ${diff % 60}m`;
                  }
                  return (
                    <tr key={rec.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-4 font-medium">{rec.staffName}</td>
                      <td className="px-5 py-4 text-muted-foreground">{rec.checkIn ?? "—"}</td>
                      <td className="px-5 py-4 text-muted-foreground">{rec.checkOut ?? "—"}</td>
                      <td className="px-5 py-4 font-medium">{hours}</td>
                      <td className="px-5 py-4">
                        <span className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium w-fit",
                          rec.status === "PRESENT" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                          rec.status === "LATE" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                          rec.status === "ABSENT" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        )}>
                          {rec.status === "PRESENT" && <CheckCircle2 className="w-3 h-3" />}
                          {rec.status === "ABSENT" && <AlertCircle className="w-3 h-3" />}
                          {rec.status === "LATE" && <Clock className="w-3 h-3" />}
                          {rec.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Payroll() {
  const { data: runs, isLoading } = useQuery({ queryKey: ['payrollRuns'], queryFn: hcmService.getPayrollRuns, retry: false });
  const display = runs ?? mockPayroll;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Payroll</h1>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Run Payroll
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Last Payroll", value: display[0] ? `$${display[0].totalAmount.toLocaleString()}` : "—", sub: display[0]?.period ?? "", icon: DollarSign, color: "text-violet-600" },
          { label: "Employees Paid", value: display[0]?.employeeCount ?? "—", sub: "In last run", icon: Users, color: "text-emerald-600" },
          { label: "Next Payroll", value: "May 1, 2026", sub: "30 days away", icon: Calendar, color: "text-amber-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-xl bg-secondary", stat.color)}><stat.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border"><h2 className="font-semibold">Payroll History</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Period</th>
                <th className="px-5 py-3 font-medium text-right">Total Amount</th>
                <th className="px-5 py-3 font-medium text-right">Employees</th>
                <th className="px-5 py-3 font-medium">Processed</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} cols={6} />) :
                display.map(run => (
                  <tr key={run.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-4 font-medium">{run.period}</td>
                    <td className="px-5 py-4 text-right font-semibold text-violet-600">
                      {run.totalAmount > 0 ? `$${run.totalAmount.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-5 py-4 text-right text-muted-foreground">{run.employeeCount}</td>
                    <td className="px-5 py-4 text-muted-foreground">{run.processedAt ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium",
                        run.status === "PAID" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        run.status === "PROCESSING" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        "bg-secondary text-muted-foreground"
                      )}>
                        {run.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-primary hover:underline font-medium">
                        {run.status === "DRAFT" ? "Process" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function HumanResources({ activeSubmenu }: HumanResourcesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview": return <HROverview />;
      case "Employee List": return <EmployeeList />;
      case "Attendance": return <Attendance />;
      case "Payroll": return <Payroll />;
      default: return <HROverview />;
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
