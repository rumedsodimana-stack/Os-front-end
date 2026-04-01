import React, { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Layout } from "./components/Layout";
import { FrontDesk } from "./pages/FrontDesk";
import { Housekeeping } from "./pages/Housekeeping";
import { FoodAndBeverage } from "./pages/FoodAndBeverage";

type Department = 
  | "Dashboard" 
  | "Front Desk" 
  | "Housekeeping" 
  | "Food & Beverage" 
  | "Sales & Revenue" 
  | "Human Resources" 
  | "Engineering" 
  | "Executive";

export default function App() {
  const [activeDepartment, setActiveDepartment] = useState<Department>("Dashboard");
  const [activeSubmenu, setActiveSubmenu] = useState<string>("Overview");
  const [aiEnabled, setAiEnabled] = useState(true);

  return (
    <ThemeProvider defaultTheme="system" storageKey="omnistay-theme">
      <Layout 
        activeDepartment={activeDepartment} 
        setActiveDepartment={setActiveDepartment}
        activeSubmenu={activeSubmenu}
        setActiveSubmenu={setActiveSubmenu}
        aiEnabled={aiEnabled}
        setAiEnabled={setAiEnabled}
      >
        {activeDepartment === "Dashboard" && <FrontDesk aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
        {activeDepartment === "Front Desk" && <FrontDesk aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
        {activeDepartment === "Housekeeping" && <Housekeeping aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
        {activeDepartment === "Food & Beverage" && <FoodAndBeverage aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
        
        {/* Placeholders for other departments */}
        {activeDepartment !== "Dashboard" && activeDepartment !== "Front Desk" && activeDepartment !== "Housekeeping" && activeDepartment !== "Food & Beverage" && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{activeDepartment} - {activeSubmenu}</h2>
            <p className="text-muted-foreground max-w-md">
              This department dashboard is currently under construction. It will connect to the relevant backend modules (ERP, POS, HCM, etc.) to provide employee-centric workflows.
            </p>
          </div>
        )}
      </Layout>
    </ThemeProvider>
  );
}
