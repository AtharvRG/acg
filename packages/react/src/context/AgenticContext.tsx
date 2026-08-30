import { createContext, useContext, useState, ReactNode } from "react";
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
  simulateSpend: (amountPaise: number) => void;
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

  const simulateSpend = (amountPaise: number) => {
    // Read the current state directly instead of using functional updates for evaluation
    // This prevents React Strict Mode from firing addLog twice
    if (session.remainingAllowancePaise < amountPaise) {
      addLog("GATE_EVALUATION_FAIL", `Budget breach attempted. Blocked ₹${(amountPaise/100).toFixed(2)}. Escalating to HITL.`);
      setSession(prev => ({ ...prev, status: "THROTTLED" }));
    } else {
      addLog("PAYMENT_SETTLED", `Autonomous execution verified. Debited ₹${(amountPaise/100).toFixed(2)}.`);
      setSession(prev => ({
        ...prev,
        totalSpentPaise: prev.totalSpentPaise + amountPaise,
        remainingAllowancePaise: prev.remainingAllowancePaise - amountPaise
      }));
    }
  };

  const approveOverdraft = async (additionalBudgetPaise: number) => {
    addLog("HITL_PENDING", "Merchant reviewing overdraft request via Razorpay UI...");
    
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    addLog("HITL_APPROVED", `Mandate expanded by ₹${(additionalBudgetPaise/100).toFixed(2)}. Resuming autonomous execution.`);
    setSession(prev => ({
      ...prev,
      status: "ACTIVE",
      maxTotalBudgetPaise: prev.maxTotalBudgetPaise + additionalBudgetPaise,
      remainingAllowancePaise: prev.remainingAllowancePaise + additionalBudgetPaise
    }));
  };

  return (
    <AgenticContext value={{ session, logs, setSession, simulateSpend, approveOverdraft }}>
      {children}
    </AgenticContext>
  );
}

export function useAgenticSession() {
  const context = useContext(AgenticContext);
  if (!context) throw new Error("useAgenticSession must be used within an AgenticProvider");
  return context;
}