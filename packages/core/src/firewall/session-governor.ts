import { SessionPolicy } from "../types/schemas";

export class SessionGovernor {
  private activeSessions = new Map<string, SessionPolicy>();

  public registerSession(policy: SessionPolicy): void {
    this.activeSessions.set(policy.sessionId, { ...policy });
  }

  public getSession(sessionId: string): SessionPolicy | undefined {
    return this.activeSessions.get(sessionId);
  }

  public attemptDebit(sessionId: string, netAmountPaise: number): boolean {
    const session = this.activeSessions.get(sessionId);
    
    if (!session || session.status === "TERMINATED" || session.status === "EXHAUSTED") {
      return false;
    }

    let isBlocked = false;

    // Check 1: Does it exceed the Per-Transaction Ceiling?
    if (netAmountPaise > session.maxPerTransactionPaise) {
      isBlocked = true;
    }
    
    // Check 2: Does it exceed the Overall Remaining Budget?
    if (session.remainingAllowancePaise < netAmountPaise) {
      isBlocked = true;
    }

    if (isBlocked) {
      // Calculate exactly how much money the AI is missing
      const deficit = netAmountPaise - session.remainingAllowancePaise;
      session.pendingShortfallPaise = deficit > 0 ? deficit : 0;
      session.status = "THROTTLED"; 
      return false; 
    }

    // Mathematical Execution
    session.remainingAllowancePaise -= netAmountPaise;
    session.totalSpentPaise += netAmountPaise;
    session.pendingShortfallPaise = 0;
    
    if (session.remainingAllowancePaise === 0) {
      session.status = "EXHAUSTED";
    }

    return true;
  }
}