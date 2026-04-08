import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  Share2, 
  Image as ImageIcon, 
  Target, 
  BarChart,
  X,
  CheckCircle2
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";

interface MarketingAndPRProps {
  aiEnabled: boolean;
  activeSubmenu: string;
}

export function MarketingAndPR({ aiEnabled, activeSubmenu }: MarketingAndPRProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "Overview":
        return <MarketingOverview />;
      case "Campaigns":
        return <Campaigns />;
      case "Social Media":
        return <SocialMedia />;
      case "Brand Assets":
        return <BrandAssets />;
      case "Settings":

        return <MarketingAndPRSettings />;

      default:
        return <GenericView title={activeSubmenu} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Marketing & PR</h2>
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

function MarketingOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Active Campaigns" 
          value="4" 
          change="2 ending soon" 
          trend="neutral" 
          icon={Target} 
          color="blue" 
        />
        <KPICard 
          label="Social Reach" 
          value="124K" 
          change="+12% vs last month" 
          trend="up" 
          icon={Share2} 
          color="emerald" 
        />
        <KPICard 
          label="Email Open Rate" 
          value="24.5%" 
          change="+2.1% vs avg" 
          trend="up" 
          icon={Megaphone} 
          color="purple" 
        />
        <KPICard 
          label="ROI (YTD)" 
          value="312%" 
          change="On target" 
          trend="up" 
          icon={BarChart} 
          color="amber" 
        />
      </div>
    </div>
  );
}

function Campaigns() {
  const [isAddCampaignModalOpen, setIsAddCampaignModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <h3 className="font-semibold">Marketing Campaigns</h3>
        <button 
          onClick={() => setIsAddCampaignModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center h-[30vh] text-center border border-dashed border-border rounded-2xl">
        <p className="text-muted-foreground">Campaigns list will appear here.</p>
      </div>

      <AnimatePresence>
        {isAddCampaignModalOpen && (
          <AddCampaignModal onClose={() => setIsAddCampaignModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddCampaignModal({ onClose }: { onClose: () => void }) {
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
            <h3 className="text-lg font-bold text-foreground">New Marketing Campaign</h3>
            <p className="text-sm text-muted-foreground">Setup a new promotional campaign.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Campaign Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Summer Getaway 2026" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Channel</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Email</option>
                  <option>Social Media</option>
                  <option>Search Ads</option>
                  <option>Display Ads</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget ($)</label>
                <input type="number" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Target Audience / Description</label>
                <textarea className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Describe the campaign goals and target audience..."></textarea>
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
            Save Campaign
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SocialMedia() {
  return (
    <div className="flex flex-col items-center justify-center h-[40vh] text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Social Media</h2>
      <p className="text-muted-foreground">Manage social media posts here.</p>
    </div>
  );
}

function BrandAssets() {
  return (
    <div className="flex flex-col items-center justify-center h-[40vh] text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Brand Assets</h2>
      <p className="text-muted-foreground">Manage logos and brand guidelines here.</p>
    </div>
  );
}



function MarketingAndPRSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-foreground">Marketing And P R Settings</h3>
          <p className="text-sm text-muted-foreground">Configure module-specific parameters and preferences.</p>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>Settings configuration for MarketingAndPR will be available here.</p>
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
