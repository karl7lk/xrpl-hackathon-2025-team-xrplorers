"use client";

export default function GovernmentDashboard() {
  return (
    <div className="space-y-8">
      <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Population Health Index</h2>
            <p className="text-slate-500">National vaccination coverage stats</p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30">
            Download Report
          </button>
        </div>
        
        <div className="space-y-4">
          {['Flu Vaccination', 'Covid-19 Booster', 'Childhood Immunization'].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-white/50">
              <span className="font-bold text-slate-700">{item}</span>
              <div className="w-1/2 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[75%]"></div>
              </div>
              <span className="font-mono text-purple-600 font-bold">75%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}