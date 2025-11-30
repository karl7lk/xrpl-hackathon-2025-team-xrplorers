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
      {/* Styles globaux pour les animations personnalisées */}
      <style jsx global>{`
        @keyframes shine-text {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-text-shine {
          background-size: 200% auto;
          animation: shine-text 3s linear infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>

      <h3 className="text-2xl font-bold text-slate-900 px-2">
        My Certificates{" "}
        <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2.5 py-0.5 rounded-full align-middle ml-2">
          On-Chain
        </span>
      </h3>
      <div className="grid gap-3">
        {certificates.map((c) => {
          const explorerBase = accountInfo?.network?.toLowerCase().includes("test")
            ? "https://testnet.xrpscan.com/tx/"
            : "https://xrpscan.com/tx/";
          const nftStatus = c.nftId ? "minted" : "pending";
          const nftHash = c.nftTxHash || null;

          return (
            <div
              key={`${c.id}-${c.txHash}`}
              className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Effet de lueur d'ambiance si NFT minté */}
              {nftStatus === "minted" && (
                <div className="absolute top-[-50%] right-[-10%] w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
              )}

              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-800 font-bold">{c.label}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{new Date(c.date).toLocaleDateString()}</p>
                  
                  {/* --- BADGE 3D CRYPTO STYLE --- */}
                  <div className="flex items-center gap-3 mt-2.5">
                    {nftStatus === "minted" ? (
                      <div className="relative group/badge cursor-default">
                        {/* Ombre solide pour l'effet d'épaisseur 3D */}
                        <div className="absolute inset-0 bg-amber-700/80 rounded-lg translate-y-[3px] group-hover/badge:translate-y-[4px] transition-transform duration-300"></div>
                        
                        {/* Face du Badge */}
                        <div className="relative flex items-center gap-2 px-3 py-1 bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 rounded-lg border-t border-l border-yellow-200 border-b-0 border-r-0 shadow-inner group-hover/badge:-translate-y-[1px] transition-transform duration-300 active:translate-y-[3px]">
                          
                          {/* Icone flottante */}
                          <span className="text-sm filter drop-shadow-sm animate-float-slow">🏆</span>
                          
                          <div className="flex flex-col leading-none">
                            <span className="text-[8px] font-bold text-amber-900 uppercase tracking-wider opacity-80">Reward</span>
                            {/* Texte brillant */}
                            <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-white animate-text-shine drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] font-sans tracking-wide">
                              NFT MINTED
                            </span>
                          </div>
                          
                          {/* Reflet brillant au survol */}
                          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
                        </div>
                      </div>
                    ) : (
                      // Badge "Pending" style flat mais propre
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
                        Pending
                      </span>
                    )}

                    {/* Token ID affiché discrètement */}
                    {c.nftId && (
                      <span className="hidden sm:flex items-center text-[9px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 opacity-80 hover:opacity-100 transition-opacity">
                        ID: <span className="text-slate-600 font-semibold ml-1">#{c.nftId.slice(0, 6)}...</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                {c.txHash ? (
                  <a
                    href={`${explorerBase}${c.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-4 py-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 font-medium flex items-center gap-1"
                  >
                    Proof ↗
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 animate-pulse">Pending...</span>
                )}
                
                {/* Bouton Voir NFT Style Crypto */}
                {nftHash && (
                  <a
                    href={`${explorerBase}${nftHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110 transition-all text-white border border-white/20"
                    title="View NFT Transaction"
                  >
                    <span className="text-xs group-hover/btn:rotate-12 transition-transform">💎</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}