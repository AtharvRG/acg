import { useEffect, useRef, useState } from "react";
import { useAgenticSession } from "../context/AgenticContext";
import { Terminal } from "lucide-react";
import { cn } from "../utils/cn";

export function AuditLedger() {
  const { logs } = useAgenticSession();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // If user scrolls up, disable auto-scroll. If they hit the bottom, re-enable.
    setIsAutoScroll(scrollHeight - scrollTop - clientHeight < 20);
  };

  // Auto-scroll to bottom on the main container
  useEffect(() => {
    if (isAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isAutoScroll]);

  if (!mounted) return null;

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex flex-col h-full w-full overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pr-2"
    >
      <div className="flex items-center gap-2 mb-4 px-1 shrink-0">
        <Terminal className="w-4 h-4 text-zinc-500" />
        <h3 className="text-white font-medium text-sm tracking-wide">Append-Only Audit Ledger</h3>
      </div>
      
      {/* The black terminal box now just grows naturally with its content */}
      <div className="flex-1 bg-black border border-zinc-800/80 rounded-xl p-4 font-mono text-[11px] sm:text-xs shadow-inner flex flex-col gap-3 h-max">
        {logs.map((log, index) => (
          <div 
            key={log.id} 
            className="flex flex-col gap-1 pb-3 border-b border-zinc-900/50 last:border-0 last:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="flex items-center justify-between text-zinc-500">
              <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className="text-[10px]">idx_{index}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-bold shrink-0",
                log.action.includes("FAIL") || log.action.includes("BREACH") ? "text-red-400" : 
                log.action.includes("APPROVED") || log.action.includes("SETTLED") ? "text-emerald-400" : 
                log.action.includes("PENDING") ? "text-amber-400" : "text-brand"
              )}>
                [{log.action}]
              </span>
              <span className="text-zinc-300 leading-relaxed">{log.details}</span>
            </div>
            <div className="text-zinc-700 truncate w-full" title={log.hash}>
              hash: {log.hash}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}