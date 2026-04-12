import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Send, 
  ChevronDown, 
  FileText, 
  BarChart3, 
  Layout, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Loader2,
  Paperclip,
  Zap,
  MessageSquare,
  Briefcase,
  Layers,
  Info,
  User,
  TrendingUp,
  Search,
  Activity,
  Database,
  Globe,
  Calendar,
  Mail,
  ShieldCheck,
  Link2
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MagicGeneratingEffect } from "../components/MagicGeneratingEffect";
import { ReservationForm, ReservationData } from "../components/ReservationForm";
import { ReservationTable } from "../components/ReservationTable";
import { useBookings } from "../context/BookingContext";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  subtitle?: string;
  time?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  uiComponent?: {
    type: "reservation_form" | "reservation_table" | "none";
    status: "generating" | "ready";
    data?: any;
  };
}

interface Artifact {
  id: string;
  title: string;
  type: "spreadsheet" | "document" | "chart" | "code";
}

interface ProgressStep {
  id: string;
  label: string;
  status: "pending" | "working" | "completed";
}

export const NewFeature: React.FC = () => {
  const { addBooking } = useBookings();
  const [mode, setMode] = useState<"chat" | "cowork">("cowork");
  const [input, setInput] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Monthly Occupancy Forecast", status: "in-progress", subtitle: "Analyzing seasonal trends..." },
    { id: "2", title: "Guest Feedback Sentiment", status: "done", subtitle: "Processed 500+ reviews" },
    { id: "3", title: "Revenue Leakage Audit", status: "done", subtitle: "Identified $2.4k in discrepancies" },
    { id: "4", title: "Staff Shift Optimization", status: "in-progress", subtitle: "Balancing peak hours..." },
  ]);

  const [artifacts, setArtifacts] = useState<Artifact[]>([
    { id: "a1", title: "Q1 Revenue Report", type: "spreadsheet" },
    { id: "a2", title: "Housekeeping SOP v2", type: "document" },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const simulateWork = async (taskTitle: string, dynamicSteps: string[], dynamicArtifacts: {title: string, type: string}[], messageId?: string, uiComponentType?: string) => {
    const steps: ProgressStep[] = dynamicSteps.map((label, index) => ({
      id: `s${index}`,
      label,
      status: index === 0 ? "working" : "pending"
    }));
    setProgressSteps(steps);

    for (let i = 0; i < steps.length; i++) {
      // Simulate work for each step
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
      
      setProgressSteps(prev => prev.map(s => {
        if (s.id === `s${i}`) return { ...s, status: "completed" };
        if (s.id === `s${i + 1}`) return { ...s, status: "working" };
        return s;
      }));
    }

    // Add Artifacts
    const newArtifacts: Artifact[] = dynamicArtifacts.map(art => ({
      id: Math.random().toString(),
      title: art.title,
      type: art.type as any
    }));
    setArtifacts(prev => [...newArtifacts, ...prev]);

    // Update UI Component status if present
    if (messageId && uiComponentType && uiComponentType !== "none") {
      setMessages(prev => prev.map(m => 
        m.id === messageId && m.uiComponent 
          ? { ...m, uiComponent: { ...m.uiComponent, status: "ready" } } 
          : m
      ));
    }

    // Complete Task
    setTasks(prev => prev.map(t => t.title === taskTitle ? { ...t, status: "done", subtitle: "Analysis complete" } : t));
  };

  const handleStart = async (overrideInput?: string | React.MouseEvent | React.KeyboardEvent) => {
    const textToProcess = typeof overrideInput === 'string' ? overrideInput : input;
    if (!textToProcess.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: textToProcess };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = textToProcess;
    if (typeof overrideInput !== 'string') {
      setInput("");
    }
    setIsWorking(true);

    // Add task immediately
    const newTask: Task = {
      id: Math.random().toString(),
      title: currentInput.length > 30 ? currentInput.substring(0, 30) + "..." : currentInput,
      status: "in-progress",
      subtitle: "AI is initiating coworker workflow..."
    };
    setTasks(prev => [newTask, ...prev]);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: currentInput,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: "Your conversational response to the user, acknowledging the task and explaining your plan. Use markdown formatting."
              },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 3-5 specific, actionable steps you will take to complete this task. Make them sound like real system operations (e.g., 'Querying Omnistay PMS for Q3 data')."
              },
              artifacts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["spreadsheet", "document", "chart", "code"] }
                  }
                },
                description: "A list of 1-3 artifacts (files, reports, charts) you will produce as a result of this task."
              },
              uiComponent: {
                type: Type.STRING,
                description: "If the user asks to create a reservation, return 'reservation_form'. If the user confirms a reservation or asks to see the reservation table, return 'reservation_table'. Otherwise return 'none'.",
                enum: ["reservation_form", "reservation_table", "none"]
              },
              uiData: {
                type: Type.OBJECT,
                description: "If returning a 'reservation_table', optionally provide the data for it.",
                properties: {
                  name: { type: Type.STRING },
                  checkIn: { type: Type.STRING },
                  checkOut: { type: Type.STRING },
                  roomType: { type: Type.STRING }
                }
              }
            },
            required: ["reply", "steps", "artifacts"]
          },
          systemInstruction: `You are the Omnistay AI Coworker, a specialized assistant for hotel management. 
          Your goal is to help hotel staff (Sarah Chen) with complex operational tasks.
          You have full administrative visibility across all departmental modules (Front Desk, Housekeeping, Revenue, etc.) and external connectors (Outlook, Gmail).
          When a user gives you a task:
          1. Acknowledge the task in the context of hotel operations.
          2. Explain the specific steps you are taking to help.
          3. Be professional, efficient, and proactive.
          4. Output a structured JSON response containing your reply, the steps you will simulate, the artifacts you will generate.
          5. If a reservation is requested, specify 'reservation_form' in uiComponent.
          6. If the user confirms a reservation, specify 'reservation_table' in uiComponent and populate uiData with the reservation details.`
        }
      });

      const data = JSON.parse(response.text || "{}");
      const messageId = (Date.now() + 1).toString();

      const assistantMessage: Message = { 
        id: messageId, 
        role: "assistant", 
        content: data.reply || "I've started the analysis. You can track my progress in the sidebar.",
        uiComponent: data.uiComponent && data.uiComponent !== "none" ? {
          type: data.uiComponent,
          status: "generating",
          data: data.uiData
        } : undefined
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Start simulation with dynamic data
      simulateWork(newTask.title, data.steps || ["Processing request..."], data.artifacts || [], messageId, data.uiComponent);

    } catch (error) {
      console.error("AI Error:", error);
      setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: "done", subtitle: "Failed to process" } : t));
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1A1A1A] flex font-sans overflow-hidden">
      {/* Left Sidebar - Tasks */}
      <aside className="w-72 border-r border-gray-200 bg-white flex flex-col h-screen">
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span>Claude</span>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-md">
            <Layout className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1 mb-6">
            <button 
              onClick={() => setMode("chat")}
              className={cn(
                "flex-1 py-1.5 text-sm font-medium rounded-lg transition-all",
                mode === "chat" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Chat
            </button>
            <button 
              onClick={() => setMode("cowork")}
              className={cn(
                "flex-1 py-1.5 text-sm font-medium rounded-lg transition-all",
                mode === "cowork" ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Cowork
            </button>
          </div>

          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-200 mb-6 transition-colors">
            <Plus className="w-4 h-4" />
            New task
          </button>

          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
            {tasks.map((task) => (
              <div key={task.id} className="group p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all relative">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {task.status === "done" ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    ) : task.status === "in-progress" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "text-sm font-medium truncate",
                      task.status === "done" ? "text-gray-500" : "text-gray-900"
                    )}>
                      {task.title}
                    </h4>
                    {task.subtitle && (
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate leading-tight">
                        {task.subtitle}
                      </p>
                    )}
                    {task.time && (
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {task.time}
                      </p>
                    )}
                  </div>
                  {task.status === "in-progress" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              SC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Sarah Chen</p>
              <p className="text-xs text-gray-500 truncate">Acme, Co.</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-white">
        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full z-10">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-8 w-full"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
                    <Zap className="w-10 h-10 fill-current" />
                  </div>
                </div>
                <h2 className="text-4xl font-serif font-medium text-gray-900 tracking-tight">
                  Let's knock something off your list
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  {[
                    { icon: FileText, label: "Create a file" },
                    { icon: BarChart3, label: "Crunch data" },
                    { icon: Layout, label: "Make a prototype" },
                    { icon: Clock, label: "Prep for the day" },
                    { icon: Briefcase, label: "Organize files" },
                    { icon: MessageSquare, label: "Send a message" },
                  ].map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setInput(item.label);
                        // We use setTimeout to allow the state to update before triggering handleStart
                        setTimeout(() => handleStart(item.label), 50);
                      }}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-orange-200 hover:bg-orange-50/30 transition-all group text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <item.icon className="w-4 h-4 text-gray-500 group-hover:text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="w-full flex-1 overflow-y-auto py-8 space-y-8 custom-scrollbar">
                {/* 
                  HANDOVER NOTE FOR CLAUDE AI:
                  This section renders the chat messages and dynamic UI components.
                  - The `uiComponent` property in the message object determines which custom UI to render.
                  - Currently supported: "reservation_form" and "reservation_table".
                  - To add new capabilities, update the Gemini system prompt to return new `uiComponent` types,
                    and add the corresponding rendering logic here.
                  - The `addBooking` function from `BookingContext` is used to write real data to Firestore.
                */}
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex gap-4 max-w-[85%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                    )}>
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />}
                    </div>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                    )}>
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                      {msg.uiComponent && (
                        <div className="mt-4">
                          {msg.uiComponent.status === "generating" ? (
                            <MagicGeneratingEffect />
                          ) : msg.uiComponent.type === "reservation_form" ? (
                            <ReservationForm onConfirm={async (data) => {
                              await addBooking({
                                guestName: data.name,
                                roomNumber: data.roomType,
                                checkIn: data.checkIn,
                                checkOut: data.checkOut,
                                status: "Confirmed",
                                amount: 1500 // Mock amount
                              });
                              handleStart(`Reservation confirmed for ${data.name}. Check-in: ${data.checkIn}, Check-out: ${data.checkOut}, Room: ${data.roomType}. Please finalize the entry and show the reservation table.`);
                            }} />
                          ) : msg.uiComponent.type === "reservation_table" ? (
                            <ReservationTable data={msg.uiComponent.data} />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isWorking && (
                  <div className="flex gap-4 mr-auto max-w-[85%]">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-100 text-gray-500 text-sm animate-pulse">
                      AI is thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-6 max-w-4xl mx-auto w-full z-20">
          <div className="relative bg-white border border-gray-200 rounded-3xl shadow-xl focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-50 transition-all p-2">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleStart();
                }
              }}
              placeholder="Type a task here or use / for more tools"
              className="w-full bg-transparent border-none focus:ring-0 p-4 text-gray-800 placeholder-gray-400 resize-none min-h-[60px] max-h-[200px]"
              rows={1}
            />
            <div className="flex items-center justify-between p-2 border-t border-gray-100">
              <div className="flex gap-1">
                <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={() => handleStart()}
                disabled={!input.trim() || isWorking}
                className="px-6 py-2 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center gap-2"
              >
                Start
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Progress & Context */}
      <aside className="w-80 border-l border-gray-200 bg-white p-4 space-y-4 overflow-y-auto h-screen custom-scrollbar">
        {/* Progress Panel */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-3 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <TrendingUp className="w-4 h-4" />
              Progress
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-4 space-y-4">
            <div className="flex gap-2">
              {progressSteps.length > 0 ? (
                <div className="space-y-3 w-full">
                  {progressSteps.map(step => (
                    <div key={step.id} className="flex items-center gap-3">
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      ) : step.status === "working" ? (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-200" />
                      )}
                      <span className={cn(
                        "text-xs",
                        step.status === "pending" ? "text-gray-400" : "text-gray-700 font-medium"
                      )}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                </>
              )}
            </div>
            {progressSteps.length === 0 && (
              <p className="text-xs text-gray-500 leading-relaxed">
                Steps will show as the task unfolds.
              </p>
            )}
          </div>
        </div>

        {/* Artifacts Panel */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-3 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Layers className="w-4 h-4" />
              Artifacts
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-4 space-y-3">
            {artifacts.map(art => (
              <div key={art.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  {art.type === "spreadsheet" ? <BarChart3 className="w-4 h-4 text-gray-500 group-hover:text-blue-600" /> : <FileText className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />}
                </div>
                <span className="text-xs font-medium text-gray-700 truncate">{art.title}</span>
              </div>
            ))}
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold pt-2">
              Outputs created during the task land here.
            </p>
          </div>
        </div>

        {/* Context Panel */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-3 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Info className="w-4 h-4" />
              Context
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-4 space-y-6">
            {/* Admin Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Admin Access
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-1 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-medium text-indigo-700">
                  All Modules Connected
                </div>
              </div>
            </div>

            {/* Core Systems */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Core Systems
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 border border-blue-100 rounded text-[10px] font-medium text-blue-700">
                  <Database className="w-3 h-3" />
                  Omnistay PMS
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-orange-50 border border-orange-100 rounded text-[10px] font-medium text-orange-700">
                  <Activity className="w-3 h-3" />
                  Data Engine
                </div>
              </div>
            </div>

            {/* Connectors */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Link2 className="w-3 h-3" />
                Active Connectors
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-2 py-1 bg-green-50 border border-green-100 rounded text-[10px] font-medium text-green-700">
                  <Calendar className="w-3 h-3" />
                  Outlook Calendar
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-red-50 border border-red-100 rounded text-[10px] font-medium text-red-700">
                  <Mail className="w-3 h-3" />
                  Gmail
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-purple-50 border border-purple-100 rounded text-[10px] font-medium text-purple-700">
                  <Globe className="w-3 h-3" />
                  Web Search
                </div>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed italic">
              Claude has full administrative visibility across all departmental modules and external connectors.
            </p>
          </div>
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
        @font-face {
          font-family: 'BrandSerif';
          src: url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;500;600&display=swap');
        }
      `}} />
    </div>
  );
};
