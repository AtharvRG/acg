import { createContext, useContext, useState, ReactNode } from "react";
import { SessionPolicy } from "@acg/core";

interface AgenticState {
  session: SessionPolicy | null;
  setSession: (session: SessionPolicy) => void;
  simulateSpend: (amountPaise: number) => void;
}

const AgenticContext = createContext<AgenticState | undefined>(undefined);

export function AgenticProvider({ children }: { children: ReactNode }) {
  // Initialize with a mock state for the UI development
  const [session, setSession] = useState<SessionPolicy>({
    sessionId: "demo_session_1",
    merchantId: "merch_1",
    agentId: "Claude 3.5 Sonnet",
    maxTotalBudgetPaise: 500000, // ₹5,000
    maxPerTransactionPaise: 200000,
    totalSpentPaise: 150000, // ₹1,500 already spent
    remainingAllowancePaise: 350000,
    maxVelocityPerMinute: 10,
    status: "ACTIVE",
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000
  });

  const simulateSpend = (amountPaise: number) => {
    setSession(prev => {
      if (prev.remainingAllowancePaise < amountPaise) {
        return { ...prev, status: "THROTTLED" }; // Triggers the HITL state
      }
      return {
        ...prev,
        totalSpentPaise: prev.totalSpentPaise + amountPaise,
        remainingAllowancePaise: prev.remainingAllowancePaise - amountPaise
      };
    });
  };

  return (
    <AgenticContext value={{ session, setSession, simulateSpend }}>
      {children}
    </AgenticContext>
  );
}

export function useAgenticSession() {
  const context = useContext(AgenticContext);
  if (!context) throw new Error("useAgenticSession must be used within an AgenticProvider");
  return context;
}