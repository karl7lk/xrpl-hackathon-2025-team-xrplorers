"use client";
import ProgressUI from "../ProgressUI";

export default function DashboardTab({ 
  profile, 
  userAge, 
  ageBandLabel, 
  certificates, 
  totalActionsCount, 
  onEditProfile 
}) {
  const completionPct = totalActionsCount > 0 
    ? Math.round((certificates.length / 10) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Carte Hello Victor */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl text-white shadow-lg shadow-purple-500/20">
              {profile ? profile.first_name[0] : "👤"}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
                {profile ? `Hello, ${profile.first_name}` : "Hello, Guest"}
              </h2>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                {profile ? (
                  <>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">Verified</span>
                    <span>•</span>
                    <span>{ageBandLabel}</span>
                    <span>•</span>
                    <span>{profile.country?.toUpperCase()}</span>
                  </>
                ) : (
                  <span className="italic text-slate-400">Anonymous User</span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onEditProfile}
            className="px-6 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:shadow-md transition-all active:scale-95"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Progress Summary Mini */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-bold uppercase mb-2">Completion</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-extrabold text-purple-600">{completionPct}%</span>
            <span className="text-slate-400 mb-1">towards Gold</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${Math.min(completionPct, 100)}%` }}></div>
          </div>
        </div>
        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/20">
          <p className="text-purple-200 text-sm font-bold uppercase mb-2">Next Reward</p>
          <h3 className="text-2xl font-bold">Insurance Discount</h3>
          <p className="text-purple-100 text-sm mt-2 opacity-80">Complete 3 more actions to unlock 5% off partner health insurance.</p>
        </div>
      </div>
      
      {/* Progress UI Global */}
      <ProgressUI certificates={certificates} />
    </div>
  );
}