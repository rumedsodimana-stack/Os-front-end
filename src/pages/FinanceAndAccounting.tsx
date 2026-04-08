import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { 
  Calculator, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Send,
  Download,
  ShieldAlert,
  CalendarDays,
  Landmark,
  ReceiptText,
  Scale,
  Upload,
  Trash2,
  Play,
  Building2,
  User,
  FileSpreadsheet
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

interface FinanceAndAccountingProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function FinanceAndAccounting({ aiEnabled, activeSubmenu }: FinanceAndAccountingProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <FinanceOverview />;
      case "Daily Revenue":
        return <DailyRevenue />;
      case "Accounts Payable":
        return <AccountsPayable />;
      case "Accounts Receivable":
        return <AccountsReceivable />;
      case "General Ledger":
        return <GeneralLedger />;
      case "Budget & Forecast":
        return <BudgetAndForecast />;
      case "Tax & Compliance":
        return <TaxAndCompliance />;
      case "Audit Logs":
        return <AuditLogs />;
      case "Settings":

        return <FinanceAndAccountingSettings />;

      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Finance & Accounting</h2>
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

function FinanceOverview() {
  const plData = [
    { month: 'Jan', revenue: 400000, expenses: 240000, profit: 160000 },
    { month: 'Feb', revenue: 300000, expenses: 220000, profit: 80000 },
    { month: 'Mar', revenue: 550000, expenses: 280000, profit: 270000 },
    { month: 'Apr', revenue: 450000, expenses: 260000, profit: 190000 },
    { month: 'May', revenue: 480000, expenses: 270000, profit: 210000 },
    { month: 'Jun', revenue: 520000, expenses: 290000, profit: 230000 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Total Revenue (YTD)" 
          value="$2,700,000" 
          change="+12% vs last year" 
          trend="up" 
          icon={DollarSign} 
          color="emerald" 
        />
        <KPICard 
          label="GOPPAR" 
          value="$145.20" 
          change="+5.4% vs last month" 
          trend="up" 
          icon={TrendingUp} 
          color="blue" 
        />
        <KPICard 
          label="Operating Costs" 
          value="$1,560,000" 
          change="-2.1% vs budget" 
          trend="down" 
          icon={TrendingDown} 
          color="amber" 
        />
        <KPICard 
          label="Net Profit Margin" 
          value="42.2%" 
          change="+1.5% vs last month" 
          trend="up" 
          icon={Calculator} 
          color="purple" 
        />
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Profit & Loss Summary</h3>
          <select className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Last 6 Months</option>
            <option>Year to Date</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={plData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `$${value / 1000}k`} />
              <RechartsTooltip 
                cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Net Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AccountsPayable() {
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] = useState(false);
  const [isProcessPaymentModalOpen, setIsProcessPaymentModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const apInvoices = [
    { id: "INV-2024-001", vendor: "Sysco Foods", amount: "$12,450.00", date: "2024-05-10", dueDate: "2024-06-10", status: "Overdue", aging: "30+ Days" },
    { id: "INV-2024-002", vendor: "Ecolab", amount: "$3,200.00", date: "2024-05-25", dueDate: "2024-06-25", status: "Pending", aging: "Current" },
    { id: "INV-2024-003", vendor: "Guest Supply", amount: "$8,150.00", date: "2024-06-01", dueDate: "2024-07-01", status: "Pending", aging: "Current" },
    { id: "INV-2024-004", vendor: "Otis Elevators", amount: "$4,500.00", date: "2024-04-15", dueDate: "2024-05-15", status: "Overdue", aging: "60+ Days" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Total AP Outstanding" 
          value="$28,300.00" 
          change="4 Invoices" 
          trend="neutral" 
          icon={ReceiptText} 
          color="blue" 
        />
        <KPICard 
          label="Current (0-30 Days)" 
          value="$11,350.00" 
          change="2 Invoices" 
          trend="neutral" 
          icon={CheckCircle2} 
          color="emerald" 
        />
        <KPICard 
          label="Overdue (30+ Days)" 
          value="$16,950.00" 
          change="2 Invoices" 
          trend="up" 
          icon={AlertCircle} 
          color="red" 
        />
      </div>

      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Vendor Invoices</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search vendors or invoices..." 
              className="pl-9 pr-4 py-1.5 bg-secondary border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsAddInvoiceModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Invoice
          </button>
        </div>
      </div>
      
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice ID</th>
                <th className="px-6 py-4 font-medium">Vendor</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Aging</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {apInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{inv.id}</td>
                  <td className="px-6 py-4">{inv.vendor}</td>
                  <td className="px-6 py-4 font-bold">{inv.amount}</td>
                  <td className="px-6 py-4 text-muted-foreground">{inv.date}</td>
                  <td className="px-6 py-4 text-muted-foreground">{inv.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      inv.status === "Overdue" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    )}>
                      {inv.aging}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setIsProcessPaymentModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors font-medium ml-auto"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Pay Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isAddInvoiceModalOpen && (
          <AddInvoiceModal onClose={() => setIsAddInvoiceModalOpen(false)} />
        )}
        {isProcessPaymentModalOpen && (
          <ProcessPaymentModal onClose={() => setIsProcessPaymentModalOpen(false)} />
        )}
        {isFilterModalOpen && (
          <FilterModal onClose={() => setIsFilterModalOpen(false)} type="ap" />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddInvoiceModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Add Vendor Invoice</h3>
            <p className="text-sm text-muted-foreground">Record a new vendor invoice with full GL coding and approval routing.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            {/* Vendor Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Vendor Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Vendor Name <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select Vendor...</option>
                    <option value="sysco">Sysco Foods</option>
                    <option value="ecolab">Ecolab</option>
                    <option value="guest_supply">Guest Supply</option>
                    <option value="otis">Otis Elevators</option>
                    <option value="new">+ Add New Vendor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vendor ID</label>
                  <input type="text" className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none" value="VND-1042" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Purchase Order (PO) #</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="PO-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Terms</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Net 30</option>
                    <option>Net 15</option>
                    <option>Net 60</option>
                    <option>Due on Receipt</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Remit-To Address</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Primary: 123 Vendor St, City, ST</option>
                    <option>Secondary: PO Box 456, City, ST</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <FileText className="w-4 h-4" /> Invoice Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Invoice Number <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="INV-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice Date <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subtotal ($) <span className="text-red-500">*</span></label>
                  <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax Amount ($)</label>
                  <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Freight/Shipping ($)</label>
                  <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Amount ($) <span className="text-red-500">*</span></label>
                  <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-primary" placeholder="0.00" />
                </div>

                <div className="space-y-2 md:col-span-4">
                  <label className="text-sm font-medium">Description / Memo</label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" placeholder="Enter invoice details..."></textarea>
                </div>
              </div>
            </div>

            {/* GL Coding & Routing */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Calculator className="w-4 h-4" /> GL Coding & Approval
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Food & Beverage</option>
                    <option>Rooms</option>
                    <option>Maintenance</option>
                    <option>Administration</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GL Account</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>5000 - Payroll Expenses</option>
                    <option>5100 - Utilities</option>
                    <option>5200 - F&B Cost of Sales</option>
                    <option>5300 - Maintenance Supplies</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Route for Approval To</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Jane Doe (F&B Director)</option>
                    <option>John Smith (General Manager)</option>
                    <option>Auto-Approve (Under $500)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Upload className="w-4 h-4" /> Attachments
              </h4>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer">
                <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Drag and drop invoice PDF here, or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Supports PDF, JPG, PNG up to 10MB</p>
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
            Submit for Approval
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AccountsReceivable() {
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [isSendReminderModalOpen, setIsSendReminderModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const arAccounts = [
    { id: "AR-1001", client: "IBM Corporate", type: "Corporate", amount: "$45,200.00", dueDate: "2024-06-15", status: "Pending", aging: "Current" },
    { id: "AR-1002", client: "Expedia", type: "OTA Commission", amount: "$12,800.00", dueDate: "2024-05-20", status: "Overdue", aging: "30+ Days" },
    { id: "AR-1003", client: "Smith Wedding Group", type: "Group Block", amount: "$25,000.00", dueDate: "2024-06-01", status: "Pending", aging: "Current" },
    { id: "AR-1004", client: "Delta Airlines", type: "Crew Contract", amount: "$85,000.00", dueDate: "2024-04-30", status: "Overdue", aging: "60+ Days" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Total AR Outstanding" 
          value="$168,000.00" 
          change="4 Accounts" 
          trend="neutral" 
          icon={Landmark} 
          color="blue" 
        />
        <KPICard 
          label="Current (0-30 Days)" 
          value="$70,200.00" 
          change="2 Accounts" 
          trend="neutral" 
          icon={CheckCircle2} 
          color="emerald" 
        />
        <KPICard 
          label="Overdue (30+ Days)" 
          value="$97,800.00" 
          change="2 Accounts" 
          trend="up" 
          icon={AlertCircle} 
          color="amber" 
        />
      </div>

      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Client Accounts</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search clients or accounts..." 
              className="pl-9 pr-4 py-1.5 bg-secondary border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsCreateInvoiceModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </div>
      
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Account ID</th>
                <th className="px-6 py-4 font-medium">Client Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Amount Due</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Aging</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {arAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{acc.id}</td>
                  <td className="px-6 py-4 font-semibold">{acc.client}</td>
                  <td className="px-6 py-4 text-muted-foreground">{acc.type}</td>
                  <td className="px-6 py-4 font-bold">{acc.amount}</td>
                  <td className="px-6 py-4 text-muted-foreground">{acc.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      acc.status === "Overdue" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    )}>
                      {acc.aging}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setIsSendReminderModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors font-medium ml-auto"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Remind
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isCreateInvoiceModalOpen && (
          <CreateInvoiceModal onClose={() => setIsCreateInvoiceModalOpen(false)} />
        )}
        {isSendReminderModalOpen && (
          <SendReminderModal onClose={() => setIsSendReminderModalOpen(false)} />
        )}
        {isFilterModalOpen && (
          <FilterModal onClose={() => setIsFilterModalOpen(false)} type="ar" />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateInvoiceModal({ onClose }: { onClose: () => void }) {
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
        className="bg-card w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 sticky top-0 z-20">
          <div>
            <h3 className="text-lg font-bold text-foreground">Create Client Invoice</h3>
            <p className="text-sm text-muted-foreground">Generate a new invoice for corporate clients, groups, or OTAs.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            {/* Client Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <User className="w-4 h-4" /> Client Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Client Name <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select Client...</option>
                    <option value="ibm">IBM Corporate</option>
                    <option value="expedia">Expedia</option>
                    <option value="smith">Smith Wedding Group</option>
                    <option value="delta">Delta Airlines</option>
                    <option value="new">+ Add New Client</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client ID</label>
                  <input type="text" className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:outline-none" value="CL-8890" disabled />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <label className="text-sm font-medium">Billing Address</label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" placeholder="Enter billing address..."></textarea>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <FileText className="w-4 h-4" /> Invoice Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice Number <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="INV-2024-1050" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice Date <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Terms</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Net 30</option>
                    <option>Net 15</option>
                    <option>Net 60</option>
                    <option>Due on Receipt</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Line Items
              </h4>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium w-1/2">Description</th>
                      <th className="px-4 py-3 font-medium w-32">GL Code</th>
                      <th className="px-4 py-3 font-medium text-right w-24">Qty</th>
                      <th className="px-4 py-3 font-medium text-right w-32">Unit Price</th>
                      <th className="px-4 py-3 font-medium text-right w-32">Amount</th>
                      <th className="px-4 py-3 font-medium text-center w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="bg-background">
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" defaultValue="Corporate Room Block - May 2024" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" defaultValue="4000" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-right" defaultValue="50" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-right" defaultValue="250.00" />
                      </td>
                      <td className="px-4 py-2 text-right font-medium">$12,500.00</td>
                      <td className="px-4 py-2 text-center">
                        <button type="button" className="text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    <tr className="bg-background">
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" defaultValue="Conference Room Rental" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" defaultValue="4100" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-right" defaultValue="2" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-right" defaultValue="1500.00" />
                      </td>
                      <td className="px-4 py-2 text-right font-medium">$3,000.00</td>
                      <td className="px-4 py-2 text-center">
                        <button type="button" className="text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-3 bg-secondary/20 border-t border-border">
                  <button type="button" className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <Plus className="w-4 h-4" /> Add Line Item
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">$15,500.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium">$1,550.00</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t border-border">
                    <span>Total Amount</span>
                    <span className="text-primary">$17,050.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes / Terms to Client</label>
              <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" placeholder="Thank you for your business..."></textarea>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-between sticky bottom-0 z-20">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            <FileText className="w-4 h-4" /> Preview PDF
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" />
              Save & Send
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DailyRevenue() {
  const [isNightAuditModalOpen, setIsNightAuditModalOpen] = useState(false);

  const revenueData = [
    { department: "Rooms", actual: 125000, budget: 120000, variance: 5000, variancePct: "+4.1%" },
    { department: "Food & Beverage", actual: 45000, budget: 50000, variance: -5000, variancePct: "-10.0%" },
    { department: "Spa & Wellness", actual: 12500, budget: 10000, variance: 2500, variancePct: "+25.0%" },
    { department: "Events & Banquets", actual: 28000, budget: 25000, variance: 3000, variancePct: "+12.0%" },
    { department: "Other Operating", actual: 4500, budget: 5000, variance: -500, variancePct: "-10.0%" },
  ];

  const totalActual = revenueData.reduce((sum, item) => sum + item.actual, 0);
  const totalBudget = revenueData.reduce((sum, item) => sum + item.budget, 0);
  const totalVariance = totalActual - totalBudget;
  const totalVariancePct = ((totalVariance / totalBudget) * 100).toFixed(1) + "%";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Total Daily Revenue" 
          value={`$${totalActual.toLocaleString()}`} 
          change={`${totalVariance > 0 ? '+' : ''}${totalVariancePct} vs budget`} 
          trend={totalVariance >= 0 ? "up" : "down"} 
          icon={DollarSign} 
          color={totalVariance >= 0 ? "emerald" : "red"} 
        />
        <KPICard 
          label="ADR (Average Daily Rate)" 
          value="$285.50" 
          change="+2.4% vs last week" 
          trend="up" 
          icon={TrendingUp} 
          color="blue" 
        />
        <KPICard 
          label="Occupancy Rate" 
          value="84.2%" 
          change="-1.5% vs last week" 
          trend="down" 
          icon={CalendarDays} 
          color="amber" 
        />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
          <h3 className="font-semibold text-lg">Night Audit Revenue Breakdown</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Date:</span>
            <input type="date" className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="2024-06-05" />
            <button 
              onClick={() => setIsNightAuditModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm ml-2"
            >
              <Play className="w-4 h-4" /> Run Night Audit
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium text-right">Actual ($)</th>
                <th className="px-6 py-4 font-medium text-right">Budget ($)</th>
                <th className="px-6 py-4 font-medium text-right">Variance ($)</th>
                <th className="px-6 py-4 font-medium text-right">Variance (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {revenueData.map((row, idx) => (
                <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{row.department}</td>
                  <td className="px-6 py-4 text-right font-semibold">${row.actual.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">${row.budget.toLocaleString()}</td>
                  <td className={cn("px-6 py-4 text-right font-medium", row.variance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                    {row.variance > 0 ? '+' : ''}{row.variance.toLocaleString()}
                  </td>
                  <td className={cn("px-6 py-4 text-right font-medium", row.variance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                    {row.variancePct}
                  </td>
                </tr>
              ))}
              <tr className="bg-secondary/20 font-bold">
                <td className="px-6 py-4">Total</td>
                <td className="px-6 py-4 text-right">${totalActual.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">${totalBudget.toLocaleString()}</td>
                <td className={cn("px-6 py-4 text-right", totalVariance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                  {totalVariance > 0 ? '+' : ''}{totalVariance.toLocaleString()}
                </td>
                <td className={cn("px-6 py-4 text-right", totalVariance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                  {totalVariance > 0 ? '+' : ''}{totalVariancePct}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isNightAuditModalOpen && (
          <NightAuditModal onClose={() => setIsNightAuditModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function NightAuditModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

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
            <h3 className="text-lg font-bold text-foreground">Run Night Audit</h3>
            <p className="text-sm text-muted-foreground">Process daily transactions and roll business date.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary -z-10 rounded-full"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-1 bg-primary -z-10 rounded-full transition-all duration-500"></div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">1</div>
                <span className="text-xs font-medium">Pre-Audit</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center font-bold text-sm border border-border">2</div>
                <span className="text-xs font-medium text-muted-foreground">Processing</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center font-bold text-sm border border-border">3</div>
                <span className="text-xs font-medium text-muted-foreground">Reports</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Pre-Audit Checklist
              </h4>
              <div className="bg-secondary/20 rounded-xl p-4 space-y-3 border border-border">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" className="peer sr-only" defaultChecked />
                    <div className="w-5 h-5 border-2 border-primary rounded bg-background peer-checked:bg-primary transition-colors"></div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">Verify all POS batches are closed</p>
                    <p className="text-xs text-muted-foreground">F&B, Spa, and Retail outlets must be settled.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" className="peer sr-only" defaultChecked />
                    <div className="w-5 h-5 border-2 border-primary rounded bg-background peer-checked:bg-primary transition-colors"></div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">Resolve pending check-outs</p>
                    <p className="text-xs text-muted-foreground">0 rooms currently pending departure.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-muted-foreground rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">Room Rate Verification</p>
                    <p className="text-xs text-muted-foreground">Check for rate variances or missing room rates.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-muted-foreground rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors"></div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">Credit Limit Check</p>
                    <p className="text-xs text-muted-foreground">Review guests exceeding authorized credit limits.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Warning: Irreversible Action</p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                  Running the night audit will post room and tax charges, roll the business date forward, and lock today's transactions. Ensure all pre-audit tasks are complete.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" />
            Start Processing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GeneralLedger() {
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const glAccounts = [
    { code: "1000", name: "Cash - Operating", type: "Asset", debit: 450200.00, credit: 0, balance: 450200.00 },
    { code: "1200", name: "Accounts Receivable", type: "Asset", debit: 168000.00, credit: 0, balance: 168000.00 },
    { code: "2000", name: "Accounts Payable", type: "Liability", debit: 0, credit: 28300.00, balance: -28300.00 },
    { code: "2100", name: "Accrued Taxes", type: "Liability", debit: 0, credit: 45000.00, balance: -45000.00 },
    { code: "3000", name: "Owner's Equity", type: "Equity", debit: 0, credit: 1500000.00, balance: -1500000.00 },
    { code: "4000", name: "Room Revenue", type: "Revenue", debit: 0, credit: 2100000.00, balance: -2100000.00 },
    { code: "4100", name: "F&B Revenue", type: "Revenue", debit: 0, credit: 850000.00, balance: -850000.00 },
    { code: "5000", name: "Payroll Expenses", type: "Expense", debit: 950000.00, credit: 0, balance: 950000.00 },
    { code: "5100", name: "Utilities", type: "Expense", debit: 125000.00, credit: 0, balance: 125000.00 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Chart of Accounts</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search account code or name..." 
              className="pl-9 pr-4 py-1.5 bg-secondary border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm font-medium"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsAddAccountModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Account
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Account Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Debit YTD</th>
                <th className="px-6 py-4 font-medium text-right">Credit YTD</th>
                <th className="px-6 py-4 font-medium text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {glAccounts.map((acc) => (
                <tr key={acc.code} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-muted-foreground">{acc.code}</td>
                  <td className="px-6 py-4 font-semibold">{acc.name}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      acc.type === "Asset" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                      acc.type === "Liability" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" :
                      acc.type === "Equity" ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400" :
                      acc.type === "Revenue" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                      "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                    )}>
                      {acc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{acc.debit > 0 ? `$${acc.debit.toLocaleString()}` : '-'}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{acc.credit > 0 ? `$${acc.credit.toLocaleString()}` : '-'}</td>
                  <td className="px-6 py-4 text-right font-bold">
                    ${Math.abs(acc.balance).toLocaleString()} {acc.balance >= 0 ? 'Dr' : 'Cr'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isAddAccountModalOpen && (
          <AddAccountModal onClose={() => setIsAddAccountModalOpen(false)} />
        )}
        {isFilterModalOpen && (
          <FilterModal onClose={() => setIsFilterModalOpen(false)} type="gl" />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddAccountModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Add GL Account</h3>
            <p className="text-sm text-muted-foreground">Create a new account in the Chart of Accounts.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Code <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g., 5120" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g., Office Supplies" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Type <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select Type...</option>
                  <option value="asset">Asset</option>
                  <option value="liability">Liability</option>
                  <option value="equity">Equity</option>
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub-Type / Category</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select Category...</option>
                  <option value="current_asset">Current Asset</option>
                  <option value="fixed_asset">Fixed Asset</option>
                  <option value="current_liability">Current Liability</option>
                  <option value="long_term_liability">Long-Term Liability</option>
                  <option value="operating_expense">Operating Expense</option>
                  <option value="cogs">Cost of Goods Sold</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Parent Account</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">None (Top Level)</option>
                  <option value="5000">5000 - Payroll Expenses</option>
                  <option value="5100">5100 - Utilities</option>
                  <option value="5200">5200 - F&B Cost of Sales</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" placeholder="Detailed description of what this account tracks..."></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
            Save Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BudgetAndForecast() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const forecastData = [
    { month: 'Jul', actual: null, budget: 500000, forecast: 510000 },
    { month: 'Aug', actual: null, budget: 520000, forecast: 540000 },
    { month: 'Sep', actual: null, budget: 480000, forecast: 470000 },
    { month: 'Oct', actual: null, budget: 550000, forecast: 560000 },
    { month: 'Nov', actual: null, budget: 580000, forecast: 600000 },
    { month: 'Dec', actual: null, budget: 650000, forecast: 680000 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Q3 Forecast Revenue" 
          value="$1,520,000" 
          change="+1.3% vs Budget" 
          trend="up" 
          icon={TrendingUp} 
          color="emerald" 
        />
        <KPICard 
          label="Q4 Forecast Revenue" 
          value="$1,840,000" 
          change="+3.4% vs Budget" 
          trend="up" 
          icon={TrendingUp} 
          color="emerald" 
        />
        <KPICard 
          label="Forecast Accuracy (YTD)" 
          value="96.8%" 
          change="Target: >95%" 
          trend="neutral" 
          icon={CheckCircle2} 
          color="blue" 
        />
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">H2 Revenue Forecast vs Budget</h3>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `$${value / 1000}k`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" />
              <Area type="monotone" dataKey="budget" name="Budget" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AnimatePresence>
        {isExportModalOpen && (
          <ExportModal onClose={() => setIsExportModalOpen(false)} title="Export Budget & Forecast" />
        )}
      </AnimatePresence>
    </div>
  );
}

function TaxAndCompliance() {
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);

  const taxes = [
    { type: "Occupancy Tax (City)", rate: "5.0%", collected: 105000, remitted: 85000, pending: 20000, dueDate: "2024-07-15" },
    { type: "State Sales Tax", rate: "7.0%", collected: 147000, remitted: 120000, pending: 27000, dueDate: "2024-07-20" },
    { type: "VAT / GST", rate: "10.0%", collected: 210000, remitted: 180000, pending: 30000, dueDate: "2024-07-31" },
    { type: "Payroll Tax", rate: "Variable", collected: 85000, remitted: 85000, pending: 0, dueDate: "2024-06-30" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          label="Total Pending Tax Liability" 
          value="$77,000" 
          change="Due within 30 days" 
          trend="neutral" 
          icon={Landmark} 
          color="amber" 
        />
        <KPICard 
          label="Taxes Remitted (YTD)" 
          value="$470,000" 
          change="Fully compliant" 
          trend="up" 
          icon={CheckCircle2} 
          color="emerald" 
        />
        <KPICard 
          label="Upcoming Audit" 
          value="Oct 15" 
          change="State Tax Authority" 
          trend="neutral" 
          icon={Scale} 
          color="blue" 
        />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
          <h3 className="font-semibold text-lg">Tax Liabilities & Remittance</h3>
          <button 
            onClick={() => setIsRecordPaymentModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <ReceiptText className="w-4 h-4" /> Record Payment
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Tax Type</th>
                <th className="px-6 py-4 font-medium">Rate</th>
                <th className="px-6 py-4 font-medium text-right">Collected (YTD)</th>
                <th className="px-6 py-4 font-medium text-right">Remitted (YTD)</th>
                <th className="px-6 py-4 font-medium text-right">Pending Liability</th>
                <th className="px-6 py-4 font-medium">Next Due Date</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {taxes.map((tax, idx) => (
                <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-semibold">{tax.type}</td>
                  <td className="px-6 py-4 text-muted-foreground">{tax.rate}</td>
                  <td className="px-6 py-4 text-right">${tax.collected.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400">${tax.remitted.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-amber-600 dark:text-amber-400">${tax.pending.toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{tax.dueDate}</td>
                  <td className="px-6 py-4 text-right">
                    {tax.pending > 0 ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                        Payment Due
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                        Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isRecordPaymentModalOpen && (
          <RecordPaymentModal onClose={() => setIsRecordPaymentModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function RecordPaymentModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Record Tax Payment</h3>
            <p className="text-sm text-muted-foreground">Log a tax remittance to a government authority.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Tax Authority <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select Authority...</option>
                  <option value="city">City Department of Revenue</option>
                  <option value="state">State Tax Commission</option>
                  <option value="federal">IRS / Federal Tax Authority</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Type <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select Tax Type...</option>
                  <option value="occupancy">Occupancy Tax</option>
                  <option value="sales">Sales Tax</option>
                  <option value="vat">VAT / GST</option>
                  <option value="payroll">Payroll Tax</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Remitted ($) <span className="text-red-500">*</span></label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Period Start <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Period End <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="ach">ACH / Wire Transfer</option>
                  <option value="check">Check</option>
                  <option value="credit">Credit Card</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmation / Ref Number</label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g., CONF-123456" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px]" placeholder="Add any relevant notes..."></textarea>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Attach Receipt / Filing Document</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-secondary/50 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
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
            Record Payment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AuditLogs() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const auditLogs = [
    { id: "AL-8890", timestamp: "2024-06-05 23:45", user: "Night Auditor", action: "Night Audit Completed", details: "Revenue posted for 06/05", status: "Success" },
    { id: "AL-8891", timestamp: "2024-06-05 14:20", user: "Jane Doe (FO Manager)", action: "Rate Override", details: "Res #44512 rate changed from $250 to $200 (Comp recovery)", status: "Flagged" },
    { id: "AL-8892", timestamp: "2024-06-05 11:15", user: "System", action: "Payment Gateway Sync", details: "Batch #442 settled successfully", status: "Success" },
    { id: "AL-8893", timestamp: "2024-06-04 09:30", user: "John Smith (Finance)", action: "Voided Transaction", details: "Voided payment $45.00 on Folio #1120", status: "Warning" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Financial Audit Trail</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search logs, users, or actions..." 
              className="pl-9 pr-4 py-1.5 bg-secondary border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-80"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm font-medium"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Log ID</th>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">User / System</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-muted-foreground">{log.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-4 font-medium">{log.user}</td>
                  <td className="px-6 py-4 font-semibold">{log.action}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-md truncate" title={log.details}>{log.details}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {log.status === "Success" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {log.status === "Flagged" && <ShieldAlert className="w-4 h-4 text-red-500" />}
                      {log.status === "Warning" && <AlertCircle className="w-4 h-4 text-amber-500" />}
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        log.status === "Success" ? "text-emerald-600 dark:text-emerald-400" : 
                        log.status === "Flagged" ? "text-red-600 dark:text-red-400" : 
                        "text-amber-600 dark:text-amber-400"
                      )}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isExportModalOpen && (
          <ExportModal onClose={() => setIsExportModalOpen(false)} title="Export Audit Logs" />
        )}
        {isFilterModalOpen && (
          <FilterModal onClose={() => setIsFilterModalOpen(false)} type="audit" />
        )}
      </AnimatePresence>
    </div>
  );
}



function FinanceAndAccountingSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Finance And Accounting Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for FinanceAndAccounting will be available here.</p>
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

function ExportModal({ onClose, title }: { onClose: () => void, title: string }) {
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
        className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="csv">CSV (Comma Separated Values)</option>
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="pdf">PDF Document</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="today">Today</option>
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="custom">Custom Range...</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/20" defaultChecked />
                <span className="text-sm">Include metadata (timestamps, user info)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProcessPaymentModal({ onClose }: { onClose: () => void }) {
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
        className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
          <div>
            <h3 className="text-lg font-bold text-foreground">Process Payment</h3>
            <p className="text-sm text-muted-foreground">Authorize and schedule vendor payment.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-secondary/30 p-4 rounded-xl border border-border flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Vendor</p>
              <p className="font-semibold">Sysco Foods</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Amount Due</p>
              <p className="font-bold text-lg text-foreground">$12,450.00</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="ach">ACH Transfer (Default)</option>
                <option value="wire">Wire Transfer</option>
                <option value="check">Physical Check</option>
                <option value="card">Corporate Credit Card</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Date</label>
              <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="2024-06-05" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Funding Account</label>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="op">Operating Account (...4592)</option>
                <option value="reserve">Reserve Account (...1102)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Memo / Reference</label>
              <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g., May 2024 Invoices" />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Authorize Payment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SendReminderModal({ onClose }: { onClose: () => void }) {
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
        className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
          <div>
            <h3 className="text-lg font-bold text-foreground">Send Payment Reminder</h3>
            <p className="text-sm text-muted-foreground">Email client regarding outstanding balance.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <input type="email" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="billing@expedia.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="Action Required: Overdue Invoice #INV-88291" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[150px]" defaultValue={`Dear Expedia Billing Team,\n\nThis is a friendly reminder that invoice #INV-88291 for $12,800.00 was due on May 20, 2024 and is currently 16 days overdue.\n\nPlease let us know if you have any questions or if payment has already been scheduled.\n\nThank you,\nFinance Department`}></textarea>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/20" defaultChecked />
                <span className="text-sm">Attach original invoice PDF</span>
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send Email
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FilterModal({ onClose, type }: { onClose: () => void, type: 'ap' | 'ar' | 'gl' | 'audit' }) {
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
        className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
          <h3 className="text-lg font-bold text-foreground">Advanced Filters</h3>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Common Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="custom">Custom Range...</option>
              </select>
            </div>

            {/* Type-Specific Filters */}
            {(type === 'ap' || type === 'ar') && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="paid">Paid / Settled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount Range</label>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <span className="text-muted-foreground">-</span>
                    <input type="number" placeholder="Max" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </>
            )}

            {type === 'gl' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Type</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="all">All Types</option>
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="equity">Equity</option>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/20" />
                    <span className="text-sm">Show inactive accounts</span>
                  </label>
                </div>
              </>
            )}

            {type === 'audit' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Action Type</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="all">All Actions</option>
                    <option value="create">Created</option>
                    <option value="update">Modified</option>
                    <option value="delete">Deleted / Voided</option>
                    <option value="system">System Events</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">User / System</label>
                  <input type="text" placeholder="Filter by username..." className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-between">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Clear All
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
