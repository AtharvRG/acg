import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { OrderItemInputSchema, DraftQuoteSchema } from "@acg/core";
import { kernel } from "./kernel.js";
import { ZodIngress } from "./sanitizer/zod-ingress.js";

// Helper to push TRUE state from the Governor to the Dashboard
async function syncToDashboard(action: string, details: string, unitsBought: number = 0) {
  const session = kernel.governor.getSession(kernel.SESSION_ID);
  if (!session) return;

  try {
    await fetch("http://localhost:3000/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session: session, // The absolute mathematical truth
        newLog: {
          id: `log_${Date.now()}_${Math.random()}`,
          timestamp: Date.now(),
          action,
          details,
          hash: "hash_" + Date.now().toString(16),
          units: unitsBought // Pass this so the Compute Storefront knows exactly how many to add
        }
      })
    });
  } catch (e) {
    // Silently fail if dashboard is offline
  }
}

export class AcgMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server({ name: "acg-monetary-firewall", version: "1.0.0" }, { capabilities: { tools: {} } });
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        { name: "search_catalog", description: "Look up SKUs.", inputSchema: { type: "object", properties: {} } },
        { name: "request_volume_tier", description: "Negotiate discounts.", inputSchema: { type: "object", properties: { skuId: { type: "string" }, quantity: { type: "number" } }, required: ["skuId", "quantity"] } },
        { name: "draft_quote", description: "Draft signed intent.", inputSchema: { type: "object", properties: { items: { type: "array", items: { type: "object", properties: { skuId: { type: "string" }, quantity: { type: "number" } }, required: ["skuId", "quantity"] } } }, required: ["items"] } },
        { name: "execute_checkout", description: "Execute checkout.", inputSchema: { type: "object", properties: { quote: { type: "object" } }, required: ["quote"] } }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (name === "search_catalog") {
          await syncToDashboard("SEARCH_CATALOG", "Agent queried infrastructure inventory.");
          return { content: [{ type: "text", text: JSON.stringify(kernel.catalog.getAllSkus(), null, 2) }] };
        }

        if (name === "request_volume_tier") {
          const skuId = String(args?.skuId);
          const quantity = Number(args?.quantity);
          const resolved = kernel.catalog.resolveItem(skuId, quantity);
          await syncToDashboard("REQUEST_VOLUME_TIER", `Agent evaluating ${quantity} units of ${skuId}.`);
          return { content: [{ type: "text", text: JSON.stringify(resolved, null, 2) }] };
        }

        if (name === "draft_quote") {
          const inputSchema = z.object({ items: z.array(OrderItemInputSchema) });
          const validation = ZodIngress.sanitize(inputSchema, args);
          if (!validation.success) return { content: [{ type: "text", text: validation.autoCorrectPrompt }] };

          const draft = kernel.quoteBuilder.buildDraft("merch_1", "tenant_1", "client_1", kernel.SESSION_ID, "ForgeBot (Mistral)", validation.data.items);
          await syncToDashboard("DRAFT_QUOTE", "Agent sealed cryptographic intent payload.");
          return { content: [{ type: "text", text: JSON.stringify(draft, null, 2) }] };
        }

        if (name === "execute_checkout") {
          const inputSchema = z.object({ quote: DraftQuoteSchema });
          const validation = ZodIngress.sanitize(inputSchema, args);
          if (!validation.success) return { content: [{ type: "text", text: validation.autoCorrectPrompt }] };

          const result = kernel.gatekeeper.evaluate(validation.data.quote);
          const totalUnits = validation.data.quote.items.reduce((acc: number, item: any) => acc + item.quantity, 0);

          if (result.status === "APPROVED") {
            const rzpResponse = await kernel.rzpClient.createTestOrder(validation.data.quote);
            if (!rzpResponse.success) {
              await syncToDashboard("GATEWAY_ERROR", `Razorpay rejected the payload.`);
              return { content: [{ type: "text", text: `RAZORPAY_API_ERROR: ${rzpResponse.error}` }] };
            }
            
            // Push exact success state and units bought
            await syncToDashboard("EXECUTE_CHECKOUT", `Payment Settled. Order: ${rzpResponse.orderId}`, totalUnits);
            return { content: [{ type: "text", text: JSON.stringify({ ...result, razorpay_order_id: rzpResponse.orderId }, null, 2) }] };
          }

          // Push exact breach state
          await syncToDashboard("GATE_EVALUATION_FAIL", `Budget breach. Status: ${result.status}`);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        return { content: [{ type: "text", text: `Unknown tool: ${name}` }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `EXECUTION_ERROR: ${error.message}` }] };
      }
    });
  }

  public async connect() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("ACG MCP Server running on stdio");
  }
}
