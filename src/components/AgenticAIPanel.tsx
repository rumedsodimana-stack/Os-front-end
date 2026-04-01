import React, { useState, useEffect } from "react";
import { Sparkles, X, ArrowRight, CheckCircle2, AlertTriangle, TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analytics";
import { pmsService } from "../services/pms";

interface AgenticAIPanelProps {
  department: string;
  onClose: () => void;
}

interface Insight {
  type: "warning" | "success" | "info";
  title: string;
  body: string;
  action: string;
}

// Generate contextual insights from real (or mock) data
function buildInsights(department: string, kpi: { occupancyRate: number; revPAR: number; arrivals: number; inHouse: number } | undefined): Insight[] {
  const occ = kpi?.occupancyRate ?? 72;
  const revpar = kpi?.revPAR ?? 145;
  const arrivals = kpi?.arrivals ?? 45;

  switch (department) {
    case "Front Desk":
    case "Dashboard":
      return [
        {
          type: occ > 85 ? "warning" : "success",
          title: occ > 85 ? "High Occupancy Alert" : "Occupancy on Track",
          body: occ > 85
            ? `Occupancy at ${occ}% — Standard Kings may be overbooked. Consider upgrading 2 guests to Junior Suites.`
            : `Occupancy at ${occ}% — ${arrivals} arrivals today. Rooms are ready.`,
          action: occ > 85 ? "Execute Upgrades" : "View Arrivals",
        },
        {
          type: "info",
          title: "VIP Arrival Prep",
          body: `${arrivals > 40 ? "3" : "1"} VIPs arriving before 12 PM. Rooms need priority cleaning and amenity setup.`,
          action: "Alert Housekeeping",
        },
      ];
    case "Housekeeping":
      return [
        {
          type: "warning",
          title: "Energy Waste Detected",
          body: "IoT sensors show AC running in 5 vacant rooms (301, 305, 412, 415, 501). Estimated waste: $48/hr.",
          action: "Auto-Shutoff",
        },
        {
          type: "info",
          title: "Predictive Maintenance",
          body: "Room 210 shower flow rate dropped 15%. Likely mineral buildup — early intervention prevents guest complaint.",
          action: "Create Work Order",
        },
      ];
    case "Food & Beverage":
      return [
        {
          type: "success",
          title: "Menu Optimization",
          body: "Top 3 items by margin: Grilled Salmon (+42%), Chef's Pasta (+38%), Chocolate Fondant (+55%). Feature these tonight.",
          action: "Update Daily Specials",
        },
        {
          type: "warning",
          title: "Stock Alert",
          body: "Salmon fillet will run out in ~3 hours at current consumption rate. 12 kg needed for dinner service.",
          action: "Order from Supplier",
        },
      ];
    case "Sales & Revenue":
      return [
        {
          type: revpar > 150 ? "success" : "warning",
          title: revpar > 150 ? "RevPAR Exceeding Target" : "RevPAR Optimization Opportunity",
          body: `RevPAR at $${revpar.toFixed(0)}. ${revpar > 150 ? "You're outperforming the comp set by 12%." : "Consider raising rates for the upcoming weekend — demand signals are strong."}`,
          action: revpar > 150 ? "View Report" : "Adjust Rates",
        },
        {
          type: "info",
          title: "Channel Rebalancing",
          body: "Booking.com allocation at 40% while direct bookings are only 15%. Shift 10% to direct to save $3,200 in commissions this month.",
          action: "Rebalance Channels",
        },
      ];
    case "Human Resources":
      return [
        {
          type: "warning",
          title: "Attendance Anomaly",
          body: "3 no-shows today in Housekeeping — peak checkout day. Recommend calling in 2 on-call staff members.",
          action: "Contact On-Call Staff",
        },
        {
          type: "success",
          title: "Payroll Ready",
          body: "March payroll is processed and ready for approval. 42 employees, total: $148,500.",
          action: "Approve Payroll",
        },
      ];
    case "Engineering":
      return [
        {
          type: "warning",
          title: "Elevator A PM Overdue",
          body: "Scheduled monthly maintenance for Elevator A is 1 day overdue. Safety risk if delayed further.",
          action: "Schedule Now",
        },
        {
          type: "info",
          title: "Generator Health Check",
          body: "Generator flagged as 'Needs Attention'. Last service was 27 days ago. Recommend inspection before next event.",
          action: "Create Work Order",
        },
      ];
    case "Executive":
      return [
        {
          type: "success",
          title: `Q2 Outlook: Strong`,
          body: `Occupancy tracking at ${occ}% with RevPAR at $${revpar.toFixed(0)}. Pacing 8% ahead of same period last year.`,
          action: "View Full Report",
        },
        {
          type: "info",
          title: "Strategic Action Required",
          body: "Loyalty program launch is at 65% completion — 35 days until target date. 2 deliverables still pending from IT team.",
          action: "Review Initiative",
        },
      ];
    default:
      return [
        {
          type: "info",
          title: "Workflow Optimizations Found",
          body: `AI has analyzed ${department} operations and identified 3 potential efficiency gains worth ~$2,400/month.`,
          action: "Review Optimizations",
        },
      ];
  }
}

export function AgenticAIPanel({ department, onClose }: AgenticAIPanelProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [executedActions, setExecutedActions] = useState<Set<string>>(new Set());

  const { data: kpi } = useQuery({
    queryKey: ['dailyKPI'],
    queryFn: analyticsService.getDailyKPI,
    retry: false,
    staleTime: 60_000,
  });

  const insights = buildInsights(department, kpi);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setRefreshing(false);
  };

  const handleAction = (action: string) => {
    setExecutedActions(prev => new Set(prev).add(action));
  };

  const iconMap: Record<Insight["type"], React.ReactNode> = {
    warning: (
      <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full text-amber-600 dark:text-amber-400 shrink-0">
        <AlertTriangle className="w-4 h-4" />
      </div>
    ),
    success: (
      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </div>
    ),
    info: (
      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400 shrink-0">
        <TrendingUp className="w-4 h-4" />
      </div>
    ),
  };

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col shadow-2xl z-30 animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-bold text-lg">Agentic AI</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className={cn("text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-secondary", refreshing && "animate-spin")}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {department} Insights
          </h3>
          <p className="text-sm text-foreground">
            {kpi
              ? `Live data from backend — Occ: ${kpi.occupancyRate}%, RevPAR: $${kpi.revPAR.toFixed(0)}`
              : `Monitoring ${department.toLowerCase()} systems. Showing best-effort recommendations.`}
          </p>
        </div>

        {refreshing ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Analyzing latest data...</p>
          </div>
        ) : (
          insights.map((insight, i) => {
            const done = executedActions.has(insight.action);
            return (
              <div key={i} className="bg-background border border-border rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  {iconMap[insight.type]}
                  <div>
                    <h4 className="text-sm font-semibold">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{insight.body}</p>
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-xs">
                  <button
                    onClick={() => handleAction(insight.action)}
                    disabled={done}
                    className={cn(
                      "w-full py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2",
                      done
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 cursor-default"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {done ? (
                      <><CheckCircle2 className="w-3 h-3" /> Done</>
                    ) : (
                      <>{insight.action} <ArrowRight className="w-3 h-3" /></>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Gemini-powered placeholder */}
        <div className="border border-dashed border-border rounded-xl p-4 text-center">
          <Sparkles className="w-6 h-6 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            Connect <code className="font-mono text-xs bg-secondary px-1 rounded">VITE_GEMINI_API_KEY</code> to enable AI-generated narrative insights.
          </p>
        </div>
      </div>
    </div>
  );
}
