"use client";

import { AgenticProvider, MonetaryFirewallBanner, AgentCheckoutDrawer, AuditLedger } from "@acg/react";

function DashboardContent() {
  return (
    <main className="h-screen w-full bg-[#09090b] flex flex-col p-8 max-w-5xl mx-auto gap-6">
      <MonetaryFirewallBanner />
      <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col min-h-0">
        <AuditLedger />
      </div>
      <AgentCheckoutDrawer />
    </main>
  );
}

export default function Dashboard() {
  return <AgenticProvider><DashboardContent /></AgenticProvider>;
}