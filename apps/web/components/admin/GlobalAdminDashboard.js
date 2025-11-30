"use client";

export default function GlobalAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <h3 className="text-slate-500 text-sm font-bold uppercase mb-2">Total Users</h3>
          <p className="text-4xl font-extrabold text-slate-900">12,450</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <h3 className="text-slate-500 text-sm font-bold uppercase mb-2">Verified Actions</h3>
          <p className="text-4xl font-extrabold text-purple-600">85,200</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <h3 className="text-slate-500 text-sm font-bold uppercase mb-2">Active Nodes</h3>
          <p className="text-4xl font-extrabold text-emerald-600">8</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">System Overview</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl">
          <p className="text-slate-400">Global Admin Charts & Logs Placeholder</p>
        </div>
      </div>
    </div>
  );
}