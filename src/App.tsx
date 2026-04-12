import React, { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Layout } from "./components/Layout";
import { NotificationProvider } from "./context/NotificationContext";
import { GuestProvider } from "./context/GuestContext";
import { MenuProvider } from "./context/MenuContext";
import { TableProvider } from "./context/TableContext";
import { RoomProvider } from "./context/RoomContext";
import { BookingProvider } from "./context/BookingContext";
import { FolioProvider } from "./context/FolioContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Hotel, ArrowLeft } from "lucide-react";
import { FrontDesk } from "./pages/FrontDesk";
import { Housekeeping } from "./pages/Housekeeping";
import { FoodAndBeverage } from "./pages/FoodAndBeverage";
import { HumanResources } from "./pages/HumanResources";
import { Configuration } from "./pages/Configuration";
import { Purchasing } from "./pages/Purchasing";
import { SalesAndRevenue } from "./pages/SalesAndRevenue";
import { Engineering } from "./pages/Engineering";
import { Concierge } from "./pages/Concierge";
import { EventsAndBanquets } from "./pages/EventsAndBanquets";
import { MarketingAndPR } from "./pages/MarketingAndPR";
import { Connect } from "./pages/Connect";
import { GuestRelations } from "./pages/GuestRelations";
import { FinanceAndAccounting } from "./pages/FinanceAndAccounting";
import { SpaAndWellness } from "./pages/SpaAndWellness";
import { Executive } from "./pages/Executive";
import { Security } from "./pages/Security";
import { ITAndSystems } from "./pages/ITAndSystems";
import { Reservations } from "./pages/Reservations";
import { LegalAndCompliance } from "./pages/LegalAndCompliance";
import { CostControl } from "./pages/CostControl";
import { Readme } from "./pages/Readme";
import { Onboarding } from "./pages/Onboarding";
import { LandingPage } from "./pages/LandingPage";
import { NewFeature } from "./pages/NewFeature";

type Department = 
  | "Front Desk" 
  | "Housekeeping" 
  | "Food & Beverage" 
  | "Sales & Revenue" 
  | "Human Resources" 
  | "Engineering" 
  | "Executive"
  | "Concierge"
  | "Spa & Wellness"
  | "Events & Banquets"
  | "Security"
  | "IT & Systems"
  | "Finance & Accounting"
  | "Marketing & PR"
  | "Purchasing & Procurement"
  | "Reservations"
  | "Legal & Compliance"
  | "Cost Control"
  | "Mini Bar"
  | "Room Service"
  | "Configuration"
  | "Guest Relations"
  | "Connect"
  | "Readme"
  | "Sandbox";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="omnistay-theme">
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [activeDepartment, setActiveDepartment] = useState<Department>("Sandbox");
  const [activeSubmenu, setActiveSubmenu] = useState<string>("Overview");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [viewWebsite, setViewWebsite] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || viewWebsite) {
    if (showLogin) {
      return <LoginScreen onBack={() => setShowLogin(false)} />;
    }
    return (
      <LandingPage 
        isLoggedIn={!!user}
        onGetStarted={() => {
          if (user) {
            setViewWebsite(false);
          } else {
            setShowLogin(true);
          }
        }} 
      />
    );
  }

  if (!profile || !profile.hotelId) {
    return <Onboarding onComplete={() => {}} />;
  }

  if (activeDepartment === "Sandbox") {
    return (
      <NotificationProvider>
        <GuestProvider>
          <MenuProvider>
            <TableProvider>
              <RoomProvider>
                <BookingProvider>
                  <FolioProvider>
                    <NewFeature />
                  </FolioProvider>
                </BookingProvider>
              </RoomProvider>
            </TableProvider>
          </MenuProvider>
        </GuestProvider>
      </NotificationProvider>
    );
  }

  return (
    <NotificationProvider>
      <GuestProvider>
        <MenuProvider>
          <TableProvider>
            <RoomProvider>
              <BookingProvider>
                <FolioProvider>
                  <Layout 
                    activeDepartment={activeDepartment} 
                    setActiveDepartment={setActiveDepartment}
                    activeSubmenu={activeSubmenu}
                    setActiveSubmenu={setActiveSubmenu}
                    aiEnabled={aiEnabled}
                    setAiEnabled={setAiEnabled}
                    onViewWebsite={() => setViewWebsite(true)}
                  >
                    {activeDepartment === "Front Desk" && <FrontDesk aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Housekeeping" && <Housekeeping aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Food & Beverage" && <FoodAndBeverage aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Human Resources" && <HumanResources aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Configuration" && activeSubmenu === "Overview" ? (
                      <Onboarding onComplete={() => setActiveSubmenu("Overview")} />
                    ) : (
                      activeDepartment === "Configuration" && <Configuration activeSubmenu={activeSubmenu} />
                    )}
                    {activeDepartment === "Purchasing & Procurement" && <Purchasing aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Sales & Revenue" && <SalesAndRevenue aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Engineering" && <Engineering aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Concierge" && <Concierge aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Events & Banquets" && <EventsAndBanquets aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Marketing & PR" && <MarketingAndPR aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Connect" && <Connect aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Guest Relations" && <GuestRelations aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Finance & Accounting" && <FinanceAndAccounting aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Spa & Wellness" && <SpaAndWellness aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Executive" && <Executive aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Security" && <Security aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "IT & Systems" && <ITAndSystems aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Reservations" && <Reservations aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Legal & Compliance" && <LegalAndCompliance aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Cost Control" && <CostControl aiEnabled={aiEnabled} activeSubmenu={activeSubmenu} />}
                    {activeDepartment === "Mini Bar" && <div className="p-8">Mini Bar Module</div>}
                    {activeDepartment === "Room Service" && <div className="p-8">Room Service Module</div>}
                    {activeDepartment === "Readme" && <Readme activeSubmenu={activeSubmenu} />}
                  </Layout>
                </FolioProvider>
              </BookingProvider>
            </RoomProvider>
          </TableProvider>
        </MenuProvider>
      </GuestProvider>
    </NotificationProvider>
  );
}

function LoginScreen({ onBack }: { onBack: () => void }) {
  const { login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Website
      </button>
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-10 shadow-2xl text-center">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Hotel className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-brand mb-2 tracking-tight">TravelBook HOS</h1>
        <p className="text-muted-foreground mb-10">
          Advanced Hotel Management & Intelligence Platform
        </p>
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoggingIn ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Google" />
          )}
          Sign in with Google
        </button>
        <p className="mt-8 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
