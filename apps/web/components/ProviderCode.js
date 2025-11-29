"use client";

import { useState } from "react";

export default function ProviderCode({ onBack, onValidated }) {
  const [code, setCode] = useState("");

  const submit = () => {
    if (code.length !== 6) return alert("Code must be 6 digits.");
    onValidated();
  };

  return (
    <div className="p-6 rounded-xl border border-slate-700 bg-slate-900/40 space-y-4">
      <h3 className="text-lg font-semibold text-slate-200">Enter Provider Code</h3>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
        placeholder="123456"
        className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none"
      />

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
        >
          Back
        </button>

        <button
          onClick={submit}
          className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-sm"
        >
          Validate
        </button>
      </div>
    </div>
  );
}
