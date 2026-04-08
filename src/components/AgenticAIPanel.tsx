import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, ArrowRight, CheckCircle2, AlertTriangle, Send, Bot, User, Loader2, Settings2 } from "lucide-react";
import { cn } from "../lib/utils";
import { GoogleGenAI, Type } from "@google/genai";

interface AgenticAIPanelProps {
  department: string;
  onClose: () => void;
}

interface WorkflowStep {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "failed";
  error?: string;
}

interface WorkflowData {
  status: "running" | "completed" | "failed";
  steps: WorkflowStep[];
  finalMessage?: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  type?: "text" | "action" | "insight" | "workflow";
  actionStatus?: "pending" | "success" | "error";
  workflow?: WorkflowData;
}

function WorkflowVisualization({ workflow, onRetry }: { workflow: WorkflowData, onRetry?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (workflow.status === "completed" || workflow.status === "failed") {
    return (
      <div 
        className={cn(
          "bg-white/80 dark:bg-black/80 backdrop-blur-sm border rounded-xl p-4 shadow-sm space-y-3 w-full animate-in zoom-in-95 duration-300 cursor-pointer transition-colors hover:bg-white/90 dark:hover:bg-black/90",
          workflow.status === "completed" ? "border-emerald-200 dark:border-emerald-800/30" : "border-rose-200 dark:border-rose-800/30"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full shrink-0",
            workflow.status === "completed" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
          )}>
            {workflow.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold">
              {workflow.status === "completed" ? "Task Completed Successfully" : "Task Completed With Issues"}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {workflow.finalMessage}
            </p>
          </div>
          <div className="text-muted-foreground shrink-0 mt-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={cn("transition-transform duration-200", isExpanded ? "rotate-180" : "")}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2 flex justify-between items-center">
              <span>Execution Log</span>
              {workflow.status === "failed" && onRetry && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry();
                  }}
                  className="text-primary hover:text-primary/80 flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Retry Failed Step
                </button>
              )}
            </div>
            {workflow.steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 shrink-0">
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : step.status === "failed" ? (
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-muted-foreground mr-2">{index + 1}.</span>
                  <span className={step.status === "completed" ? "text-foreground" : "text-muted-foreground"}>
                    {step.title}
                  </span>
                  {step.error && (
                    <p className="text-xs text-rose-500 mt-1">{step.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Running state
  const activeStepIndex = workflow.steps.findIndex(s => s.status === "running" || s.status === "failed");
  const activeStep = activeStepIndex !== -1 ? workflow.steps[activeStepIndex] : workflow.steps.find(s => s.status === "pending");

  return (
    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-border rounded-xl p-4 shadow-sm space-y-4 w-full">
      {/* Timeline Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          <span>Workflow Progress</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden flex gap-0.5">
          {workflow.steps.map((step) => (
            <div 
              key={step.id}
              className={cn(
                "h-full flex-1 transition-colors duration-500",
                step.status === "completed" ? "bg-emerald-500" :
                step.status === "running" ? "bg-primary animate-pulse" :
                step.status === "failed" ? "bg-rose-500" :
                "bg-secondary-foreground/10"
              )}
            />
          ))}
        </div>
      </div>

      {/* Active Step */}
      {activeStep && (
        <div key={activeStep.id} className="bg-secondary/50 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
          {activeStep.status === "running" ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0 mt-0.5" />
          ) : activeStep.status === "failed" ? (
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">{activeStep.title}</p>
            {activeStep.error && (
              <p className="text-xs text-rose-500 mt-1">{activeStep.error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AgenticAIPanel({ department, onClose }: AgenticAIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      type: "text"
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({
        // WARNING: Hardcoded API key for testing purposes as explicitly requested. 
        // In production, always use environment variables (e.g., process.env.GEMINI_API_KEY) to prevent key theft.
        apiKey: "AIzaSyDJ4sf8T2STcANgSOyhQLkibjv_8LF6mi0",
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: currentInput,
        config: {
          systemInstruction: "You are a hotel management AI assistant. Break down the user's request into a sequence of logical subtasks for hotel operations. Keep it between 3 to 6 steps.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              steps: {
                type: Type.ARRAY,
                description: "The sequence of subtasks to complete the user's request",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING, description: "The description of the subtask" }
                  },
                  required: ["id", "title"]
                }
              },
              finalSuccessMsg: { type: Type.STRING, description: "Message to show when all tasks succeed" },
              finalFailMsg: { type: Type.STRING, description: "Message to show if a task fails" }
            },
            required: ["steps", "finalSuccessMsg", "finalFailMsg"]
          }
        }
      });

      const parsedResponse = JSON.parse(response.text || "{}");

      setIsTyping(false);
      
      const workflowId = (Date.now() + 1).toString();
      
      const steps: WorkflowStep[] = (parsedResponse.steps || []).map((s: any) => ({
        id: s.id,
        title: s.title,
        status: "pending"
      }));

      const finalSuccessMsg = parsedResponse.finalSuccessMsg || "Task completed successfully.";
      const finalFailMsg = parsedResponse.finalFailMsg || "Task failed.";

      const initialWorkflow: WorkflowData = {
        status: "running",
        steps
      };

      const aiMsg: Message = {
        id: workflowId,
        role: "ai",
        content: "I've initiated the workflow for your request. You can monitor the progress below.",
        type: "workflow",
        workflow: initialWorkflow
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      // Start execution engine simulation
      const executeStep = (stepIndex: number) => {
        // First, set the current step to running
        setMessages(prev => {
          const msgIndex = prev.findIndex(m => m.id === workflowId);
          if (msgIndex === -1) return prev;
          
          const msg = prev[msgIndex];
          if (!msg.workflow) return prev;

          // Check if we are done
          if (stepIndex >= msg.workflow.steps.length) {
            const hasFailed = msg.workflow.steps.some(s => s.status === "failed");
            const newMsg: Message = {
              ...msg,
              workflow: {
                ...msg.workflow,
                status: hasFailed ? "failed" : "completed",
                finalMessage: hasFailed ? finalFailMsg : finalSuccessMsg
              }
            };
            const newMessages = [...prev];
            newMessages[msgIndex] = newMsg;
            return newMessages;
          }

          const newSteps = [...msg.workflow.steps];
          if (newSteps[stepIndex] && newSteps[stepIndex].status === "pending") {
            newSteps[stepIndex] = { ...newSteps[stepIndex], status: "running" };
            const newMsg: Message = { ...msg, workflow: { ...msg.workflow, steps: newSteps } };
            const newMessages = [...prev];
            newMessages[msgIndex] = newMsg;
            return newMessages;
          }
          
          return prev;
        });

        // If we are done, no need to schedule completion
        if (stepIndex >= steps.length) return;

        // Schedule the completion of this step
        setTimeout(() => {
          setMessages(prev2 => {
            const msgIndex2 = prev2.findIndex(m => m.id === workflowId);
            if (msgIndex2 === -1) return prev2;
            const msg2 = prev2[msgIndex2];
            if (!msg2.workflow) return prev2;

            const newSteps2 = [...msg2.workflow.steps];
            if (!newSteps2[stepIndex]) return prev2;
            
            // Simulate failure condition based on input
            const shouldFail = (currentInput.toLowerCase().includes("fail") || currentInput.toLowerCase().includes("banquet")) && stepIndex === 2;
            
            newSteps2[stepIndex] = {
              ...newSteps2[stepIndex],
              status: shouldFail ? "failed" : "completed",
              error: shouldFail ? "AV equipment missing or malfunctioning." : undefined
            };
            
            const newMsg2: Message = { ...msg2, workflow: { ...msg2.workflow, steps: newSteps2 } };
            const newMessages2 = [...prev2];
            newMessages2[msgIndex2] = newMsg2;
            
            return newMessages2;
          });

          // Schedule next step
          setTimeout(() => {
            executeStep(stepIndex + 1);
          }, 800);
        }, 2000); // Time taken to execute step
      };

      executeStep(0);
    } catch (error: any) {
      console.error("Langchain error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "ai",
        content: `Sorry, I encountered an error while processing your request: ${error?.message || String(error)}`,
        type: "text"
      }]);
    }
  };

  const handleRetry = (workflowId: string) => {
    setMessages(prev => {
      const msgIndex = prev.findIndex(m => m.id === workflowId);
      if (msgIndex === -1) return prev;
      
      const msg = prev[msgIndex];
      if (!msg.workflow) return prev;

      // Find the first failed step
      const failedStepIndex = msg.workflow.steps.findIndex(s => s.status === "failed");
      if (failedStepIndex === -1) return prev;

      // Reset the failed step and any subsequent steps
      const newSteps = msg.workflow.steps.map((step, index) => {
        if (index >= failedStepIndex) {
          return { ...step, status: "pending" as const, error: undefined };
        }
        return step;
      });

      const newMsg: Message = {
        ...msg,
        workflow: {
          ...msg.workflow,
          status: "running",
          steps: newSteps
        }
      };

      const newMessages = [...prev];
      newMessages[msgIndex] = newMsg;
      
      // Restart execution from the failed step
      setTimeout(() => {
        let currentStepIndex = failedStepIndex;
        
        const runRetryStep = () => {
          setMessages(currentPrev => {
            const currentMsgIndex = currentPrev.findIndex(m => m.id === workflowId);
            if (currentMsgIndex === -1) return currentPrev;
            
            const currentMsg = currentPrev[currentMsgIndex];
            if (!currentMsg.workflow) return currentPrev;

            if (currentStepIndex >= currentMsg.workflow.steps.length) {
              const newCompletedMsg: Message = {
                ...currentMsg,
                workflow: {
                  ...currentMsg.workflow,
                  status: "completed",
                  finalMessage: "Task completed successfully after retry."
                }
              };
              const finalMessages = [...currentPrev];
              finalMessages[currentMsgIndex] = newCompletedMsg;
              return finalMessages;
            }

            const runningSteps = [...currentMsg.workflow.steps];
            if (runningSteps[currentStepIndex] && runningSteps[currentStepIndex].status === "pending") {
              runningSteps[currentStepIndex] = { ...runningSteps[currentStepIndex], status: "running" };
              const runningMsg: Message = { ...currentMsg, workflow: { ...currentMsg.workflow, steps: runningSteps } };
              const runningMessages = [...currentPrev];
              runningMessages[currentMsgIndex] = runningMsg;
              
              // Schedule completion
              setTimeout(() => {
                setMessages(completePrev => {
                  const compMsgIndex = completePrev.findIndex(m => m.id === workflowId);
                  if (compMsgIndex === -1) return completePrev;
                  const compMsg = completePrev[compMsgIndex];
                  if (!compMsg.workflow) return completePrev;

                  const compSteps = [...compMsg.workflow.steps];
                  if (!compSteps[currentStepIndex]) return completePrev;
                  
                  compSteps[currentStepIndex] = {
                    ...compSteps[currentStepIndex],
                    status: "completed"
                  };
                  
                  const compMsg2: Message = { ...compMsg, workflow: { ...compMsg.workflow, steps: compSteps } };
                  const compMessages = [...completePrev];
                  compMessages[compMsgIndex] = compMsg2;
                  
                  // Schedule next step
                  setTimeout(() => {
                    currentStepIndex++;
                    runRetryStep();
                  }, 800);
                  
                  return compMessages;
                });
              }, 2000);
              
              return runningMessages;
            }
            return currentPrev;
          });
        };
        
        runRetryStep();
      }, 500);

      return newMessages;
    });
  };

  return (
    <div className="w-[450px] bg-card border-l border-border h-full flex flex-col shadow-2xl z-30 animate-in slide-in-from-right duration-300 rounded-l-3xl overflow-hidden relative">
      
      {/* Background Gradient Mesh */}
      <div className="absolute bottom-0 left-0 right-0 h-3/4 opacity-60 pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-pink-300/40 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-300/40 blur-[80px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-300/40 blur-[80px]" />
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Agentic AI</h2>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Monitoring {department}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary/50">
            <Settings2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-2">
            <div className="flex flex-col items-center mb-12 mt-auto">
              <Sparkles className="w-8 h-8 text-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">Ask our AI anything</h3>
            </div>
            
            <div className="w-full mt-auto">
              <p className="text-xs font-medium text-purple-900/60 dark:text-purple-300/60 mb-3 ml-1">
                Suggestions on what to ask Our AI
              </p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setInput("Prepare Room 305 for VIP check-in"); handleSend(); }}
                  className="text-left px-4 py-3 bg-white/60 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-black/60 border border-white/40 dark:border-white/10 rounded-xl text-sm text-foreground transition-colors shadow-sm"
                >
                  Prepare Room 305 for VIP check-in
                </button>
                <button 
                  onClick={() => { setInput("Prepare banquet hall for wedding at 6 PM"); handleSend(); }}
                  className="text-left px-4 py-3 bg-white/60 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-black/60 border border-white/40 dark:border-white/10 rounded-xl text-sm text-foreground transition-colors shadow-sm"
                >
                  Prepare banquet hall for wedding at 6 PM
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-white/80 dark:bg-black/80 border border-border text-foreground shadow-sm"
                )}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={cn(
                  "max-w-[85%] space-y-2",
                  msg.role === "user" ? "items-end" : "items-start"
                )}>
                  {msg.type === "text" && (
                    <div className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm",
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                        : "bg-white/80 dark:bg-black/80 border border-border text-foreground rounded-tl-sm backdrop-blur-sm"
                    )}>
                      {msg.content}
                    </div>
                  )}

                  {msg.type === "workflow" && msg.workflow && (
                    <div className="space-y-2 w-full">
                      <div className="p-3 rounded-2xl text-sm shadow-sm bg-white/80 dark:bg-black/80 border border-border text-foreground rounded-tl-sm backdrop-blur-sm">
                        {msg.content}
                      </div>
                      <WorkflowVisualization workflow={msg.workflow} onRetry={() => handleRetry(msg.id)} />
                    </div>
                  )}

                  {msg.type === "insight" && (
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-border rounded-xl p-4 shadow-sm space-y-3 w-full">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full text-amber-600 dark:text-amber-400 shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">Action Required</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {department === "Front Desk" 
                              ? "Standard Kings are overbooked by 2 for tonight." 
                              : `AI has found 3 workflow optimizations for ${department}.`}
                          </p>
                        </div>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3 text-xs space-y-2">
                        <button className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                          Execute Recommendation <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {msg.type === "action" && (
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-border rounded-xl p-3 shadow-sm flex items-center gap-3">
                      {msg.actionStatus === "pending" ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : msg.actionStatus === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                      )}
                      <p className="text-xs font-medium">{msg.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white/80 dark:bg-black/80 border border-border text-foreground flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-border rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 relative z-10 pb-6">
        <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-border rounded-xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything about your projects"
            className="w-full bg-transparent border-none focus:outline-none px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

