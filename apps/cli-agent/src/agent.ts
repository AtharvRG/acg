import { Mistral } from "@mistralai/mistralai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as readline from "readline/promises";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) throw new Error("MISTRAL_API_KEY is missing in .env");

const client = new Mistral({ apiKey });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function runInteractiveAgent() {
  console.log("\n[1] Booting Agentic Commerce Gateway (MCP Client)...");
  
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "../../packages/mcp-server/src/index.ts"],
  });

  const mcpClient = new Client({ name: "mistral-buyer", version: "1.0.0" }, { capabilities: {} });
  await mcpClient.connect(transport);
  
  console.log("[2] Connected to MCP Server. Fetching secure catalog tools...\n");
  const { tools: mcpTools } = await mcpClient.listTools();

  const mistralTools = mcpTools.map(t => ({
    type: "function" as const,
    function: { name: t.name, description: t.description, parameters: t.inputSchema }
  }));

  // STRICTLY A SYSTEM PROMPT. No fake user messages.
  const messages: any[] = [
    {
      role: "system",
      content: `You are 'ForgeBot', an autonomous Cloud Infrastructure Procurement AI. 
      You manage compute credits. The user (DevOps Engineer) will tell you what to do.
      
      RULES:
      1. Always use 'search_catalog' to verify SKUs (e.g. COMPUTE_01).
      2. If buying >= 50, use 'request_volume_tier' to negotiate a discount.
      3. Use 'draft_quote' to seal the intent.
      4. Use 'execute_checkout' to pay.
      5. If checkout returns 'REQUIRES_HITL', tell the user to authorize it in the dashboard.
      6. Do NOT make up an order ID if the checkout fails.`
    }
  ];

  console.log("=========================================================");
  console.log("🧠 FORGEBOT (MISTRAL AI) INFRASTRUCTURE MANAGER ONLINE");
  console.log("   Type your commands below. Type 'exit' to quit.");
  console.log("=========================================================\n");

  while (true) {
    const userInput = await rl.question("👨‍💻 YOU: ");
    if (userInput.toLowerCase() === "exit") break;

    messages.push({ role: "user", content: userInput });

    let isThinking = true;

    while (isThinking) {
      process.stdout.write("🤖 FORGEBOT is thinking...\r");
      
      const response = await client.chat.complete({
        model: "mistral-large-latest",
        messages,
        tools: mistralTools,
        toolChoice: "auto",
      });

      const assistantMsg = response.choices?.[0]?.message;
      if (!assistantMsg) break;

      messages.push(assistantMsg);
      process.stdout.write("                          \r"); // clear thinking line

      if (assistantMsg.content) {
        console.log(`🤖 FORGEBOT: ${assistantMsg.content}\n`);
      }

      if (assistantMsg.toolCalls && assistantMsg.toolCalls.length > 0) {
        for (const tc of assistantMsg.toolCalls) {
          console.log(`   ⚙️  [SYSTEM] Executing Tool: ${tc.function.name}...`);
          
          const args = typeof tc.function.arguments === "string" 
            ? JSON.parse(tc.function.arguments) 
            : tc.function.arguments;
          
          try {
            const result = await mcpClient.callTool({ name: tc.function.name, arguments: args });
            const textOutput = ((result as any).content[0] as any).text;
            
            messages.push({
              role: "tool",
              toolCallId: tc.id,
              content: textOutput,
              name: tc.function.name,
            });
            // (Webhook removed from here. The backend will handle it now.)
          } catch (error: any) {
            console.error(`   ❌ Tool Error:`, error.message);
            messages.push({ role: "tool", toolCallId: tc.id, content: `ERROR: ${error.message}`, name: tc.function.name });
          }
        }
      } else {
        isThinking = false; 
      }
    }
  }

  rl.close();
  process.exit(0);
}

runInteractiveAgent().catch(console.error);
