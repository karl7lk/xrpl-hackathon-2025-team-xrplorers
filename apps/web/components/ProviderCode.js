"use client";
import { useState } from "react";

export default function ProviderCode({ onBack, onValidated }) {
  const [code, setCode] = useState("");
  const submit = () => { if (code.length !== 6) return alert("Code must be 6 digits."); onValidated(); };

  return (
    <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Enter Provider Code</h3>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
        placeholder="123456"
        className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <div className="flex gap-2">
        <button onClick={onBack} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm">Back</button>
        <button onClick={submit} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm">Validate</button>
      </div>
    </div>
  );
}