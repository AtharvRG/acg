import { AcgMcpServer } from "./server.js";

const server = new AcgMcpServer();
server.connect().catch((error) => {
  console.error("FATAL: MCP Server crashed", error);
  process.exit(1);
});