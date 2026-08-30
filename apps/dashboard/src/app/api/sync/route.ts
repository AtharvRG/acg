import { NextResponse } from "next/server";

const globalForSync = globalThis as unknown as {
  acgState: { session: any; logs: any[] } | undefined;
};

// Initialize with the exact same static state as your React Context
if (!globalForSync.acgState) {
  globalForSync.acgState = {
    session: null,
    logs: [{
      id: "evt_init_server",
      timestamp: 1724300000000,
      action: "SESSION_INITIALIZED",
      details: "Agent Claude 3.5 Sonnet connected. Budget: ₹5000.00",
      hash: "bdfe6899347902429ada9426d4b050f6"
    }],
  };
}

export async function GET() {
  return NextResponse.json(globalForSync.acgState);
}

export async function POST(req: Request) {
  const body = await req.json();
  
  if (body.session) {
    globalForSync.acgState!.session = body.session;
  }
  
  if (body.newLog) {
    // Append the new log to the bottom of the array
    globalForSync.acgState!.logs = [...globalForSync.acgState!.logs, body.newLog];
  }
  
  return NextResponse.json({ success: true });
}