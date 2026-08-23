import { SessionPolicy } from "../types/schemas";

export class SessionGovernor {
  private activeSessions = new Map<string, SessionPolicy>();

  /**
   * Hydrates a session policy into the governor.
   */
  public registerSession(policy: SessionPolicy): void {
    this.activeSessions.set(policy.sessionId, { ...policy });
  }

  public getSession(sessionId: string): SessionPolicy | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Evaluates the budget and atomically deducts the amount if valid.
   * Returns true if execution is permitted, false if it breaches policy.
   */
  public attemptDebit(sessionId: string, netAmountPaise: number): boolean {
    const session = this.activeSessions.get(sessionId);
    
    // 1. Session Existence & Status Check
    if (!session || session.status !== "ACTIVE") {
      return false;
    }

    // 2. Per-Transaction Ceiling Check
    if (netAmountPaise > session.maxPerTransactionPaise) {
      return false;
    }

    // 3. Overall Budget Margin Check
    if (session.remainingAllowancePaise < netAmountPaise) {
      return false; // Triggers Asynchronous HITL Pause in the higher levels
    }

    // 4. Atomic Execution (Optimistic Concurrency Control Simulation)
    session.remainingAllowancePaise -= netAmountPaise;
    session.totalSpentPaise += netAmountPaise;
    
    if (session.remainingAllowancePaise === 0) {
      session.status = "EXHAUSTED";
    }

    return true;
  }
}