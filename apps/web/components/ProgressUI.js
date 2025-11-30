"use client";

export default function ProgressUI({ certificates }) {
  const totalCompleted = certificates.length;

  // Badge logic
  const getBadge = () => {
    if (totalCompleted >= 10) return { label: "Gold Hero", color: "from-amber-300 to-yellow-500", icon: "🏆", glow: "shadow-yellow-500/30" };
    if (totalCompleted >= 5) return { label: "Silver Hero", color: "from-slate-300 to-slate-400", icon: "🥈", glow: "shadow-slate-400/30" };
    if (totalCompleted >= 3) return { label: "Bronze Hero", color: "from-orange-300 to-amber-600", icon: "🥉", glow: "shadow-orange-500/30" };
    if (totalCompleted >= 1) return { label: "Rookie", color: "from-emerald-400 to-green-600", icon: "🌱", glow: "shadow-emerald-500/30" };
    return null;
  };

  const badge = getBadge();

  // For the progress bar
  const maxGoal = 10; 
  const progressPct = Math.min((totalCompleted / maxGoal) * 100, 100);

  return (
    <div className="grid md:grid-cols-2 gap-6 pt-6">
      
      {/* --- PROGRESS CARD --- */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <h3 className="text-xl font-bold text-white mb-4 relative z-10">Your Journey</h3>

        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <span className="text-4xl font-extrabold text-white">{totalCompleted}</span>
            <span className="text-slate-400 text-sm ml-2">actions done</span>
          </div>
          <span className="text-sky-400 font-bold">{Math.round(progressPct)}%</span>
        </div>

        {/* Neon Progress bar */}
        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-white/5 relative z-10">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(14,165,233,0.5)]"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      {/* --- BADGE / REWARDS CARD --- */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-8 backdrop-blur-xl flex flex-col justify-center">
        {badge ? (
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-4xl shadow-2xl ${badge.glow} animate-pulse-slow`}>
              {badge.icon}
            </div>
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Current Rank</p>
              <h3 className="text-3xl font-extrabold text-white">{badge.label}</h3>
              <p className="text-xs text-slate-500 mt-2">Next rank at {totalCompleted < 3 ? 3 : totalCompleted < 5 ? 5 : 10} actions</p>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-50">
            <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl grayscale">🔒</div>
            <p className="text-slate-400">Complete 1 action to unlock your first badge!</p>
          </div>
        )}
        
        {/* Decorative background glow */}
        <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t ${badge ? badge.color.split(' ')[1].replace('to-', 'from-') : 'from-slate-800'} to-transparent opacity-10 pointer-events-none`}></div>
      </div>

    </div>
  );
}