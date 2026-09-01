import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SessionPolicy } from "@acg/core";
export interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  hash: string;
}

interface AgenticState {
  session: SessionPolicy | null;
  logs: AuditLog[];
  setSession: (session: SessionPolicy) => void;
  updateBudget: (newBudgetPaise: number) => Promise<void>;
  approveOverdraft: (additionalBudgetPaise: number) => Promise<void>;
}

const AgenticContext = createContext<AgenticState | undefined>(undefined);

// Generate random hash, but keep a counter for guaranteed unique keys
let logCounter = 1;
const generateHash = () => Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');

// Static initial data prevents Next.js SSR Hydration errors
const STATIC_INITIAL_TIME = 1724300000000; 

export function AgenticProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<AuditLog[]>([{
    id: "evt_init_0",
    timestamp: STATIC_INITIAL_TIME,
    action: "SESSION_INITIALIZED",
    details: "Agent Claude 3.5 Sonnet connected. Budget: ₹5000.00",
    hash: "bdfe6899347902429ada9426d4b050f6" // Static hash for SSR
  }]);

  const [session, setSession] = useState<SessionPolicy>({
    sessionId: "demo_session_1",
    merchantId: "merch_1",
    agentId: "Claude 3.5 Sonnet",
    maxTotalBudgetPaise: 500000, 
    maxPerTransactionPaise: 200000,
    totalSpentPaise: 150000, 
    remainingAllowancePaise: 350000,
    maxVelocityPerMinute: 10,
    status: "ACTIVE",
    createdAt: STATIC_INITIAL_TIME,
    expiresAt: STATIC_INITIAL_TIME + 86400000
  });

useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/sync", { cache: "no-store" });
        const data = await res.json();
        
        if (data.session) setSession(data.session);
        if (data.logs && data.logs.length > 0) {
          // Sync UI logs strictly with the Server's authoritative array
          setLogs(data.logs);
        }
      } catch (err) {
        // Silently fail if server is busy
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Appends to the end of the array (Top-to-Bottom flow)
  const addLog = (action: string, details: string) => {
    setLogs(prev => [...prev, {
      id: `evt_${Date.now()}_${logCounter++}`,
      timestamp: Date.now(),
      action,
      details,
      hash: generateHash()
    }]);
  };

  const updateBudget = async (newBudgetPaise: number) => {
    try {
      await fetch("http://localhost:3002/update-budget", {
        method: "POST", body: JSON.stringify({ newBudgetPaise })
      });
    } catch (e) { console.error("Backend unreachable"); }
  };

  const approveOverdraft = async (additionalBudgetPaise: number) => {
    try {
      // Tell the backend kernel to physically unlock the session
      await fetch("http://localhost:3002/approve-hitl", {
        method: "POST",
        body: JSON.stringify({ additionalBudgetPaise })
      });
      // We don't need to manually update React state here, 
      // because our 1-second polling loop will instantly catch the new "ACTIVE" state from the backend!
    } catch (e) {
      console.error("Backend unreachable");
    }
  };

  return (
    <AgenticContext value={{ session, logs, setSession, updateBudget, approveOverdraft }}>
      {children}
    </AgenticContext>
  );
}

export function useAgenticSession() {
  const context = useContext(AgenticContext);
  if (!context) throw new Error("useAgenticSession must be used within an AgenticProvider");
  return context;
}