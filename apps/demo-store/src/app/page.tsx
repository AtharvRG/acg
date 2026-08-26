export default function Dashboard() {
  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
      <header className="mb-12 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          CloudSaaS <span className="text-zinc-500">B2B Dashboard</span>
        </h1>
        <p className="text-zinc-400 mt-2">
          Agentic Commerce Gateway active. Monitoring autonomous inbound requests.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* We will drop the React Components here in the next step */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex items-center justify-center min-h-[400px]">
          <p className="text-zinc-500 font-mono text-sm">[ Monetary Firewall UI Pending ]</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex items-center justify-center">
          <p className="text-zinc-500 font-mono text-sm">[ Audit Ledger Pending ]</p>
        </div>
      </div>
    </main>
  );
}