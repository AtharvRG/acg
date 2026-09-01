import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // THE FIX: Disables aggressive Next.js caching

const globalForSync = globalThis as unknown as {
  acgState: { session: any; logs: any[] } | undefined;
};

if (!globalForSync.acgState) {
  globalForSync.acgState = {
    session: null,
    logs: [{
      id: "evt_init_server",
      timestamp: Date.now(),
      action: "SESSION_INITIALIZED",
      details: "Agent Claude / Mistral connected. Budget: ₹5000.00",
      hash: "bdfe6899347902429ada9426d4b050f6"
    }],
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  return NextResponse.json(globalForSync.acgState, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const body = await req.json();
  
  if (body.session) globalForSync.acgState!.session = body.session;
  if (body.newLog) globalForSync.acgState!.logs = [...globalForSync.acgState!.logs, body.newLog];
  
  return NextResponse.json({ success: true }, { headers: corsHeaders });
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
