"use client";

export default function NGODashboard() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Campaign Impact</h2>
          <p className="text-slate-500 mb-4">Tracking distribution of health incentives.</p>
          <div className="text-5xl font-extrabold text-orange-500 mb-2">4,200</div>
          <p className="text-sm font-bold text-slate-400 uppercase">Vaccines Sponsored</p>
        </div>
        
        <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg flex items-center justify-center">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold text-lg shadow-xl shadow-orange-500/30 hover:scale-105 transition-transform">
            Launch New Campaign
          </button>
        </div>
      </div>
    </div>
  );
}