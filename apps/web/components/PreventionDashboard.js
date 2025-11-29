"use client";

import { useState, useEffect } from "react";
import { useWallet } from "./providers/WalletProvider";
import ValidationModes from "./ValidationModes";
import QRValidation from "./QRValidation";
import ProviderCode from "./ProviderCode";
import ProgressUI from "./ProgressUI";
import { submitPreventionAction } from "../lib/xrpl";

export default function PreventionDashboard() {
  const { accountInfo, isConnected, walletManager, showStatus } = useWallet();

  // State
  const [ageGroup, setAgeGroup] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [validationMode, setValidationMode] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Static action list
  const actions = [
    { id: "tetanus", label: "Tetanus Booster", type: "vaccine", min: 18, max: 60 },
    { id: "flu", label: "Flu Shot", type: "vaccine", min: 18, max: 99 },
    { id: "wellness", label: "Annual Wellness Check-up", type: "wellness", min: 26, max: 99 },
  ];

  // FIXED FILTER: keep actions whose ranges overlap with selected age
  const filteredActions = ageGroup
    ? actions.filter((action) => {
        const [min, max] = ageGroup.split("-").map(Number);
        return !(action.max < min || action.min > max);
      })
    : [];

  // XRPL Transaction
  async function validateOnChain(action) {
    try {
      setIsProcessing(true);
      showStatus("Waiting for wallet signature…", "info");

      const txHash = await submitPreventionAction(walletManager, accountInfo, action.id);

      setCertificates((prev) => [
        {
          id: action.id,
          label: action.label,
          date: new Date().toISOString(),
          txHash,
          owner: accountInfo.address,
        },
        ...prev,
      ]);

      showStatus("Prevention validated on XRPL!", "success");
    } catch (err) {
      console.error(err);
      showStatus("Transaction failed or rejected", "error");
    } finally {
      setIsProcessing(false);
      setValidationMode(null);
      setPendingAction(null);
    }
  }

  // SELF-REPORT → Auto-run transaction ONCE (fix infinite loop)
  useEffect(() => {
    if (validationMode === "self" && pendingAction) {
      validateOnChain(pendingAction);
    }
  }, [validationMode, pendingAction]);

  // Start validation flow
  function startValidation(action) {
    setPendingAction(action);
    setValidationMode("choose");
  }

  return (
    <div className="space-y-10 mt-10">

      {/* Connected Wallet */}
      {isConnected && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
          <p className="text-slate-400 text-sm">Connected wallet:</p>
          <p className="text-sky-400 font-mono text-sm">{accountInfo?.address}</p>
        </div>
      )}

      {/* Age Selector */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">Choose your age range</h3>

        <div className="grid grid-cols-4 gap-2">
          {["18-25", "26-40", "41-60", "60-99"].map((range) => (
            <button
              key={range}
              onClick={() => setAgeGroup(range)}
              className={`px-4 py-2 rounded-lg border transition ${
                ageGroup === range
                  ? "bg-sky-700 border-sky-500 text-white"
                  : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {range.replace("-", "–")}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      {ageGroup && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">Recommended Actions</h3>

          {filteredActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between bg-slate-800/40 border border-slate-700 rounded-xl p-4"
            >
              <div>
                <p className="text-slate-200 font-medium">{action.label}</p>
                <p className="text-xs text-slate-500">Type: {action.type}</p>
              </div>

              <button
                disabled={isProcessing}
                onClick={() => startValidation(action)}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-600 rounded-lg text-sm text-white"
              >
                {isProcessing ? "Waiting..." : "Validate"}
              </button>
            </div>
          ))}

          {filteredActions.length === 0 && (
            <p className="text-slate-500 text-sm italic">
              No recommended actions for this age range.
            </p>
          )}
        </div>
      )}

      {/* Validation Modes */}
      {validationMode === "choose" && (
        <ValidationModes onModeSelected={setValidationMode} />
      )}

      {validationMode === "qr" && (
        <QRValidation onBack={() => setValidationMode("choose")} />
      )}

      {validationMode === "provider" && (
        <ProviderCode
          onBack={() => setValidationMode("choose")}
          onValidated={() => validateOnChain(pendingAction)}
        />
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">My Prevention Certificates</h3>

          {certificates.map((c) => (
            <div
              key={c.txHash}
              className="p-4 border border-slate-700 bg-slate-800/40 rounded-xl"
            >
              <p className="text-slate-200 font-medium">{c.label}</p>
              <p className="text-xs text-slate-400">{new Date(c.date).toLocaleString()}</p>
              <a
                className="text-xs text-sky-400 hover:underline"
                href={`https://explorer.xrplf.org/transactions/${c.txHash}`}
                target="_blank"
              >
                View on XRPL Explorer
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Progress & Rewards */}
      <ProgressUI certificates={certificates} />
    </div>
  );
}
