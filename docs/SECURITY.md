
# Threat Mitigation Matrix

The ACG assumes the AI client is a hostile actor. The following security invariants protect the merchant's financial infrastructure.

| Threat Vector                         | Attack Mechanism                                                          | Gateway Deterministic Defense                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Price Manipulation**          | Agent modifies`netAmountPaise` to ₹1 in the draft payload.             | **Zero-Trust Hydration & HMAC:** Prices are recalculated from the database; tampered payloads fail HMAC validation instantly.                                      |
| **Replay Storms**               | AI gets stuck in a loop and resubmits a valid checkout request 100 times. | **Atomic Nonce Registry:** Nonces are validated and burned on first touch. Duplicate nonces receive immediate rejection, and Razorpay rejects the Idempotency Key. |
| **Time-Travel Exploits**        | Attacker alters timestamps to reuse historical discounted quotes.         | **Monotonic Clock Monitor:** Enforces a 5-minute TTL and rejects requests with timestamp drift.                                                                    |
| **Concurrency Race Conditions** | Multi-threaded agents fire simultaneous checkouts to exceed balance.      | **Optimistic Concurrency Control (OCC):** Atomic ledger updates prevent balance over-debits without blocking table locks.                                          |
| **Precision Rounding Errors**   | JS floating-point artifacts crash banking APIs.                           | **Paise Invariant:** All currency values are strictly handled as positive integers.                                                                                |
| **Malformed Tool Calls**        | LLM drops fields or outputs malformed strings.                            | **Zod Ingress Sanitizer:** Validates schemas at the boundary and returns exact formatting corrections.                                                             |
