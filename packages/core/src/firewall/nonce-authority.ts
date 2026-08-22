export class NonceAuthority {
  // In production, this would be a Redis store with a TTL.
  // For the hackathon, an in-memory Map is sufficient.
  private usedNonces = new Map<string, number>();
  private readonly ttlMs = 5 * 60 * 1000; // 5 minutes

  /**
   * Registers a nonce. Throws an error if it has already been consumed.
   */
  public consume(nonce: string): void {
    this.cleanUp(); // Prune expired nonces first

    if (this.usedNonces.has(nonce)) {
      throw new Error(`SECURITY_VIOLATION: Nonce ${nonce} has already been consumed.`);
    }

    this.usedNonces.set(nonce, Date.now());
  }

  /**
   * Checks if a nonce is valid without consuming it (useful for dry-runs).
   */
  public isValid(nonce: string): boolean {
    return !this.usedNonces.has(nonce);
  }

  /**
   * Garbage collection to prevent memory leaks in the local Map.
   */
  private cleanUp(): void {
    const now = Date.now();
    for (const [nonce, timestamp] of this.usedNonces.entries()) {
      if (now - timestamp > this.ttlMs) {
        this.usedNonces.delete(nonce);
      }
    }
  }
}