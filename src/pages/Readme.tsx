import React from "react";
import { BookOpen, Info, Book, Image as ImageIcon } from "lucide-react";
import { UIAssetsLibrary } from "../components/UIAssetsLibrary";

export function Readme({ activeSubmenu }: { activeSubmenu: string }) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case "About":
        return <AboutSection />;
      case "User Guide":
        return <UserGuideSection />;
      case "UI Assets":
        return <UIAssetsLibrary />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
               <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Readme - {activeSubmenu}</h2>
            <p className="text-muted-foreground max-w-md">
              The {activeSubmenu} section is currently under development.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[1.5cm] px-[1.5cm] pt-2 pb-4 border-b border-border mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Readme</h2>
            <h1 className="text-2xl font-bold text-foreground">{activeSubmenu}</h1>
            <p className="text-sm text-muted-foreground mt-1">Documentation and resources for OmniStay</p>
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}

function AboutSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Info className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold">About OmniStay</h2>
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            OmniStay is an advanced, AI-powered Hotel Management & Intelligence Platform designed to streamline operations across all departments of modern hospitality businesses.
          </p>
          <p>
            Built with a focus on real-time data, predictive analytics, and seamless user experience, OmniStay provides a unified interface for Front Desk, Housekeeping, Food & Beverage, and more.
          </p>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Architecture</h3>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <strong>Frontend:</strong> React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
          </p>
          <p>
            <strong>State Management:</strong> React Context API for global state (Auth, Notifications, Guests, Rooms, etc.).
          </p>
          <p>
            <strong>AI Integration:</strong> Google GenAI SDK (Gemini 3 Flash) for the Agentic AI assistant, providing workflow automation and insights.
          </p>
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Licenses & Policies</h3>
        <div className="space-y-4 text-muted-foreground">
          <p>
            This software is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.
          </p>
          <p>
            <strong>Data Privacy:</strong> OmniStay adheres to strict data protection policies, ensuring guest information is encrypted and handled in compliance with global standards (GDPR, CCPA).
          </p>
        </div>
      </section>
    </div>
  );
}

function UserGuideSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Book className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold">Comprehensive User Guide</h2>
        </div>
        <div className="space-y-6 text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">1. Navigation</h4>
            <p>Use the left sidebar to switch between departments. The sidebar can be collapsed for more workspace. Each department has its own set of submenus located next to the main sidebar.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">2. Agentic AI</h4>
            <p>The AI assistant is available on the right panel. You can ask it to perform complex workflows, such as "Prepare Room 305 for VIP check-in". It will break down the request into actionable steps and execute them.</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">3. Command Palette</h4>
            <p>Press <kbd className="px-2 py-1 bg-secondary rounded-md text-xs mx-1">Cmd/Ctrl + K</kbd> to open the global command palette. This allows you to quickly search for guests, rooms, or jump to specific settings.</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">4. Configuration</h4>
            <p>Navigate to the Configuration department to customize the appearance (theme, primary color, sidebar style) and manage system parameters.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
