import React, { useState, useEffect } from "react";
import { DollarSign, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface CostCenter {
  id: string;
  name: string;
  code: string;
  description: string;
  budget: number;
  manager: string;
}

export function CostControl({ aiEnabled, activeSubmenu }: { aiEnabled: boolean; activeSubmenu?: string }) {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<CostCenter, 'id'>>({
    name: "",
    code: "",
    description: "",
    budget: 0,
    manager: ""
  });

  useEffect(() => {
    // For now, use mock data instead of real Firestore listener
    const mockData: CostCenter[] = [
      { id: "1", name: "Front Office", code: "FO-001", description: "Front desk operations", budget: 50000, manager: "John Doe" },
      { id: "2", name: "Housekeeping", code: "HK-002", description: "Room cleaning services", budget: 75000, manager: "Jane Smith" },
      { id: "3", name: "F&B", code: "FB-003", description: "Food and beverage operations", budget: 120000, manager: "Mike Johnson" },
    ];
    setCostCenters(mockData);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Cost Control</h1>
      
      {activeSubmenu === "Overview" && (
        <div className="text-muted-foreground">
          <h2 className="text-xl font-semibold mb-4">Summary of Data</h2>
          <p>This is the overview summary of all cost centers.</p>
        </div>
      )}

      {activeSubmenu === "Cost Centers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {costCenters.map(cc => (
            <div key={cc.id} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-bold">{cc.name}</h3>
              <p className="text-sm text-muted-foreground">{cc.code}</p>
              <p className="mt-4 text-sm">{cc.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-bold">${cc.budget.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">{cc.manager}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INSTRUCTION: This 'Settings' submenu is for department-specific configuration, including the Cost Center Onboarding Wizard. */}
      {activeSubmenu === "Settings" && (
        <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Cost Center Onboarding Wizard</h2>
          <p className="text-muted-foreground mb-6">Follow the steps below to add a new cost center to the system.</p>
          <div className="p-12 border-2 border-dashed border-border rounded-xl text-center">
            <p className="text-lg font-medium text-muted-foreground">Wizard steps will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
}
