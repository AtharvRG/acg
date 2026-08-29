import { useAgenticSession } from "../context/AgenticContext";
import { Terminal } from "lucide-react";
import { cn } from "../utils/cn";

export function AuditLedger() {
  const { logs } = useAgenticSession();

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Terminal className="w-4 h-4 text-zinc-500" />
        <h3 className="text-white font-medium text-sm tracking-wide">Append-Only Audit Ledger</h3>
      </div>
      
      <div className="flex-1 bg-black border border-zinc-800/80 rounded-xl p-4 overflow-y-auto font-mono text-[11px] sm:text-xs shadow-inner flex flex-col gap-3 relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {logs.map((log, index) => (
          <div 
            key={log.id} 
            className="flex flex-col gap-1 pb-3 border-b border-zinc-900/50 last:border-0 last:pb-0 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="flex items-center justify-between text-zinc-500">
              <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className="text-[10px]">idx_{logs.length - index - 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-bold",
                log.action.includes("FAIL") || log.action.includes("BREACH") ? "text-red-400" : 
                log.action.includes("APPROVED") || log.action.includes("SETTLED") ? "text-emerald-400" : 
                log.action.includes("PENDING") ? "text-amber-400" : "text-brand"
              )}>
                [{log.action}]
              </span>
              <span className="text-zinc-300">{log.details}</span>
            </div>
            <div className="text-zinc-700 truncate w-full" title={log.hash}>
              hash: {log.hash}
            </div>
          </div>
        ))}
        {/* Fading overlay at bottom to look like a terminal feed */}
        <div className="sticky bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </div>
  );
}