import { Mistral } from "@mistralai/mistralai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) throw new Error("MISTRAL_API_KEY is missing in .env");

const client = new Mistral({ apiKey });

async function runAutonomousProcurement() {
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
    function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema,
    }
  }));

  // THE FIX: Strict System Persona + Direct User Command
  const messages: any[] = [
    {
      role: "system",
      content: `You are an elite, headless B2B procurement AI. 
      You DO NOT write conversational text. You DO NOT output markdown.
      You MUST use the provided function tools directly to execute your tasks.`
    },
    {
      role: "user",
      content: `EXECUTE PROCUREMENT RUN:
      1. Use 'search_catalog' to find the SKU for "Enterprise GPU Compute Hour".
      2. Use 'request_volume_tier' to negotiate a price for exactly 50 units.
      3. Use 'draft_quote' to create a cryptographically signed intent using the SKU and quantity.
      4. Use 'execute_checkout' to pay.
      
      Begin tool execution immediately.`
    }
  ];

  console.log("================================================");
  console.log("🧠 MISTRAL PROCUREMENT AGENT ONLINE");
  console.log("================================================\n");

  while (true) {
    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages,
      tools: mistralTools,
      toolChoice: "auto", // Forces the model to evaluate tools
    });

    const assistantMsg = response.choices?.[0]?.message;
    if (!assistantMsg) break;

    messages.push(assistantMsg);

    if (assistantMsg.content) {
      console.log(`\n🤖 MISTRAL: ${assistantMsg.content}`);
    }

    if (assistantMsg.toolCalls && assistantMsg.toolCalls.length > 0) {
      for (const tc of assistantMsg.toolCalls) {
        console.log(`\n⚙️  EXECUTING TOOL: [${tc.function.name}]`);
        const args = typeof tc.function.arguments === "string" 
          ? JSON.parse(tc.function.arguments) 
          : tc.function.arguments;
        
        console.log(`   Payload:`, JSON.stringify(args));

        try {
          const result = await mcpClient.callTool({ name: tc.function.name, arguments: args });
          const textOutput = (result.content[0] as any).text;
          
          console.log(`   Response:`, textOutput.substring(0, 200) + (textOutput.length > 200 ? "..." : ""));

          messages.push({
            role: "tool",
            toolCallId: tc.id,
            content: textOutput,
            name: tc.function.name,
          });

          // Webhook to update Next.js React UI
          const isBreach = textOutput.includes("BUDGET_BREACH");
          const isSettled = textOutput.includes("APPROVED");
          
          await fetch("http://localhost:3000/api/sync", {
             method: "POST", 
             body: JSON.stringify({
               session: {
                 sessionId: "demo_session_1",
                 merchantId: "merch_1",
                 agentId: "Mistral-Large (Autonomous)", // Updates UI to show Mistral is driving
                 status: isBreach ? "THROTTLED" : "ACTIVE",
                 remainingAllowancePaise: isBreach ? 0 : (isSettled ? 350000 - 1875000 : 350000),
                 maxTotalBudgetPaise: 500000,
                 totalSpentPaise: isSettled ? 150000 + 1875000 : 150000, 
                 maxVelocityPerMinute: 10,
                 createdAt: 1724300000000,
                 expiresAt: 1724300000000 + 86400000
               },
               newLog: { 
                 id: `log_${Date.now()}_${Math.random()}`, 
                 timestamp: Date.now(), 
                 action: isBreach ? "GATE_EVALUATION_FAIL" : tc.function.name.toUpperCase(), 
                 details: isBreach ? "Budget limit breached. Execution halted." : `Mistral executed ${tc.function.name}.`, 
                 hash: "hash_" + Date.now().toString(16) 
               }
             })
          }).catch(() => {}); 

        } catch (error: any) {
          console.error(`   Error executing tool:`, error.message);
          messages.push({
            role: "tool",
            toolCallId: tc.id,
            content: `ERROR: ${error.message}`,
            name: tc.function.name,
          });
        }
      }
    } else {
      console.log("\n✅ PROCUREMENT COMPLETE.");
      break;
    }
  }
}

runAutonomousProcurement().catch(console.error);