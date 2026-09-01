
# Agentic Commerce Gateway (ACG)

**Zero-Trust Middleware for Autonomous Machine-to-Machine Commerce.**
*Engineered for the Razorpay Build-a-thon: Track 01 (AI Growth & Agentic Commerce).*

## The Trust Barrier

Merchants cannot safely accept autonomous AI buyers. Large Language Models are probabilistic state machines—they hallucinate prices, mutate JSON payloads, and fall into infinite execution loops. If an AI buyer hallucinates a ₹50,000 server rack down to ₹50 and bypasses authorization, the merchant absorbs a catastrophic loss. Due to this risk, the Agentic Economy remains stalled.

## The Solution: Deterministic Isolation

The Agentic Commerce Gateway (ACG) is an enterprise middleware proxy deployed on the merchant's infrastructure. It sits between probabilistic LLM agents (via the Model Context Protocol) and deterministic payment rails (Razorpay).

ACG mathematically neutralizes the financial risk of AI buyers. It forces AI intents through a 5-Gate Cryptographic Firewall, allowing merchants to safely open their APIs to autonomous agents and unlock a massive net-new M2M revenue channel.

## Core Architectural Invariants

1. **Zero-Trust Parameter Hydration:** AI agents are stripped of pricing authority. They may only pass structural references (SKU IDs). The ACG Kernel independently queries the merchant database, evaluates dynamic volume discounts, and reconstructs the true integer cost.
2. **Cryptographic Intent Sealing (HMAC-SHA256):** Quote payloads are cryptographically sealed with a server-side secret. If the AI (or a man-in-the-middle) alters a single byte before checkout execution, the transaction is violently rejected via constant-time comparison.
3. **Atomic Anti-Replay Nonces:** To prevent infinite LLM execution loops from draining corporate budgets, every quote is bound to a single-use UUIDv4. The exact millisecond checkout is attempted, the token is burned in memory and passed to Razorpay as an `Idempotency-Key` to guarantee zero double-spends on the banking rail.
4. **The Paise Invariant:** Floating-point math is banned within the execution kernel. All financial limits and cryptographic hashes are calculated as positive integers to prevent JavaScript decimal corruption (`0.1 + 0.2` artifacts).
5. **Asynchronous HITL (Human-in-the-Loop):** If an AI breaches its pre-authorized mandate budget, the system does not crash. It suspends the transaction and pushes a webhook to a React dashboard, allowing a human manager to manually authorize the Razorpay mandate expansion. The AI then seamlessly resumes execution.

## Monorepo Topology

* `@acg/core`: The headless, framework-agnostic TypeScript execution kernel and firewall.
* `@acg/mcp-server`: The ingress bridge utilizing the Model Context Protocol and Zod schema sanitization.
* `@acg/react`: A drop-in UI component library for merchant dashboards.
* `apps/dashboard`: The Merchant God-Mode logger and HITL authorization interface.
* `apps/storefront`: A dual-purpose retail/SaaS Next.js storefront syncing live state via polling.
* `apps/cli-agent`: A headless Mistral AI procurement agent dynamically interacting with the MCP server.

## Quickstart & Demonstration

1. Populate `.env` files in `apps/storefront` and `apps/cli-agent` with `MISTRAL_API_KEY`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET`.
2. Boot the infrastructure (requires three terminals):
   * `pnpm --filter dashboard dev` (Port 3000)
   * `pnpm --filter storefront dev` (Port 3001)
   * `pnpm --filter cli-agent start` (Terminal TUI)
3. Command the Agentic CLI: `Buy 2 units of Enterprise GPU Compute Hour.` Watch the Storefront UI Heatmap react instantly to the autonomous transaction.
4. Trigger the Firewall: `Buy 100 units of Enterprise GPU Compute Hour.` Watch the ACG suspend the agent and trigger the HITL authorization drawer in the Dashboard.

Please reference the `/docs` directory for deep-dives into the architecture, security schema, and SDK integration.
