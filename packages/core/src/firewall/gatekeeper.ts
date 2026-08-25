import { DraftQuote } from "../types/schemas";
import { HmacSigner } from "./signer";
import { NonceAuthority } from "./nonce-authority";
import { ClockMonitor } from "./clock-monitor";
import { SessionGovernor } from "./session-governor";

export type GatekeeperResult = 
  | { status: "APPROVED"; message: string }
  | { status: "REQUIRES_HITL"; message: string; asyncToken: string }
  | { status: "REJECTED"; reason: string };

export class Gatekeeper {
  constructor(
    private readonly signer: HmacSigner,
    private readonly nonces: NonceAuthority,
    private readonly clock: ClockMonitor,
    private readonly governor: SessionGovernor
  ) {}

  /**
   * Executes the 5-Gate Firewall Gauntlet.
   * Fails fast and fails closed.
   */
  public evaluate(quote: DraftQuote): GatekeeperResult {
    // Gate 1: Cryptographic Integrity
    if (!this.signer.verify(quote)) {
      return { status: "REJECTED", reason: "SECURITY_VIOLATION: HMAC signature mismatch. Payload tampered." };
    }

    // Gate 2: Temporal Bounds
    if (!this.clock.verify(quote.issuedAt, quote.expiresAt)) {
      return { status: "REJECTED", reason: "SECURITY_VIOLATION: Temporal bounds exceeded. Quote is stale or future-dated." };
    }

    // Gate 3: Anti-Replay (Burns the nonce immediately)
    try {
      this.nonces.consume(quote.nonce);
    } catch (error: any) {
      return { status: "REJECTED", reason: error.message || "SECURITY_VIOLATION: Nonce reuse detected." };
    }

    // Gate 4 & 5: Budget and Velocity (Optimistic Governor)
    const canDebit = this.governor.attemptDebit(quote.sessionId, quote.netAmountPaise);
    
    if (!canDebit) {
      // The AI exceeded its limit. We do not reject outright. 
      // We pause and escalate to the human merchant (Asynchronous HITL).
      const asyncToken = `hitl_req_${quote.nonce}`;
      return { 
        status: "REQUIRES_HITL", 
        message: "BUDGET_BREACH: Session allowance exceeded. Human authorization required.",
        asyncToken
      };
    }

    return { status: "APPROVED", message: "FIREWALL_CLEARED: Transaction authorized for settlement." };
  }
}