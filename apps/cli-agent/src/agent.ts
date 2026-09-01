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
  process.stdout.write("\x1Bc"); // Clear console
  console.log("ACG Agentic CLI v1.0.0");
  console.log("Initializing secure MCP connection...");
  
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "../../packages/mcp-server/src/index.ts"],
    env: { ...process.env } as Record<string, string>
  });

  const mcpClient = new Client({ name: "agentic-cli", version: "1.0.0" }, { capabilities: {} });
  await mcpClient.connect(transport);
  
  const { tools: mcpTools } = await mcpClient.listTools();
  const mistralTools = mcpTools.map(t => ({
    type: "function" as const,
    function: { name: t.name, description: t.description, parameters: t.inputSchema }
  }));

const messages: any[] = [
    {
      role: "system",
      content: `You are 'Agentic CLI', an autonomous enterprise procurement agent.
      RULES:
      1. Use 'search_catalog' to verify SKUs and prices first.
      2. CURRENCY FORMATTING: All prices returned by tools are in PAISE (1 Rupee = 100 Paise). You MUST divide the returned price by 100 before showing the '₹' amount to the user. (e.g., 50000 paise = ₹500.00).
      3. If buying >= 50 units, use 'request_volume_tier' to negotiate a discount.
      4. Use 'draft_quote' to seal the intent.
      5. Use 'execute_checkout' to pay.
      6. If checkout returns 'REQUIRES_HITL', tell the user to authorize it in the ACG Dashboard. Do not invent URLs.
      7. CRITICAL: If the user says they authorized the request, immediately call 'execute_checkout' again with the same quote.`
    }
  ];

  console.log("Connection established. Waiting for prompt.\n");

  while (true) {
    const userInput = await rl.question("> User: ");
    if (userInput.toLowerCase() === "exit") break;

    messages.push({ role: "user", content: userInput });
    let isThinking = true;

    while (isThinking) {
      process.stdout.write("\x1b[2m> Agent is thinking...\x1b[0m\r"); // Dim text
      
      const response = await client.chat.complete({
        model: "mistral-large-latest",
        messages,
        tools: mistralTools,
        toolChoice: "auto",
      });

      const assistantMsg = response.choices?.[0]?.message;
      if (!assistantMsg) break;

      messages.push(assistantMsg);
      process.stdout.write("\x1b[2K\r"); // Clear thinking line

      if (assistantMsg.content) {
        console.log(`> Agent: ${assistantMsg.content}\n`);
      }

      if (assistantMsg.toolCalls && assistantMsg.toolCalls.length > 0) {
        for (const tc of assistantMsg.toolCalls) {
          console.log(`\x1b[2m  [Executing: ${tc.function.name}]\x1b[0m`);
          
          const args = typeof tc.function.arguments === "string" ? JSON.parse(tc.function.arguments) : tc.function.arguments;
          
          try {
            const result = await mcpClient.callTool({ name: tc.function.name, arguments: args });
            const textOutput = ((result as any).content[0] as any).text;
            messages.push({ role: "tool", toolCallId: tc.id, content: textOutput, name: tc.function.name });
          } catch (error: any) {
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
