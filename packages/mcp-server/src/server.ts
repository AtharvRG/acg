import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// We will inject the actual Core instances (Catalog, Gatekeeper) here later
export class AcgMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "acg-monetary-firewall",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // 1. Tell the AI what tools are available
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // We will define search_catalog, draft_quote, etc. here in the next step
        ],
      };
    });

    // 2. Handle the AI executing a tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      // Tool routing logic goes here
      return {
        content: [{ type: "text", text: "Tools not yet wired." }],
      };
    });
  }

  /**
   * Boots the server and begins listening to Stdio
   */
  public async connect() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("ACG MCP Server running on stdio"); // Logging to stderr so it doesn't pollute stdout JSON-RPC
  }
}