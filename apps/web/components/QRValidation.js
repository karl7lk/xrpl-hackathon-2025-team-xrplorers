"use client";

export default function QRValidation({ onBack, onContinue }) {
  return (
    <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 space-y-4 text-center">
      <h3 className="text-lg font-semibold text-slate-800">Scan this QR Code</h3>
      <p className="text-sm text-slate-500">
        Ask your doctor or health provider to scan this code to confirm your action.
      </p>
      <div className="mx-auto w-40 h-40 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
        <span className="text-slate-400 text-xs">[QR CODE GENERATOR]</span>
      </div>
      <button onClick={onBack} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm">Back</button>
    </div>
  );
}