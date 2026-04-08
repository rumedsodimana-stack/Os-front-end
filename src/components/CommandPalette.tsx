import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Command, User, Bed, UtensilsCrossed, Wrench, Settings, ChevronRight, X, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  category: string;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    { id: "1", title: "Check-in Guest", subtitle: "Front Desk", icon: User, category: "Actions", action: () => console.log("Check-in") },
    { id: "2", title: "Room Status", subtitle: "Housekeeping", icon: Bed, category: "Navigation", action: () => console.log("Rooms") },
    { id: "3", title: "Smart Menu", subtitle: "Food & Beverage", icon: UtensilsCrossed, category: "Navigation", action: () => console.log("Menu") },
    { id: "4", title: "New Work Order", subtitle: "Engineering", icon: Wrench, category: "Actions", action: () => console.log("Work Order") },
    { id: "5", title: "System Settings", subtitle: "Configuration", icon: Settings, category: "Navigation", action: () => console.log("Settings") },
    { id: "6", title: "Ask Agentic AI", subtitle: "AI Assistant", icon: Sparkles, category: "AI", action: () => console.log("AI") },
  ];

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(); // Toggle logic should be handled by parent
      }
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        }
        if (e.key === "Enter") {
          e.preventDefault();
          filteredCommands[selectedIndex]?.action();
          onClose();
        }
        if (e.key === "Escape") {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh] p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden relative z-10"
          >
            <div className="flex items-center px-4 py-4 border-b border-border bg-secondary/30">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Type a command or search..." 
                className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <div className="flex items-center gap-1 px-2 py-1 bg-background rounded-md border border-border text-[10px] font-bold text-muted-foreground">
                <Command className="w-3 h-3" />
                K
              </div>
              <button onClick={onClose} className="ml-4 p-1 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCommands.map((cmd, idx) => (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group",
                        selectedIndex === idx ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-secondary/50"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg shrink-0",
                        selectedIndex === idx ? "bg-white/20" : "bg-secondary"
                      )}>
                        <cmd.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{cmd.title}</span>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full uppercase font-black tracking-tighter",
                            selectedIndex === idx ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
                          )}>
                            {cmd.category}
                          </span>
                        </div>
                        {cmd.subtitle && (
                          <p className={cn(
                            "text-xs truncate mt-0.5",
                            selectedIndex === idx ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>
                            {cmd.subtitle}
                          </p>
                        )}
                      </div>
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-transform",
                        selectedIndex === idx ? "translate-x-1" : "opacity-0"
                      )} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border bg-secondary/10 flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="px-1 bg-background border border-border rounded">↑↓</span> Navigate</span>
                <span className="flex items-center gap-1"><span className="px-1 bg-background border border-border rounded">Enter</span> Select</span>
              </div>
              <span className="flex items-center gap-1"><span className="px-1 bg-background border border-border rounded">Esc</span> Close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
