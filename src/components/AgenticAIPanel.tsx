import React from "react";
import { Sparkles, X, ArrowRight, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";

interface AgenticAIPanelProps {
  department: string;
  onClose: () => void;
}

export function AgenticAIPanel({ department, onClose }: AgenticAIPanelProps) {
  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col shadow-2xl z-30 animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-bold text-lg">Agentic AI</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-secondary"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {department} Insights
          </h3>
          <p className="text-sm text-foreground">
            I am monitoring the {department.toLowerCase()} systems. Here are my automated recommendations.
          </p>
        </div>

        {department === "Front Desk" && (
          <>
            <div className="bg-background border border-border rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Overbooked Standard</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Standard Kings are overbooked by 2 for tonight.
                  </p>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-xs space-y-2">
                <p><span className="font-medium">Action:</span> Upgrade Smith & Johnson to Junior Suites.</p>
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  Execute Upgrades <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-background border border-border rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">VIP Arrival Prep</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 VIPs arriving before 12 PM. Rooms need priority cleaning.
                  </p>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-xs space-y-2">
                <p><span className="font-medium">Action:</span> Alert Housekeeping to prioritize 402, 405, 510.</p>
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  Send Alert <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </>
        )}

        {department !== "Front Desk" && (
          <div className="bg-background border border-border rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400 shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Optimization Ready</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  AI has found 3 workflow optimizations for {department}.
                </p>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-xs space-y-2">
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                Review Optimizations <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
