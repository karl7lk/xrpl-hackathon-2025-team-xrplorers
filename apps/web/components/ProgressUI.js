"use client";

export default function ProgressUI({ certificates }) {
  const totalCompleted = certificates.length;

  // Badge logic
  const getBadge = () => {
    if (totalCompleted >= 10) return { label: "Gold Hero", color: "bg-yellow-400" };
    if (totalCompleted >= 5) return { label: "Silver Hero", color: "bg-gray-300" };
    if (totalCompleted >= 3) return { label: "Bronze Hero", color: "bg-orange-400" };
    if (totalCompleted >= 1) return { label: "Rookie", color: "bg-green-400" };
    return null;
  };

  const badge = getBadge();

  // For the progress bar
  const maxGoal = 10; // arbitrary goal for now
  const progressPct = Math.min((totalCompleted / maxGoal) * 100, 100);

  return (
    <div className="space-y-8 mt-10">
      {/* Progress card */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          Your Prevention Progress
        </h3>

        <p className="text-sm text-slate-400 mb-4">
          You have completed <span className="text-sky-400 font-semibold">{totalCompleted}</span>{" "}
          prevention actions.
        </p>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        <p className="text-xs text-slate-500 mt-2">
          Progress: {Math.round(progressPct)}%
        </p>
      </div>

      {/* Badge */}
      {badge && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${badge.color} shadow-md`}></div>

          <div>
            <h3 className="text-lg font-semibold text-slate-200">{badge.label}</h3>
            <p className="text-xs text-slate-500">
              Keep going to unlock the next badge!
            </p>
          </div>
        </div>
      )}

      {/* Rewards card */}
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-2">Rewards</h3>
        <p className="text-sm text-slate-400">
          Partner rewards and prevention incentives will be available in a future version.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Stay tuned — early users may receive exclusive benefits ✨
        </p>
      </div>
    </div>
  );
}
