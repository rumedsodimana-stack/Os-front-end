import React from "react";
import { motion } from "motion/react";
import { 
  Hotel, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Users, 
  LayoutDashboard,
  Sparkles,
  Globe,
  CheckCircle2,
  Star,
  Play,
  ChevronRight,
  Quote,
  Smartphone,
  Layers,
  MousePointer2
} from "lucide-react";
import { cn } from "../lib/utils";

interface LandingPageProps {
  onGetStarted: () => void;
  isLoggedIn?: boolean;
}

export function LandingPage({ onGetStarted, isLoggedIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Hotel className="w-6 h-6" />
            </div>
            <span className="font-brand text-2xl tracking-tight">TravelBook HOS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Impact</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/10"
            >
              {isLoggedIn ? "Back to App" : "Get Started"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Editorial Style */}
      <section className="relative pt-40 pb-32 min-h-screen flex items-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[150px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold mb-8 tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Future of Hospitality</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] uppercase italic">
              Elevate <br />
              <span className="text-primary">Every</span> <br />
              Stay.
            </h1>
            
            <p className="text-xl text-white/60 mb-12 max-w-lg leading-relaxed">
              TravelBook HOS is the intelligent operating system for modern hotels. 
              Streamline operations, maximize revenue, and delight guests with 
              AI-powered precision.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={onGetStarted}
                className="group relative w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">{isLoggedIn ? "Back to Dashboard" : "Enroll Your Hotel"}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              
              <button className="flex items-center gap-3 text-white/80 font-bold hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                Watch the Film
              </button>
            </div>

            <div className="mt-16 flex items-center gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Hotels Worldwide</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Guest Satisfaction</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">AI Support</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-3xl p-4 shadow-2xl overflow-hidden aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000" 
                alt="Luxury Hotel" 
                className="w-full h-full object-cover rounded-[32px] opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute bottom-10 left-10 right-10">
                <div className="p-6 bg-black/60 backdrop-blur-md rounded-3xl border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Revenue Growth</p>
                      <p className="text-xl font-bold">+32% This Quarter</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-primary" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border border-primary/30 rounded-full animate-spin-slow" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-12">
            Trusted by the world's most prestigious properties
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {["Ritz-Carlton", "Four Seasons", "Aman", "Rosewood", "Belmond"].map(brand => (
              <span key={brand} className="text-2xl md:text-3xl font-serif italic tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Bento Grid Style */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">
                Engineered for <br />
                <span className="text-primary">Excellence.</span>
              </h2>
              <p className="text-xl text-white/60 leading-relaxed">
                We've rebuilt the hotel tech stack from the ground up. 
                No legacy bloat, just pure performance.
              </p>
            </div>
            <button className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all uppercase tracking-widest text-sm">
              Explore all features <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* Feature 1 - Large */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-12 hover:border-primary/50 transition-all duration-500">
              <div className="relative z-10 max-w-md">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Real-time Pulse</h3>
                <p className="text-white/60 text-lg leading-relaxed">
                  Monitor every department in real-time. From check-ins to room service orders, 
                  stay on top of your property's heartbeat from any device.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 group-hover:opacity-40 transition-opacity">
                <LayoutDashboard className="w-full h-full p-12 text-primary" />
              </div>
            </div>

            {/* Feature 2 - Small */}
            <div className="md:col-span-4 group overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-10 hover:border-primary/50 transition-all duration-500">
              <div className="w-14 h-14 bg-violet-500/10 text-violet-500 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Mobile First</h3>
              <p className="text-white/60 leading-relaxed">
                Empower your staff with mobile tools that actually work. 
                Housekeeping and maintenance at their fingertips.
              </p>
            </div>

            {/* Feature 3 - Small */}
            <div className="md:col-span-4 group overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-10 hover:border-primary/50 transition-all duration-500">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Unified Stack</h3>
              <p className="text-white/60 leading-relaxed">
                PMS, POS, and CRM in one single source of truth. 
                Eliminate data silos forever.
              </p>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-12 hover:border-primary/50 transition-all duration-500">
              <div className="relative z-10 max-w-md">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-8">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Revenue Intelligence</h3>
                <p className="text-white/60 text-lg leading-relaxed">
                  Our AI analyzes market trends and guest behavior to optimize 
                  your pricing dynamically, maximizing your RevPAR automatically.
                </p>
              </div>
              <div className="absolute bottom-[-20%] right-[-10%] w-1/2 h-1/2 bg-green-500/20 blur-[100px] rounded-full group-hover:bg-green-500/30 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Immersive Style */}
      <section id="testimonials" className="py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 text-primary/20">
                <Quote className="w-40 h-40" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-12">
                  The Impact <br />
                  <span className="text-primary">Speaks.</span>
                </h2>
                <div className="space-y-12">
                  <div className="border-l-4 border-primary pl-8">
                    <p className="text-2xl font-serif italic mb-6 leading-relaxed">
                      "OmniStay didn't just replace our software; it transformed our culture. 
                      Our staff is more engaged, and our guests feel the difference in every interaction."
                    </p>
                    <div>
                      <p className="font-bold text-lg">Marcus Aurelius</p>
                      <p className="text-white/40 uppercase tracking-widest text-xs font-bold">General Manager, The Grand Imperial</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-4xl font-bold mb-2 text-primary">+24%</p>
                  <p className="text-sm text-white/60">Direct Bookings Increase</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-4xl font-bold mb-2 text-primary">-40%</p>
                  <p className="text-sm text-white/60">Operational Overhead</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-4xl font-bold mb-2 text-primary">15min</p>
                  <p className="text-sm text-white/60">Avg. Response Time Reduction</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-4xl font-bold mb-2 text-primary">9.8/10</p>
                  <p className="text-sm text-white/60">Avg. Guest Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Clean Utility Style */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">
              Simple <span className="text-primary">Pricing.</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Transparent plans that scale with your property. No hidden fees, ever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Boutique",
                price: "299",
                desc: "Perfect for independent hotels and guest houses.",
                features: ["Up to 50 Rooms", "Core PMS & POS", "Mobile Staff App", "Email Support"]
              },
              {
                name: "Premium",
                price: "599",
                desc: "Advanced tools for growing full-service hotels.",
                features: ["Up to 200 Rooms", "Revenue Intelligence AI", "Housekeeping & Maintenance", "24/7 Priority Support"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "Bespoke solutions for hotel groups and resorts.",
                features: ["Unlimited Rooms", "Multi-property Management", "Custom API Access", "Dedicated Account Manager"]
              }
            ].map((plan, i) => (
              <div 
                key={i}
                className={cn(
                  "p-10 rounded-[40px] border transition-all duration-500 flex flex-col",
                  plan.popular 
                    ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 scale-105 z-10" 
                    : "bg-white/5 border-white/10 hover:border-white/30"
                )}
              >
                {plan.popular && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-6 w-fit uppercase tracking-widest">
                    <Star className="w-3 h-3 fill-current" />
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 uppercase tracking-tighter">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-black tracking-tighter">
                    {plan.price === "Custom" ? "" : "$"}{plan.price}
                  </span>
                  {plan.price !== "Custom" && <span className="text-sm opacity-60">/month</span>}
                </div>
                <p className={cn("text-sm mb-8 leading-relaxed", plan.popular ? "opacity-90" : "text-white/60")}>
                  {plan.desc}
                </p>
                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <CheckCircle2 className={cn("w-5 h-5", plan.popular ? "text-white" : "text-primary")} />
                      <span className="text-sm font-medium">{f}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={onGetStarted}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold transition-all active:scale-95",
                    plan.popular 
                      ? "bg-white text-primary hover:bg-white/90" 
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary -z-10" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-white/10 blur-[150px] rounded-full" />
        
        <div className="max-w-5xl mx-auto px-6 text-center text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter mb-12 leading-[0.85]">
              Ready to <br />
              <span className="text-white">Lead</span> the <br />
              Market?
            </h2>
            <p className="text-2xl opacity-90 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
              Join the elite circle of hotels redefining hospitality with OmniStay. 
              Setup takes less than 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-12 py-6 bg-white text-primary rounded-3xl font-black text-2xl hover:bg-white/90 transition-all shadow-2xl active:scale-95"
              >
                {isLoggedIn ? "Back to Dashboard" : "Start Your Journey"}
              </button>
              <button className="flex items-center gap-2 font-bold text-lg hover:gap-4 transition-all">
                Talk to an Expert <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center">
                  <Hotel className="w-6 h-6" />
                </div>
                <span className="font-brand text-2xl tracking-tight">TravelBook HOS</span>
              </div>
              <p className="text-white/40 max-w-sm leading-relaxed mb-8">
                The intelligent operating system for modern hospitality. 
                Built with passion for the world's most beautiful properties.
              </p>
              <div className="flex gap-4">
                {["Twitter", "Instagram", "LinkedIn"].map(social => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-white/40">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">PMS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">POS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Revenue AI</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-white/40">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 text-xs font-bold uppercase tracking-[0.2em] text-white/20">
            <p>© 2026 TravelBook HOS Technologies. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <MousePointer2 className="w-3 h-3" />
              <span>Designed for Excellence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
