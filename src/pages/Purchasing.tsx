import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  Truck, 
  Building2, 
  DollarSign,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Send,
  CalendarDays,
  Users
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";

interface PurchasingProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function Purchasing({ aiEnabled, activeSubmenu }: PurchasingProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <PurchasingOverview />;
      case "Purchase Orders":
        return <PurchaseOrders />;
      case "Requisitions":
        return <Requisitions />;
      case "Receiving (GRN)":
        return <Receiving />;
      case "Inventory":
        return <Inventory />;
      case "Suppliers":
        return <Suppliers />;
      case "Contracts":
        return <Contracts />;
      case "Bids":
        return <Bids />;
      case "Settings":

        return <PurchasingSettings />;

      default:
        return <PurchasingOverview />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Purchasing & Procurement</h2>
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

function PurchasingOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Total Spend (MTD)" 
          value="$124,500" 
          change="-5% vs last month" 
          trend="down" 
          icon={DollarSign} 
          color="blue" 
        />
        <KPICard 
          label="Active POs" 
          value="45" 
          change="12 pending approval" 
          trend="neutral" 
          icon={FileText} 
          color="amber" 
        />
        <KPICard 
          label="Active Suppliers" 
          value="128" 
          change="+3 this month" 
          trend="up" 
          icon={Building2} 
          color="emerald" 
        />
        <KPICard 
          label="Pending Deliveries" 
          value="18" 
          change="5 arriving today" 
          trend="neutral" 
          icon={Truck} 
          color="purple" 
        />
      </div>
    </div>
  );
}

function PurchaseOrders() {
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false);

  const purchaseOrders = [
    { id: "PO-2024-1042", supplier: "Sysco Foods", department: "F&B", date: "2024-06-05", amount: "$12,450.00", status: "Approved" },
    { id: "PO-2024-1043", supplier: "Linen Master", department: "Housekeeping", date: "2024-06-06", amount: "$3,200.00", status: "Pending Approval" },
    { id: "PO-2024-1044", supplier: "Tech Solutions Inc.", department: "IT", date: "2024-06-07", amount: "$8,150.00", status: "Draft" },
    { id: "PO-2024-1045", supplier: "Premium Beverages", department: "F&B", date: "2024-06-08", amount: "$4,500.00", status: "Dispatched" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search POs, suppliers, or departments..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsCreatePOModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create PO
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">PO Number</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Total Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium text-muted-foreground">{po.id}</td>
                  <td className="p-4 font-medium">{po.supplier}</td>
                  <td className="p-4 text-muted-foreground">{po.department}</td>
                  <td className="p-4 text-muted-foreground">{po.date}</td>
                  <td className="p-4 font-bold">{po.amount}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      po.status === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      po.status === "Pending Approval" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      po.status === "Dispatched" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
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
        {isCreatePOModalOpen && (
          <CreatePOModal onClose={() => setIsCreatePOModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Bids() {
  const [isCreateBidModalOpen, setIsCreateBidModalOpen] = useState(false);

  const bids = [
    { id: "RFQ-2024-050", title: "Lobby Furniture Renovation", department: "Engineering", deadline: "2024-06-20", status: "Open", received: 3 },
    { id: "RFQ-2024-051", title: "Annual HVAC Maintenance", department: "Engineering", deadline: "2024-06-15", status: "Open", received: 1 },
    { id: "RFQ-2024-052", title: "New POS System Hardware", department: "IT", deadline: "2024-05-30", status: "Closed", received: 5 },
    { id: "RFQ-2024-053", title: "Banquet Hall Linens", department: "Housekeeping", deadline: "2024-05-25", status: "Awarded", received: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search RFQs or titles..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsCreateBidModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create RFQ
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">RFQ Number</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Deadline</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Bids Received</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {bids.map((bid) => (
                <tr key={bid.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium text-muted-foreground">{bid.id}</td>
                  <td className="p-4 font-semibold">{bid.title}</td>
                  <td className="p-4 text-muted-foreground">{bid.department}</td>
                  <td className="p-4 text-muted-foreground">{bid.deadline}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      bid.status === "Open" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      bid.status === "Awarded" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      {bid.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{bid.received}</td>
                  <td className="px-4 py-3 text-right">
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
        {isCreateBidModalOpen && (
          <CreateBidModal onClose={() => setIsCreateBidModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Suppliers() {
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);

  const suppliers = [
    { id: "SUP-001", name: "Fresh Foods Co.", category: "F&B", status: "Active", rating: 4.8, contact: "john@freshfoods.com" },
    { id: "SUP-002", name: "Linen Master", category: "Housekeeping", status: "Active", rating: 4.5, contact: "sales@linenmaster.com" },
    { id: "SUP-003", name: "Tech Solutions Inc.", category: "IT", status: "Under Review", rating: 3.9, contact: "support@techsol.com" },
    { id: "SUP-004", name: "Premium Beverages", category: "F&B", status: "Active", rating: 4.9, contact: "orders@premiumbev.com" },
    { id: "SUP-005", name: "Eco Cleaning Supplies", category: "Housekeeping", status: "Inactive", rating: 3.2, contact: "info@ecoclean.com" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search suppliers..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsAddSupplierModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Supplier Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium text-muted-foreground">{supplier.id}</td>
                  <td className="p-4 font-medium">{supplier.name}</td>
                  <td className="p-4 text-muted-foreground">{supplier.category}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      supplier.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      supplier.status === "Under Review" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{supplier.rating}</span>
                      <span className="text-amber-500 text-xs">★</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{supplier.contact}</td>
                  <td className="px-4 py-3 text-right">
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
        {isAddSupplierModalOpen && (
          <AddSupplierModal onClose={() => setIsAddSupplierModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddSupplierModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-card w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 sticky top-0 z-20">
          <div>
            <h3 className="text-lg font-bold text-foreground">Add New Supplier</h3>
            <p className="text-sm text-muted-foreground">Enter comprehensive details for the new vendor.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            {/* Company Information */}
            <section>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Company Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Legal Company Name <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Fresh Foods Inc." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trading Name (DBA)</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Fresh Foods" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax ID / VAT Number <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="XX-XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Registration Number</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Registration No." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Supplier Category <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option value="">Select Category</option>
                    <option value="fb">Food & Beverage</option>
                    <option value="housekeeping">Housekeeping & Laundry</option>
                    <option value="maintenance">Maintenance & Engineering</option>
                    <option value="it">IT & Technology</option>
                    <option value="marketing">Marketing & Printing</option>
                    <option value="services">Professional Services</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <input type="url" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="https://" />
                </div>
              </div>
            </section>

            {/* Contact Details */}
            <section>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Primary Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Contact Name <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Account Manager" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="email@company.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Address Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Street Address <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="123 Business Rd." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State / Province <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="State" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Postal / Zip Code <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Zip Code" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    {/* Add more countries */}
                  </select>
                </div>
              </div>
            </section>

            {/* Financial & Payment Terms */}
            <section>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Financial & Payment Terms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Terms <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option value="net15">Net 15</option>
                    <option value="net30">Net 30</option>
                    <option value="net45">Net 45</option>
                    <option value="net60">Net 60</option>
                    <option value="due_receipt">Due on Receipt</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Payment Method</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option value="ach">ACH / Bank Transfer</option>
                    <option value="wire">Wire Transfer</option>
                    <option value="check">Check</option>
                    <option value="cc">Credit Card</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Bank Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <input type="password" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Routing Number / Swift Code</label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Routing/Swift" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Credit Limit ($)</label>
                  <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                </div>
              </div>
            </section>

            {/* Compliance & Documents */}
            <section>
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Compliance & Documents</h4>
              <div className="space-y-4">
                <div className="p-4 border border-dashed border-border rounded-xl bg-secondary/20 flex flex-col items-center justify-center text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Upload W-9 / W-8BEN Form</p>
                  <p className="text-xs text-muted-foreground mb-4">PDF, JPG, PNG up to 10MB</p>
                  <button type="button" className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                    Browse Files
                  </button>
                </div>
                <div className="p-4 border border-dashed border-border rounded-xl bg-secondary/20 flex flex-col items-center justify-center text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Upload Insurance Certificate (COI)</p>
                  <p className="text-xs text-muted-foreground mb-4">PDF, JPG, PNG up to 10MB</p>
                  <button type="button" className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                    Browse Files
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Notes</label>
                  <textarea 
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-y" 
                    placeholder="Any special instructions, delivery requirements, or notes..."
                  ></textarea>
                </div>
              </div>
            </section>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Save Supplier
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


function Requisitions() {
  const [isCreateReqModalOpen, setIsCreateReqModalOpen] = useState(false);

  const requisitions = [
    { id: "REQ-2024-089", department: "Housekeeping", requestedBy: "Maria Garcia", date: "2024-06-08", items: 12, status: "Pending Approval" },
    { id: "REQ-2024-088", department: "F&B", requestedBy: "Chef Gordon", date: "2024-06-07", items: 45, status: "Approved" },
    { id: "REQ-2024-087", department: "Engineering", requestedBy: "Tom Smith", date: "2024-06-06", items: 3, status: "PO Created" },
    { id: "REQ-2024-086", department: "Front Desk", requestedBy: "Sarah Jenkins", date: "2024-06-05", items: 5, status: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search requisitions..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsCreateReqModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Requisition
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Req Number</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Requested By</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {requisitions.map((req) => (
                <tr key={req.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium text-muted-foreground">{req.id}</td>
                  <td className="p-4 font-medium">{req.department}</td>
                  <td className="p-4 text-muted-foreground">{req.requestedBy}</td>
                  <td className="p-4 text-muted-foreground">{req.date}</td>
                  <td className="p-4 text-center font-medium">{req.items}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      req.status === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      req.status === "Pending Approval" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      req.status === "PO Created" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
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
        {isCreateReqModalOpen && (
          <CreateRequisitionModal onClose={() => setIsCreateReqModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateRequisitionModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Internal Purchase Requisition</h3>
            <p className="text-sm text-muted-foreground">Request items for your department.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="housekeeping">Housekeeping</option>
                  <option value="fb">Food & Beverage</option>
                  <option value="engineering">Engineering</option>
                  <option value="frontdesk">Front Office</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Required By <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <section className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Requested Items</h4>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">Item Description</th>
                      <th className="px-4 py-2 font-medium text-right">Quantity</th>
                      <th className="px-4 py-3 font-medium">UOM</th>
                      <th className="px-4 py-3 font-medium">Preferred Vendor (Optional)</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="bg-background">
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" placeholder="What do you need?" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-right" placeholder="0" />
                      </td>
                      <td className="px-4 py-3">
                        <select className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50">
                          <option>Each</option>
                          <option>Box</option>
                          <option>Case</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" placeholder="Vendor name" />
                      </td>
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
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>
              </div>
            </section>

            <div className="space-y-2">
              <label className="text-sm font-medium">Justification / Notes</label>
              <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Why are these items needed?"></textarea>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" />
            Submit Requisition
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Receiving() {
  const [isCreateGRNModalOpen, setIsCreateGRNModalOpen] = useState(false);

  const grns = [
    { id: "GRN-2024-501", poNumber: "PO-2024-1042", supplier: "Sysco Foods", date: "2024-06-08", receivedBy: "John Doe", status: "Completed" },
    { id: "GRN-2024-502", poNumber: "PO-2024-1045", supplier: "Premium Beverages", date: "2024-06-08", receivedBy: "Jane Smith", status: "Partial" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search GRNs, POs, or suppliers..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsCreateGRNModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Receive Goods (GRN)
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">GRN Number</th>
                <th className="px-4 py-3 font-medium">PO Number</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium">Date Received</th>
                <th className="px-4 py-3 font-medium">Received By</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {grns.map((grn) => (
                <tr key={grn.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium text-muted-foreground">{grn.id}</td>
                  <td className="p-4 font-medium text-primary">{grn.poNumber}</td>
                  <td className="p-4 font-medium">{grn.supplier}</td>
                  <td className="p-4 text-muted-foreground">{grn.date}</td>
                  <td className="p-4 text-muted-foreground">{grn.receivedBy}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      grn.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                      {grn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
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
        {isCreateGRNModalOpen && (
          <CreateGRNModal onClose={() => setIsCreateGRNModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateGRNModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Goods Receipt Note (GRN)</h3>
            <p className="text-sm text-muted-foreground">Record incoming deliveries against a Purchase Order.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">PO Selection</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Purchase Order <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Search PO Number...</option>
                      <option value="po1">PO-2024-1042 - Sysco Foods</option>
                      <option value="po2">PO-2024-1045 - Premium Beverages</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Supplier</label>
                      <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Auto-filled" disabled />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Department</label>
                      <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Auto-filled" disabled />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Delivery Details</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Delivery Note / Invoice # <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="From supplier" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Received <span className="text-red-500">*</span></label>
                      <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="2024-06-08" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Received By</label>
                      <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" value="Current User" disabled />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Condition</label>
                      <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="good">Good / Undamaged</option>
                        <option value="damaged">Damaged (Note below)</option>
                        <option value="temp">Temperature Issue</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Receive Items</h4>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">Item Description</th>
                      <th className="px-4 py-2 font-medium text-center">Ordered</th>
                      <th className="px-4 py-2 font-medium text-center">Prev. Received</th>
                      <th className="px-4 py-2 font-medium text-center">Now Receiving <span className="text-red-500">*</span></th>
                      <th className="px-4 py-2 font-medium text-center">Rejected</th>
                      <th className="px-4 py-3 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="bg-background">
                      <td className="px-4 py-2 font-medium">Premium Coffee Beans (Kg)</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">50</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">0</td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-20 mx-auto px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-center" defaultValue="50" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-20 mx-auto px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-center" defaultValue="0" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" placeholder="Reason if rejected" />
                      </td>
                    </tr>
                    <tr className="bg-background">
                      <td className="px-4 py-2 font-medium">Sparkling Water (Case)</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">20</td>
                      <td className="px-4 py-2 text-center text-muted-foreground">0</td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-20 mx-auto px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-center" defaultValue="18" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-20 mx-auto px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-center" defaultValue="2" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" defaultValue="2 cases damaged in transit" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Attachments & Notes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-4 border border-dashed border-border rounded-xl bg-secondary/20 flex flex-col items-center justify-center text-center h-32">
                  <FileText className="w-6 h-6 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Upload Delivery Note / Photos</p>
                  <button type="button" className="mt-2 px-3 py-1.5 bg-secondary text-foreground rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors">
                    Browse Files
                  </button>
                </div>
                <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 h-32" placeholder="Additional notes for AP or Purchasing..."></textarea>
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
            Complete GRN
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CreatePOModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Create Purchase Order</h3>
            <p className="text-sm text-muted-foreground">Draft a new PO and route for approval.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            {/* Supplier & General Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Supplier Information</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Supplier <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Search or select supplier...</option>
                      <option value="sysco">Sysco Foods</option>
                      <option value="ecolab">Ecolab</option>
                      <option value="linen">Linen Master</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contact Person</label>
                      <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Auto-filled" disabled />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Terms</label>
                      <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Auto-filled" disabled />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Order Details</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">PO Number</label>
                      <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" value="PO-2024-1046" disabled />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Order Date <span className="text-red-500">*</span></label>
                      <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="2024-06-05" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expected Delivery <span className="text-red-500">*</span></label>
                      <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Shipping Method</label>
                      <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="standard">Standard Delivery</option>
                        <option value="express">Express / Overnight</option>
                        <option value="pickup">Vendor Pickup</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Line Items */}
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Line Items</h4>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">Item Code / SKU</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">GL Account</th>
                      <th className="px-4 py-2 font-medium text-right">Qty</th>
                      <th className="px-4 py-3 font-medium">UOM</th>
                      <th className="px-4 py-2 font-medium text-right">Unit Price</th>
                      <th className="px-4 py-2 font-medium text-right">Total</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="bg-background">
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" placeholder="SKU-123" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" placeholder="Item description" />
                      </td>
                      <td className="px-4 py-3">
                        <select className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50">
                          <option>5200 - F&B Cost</option>
                          <option>5100 - Supplies</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-right" placeholder="0" />
                      </td>
                      <td className="px-4 py-3">
                        <select className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50">
                          <option>Each</option>
                          <option>Box</option>
                          <option>Case</option>
                          <option>Kg</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-right" placeholder="0.00" />
                      </td>
                      <td className="px-4 py-2 text-right font-medium">$0.00</td>
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
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping / Freight</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t border-border">
                    <span>Total Amount</span>
                    <span className="text-primary">$0.00</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Notes & Approval */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Notes & Terms</h4>
                <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Special instructions for the vendor..."></textarea>
              </section>
              <section className="space-y-4">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Approval Routing</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Route to <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Select Approver...</option>
                      <option value="gm">General Manager</option>
                      <option value="finance">Director of Finance</option>
                      <option value="purchasing">Purchasing Manager</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-between sticky bottom-0 z-20">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            <FileText className="w-4 h-4" /> Preview PO
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" />
              Submit for Approval
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CreateBidModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Create Request for Quotation (RFQ)</h3>
            <p className="text-sm text-muted-foreground">Draft a new tender and invite suppliers to bid.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            {/* RFQ Details */}
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">RFQ Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">RFQ Title <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g., Lobby Furniture Renovation" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select Department...</option>
                    <option value="engineering">Engineering / Maintenance</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="fb">Food & Beverage</option>
                    <option value="it">IT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Submission Deadline <span className="text-red-500">*</span></label>
                  <input type="datetime-local" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description & Scope of Work</label>
                  <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Provide a detailed description of the requirements..."></textarea>
                </div>
              </div>
            </section>

            {/* Requested Items */}
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Requested Items / Services</h4>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">Item / Service Name</th>
                      <th className="px-4 py-3 font-medium">Specifications</th>
                      <th className="px-4 py-2 font-medium text-right">Quantity</th>
                      <th className="px-4 py-3 font-medium">UOM</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="bg-background">
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" placeholder="Item name" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50" placeholder="Dimensions, material, etc." />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-right" placeholder="0" />
                      </td>
                      <td className="px-4 py-3">
                        <select className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50">
                          <option>Each</option>
                          <option>Lot</option>
                          <option>Hour</option>
                        </select>
                      </td>
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
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>
              </div>
            </section>

            {/* Invited Suppliers */}
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Invite Suppliers</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search and select suppliers to invite..." 
                      className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button type="button" className="px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors">
                    Browse Directory
                  </button>
                </div>
                
                <div className="border border-border rounded-xl p-4 bg-secondary/10">
                  <p className="text-sm text-muted-foreground mb-3">Selected Suppliers (0)</p>
                  <div className="text-center py-4 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                    No suppliers selected yet. Search above to add.
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" />
            Publish RFQ & Invite
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Inventory() {
  const [isIssueStockModalOpen, setIsIssueStockModalOpen] = useState(false);

  const inventoryItems = [
    { id: "INV-1001", name: "Premium Bath Towels", category: "Housekeeping", inStock: 450, parLevel: 500, unit: "Each", status: "Low Stock" },
    { id: "INV-1002", name: "Coffee Beans (Espresso)", category: "F&B", inStock: 25, parLevel: 20, unit: "Kg", status: "Optimal" },
    { id: "INV-1003", name: "Shampoo 50ml", category: "Amenities", inStock: 1200, parLevel: 1000, unit: "Bottle", status: "Optimal" },
    { id: "INV-1004", name: "Printer Paper A4", category: "Office", inStock: 5, parLevel: 20, unit: "Box", status: "Critical" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search inventory items..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsIssueStockModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Issue Stock
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Item ID</th>
                <th className="px-4 py-3 font-medium">Item Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">In Stock</th>
                <th className="px-4 py-3 font-medium">Par Level</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium text-muted-foreground">{item.id}</td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3 text-right">{item.inStock} {item.unit}</td>
                  <td className="px-4 py-3 text-right">{item.parLevel} {item.unit}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      item.status === "Optimal" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      item.status === "Low Stock" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
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
        {isIssueStockModalOpen && (
          <IssueStockModal onClose={() => setIsIssueStockModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function IssueStockModal({ onClose }: { onClose: () => void }) {
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
        className="bg-card w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col relative z-10"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 sticky top-0 z-20">
          <div>
            <h3 className="text-lg font-bold text-foreground">Issue Stock to Department</h3>
            <p className="text-sm text-muted-foreground">Record items leaving the main storeroom.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Requesting Department <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select Department...</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="fb">Food & Beverage</option>
                  <option value="engineering">Engineering</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Requested By <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Employee Name" />
              </div>
            </div>

            <section className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Items to Issue</h4>
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">Item Name / SKU</th>
                      <th className="px-4 py-2 font-medium text-right">Current Stock</th>
                      <th className="px-4 py-2 font-medium text-right">Qty to Issue <span className="text-red-500">*</span></th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="bg-background">
                      <td className="px-4 py-3">
                        <select className="w-full px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50">
                          <option>Premium Bath Towels (INV-1001)</option>
                          <option>Coffee Beans (INV-1002)</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-right text-muted-foreground">450 Each</td>
                      <td className="px-4 py-3">
                        <input type="number" className="w-24 mx-auto px-2 py-1.5 bg-transparent border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50 text-right" placeholder="0" />
                      </td>
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
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button onClick={onClose} className="px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Issue Stock
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Contracts() {
  const [isCreateContractModalOpen, setIsCreateContractModalOpen] = useState(false);

  const contracts = [
    { id: "CTR-2024-01", supplier: "Ecolab", title: "Chemical Supply Agreement", startDate: "2024-01-01", endDate: "2025-12-31", status: "Active" },
    { id: "CTR-2024-02", supplier: "Otis Elevators", title: "Elevator Maintenance", startDate: "2023-06-01", endDate: "2024-05-31", status: "Expiring Soon" },
    { id: "CTR-2024-03", supplier: "Sysco Foods", title: "F&B Primary Vendor", startDate: "2024-03-01", endDate: "2026-02-28", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search contracts or suppliers..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsCreateContractModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Contract
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Contract ID</th>
                <th className="px-4 py-3 font-medium">Supplier</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Start Date</th>
                <th className="px-4 py-3 font-medium">End Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {contracts.map((contract) => (
                <tr key={contract.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium text-muted-foreground">{contract.id}</td>
                  <td className="p-4 font-medium">{contract.supplier}</td>
                  <td className="p-4 text-muted-foreground">{contract.title}</td>
                  <td className="p-4 text-muted-foreground">{contract.startDate}</td>
                  <td className="p-4 text-muted-foreground">{contract.endDate}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      contract.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
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
        {isCreateContractModalOpen && (
          <CreateContractModal onClose={() => setIsCreateContractModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateContractModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">Add New Contract</h3>
            <p className="text-sm text-muted-foreground">Record supplier agreements and SLAs.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select Supplier...</option>
                  <option value="ecolab">Ecolab</option>
                  <option value="otis">Otis Elevators</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contract Title <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g., Annual Maintenance" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Total Value (Optional)</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Renewal Terms</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="auto">Auto-Renew</option>
                  <option value="manual">Manual Renewal Required</option>
                  <option value="none">Non-Renewable</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-border pb-2">Contract Document</h4>
              <div className="p-4 border border-dashed border-border rounded-xl bg-secondary/20 flex flex-col items-center justify-center text-center h-32">
                <FileText className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Upload Signed Contract (PDF)</p>
                <button type="button" className="mt-2 px-3 py-1.5 bg-secondary text-foreground rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors">
                  Browse Files
                </button>
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


function PurchasingSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Purchasing Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for Purchasing will be available here.</p>
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

