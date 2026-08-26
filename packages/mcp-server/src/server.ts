import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { OrderItemInputSchema, DraftQuoteSchema } from "@acg/core";
import { kernel } from "./kernel.js";
import { ZodIngress } from "./sanitizer/zod-ingress.js";

export class AcgMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      { name: "acg-monetary-firewall", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "search_catalog",
          description: "Look up available SKUs, prices (in paise), and inventory limits.",
          inputSchema: { type: "object", properties: {} }
        },
        {
          name: "request_volume_tier",
          description: "Negotiate bulk discounts. Pass an skuId and quantity.",
          inputSchema: {
            type: "object",
            properties: {
              skuId: { type: "string" },
              quantity: { type: "number" }
            },
            required: ["skuId", "quantity"]
          }
        },
        {
          name: "draft_quote",
          description: "Draft a cryptographically signed intent to purchase.",
          inputSchema: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: { skuId: { type: "string" }, quantity: { type: "number" } },
                  required: ["skuId", "quantity"]
                }
              }
            },
            required: ["items"]
          }
        },
        {
          name: "execute_checkout",
          description: "Execute a checkout using a valid DraftQuote object.",
          inputSchema: {
            type: "object",
            properties: { quote: { type: "object" } },
            required: ["quote"]
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (name === "search_catalog") {
          return { content: [{ type: "text", text: JSON.stringify(kernel.catalog.getAllSkus(), null, 2) }] };
        }

        if (name === "request_volume_tier") {
          const skuId = String(args?.skuId);
          const quantity = Number(args?.quantity);
          const resolved = kernel.catalog.resolveItem(skuId, quantity);
          return { content: [{ type: "text", text: JSON.stringify(resolved, null, 2) }] };
        }

        if (name === "draft_quote") {
          // ZOD INGRESS SANITIZATION
          const inputSchema = z.object({ items: z.array(OrderItemInputSchema) });
          const validation = ZodIngress.sanitize(inputSchema, args);
          
          if (!validation.success) {
            return { content: [{ type: "text", text: validation.autoCorrectPrompt }] };
          }

          const draft = kernel.quoteBuilder.buildDraft(
            "merch_1", "tenant_1", "client_1", kernel.SESSION_ID, "agent_claude", validation.data.items
          );
          return { content: [{ type: "text", text: JSON.stringify(draft, null, 2) }] };
        }

        if (name === "execute_checkout") {
          // ZOD INGRESS SANITIZATION
          const inputSchema = z.object({ quote: DraftQuoteSchema });
          const validation = ZodIngress.sanitize(inputSchema, args);

          if (!validation.success) {
            return { content: [{ type: "text", text: validation.autoCorrectPrompt }] };
          }

          // FIREWALL GAUNTLET
          const result = kernel.gatekeeper.evaluate(validation.data.quote);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        }

        return { content: [{ type: "text", text: `Unknown tool: ${name}` }] };
      } catch (error: any) {
        // Fallback for core logic errors (e.g. Out of stock, invalid SKU)
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