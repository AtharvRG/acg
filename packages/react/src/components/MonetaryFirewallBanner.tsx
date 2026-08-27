import { useAgenticSession } from "../context/AgenticContext";
import { ShieldCheck, ShieldAlert, Activity } from "lucide-react";
import { cn } from "../utils/cn";

export function MonetaryFirewallBanner() {
  const { session } = useAgenticSession();
  
  if (!session) return null;

  const budgetRupees = session.maxTotalBudgetPaise / 100;
  const spentRupees = session.totalSpentPaise / 100;
  const utilization = Math.min((spentRupees / budgetRupees) * 100, 100);
  
  const isBreached = session.status === "THROTTLED" || session.status === "EXHAUSTED";

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border p-6 backdrop-blur-md transition-colors duration-500",
      isBreached 
        ? "border-red-500/50 bg-red-950/20" 
        : "border-emerald-500/30 bg-zinc-900/50"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isBreached ? (
            <ShieldAlert className="h-6 w-6 text-red-400 animate-pulse" />
          ) : (
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">Agentic Firewall Active</h3>
            <p className="text-sm text-zinc-400">Monitoring {session.agentId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-zinc-800">
          <Activity className="h-4 w-4 text-brand" />
          <span className="text-xs font-mono text-zinc-300">VELOCITY: OK</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-mono">
          <span className="text-zinc-400">SESSION SPEND</span>
          <span className={isBreached ? "text-red-400" : "text-white"}>
            ₹{spentRupees.toFixed(2)} / ₹{budgetRupees.toFixed(2)}
          </span>
        </div>
        
        {/* Glassmorphic Progress Bar */}
        <div className="h-3 w-full rounded-full bg-black/60 overflow-hidden border border-zinc-800">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              isBreached ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-brand shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            )}
            style={{ width: `${utilization}%` }}
          />
        </div>
      </div>
    </div>
  );
}