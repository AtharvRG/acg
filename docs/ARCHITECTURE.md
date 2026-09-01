
# System Architecture

The Agentic Commerce Gateway operates on a strict separation of concerns, ensuring that unpredictable AI logic never shares a memory space with deterministic ledger updates.

## Execution Flow

1. **Ingress & Sanitization**
   The AI buyer connects to the `@acg/mcp-server`. Tool calls are intercepted by the `ZodIngress` sanitizer. If the AI hallucinates a JSON schema, Zod returns a programmatic error string, prompting the AI to self-correct and retry.
2. **Zero-Trust Hydration**
   The AI calls `draft_quote` with a requested SKU. The `CatalogStore` ignores the AI's pricing assumptions, fetches the absolute cost from the database, applies the `DiscountEngine` logic, and formulates the exact subtotal using integer-only math (Paise Invariant).
3. **Sealing**
   The `QuoteBuilder` attaches a 5-minute TTL, generates a secure Nonce, and seals the payload using HMAC-SHA256.
4. **The Firewall Gauntlet**
   When the AI calls `execute_checkout`, the `Gatekeeper` assumes the payload is compromised and evaluates it against 5 distinct rules:

   * Gate 1: Signature Integrity
   * Gate 2: Temporal Bounds (TTL & Clock Skew)
   * Gate 3: Anti-Replay (Nonce burn)
   * Gate 4: Session Velocity
   * Gate 5: Optimistic Budget Margin
5. **Settlement & Synchronization**
   If all gates pass, the ACG contacts the Razorpay API using the burned nonce as the Idempotency Key. A webhook is broadcasted to the Next.js frontend, updating the live heatmaps and audit logs via Cross-Origin Resource Sharing (CORS).
