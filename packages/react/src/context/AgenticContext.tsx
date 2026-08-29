import { createContext, useContext, useState, ReactNode } from "react";
import { SessionPolicy } from "@acg/core";

interface AgenticState {
  session: SessionPolicy | null;
  setSession: (session: SessionPolicy) => void;
  simulateSpend: (amountPaise: number) => void;
  approveOverdraft: (additionalBudgetPaise: number) => Promise<void>;
}

const AgenticContext = createContext<AgenticState | undefined>(undefined);

export function AgenticProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionPolicy>({
    sessionId: "demo_session_1",
    merchantId: "merch_1",
    agentId: "Claude 3.5 Sonnet",
    maxTotalBudgetPaise: 500000, // ₹5,000
    maxPerTransactionPaise: 200000,
    totalSpentPaise: 150000, 
    remainingAllowancePaise: 350000,
    maxVelocityPerMinute: 10,
    status: "ACTIVE",
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000
  });

  const simulateSpend = (amountPaise: number) => {
    setSession(prev => {
      if (prev.remainingAllowancePaise < amountPaise) {
        return { ...prev, status: "THROTTLED" }; // Triggers the Drawer
      }
      return {
        ...prev,
        totalSpentPaise: prev.totalSpentPaise + amountPaise,
        remainingAllowancePaise: prev.remainingAllowancePaise - amountPaise
      };
    });
  };

  // Simulates the human hitting "Authorize" and Razorpay processing the mandate addition
  const approveOverdraft = async (additionalBudgetPaise: number) => {
    // Artificial network delay to simulate Razorpay API
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    setSession(prev => ({
      ...prev,
      status: "ACTIVE",
      maxTotalBudgetPaise: prev.maxTotalBudgetPaise + additionalBudgetPaise,
      remainingAllowancePaise: prev.remainingAllowancePaise + additionalBudgetPaise
    }));
  };

  return (
    <AgenticContext value={{ session, setSession, simulateSpend, approveOverdraft }}>
      {children}
    </AgenticContext>
  );
}

export function useAgenticSession() {
  const context = useContext(AgenticContext);
  if (!context) throw new Error("useAgenticSession must be used within an AgenticProvider");
  return context;
}