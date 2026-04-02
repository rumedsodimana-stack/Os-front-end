import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeApplier } from "./components/ThemeApplier";
import { Layout } from "./components/Layout";
import { FrontDesk } from "./pages/FrontDesk";
import { Housekeeping } from "./pages/Housekeeping";
import { FoodAndBeverage } from "./pages/FoodAndBeverage";
import { SalesRevenue } from "./pages/SalesRevenue";
import { HumanResources } from "./pages/HumanResources";
import { Engineering } from "./pages/Engineering";
import { Executive } from "./pages/Executive";
import { CRM } from "./pages/CRM";
import { Finance } from "./pages/Finance";
import { Security } from "./pages/Security";
import { Comms } from "./pages/Comms";
import { Events } from "./pages/Events";
import { Procurement } from "./pages/Procurement";
import { MultiProperty } from "./pages/MultiProperty";
import { Configuration } from "./pages/Configuration";
import { Login } from "./pages/Login";
import { StyleGuide } from "./pages/StyleGuide";

export type Department =
  | "Dashboard"
  | "Front Desk"
  | "Housekeeping"
  | "Food & Beverage"
  | "Sales & Revenue"
  | "Human Resources"
  | "Engineering"
  | "Executive"
  | "CRM"
  | "Finance"
  | "Security"
  | "Comms"
  | "Events"
  | "Procurement"
  | "Multi-Property"
  | "Configuration";

function DashboardApp() {
  const [activeDepartment, setActiveDepartment] = useState<Department>("Dashboard");
  const [activeSubmenu, setActiveSubmenu] = useState<string>("Overview");
  const [aiEnabled, setAiEnabled] = useState(true);

  return (
    <Layout
      activeDepartment={activeDepartment}
      setActiveDepartment={setActiveDepartment}
      activeSubmenu={activeSubmenu}
      setActiveSubmenu={setActiveSubmenu}
      aiEnabled={aiEnabled}
      setAiEnabled={setAiEnabled}
    >
      {(activeDepartment === "Dashboard" || activeDepartment === "Front Desk") && (
        <FrontDesk aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Housekeeping" && (
        <Housekeeping aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Food & Beverage" && (
        <FoodAndBeverage aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Sales & Revenue" && (
        <SalesRevenue aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Human Resources" && (
        <HumanResources aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Engineering" && (
        <Engineering aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Executive" && (
        <Executive aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "CRM" && (
        <CRM aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Finance" && (
        <Finance aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Security" && (
        <Security aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Comms" && (
        <Comms aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Events" && (
        <Events aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Procurement" && (
        <Procurement aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Multi-Property" && (
        <MultiProperty aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
      {activeDepartment === "Configuration" && (
        <Configuration aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="omnistay-theme">
      <ThemeApplier />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/style-guide" element={<StyleGuideWrapper />} />
        <Route path="/*" element={<DashboardApp />} />
      </Routes>
    </ThemeProvider>
  );
}

function StyleGuideWrapper() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <StyleGuide />
    </div>
  );
}
