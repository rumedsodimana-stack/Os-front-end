import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  CreditCard, 
  GraduationCap, 
  ShieldCheck, 
  Receipt, 
  FileText, 
  Search, 
  Filter,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Clock4,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Settings2,
  UserCheck,
  Wallet,
  UserSearch,
  X
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
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { KPICard } from "../components/ui/KPICard";

interface HRProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

const COLORS = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];

// --- Sub-components ---

function HROverview() {
  const attendanceData = [
    { name: "Mon", present: 230, absent: 18 },
    { name: "Tue", present: 235, absent: 13 },
    { name: "Wed", present: 228, absent: 20 },
    { name: "Thu", present: 240, absent: 8 },
    { name: "Fri", present: 232, absent: 16 },
  ];

  const departmentDistribution = [
    { name: "Front Desk", value: 45 },
    { name: "Housekeeping", value: 85 },
    { name: "F&B", value: 60 },
    { name: "Engineering", value: 25 },
    { name: "Admin", value: 33 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Total Employees" 
          value="248" 
          change="+12 this month" 
          trend="up" 
          icon={Users} 
          color="blue" 
        />
        <KPICard 
          label="Active Leave" 
          value="14" 
          change="5 pending approval" 
          trend="neutral" 
          icon={Calendar} 
          color="amber" 
        />
        <KPICard 
          label="Open Positions" 
          value="8" 
          change="3 new this week" 
          trend="up" 
          icon={Briefcase} 
          color="purple" 
        />
        <KPICard 
          label="Training Progress" 
          value="82%" 
          change="+5% from last month" 
          trend="up" 
          icon={GraduationCap} 
          color="emerald" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Weekly Attendance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="present" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Department Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

  const employees = [
    { id: "EMP001", name: "Alice Johnson", role: "Front Desk Manager", dept: "Front Desk", status: "Active", email: "alice.j@hotel.com" },
    { id: "EMP002", name: "Bob Smith", role: "Head Chef", dept: "Food & Beverage", status: "Active", email: "bob.s@hotel.com" },
    { id: "EMP003", name: "Charlie Davis", role: "Maintenance Lead", dept: "Engineering", status: "On Leave", email: "charlie.d@hotel.com" },
    { id: "EMP004", name: "Diana Prince", role: "HR Specialist", dept: "Human Resources", status: "Active", email: "diana.p@hotel.com" },
    { id: "EMP005", name: "Edward Norton", role: "Housekeeping Supervisor", dept: "Housekeeping", status: "Active", email: "edward.n@hotel.com" },
  ];

  const filteredEmployees = employees.filter(emp => {
    const query = searchQuery.toLowerCase();
    return emp.name.toLowerCase().includes(query) || 
           emp.role.toLowerCase().includes(query) || 
           emp.dept.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search employees by name, role, or dept..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border rounded-xl hover:bg-secondary transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button 
            onClick={() => setIsAddEmployeeModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm">
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Employee</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role & Dept</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{emp.role}</p>
                      <p className="text-xs text-muted-foreground">{emp.dept}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        emp.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      )}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {emp.email}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No employees found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isAddEmployeeModalOpen && (
          <AddEmployeeModal onClose={() => setIsAddEmployeeModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddEmployeeModal({ onClose }: { onClose: () => void }) {
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
          <div>
            <h3 className="text-lg font-bold text-foreground">Add New Employee</h3>
            <p className="text-sm text-muted-foreground">Enter comprehensive employee details.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            {/* Personal Information */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Middle Name</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Robert" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-Binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nationality</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. American" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marital Status</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option>
                    <option>O+</option><option>O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Personal Email <span className="text-red-500">*</span></label>
                  <input type="email" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Current Address</label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" placeholder="Full street address..."></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State/Province</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="State" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Postal Code</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Zip/Postal Code" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Country" />
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Employment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee ID</label>
                  <input type="text" className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-xl focus:outline-none" value="EMP-AUTO-GEN" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Front Desk</option>
                    <option>Housekeeping</option>
                    <option>Food & Beverage</option>
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Sales & Revenue</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Designation/Role <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Front Desk Agent" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employment Type</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Joining <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reporting Manager</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Select Manager...</option>
                    <option>Alice Johnson</option>
                    <option>Bob Smith</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Work Location</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Main Property</option>
                    <option>Annex Building</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shift Type</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Morning (07:00 - 15:00)</option>
                    <option>Evening (15:00 - 23:00)</option>
                    <option>Night (23:00 - 07:00)</option>
                    <option>General (09:00 - 17:00)</option>
                    <option>Rotating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payroll & Compensation */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Payroll & Compensation</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Salary (Annual) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="number" className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pay Frequency</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Monthly</option>
                    <option>Bi-Weekly</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Bank Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Account Number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Routing/Sort Code</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Routing Code" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax ID / SSN</label>
                  <input type="password" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="***-**-****" />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Name <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Emergency Contact Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Relationship <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Spouse, Parent" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>
            
            {/* System Access */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">System Access & Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">System Role</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Standard User</option>
                    <option>Manager</option>
                    <option>Department Head</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Work Email (Auto-provisioned)</label>
                  <input type="email" className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-xl focus:outline-none" placeholder="john.doe@omnistay.com" disabled />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" defaultChecked />
                    <span className="text-sm font-medium">Send welcome email with login credentials</span>
                  </label>
                </div>
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
            Save Employee Record
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LeaveManagement() {
  const leaveRequests = [
    { id: "LR001", name: "John Doe", type: "Annual Leave", duration: "3 Days", dates: "Apr 10 - Apr 12", status: "Pending" },
    { id: "LR002", name: "Jane Smith", type: "Sick Leave", duration: "1 Day", dates: "Apr 05", status: "Approved" },
    { id: "LR003", name: "Mike Ross", type: "Personal Leave", duration: "2 Days", dates: "Apr 15 - Apr 16", status: "Rejected" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KPICard 
          label="Available Balance" 
          value="18 Days" 
          change="12 days used this year" 
          icon={Calendar} 
          color="blue" 
        />
        <KPICard 
          label="Pending Requests" 
          value="5" 
          change="Requires your attention" 
          icon={AlertCircle} 
          color="amber" 
        />
        <KPICard 
          label="Upcoming Holidays" 
          value="3" 
          change="Next: Easter Monday" 
          icon={Calendar} 
          color="emerald" 
        />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Recent Leave Requests</h3>
          <button className="text-sm text-primary font-medium hover:underline">View All</button>
        </div>
        <div className="divide-y divide-border">
          {leaveRequests.map((req) => (
            <div key={req.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{req.name}</p>
                  <p className="text-xs text-muted-foreground">{req.type} • {req.duration}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{req.dates}</p>
                  <p className="text-xs text-muted-foreground">Request ID: {req.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    req.status === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                    req.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                    "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                  )}>
                    {req.status}
                  </span>
                  <button className="p-1 hover:bg-secondary rounded-md transition-colors">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LearningDevelopment() {
  const courses = [
    { title: "Guest Service Excellence", category: "Soft Skills", progress: 100, status: "Completed", instructor: "Sarah Miller" },
    { title: "Advanced POS Systems", category: "Technical", progress: 45, status: "In Progress", instructor: "Tech Team" },
    { title: "Safety & Hygiene Standards", category: "Compliance", progress: 0, status: "Not Started", instructor: "Health Dept" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Training Programs</h3>
        <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
          Browse Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-1 bg-secondary rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {course.category}
              </span>
              <div className={cn(
                "w-2 h-2 rounded-full",
                course.status === "Completed" ? "bg-emerald-500" : 
                course.status === "In Progress" ? "bg-amber-500" : "bg-muted"
              )} />
            </div>
            <h4 className="font-bold text-lg mb-1">{course.title}</h4>
            <p className="text-sm text-muted-foreground mb-6">Instructor: {course.instructor}</p>
            
            <div className="mt-auto space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold">{course.progress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    course.status === "Completed" ? "bg-emerald-500" : "bg-primary"
                  )} 
                  style={{ width: `${course.progress}%` }} 
                />
              </div>
              <button className="w-full mt-4 py-2 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-medium transition-colors">
                {course.status === "Completed" ? "Review Content" : "Continue Learning"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold mb-4">L&D Analytics</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { month: 'Jan', completed: 12, hours: 45 },
              { month: 'Feb', completed: 18, hours: 62 },
              { month: 'Mar', completed: 15, hours: 55 },
              { month: 'Apr', completed: 25, hours: 88 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
              />
              <Line type="monotone" dataKey="completed" stroke="#8b5cf6" strokeWidth={3} dot={{fill: '#8b5cf6', r: 4}} />
              <Line type="monotone" dataKey="hours" stroke="#ec4899" strokeWidth={3} dot={{fill: '#ec4899', r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Compliances() {
  const checks = [
    { title: "Health & Safety Certification", due: "In 12 days", status: "Critical", owner: "Safety Officer" },
    { title: "Data Privacy Training (GDPR)", due: "Completed", status: "Compliant", owner: "IT Dept" },
    { title: "Labor Law Postings", due: "In 45 days", status: "Warning", owner: "HR Manager" },
    { title: "Fire Safety Audit", due: "In 5 days", status: "Critical", owner: "Engineering" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Compliance Checklist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checks.map((check, i) => (
              <div key={i} className="bg-card p-5 rounded-2xl border border-border shadow-sm flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-xl shrink-0",
                  check.status === "Critical" ? "bg-red-100 text-red-600" :
                  check.status === "Warning" ? "bg-amber-100 text-amber-600" :
                  "bg-emerald-100 text-emerald-600"
                )}>
                  {check.status === "Compliant" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{check.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Due: {check.due}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] font-medium text-muted-foreground">{check.owner}</span>
                    <button className="text-[10px] font-bold text-primary hover:underline">Update</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Compliance Score</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-secondary stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                <circle className="text-primary stroke-current" strokeWidth="10" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" strokeDasharray="251.2" strokeDashoffset="62.8" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">75%</span>
                <span className="text-xs text-muted-foreground">Overall</span>
              </div>
            </div>
            <div className="mt-8 w-full space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Compliant</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Warning</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
                <span className="font-bold">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpenseManagement() {
  const expenses = [
    { id: "EXP-902", category: "Travel", amount: "$450.00", date: "Apr 02, 2026", status: "Pending", merchant: "Delta Airlines" },
    { id: "EXP-899", category: "Meals", amount: "$32.50", date: "Mar 31, 2026", status: "Approved", merchant: "Starbucks" },
    { id: "EXP-895", category: "Supplies", amount: "$128.90", date: "Mar 28, 2026", status: "Approved", merchant: "Office Depot" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Expense Claims</h3>
        <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Receipt className="w-4 h-4" />
          New Claim
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KPICard 
          label="Pending" 
          value="$1,240.00" 
          change="4 claims awaiting approval" 
          icon={Clock4} 
          color="blue" 
        />
        <KPICard 
          label="Approved" 
          value="$4,890.50" 
          change="Paid this month" 
          icon={CheckCircle2} 
          color="emerald" 
        />
        <KPICard 
          label="Budget Used" 
          value="62%" 
          change="Of monthly budget" 
          icon={TrendingUp} 
          color="purple" 
        />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Claim ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Merchant & Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{exp.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{exp.merchant}</p>
                    <p className="text-xs text-muted-foreground">{exp.category}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{exp.amount}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{exp.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      exp.status === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                    )}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-secondary rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
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

function HRReports() {
  const reports = [
    { title: "Monthly Payroll Summary", type: "Financial", lastGenerated: "Apr 01, 2026", format: "PDF" },
    { title: "Employee Turnover Analysis", type: "Analytical", lastGenerated: "Mar 15, 2026", format: "Excel" },
    { title: "Compliance Audit Log", type: "Legal", lastGenerated: "Mar 30, 2026", format: "PDF" },
    { title: "Training ROI Report", type: "L&D", lastGenerated: "Feb 28, 2026", format: "Excel" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">HR Reports & Analytics</h3>
        <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
          Generate New Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between group hover:border-primary/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <FileText className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{report.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{report.type} • Last: {report.lastGenerated}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-1 bg-secondary rounded text-muted-foreground uppercase">{report.format}</span>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold mb-6">Headcount Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { month: 'Oct', count: 210 },
              { month: 'Nov', count: 215 },
              { month: 'Dec', count: 228 },
              { month: 'Jan', count: 235 },
              { month: 'Feb', count: 242 },
              { month: 'Mar', count: 248 },
            ]}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
              />
              <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Attendance() {
  const attendanceLogs = [
    { name: "Alice Johnson", date: "Apr 03, 2026", checkIn: "08:45 AM", checkOut: "05:15 PM", status: "On Time" },
    { name: "Bob Smith", date: "Apr 03, 2026", checkIn: "09:10 AM", checkOut: "06:00 PM", status: "Late" },
    { name: "Diana Prince", date: "Apr 03, 2026", checkIn: "08:30 AM", checkOut: "04:30 PM", status: "On Time" },
    { name: "Edward Norton", date: "Apr 03, 2026", checkIn: "08:55 AM", checkOut: "---", status: "In Office" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KPICard 
          label="Present Today" 
          value="232 / 248" 
          change="93.5% Attendance rate" 
          icon={UserCheck} 
          color="emerald" 
        />
        <KPICard 
          label="Late Arrivals" 
          value="12" 
          change="Average 15 mins delay" 
          icon={Clock} 
          color="amber" 
        />
        <KPICard 
          label="On Leave" 
          value="14" 
          change="Approved absences" 
          icon={Calendar} 
          color="blue" 
        />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Daily Attendance Log</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors border border-border">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium">Export CSV</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Employee</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Check In</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Check Out</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {attendanceLogs.map((log, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{log.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{log.checkIn}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{log.checkOut}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      log.status === "On Time" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                      log.status === "In Office" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                    )}>
                      {log.status}
                    </span>
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

function Payroll() {
  const payrollHistory = [
    { period: "March 2026", date: "Mar 31, 2026", amount: "$425,800.00", status: "Paid", employees: 248 },
    { period: "February 2026", date: "Feb 28, 2026", amount: "$418,250.00", status: "Paid", employees: 242 },
    { period: "January 2026", date: "Jan 31, 2026", amount: "$412,900.00", status: "Paid", employees: 235 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold">Salary Distribution</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">This Year</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { dept: 'Front Desk', amount: 85000 },
                { dept: 'F&B', amount: 120000 },
                { dept: 'Housekeeping', amount: 95000 },
                { dept: 'Admin', amount: 75000 },
                { dept: 'Engineering', amount: 50000 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Next Payday</h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">April 30, 2026</p>
            <h4 className="text-3xl font-bold mt-1">27 Days</h4>
            <p className="text-xs text-muted-foreground mt-2">Estimated: $432,500.00</p>
            <button className="w-full mt-8 py-3 bg-primary text-white rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
              Process Payroll
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold">Payroll History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Period</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Employees</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {payrollHistory.map((pay, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{pay.period}</p>
                    <p className="text-xs text-muted-foreground">Paid on {pay.date}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{pay.employees}</td>
                  <td className="px-6 py-4 text-sm font-bold">{pay.amount}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <FileText className="w-4 h-4 text-muted-foreground" />
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

function Recruiting() {
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  const jobs = [
    { title: "Front Desk Associate", dept: "Front Desk", type: "Full-time", applicants: 24, status: "Active" },
    { title: "Sous Chef", dept: "Food & Beverage", type: "Full-time", applicants: 12, status: "Active" },
    { title: "Housekeeping Supervisor", dept: "Housekeeping", type: "Full-time", applicants: 8, status: "Paused" },
    { title: "Marketing Intern", dept: "Marketing", type: "Internship", applicants: 45, status: "Active" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Active Job Openings</h3>
        <button 
          onClick={() => setIsPostJobModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Total Applicants" 
          value="156" 
          icon={Users} 
          color="blue" 
        />
        <KPICard 
          label="Interviews Today" 
          value="8" 
          icon={Calendar} 
          color="purple" 
        />
        <KPICard 
          label="Hired this Month" 
          value="12" 
          icon={UserCheck} 
          color="emerald" 
        />
        <KPICard 
          label="Avg. Time to Hire" 
          value="18d" 
          icon={Clock} 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold">Job Pipeline</h3>
          </div>
          <div className="divide-y divide-border">
            {jobs.map((job, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <UserSearch className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.dept} • {job.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold">{job.applicants}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Applicants</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    job.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-secondary text-muted-foreground"
                  )}>
                    {job.status}
                  </span>
                  <button className="p-1 hover:bg-secondary rounded-lg transition-colors">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Candidate Sources</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'LinkedIn', value: 45 },
                    { name: 'Referral', value: 30 },
                    { name: 'Website', value: 15 },
                    { name: 'Agency', value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isPostJobModalOpen && (
          <PostJobModal onClose={() => setIsPostJobModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PostJobModal({ onClose }: { onClose: () => void }) {
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
          <div>
            <h3 className="text-lg font-bold text-foreground">Post New Job</h3>
            <p className="text-sm text-muted-foreground">Create a comprehensive job posting.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Front Desk Associate" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Front Desk</option>
                    <option>Housekeeping</option>
                    <option>Food & Beverage</option>
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Sales & Revenue</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employment Type <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Temporary</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience Level</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                    <option>Executive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location Type</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>On-Site</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Openings</label>
                  <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="1" defaultValue="1" min="1" />
                </div>
              </div>
            </div>

            {/* Compensation & Timeline */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Compensation & Timeline</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Salary</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="number" className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Salary</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="number" className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency / Period</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>USD / Year</option>
                    <option>USD / Hour</option>
                    <option>EUR / Year</option>
                    <option>GBP / Year</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Start Date</label>
                  <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Application Deadline</label>
                  <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hiring Manager</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Select Manager...</option>
                    <option>Alice Johnson</option>
                    <option>Bob Smith</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Job Details</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Description <span className="text-red-500">*</span></label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]" placeholder="Describe the role, responsibilities, and day-to-day tasks..."></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Requirements & Qualifications <span className="text-red-500">*</span></label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]" placeholder="List required skills, education, experience, and certifications..."></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Benefits & Perks</label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" placeholder="Health insurance, PTO, employee discounts..."></textarea>
                </div>
              </div>
            </div>

            {/* Posting Options */}
            <div>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Posting Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visibility</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option>Public (Careers Page & Job Boards)</option>
                    <option>Internal Only</option>
                    <option>Private (Direct Link Only)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Documents</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" defaultChecked />
                      <span className="text-sm">Resume/CV</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-sm">Cover Letter</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-sm">Portfolio</span>
                    </label>
                  </div>
                </div>
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
            Publish Job Post
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Component ---

export function HumanResources({ aiEnabled, activeSubmenu }: HRProps) {
  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Human Resources</h2>
            <h1 className="text-2xl font-bold text-foreground">{activeSubmenu || "Overview"}</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and view {(activeSubmenu || "Overview").toLowerCase()} information.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Last Sync: Just now</span>
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
          {activeSubmenu === "Overview" && <HROverview />}
          {activeSubmenu === "Employee Directory" && <EmployeeDirectory />}
          {activeSubmenu === "Attendance" && <Attendance />}
          {activeSubmenu === "Leave Management" && <LeaveManagement />}
          {activeSubmenu === "Payroll" && <Payroll />}
          {activeSubmenu === "L&D" && <LearningDevelopment />}
          {activeSubmenu === "Compliances" && <Compliances />}
          {activeSubmenu === "Expense Management" && <ExpenseManagement />}
          {activeSubmenu === "Recruiting" && <Recruiting />}
          {activeSubmenu === "Reports" && <HRReports />}
          {activeSubmenu === "Settings" && <HumanResourcesSettings />}
          
          {/* Placeholder for other submenus */}
          {![
            "Overview", 
            "Employee Directory", 
            "Attendance", 
            "Leave Management", 
            "Payroll", 
            "L&D", 
            "Compliances", 
            "Expense Management", 
            "Recruiting", 
            "Reports",
            "Settings"
          ].includes(activeSubmenu || "") && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-card rounded-2xl border border-border border-dashed">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Settings2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">{activeSubmenu} Module</h3>
              <p className="text-muted-foreground max-w-sm">
                The {activeSubmenu} module is being connected to your HCM provider. 
                Real-time data sync will be available shortly.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


function HumanResourcesSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Human Resources Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for HumanResources will be available here.</p>
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

