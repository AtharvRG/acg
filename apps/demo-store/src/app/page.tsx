"use client";

import { AgenticProvider, MonetaryFirewallBanner, AgentCheckoutDrawer, AuditLedger, useAgenticSession } from "@acg/react";

function DashboardContent() {
  const { simulateSpend } = useAgenticSession();

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full relative">
      {/* ... keeping the exact same header and buttons you have from yesterday ... */}
      <header className="mb-12 border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            CloudSaaS <span className="text-zinc-500">B2B Dashboard</span>
          </h1>
          <p className="text-zinc-400 mt-2">
            Agentic Commerce Gateway active. Monitoring autonomous inbound requests.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => simulateSpend(50000)} // ₹500
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm rounded-lg transition-colors border border-zinc-700 shadow-sm"
          >
            Simulate AI Spend (₹500)
          </button>
          <button 
            onClick={() => simulateSpend(600000)} // ₹6,000 (Instant Breach)
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium text-sm rounded-lg transition-colors border border-red-500/20 shadow-sm"
          >
            Trigger Overdraft (₹6,000)
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MonetaryFirewallBanner />
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col min-h-[300px]">
            <h3 className="text-white font-medium mb-4">Live Execution Feed</h3>
            <div className="flex-1 border border-zinc-800/50 bg-black/50 rounded-lg p-4 font-mono text-sm text-zinc-500 flex items-center justify-center">
              [ MCP Agent Stream Pending ]
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col h-[500px]">
          <AuditLedger />
        </div>
      </div>

      {/* Drop the drawer here. It remains hidden until status === "THROTTLED" */}
      <AgentCheckoutDrawer />
    </main>
  );
}

export default function Dashboard() {
  return (
    <AgenticProvider>
      <DashboardContent />
    </AgenticProvider>
  );
}