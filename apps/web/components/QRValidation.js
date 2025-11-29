"use client";

export default function QRValidation({ onBack, onContinue }) {
  return (
    <div className="p-6 rounded-xl border border-slate-700 bg-slate-900/40 space-y-4">
      <h3 className="text-lg font-semibold text-slate-200">Scan this QR Code</h3>
      <p className="text-sm text-slate-500">
        Ask your doctor or health provider to scan this code to confirm your action.
      </p>

      <div className="mx-auto w-40 h-40 bg-white/90 rounded-lg flex items-center justify-center">
        <span className="text-slate-800 text-xs">[QR CODE]</span>
      </div>

      <button
        onClick={onBack}
        className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
      >
        Back
      </button>
    </div>
  );
}
