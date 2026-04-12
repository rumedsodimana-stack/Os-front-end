import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";
import { 
  ArrowRight, 
  Hotel,
  LayoutDashboard,
  Smartphone,
  CreditCard,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Play
} from "lucide-react";
import { cn } from "../lib/utils";

interface LandingPageProps {
  onGetStarted: () => void;
  isLoggedIn?: boolean;
}

type ViewState = 'home' | 'ecosystem' | 'performance';

export function LandingPage({ onGetStarted, isLoggedIn }: LandingPageProps) {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [isMounted, setIsMounted] = useState(false);

  // Mouse tracking for Spotlight and 3D Tilt
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  
  const xPct = useMotionValue(0);
  const yPct = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const rotateX = useSpring(useTransform(yPct, [-0.5, 0.5], ["15deg", "-15deg"]), springConfig);
  const rotateY = useSpring(useTransform(xPct, [-0.5, 0.5], ["-15deg", "15deg"]), springConfig);

  const spotlightBackground = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.15), transparent 80%)`;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    
    xPct.set((clientX - left) / width - 0.5);
    yPct.set((clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    xPct.set(0);
    yPct.set(0);
  };

  if (!isMounted) return <div className="h-screen w-screen bg-black" />;

  return (
    <div 
      className="h-screen w-screen bg-[#050505] text-white overflow-hidden relative font-sans perspective-[2000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      
      {/* Mouse Spotlight */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ background: spotlightBackground }} />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">TravelBook OS</span>
        </div>
        <button 
          onClick={onGetStarted}
          className="pointer-events-auto px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-full text-sm font-bold transition-all duration-300"
        >
          {isLoggedIn ? "Dashboard" : "Sign In"}
        </button>
      </div>

      {/* 3D Interactive Container */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full flex items-center justify-center relative z-10"
      >
        <AnimatePresence mode="wait">
          
          {/* HOME VIEW */}
          {activeView === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Floating Background Element */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute w-[600px] h-[600px] border border-white/5 rounded-full border-dashed opacity-50"
                style={{ transform: "translateZ(-100px)" }}
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[400px] h-[400px] border border-indigo-500/20 rounded-full opacity-50"
                style={{ transform: "translateZ(-50px)" }}
              />

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-md"
                style={{ transform: "translateZ(20px)" }}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Zero Scroll Experience</span>
              </motion.div>

              <h1 
                className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-[0.85] uppercase mb-6"
                style={{ transform: "translateZ(60px)" }}
              >
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80">Hospitality</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Reimagined.</span>
              </h1>

              <p 
                className="text-lg md:text-2xl text-zinc-400 max-w-2xl font-medium leading-relaxed mb-12"
                style={{ transform: "translateZ(40px)" }}
              >
                A unified operating system combining PMS, POS, and Revenue AI into one beautiful, impossibly fast interface.
              </p>

              <motion.button 
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center gap-3 overflow-hidden"
                style={{ transform: "translateZ(80px)" }}
              >
                <span className="relative z-10">Initialize System</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </motion.button>
            </motion.div>
          )}

          {/* ECOSYSTEM VIEW */}
          {activeView === 'ecosystem' && (
            <motion.div 
              key="ecosystem"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-6xl px-6 grid md:grid-cols-3 gap-6"
              style={{ transformStyle: "preserve-3d" }}
            >
              {[
                { icon: LayoutDashboard, title: "Core PMS", desc: "Lightning-fast property management.", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", z: 40 },
                { icon: CreditCard, title: "Smart POS", desc: "Unified F&B and retail billing.", color: "from-violet-500/20 to-fuchsia-500/20", border: "border-violet-500/30", z: 80 },
                { icon: Smartphone, title: "Guest App", desc: "Mobile keys and instant service.", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", z: 40 }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                  className={cn("p-8 rounded-3xl bg-gradient-to-br backdrop-blur-xl border flex flex-col items-center text-center", item.color, item.border)}
                  style={{ transform: `translateZ(${item.z}px)` }}
                >
                  <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-2xl">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* PERFORMANCE VIEW */}
          {activeView === 'performance' && (
            <motion.div 
              key="performance"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div 
                className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center mb-12"
                style={{ transform: "translateZ(60px)" }}
              >
                {/* Animated Rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 rounded-full"
                    style={{ 
                      borderColor: i === 0 ? 'rgba(99,102,241,0.5)' : i === 1 ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.1)',
                      borderStyle: i === 1 ? 'dashed' : 'solid',
                      padding: `${i * 20}px`
                    }}
                  />
                ))}
                <div className="text-center relative z-10">
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-200"
                  >
                    99.9<span className="text-4xl md:text-6xl">%</span>
                  </motion.p>
                  <p className="text-indigo-300 font-bold tracking-widest uppercase mt-2">System Uptime</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-8 md:gap-16" style={{ transform: "translateZ(30px)" }}>
                <div>
                  <p className="text-4xl font-bold text-white mb-1">&lt; 50ms</p>
                  <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">API Latency</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white mb-1">Zero</p>
                  <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Data Silos</p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      {/* Floating Dock Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 p-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
          {[
            { id: 'home', icon: Globe, label: 'Overview' },
            { id: 'ecosystem', icon: LayoutDashboard, label: 'Ecosystem' },
            { id: 'performance', icon: BarChart3, label: 'Performance' },
          ].map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewState)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300",
                  isActive ? "text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeDock"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" />
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    className="font-bold text-sm relative z-10 overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}


