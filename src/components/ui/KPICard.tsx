import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  variant?: "vibrant" | "outline" | "ghost";
  color?: string; // Tailwind color class like "blue", "emerald", etc.
  className?: string;
}

export function KPICard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  variant = "vibrant",
  color = "primary",
  className,
}: KPICardProps) {
  // Map color names to background and text classes
  const colorMap: Record<string, { bg: string; text: string; lightBg: string; gradient: string }> = {
    primary: { bg: "bg-primary", text: "text-primary", lightBg: "bg-primary/10", gradient: "from-primary to-primary/80" },
    blue: { bg: "bg-blue-500", text: "text-blue-500", lightBg: "bg-blue-500/10", gradient: "from-blue-400 to-blue-600" },
    emerald: { bg: "bg-emerald-500", text: "text-emerald-500", lightBg: "bg-emerald-500/10", gradient: "from-emerald-400 to-emerald-600" },
    amber: { bg: "bg-amber-500", text: "text-amber-500", lightBg: "bg-amber-500/10", gradient: "from-amber-400 to-amber-600" },
    rose: { bg: "bg-rose-500", text: "text-rose-500", lightBg: "bg-rose-500/10", gradient: "from-rose-400 to-rose-600" },
    purple: { bg: "bg-purple-500", text: "text-purple-500", lightBg: "bg-purple-500/10", gradient: "from-purple-400 to-purple-600" },
    orange: { bg: "bg-orange-500", text: "text-orange-500", lightBg: "bg-orange-500/10", gradient: "from-orange-400 to-orange-600" },
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  if (variant === "vibrant") {
    return (
      <div className={cn(
        "relative overflow-hidden py-3 px-6 rounded-2xl shadow-sm group transition-all hover:shadow-md text-white border-none",
        `bg-gradient-to-br ${selectedColor.gradient}`,
        className
      )}>
        {/* Abstract background pattern */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl transition-transform group-hover:scale-110" />
        <div className="absolute -left-4 -top-4 w-24 h-24 bg-black/5 rounded-full blur-xl" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/10">
              <Icon className="w-5 h-5 text-white" />
            </div>
            {change && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-white">
                {change}
              </span>
            )}
          </div>
          
          <div className="mt-auto">
            <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">{value}</h3>
            <p className="text-sm font-medium text-white/90 mt-1">{label}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "py-3 px-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("p-1.5 rounded-xl", selectedColor.lightBg)}>
          <Icon className={cn("w-5 h-5", selectedColor.text)} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
          {change && (
            <p className={cn(
              "text-xs font-bold mt-1",
              trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
