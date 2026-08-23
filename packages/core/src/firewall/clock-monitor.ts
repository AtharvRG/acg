export class ClockMonitor {
  private readonly maxDriftMs = 2000; // Allow 2 seconds of server time-skew
  private readonly maxTtlMs = 60000;  // 60 seconds absolute maximum lifespan

  /**
   * Verifies the temporal validity of a transaction request.
   * Prevents stale quotes and temporal inversion (future-dated attacks).
   */
  public verify(issuedAt: number, expiresAt: number): boolean {
    const now = Date.now();

    // 1. Temporal Inversion Check (Is the timestamp from the future?)
    // We allow a slight drift in case the client clock is slightly ahead
    if (issuedAt > now + this.maxDriftMs) {
      return false;
    }

    // 2. Absolute Expiration Check (Has the quote expired?)
    if (now > expiresAt) {
      return false;
    }

    // 3. TTL Integrity Check (Did the client tamper with the expiration window?)
    if (expiresAt - issuedAt > this.maxTtlMs) {
      return false;
    }

    return true;
  }
}