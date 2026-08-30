import { useState } from "react";
import { useAgenticSession } from "../context/AgenticContext";
import { Lock, Fingerprint, CheckCircle2, ShieldAlert, Minimize2 } from "lucide-react";
import { cn } from "../utils/cn";

export function AgentCheckoutDrawer() {
  const { session, approveOverdraft } = useAgenticSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  if (!session) return null;

  const isOpen = session.status === "THROTTLED" && !isHidden;
  const additionalBudget = 5000; 

  const handleAuthorize = async () => {
    setIsProcessing(true);
    await approveOverdraft(additionalBudget * 100);
    setIsProcessing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000); 
  };

  return (
    <>
      {/* Background Dimmer Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 z-40",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )} 
      />

      {/* The Actual Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-semibold text-white tracking-wide">Manual Authorization</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHidden(true)}
              className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
              title="Hide drawer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-mono rounded border border-red-500/20 flex items-center gap-1 shadow-sm">
              <ShieldAlert className="w-3 h-3" />
              BUDGET BREACH
            </span>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex flex-col">
          <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
            Agent <strong className="text-white">{session.agentId}</strong> attempted a transaction that exceeds its pre-authorized mandate limit. 
            Please review and authorize an extension to continue autonomous execution.
          </p>

          <div className="bg-black rounded-lg border border-zinc-800 p-5 space-y-4 mb-8 shadow-inner">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Requested Top-Up</span>
              <span className="text-white font-mono text-base">₹{additionalBudget.toFixed(2)}</span>
            </div>
            <div className="h-px w-full bg-zinc-800/50" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">New Mandate Ceiling</span>
              <span className="text-emerald-400 font-mono text-base">
                ₹{((session.maxTotalBudgetPaise / 100) + additionalBudget).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleAuthorize}
              disabled={isProcessing || success}
              className={cn(
                "w-full py-4 rounded-lg flex items-center justify-center gap-3 font-semibold transition-all duration-300",
                success 
                  ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                  : isProcessing
                  ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                  : "bg-white text-black hover:bg-zinc-200 active:scale-[0.98]"
              )}
            >
              {success ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Mandate Expanded
                </>
              ) : isProcessing ? (
                <span className="animate-pulse">Processing via Razorpay...</span>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" /> Authorize ₹{additionalBudget.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating restore button - appears when drawer is hidden */}
      {session.status === "THROTTLED" && isHidden && (
        <button
          onClick={() => setIsHidden(false)}
          className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg shadow-lg transition-all duration-300 hover:shadow-red-500/20 flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="text-sm font-medium">Restore Budget Alert</span>
        </button>
      )}
    </>
  );
}