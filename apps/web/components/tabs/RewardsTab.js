"use client";
import { useMemo } from "react";

export default function RewardsTab({ certificates }) {
  // Calcul des stats
  const totalTokens = certificates.length * 50; // Exemple: 50 tokens par action
  const currentLevel = Math.floor(certificates.length / 3) + 1;
  const nextLevelThreshold = currentLevel * 3;
  const progressToNextLevel = ((certificates.length % 3) / 3) * 100;

  // Liste de récompenses fictives pour l'affichage
  const rewards = useMemo(() => [
    {
      id: "r1",
      title: "5% Health Insurance Discount",
      desc: "Unlock a discount with our partner insurers.",
      cost: 150,
      icon: "🏥",
      type: "discount",
      available: totalTokens >= 150,
    },
    {
      id: "r2",
      title: "Free Wellness Consultation",
      desc: "One-on-one session with a health coach.",
      cost: 300,
      icon: "🧘‍♀️",
      type: "service",
      available: totalTokens >= 300,
    },
    {
      id: "r3",
      title: "Premium Yoga Mat",
      desc: "High-quality eco-friendly yoga mat.",
      cost: 500,
      icon: "🎁",
      type: "product",
      available: totalTokens >= 500,
    },
    {
      id: "r4",
      title: "10% Pharmacy Discount",
      desc: "Save on non-prescription products.",
      cost: 200,
      icon: "💊",
      type: "discount",
      available: totalTokens >= 200,
    }
  ], [totalTokens]);

  return (
    <div className="space-y-8">
      
      {/* 1. Header & Stats Cards */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Your Rewards</h2>
          <p className="text-slate-500 mt-1">Earn tokens and unlock exclusive benefits.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tokens Card */}
          <div className="relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/20 flex items-center">
            <div className="relative z-10 flex-1">
              <p className="text-purple-200 text-sm font-bold uppercase tracking-wider mb-1">Total Tokens Earned</p>
              <h3 className="text-5xl font-extrabold flex items-center gap-2">
                {totalTokens}
                <span className="text-2xl">🪙</span>
              </h3>
            </div>
            <div className="text-[6rem] opacity-20 absolute right-4 rotate-12">💰</div>
          </div>

          {/* Level Card */}
          <div className="relative overflow-hidden p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center">
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Current Level</p>
              <h3 className="text-5xl font-extrabold text-slate-900 flex items-center gap-2">
                {currentLevel}
                <span className="text-3xl">🏅</span>
              </h3>
              <div className="mt-4">
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                  <span>Progress to Level {currentLevel + 1}</span>
                  <span>{certificates.length} / {nextLevelThreshold} actions</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-1000"
                    style={{ width: `${progressToNextLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Available Rewards List */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 px-2">Available Rewards</h3>
        <div className="space-y-4">
          {rewards.map((reward) => {
            const progress = Math.min((totalTokens / reward.cost) * 100, 100);
            
            return (
              <div 
                key={reward.id} 
                className={`group relative p-5 rounded-2xl border bg-white transition-all ${
                  reward.available 
                    ? "border-slate-100 hover:border-purple-200 hover:shadow-md" 
                    : "border-slate-50 opacity-80 grayscale-[30%]"
                }`}
              >
                <div className="flex items-center gap-5">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-sm ${
                    reward.available ? "bg-purple-50 text-purple-600" : "bg-slate-50 text-slate-400"
                  }`}>
                    {reward.icon}
                  </div>

                  {/* Info & Progress */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-lg text-slate-900">{reward.title}</h4>
                      <span className={`text-sm font-bold ${reward.available ? 'text-purple-600' : 'text-slate-400'}`}>
                        {reward.cost} 🪙
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{reward.desc}</p>

                    {/* Progress Bar */}
                    {!reward.available && (
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-400 transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="ml-4 flex-shrink-0">
                    <button 
                      disabled={!reward.available}
                      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        reward.available 
                          ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 active:scale-95" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {reward.available ? "Redeem" : "Locked"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}