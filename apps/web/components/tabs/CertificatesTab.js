"use client";

export default function CertificatesTab({ certificates, accountInfo }) {
  if (certificates.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
        <p className="text-slate-400 text-lg">No certificates found on-chain yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-slate-900 px-2">
        My Certificates <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2.5 py-0.5 rounded-full align-middle ml-2">On-Chain</span>
      </h3>
      <div className="grid gap-3">
        {certificates.map((c) => {
          const explorerBase = accountInfo?.network?.toLowerCase().includes("test")
            ? "https://testnet.xrpscan.com/tx/"
            : "https://xrpscan.com/tx/";
          
          return (
            <div key={`${c.id}-${c.txHash}`} className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-slate-800 font-bold">{c.label}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{new Date(c.date).toLocaleDateString()}</p>
                </div>
              </div>
              {c.txHash ? (
                <a
                  href={`${explorerBase}${c.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-4 py-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 font-medium flex items-center gap-1"
                >
                  View Proof ↗
                </a>
              ) : (
                <span className="text-xs text-slate-400 animate-pulse">Pending...</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}