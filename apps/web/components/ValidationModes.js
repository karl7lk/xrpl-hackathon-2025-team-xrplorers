"use client";

export default function ValidationModes({ onModeSelected }) {
  const modes = [
    {
      id: "qr",
      title: "Scan QR Code",
      description: "Let a health provider scan your QR code.",
    },
    {
      id: "provider",
      title: "Provider Code",
      description: "Enter a 6-digit code provided by a doctor.",
    },
    {
      id: "self",
      title: "Self-Report",
      description: "Confirm that you performed the prevention yourself.",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-200">
        Choose Validation Mode
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeSelected(mode.id)}
            className="p-4 rounded-xl border border-slate-700 bg-slate-900/40 hover:bg-slate-800 transition text-left"
          >
            <h4 className="text-md font-medium text-sky-400">{mode.title}</h4>
            <p className="text-xs text-slate-400 mt-1">
              {mode.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
