"use client";

export default function ProgressUI({ certificates }) {
  const totalCompleted = certificates.length;

  const getBadge = () => {
    // Couleurs ajustées pour le thème clair : gradients plus doux et ombres colorées
    if (totalCompleted >= 10) return { label: "Gold Hero", color: "from-amber-200 to-yellow-400", icon: "🏆", glow: "shadow-yellow-400/40" };
    if (totalCompleted >= 5) return { label: "Silver Hero", color: "from-slate-200 to-slate-300", icon: "🥈", glow: "shadow-slate-300/40" };
    if (totalCompleted >= 3) return { label: "Bronze Hero", color: "from-orange-200 to-amber-400", icon: "🥉", glow: "shadow-orange-400/40" };
    if (totalCompleted >= 1) return { label: "Rookie", color: "from-emerald-200 to-green-400", icon: "🌱", glow: "shadow-green-400/40" };
    return null;
  };

  const badge = getBadge();
  const maxGoal = 10; 
  const progressPct = Math.min((totalCompleted / maxGoal) * 100, 100);

  return (
    <div className="grid md:grid-cols-2 gap-6 pt-6">
      
      {/* --- PROGRESS CARD (White) --- */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">Your Journey</h3>

        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <span className="text-4xl font-extrabold text-slate-900">{totalCompleted}</span>
            <span className="text-slate-500 text-sm ml-2">actions done</span>
          </div>
          <span className="text-purple-600 font-bold">{Math.round(progressPct)}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative z-10">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out shadow-lg shadow-purple-500/20"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      {/* --- BADGE / REWARDS CARD (White) --- */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 flex flex-col justify-center">
        {badge ? (
          <div className="flex items-center gap-6 relative z-10">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-4xl shadow-xl ${badge.glow} animate-bounce-slow text-white`}>
              {badge.icon}
            </div>
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Current Rank</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{badge.label}</h3>
              <p className="text-xs text-slate-500 mt-2">Next rank at {totalCompleted < 3 ? 3 : totalCompleted < 5 ? 5 : 10} actions</p>
            </div>
          </div>
        ) : (
          <div className="text-center opacity-70 relative z-10">
            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl grayscale">🔒</div>
            <p className="text-slate-500">Complete 1 action to unlock your first badge!</p>
          </div>
        )}
        
        {/* Glow coloré subtil en bas */}
        <div className={`absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t ${badge ? badge.color.split(' ')[1].replace('to-', 'from-') : 'from-slate-100'} to-transparent opacity-20 pointer-events-none`}></div>
      </div>

    </div>
  );
}