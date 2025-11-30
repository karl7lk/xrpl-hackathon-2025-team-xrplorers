"use client";

import { WalletConnector } from "./WalletConnector";
import { useWalletManager } from "../hooks/useWalletManager";
import { useWallet } from "./providers/WalletProvider";

export function Header() {
  useWalletManager();
  const { statusMessage } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      
      {/* --- BACKGROUND LAYER --- */}
      {/* Transparence augmentée (bg-slate-950/30) pour un effet plus fusionnel */}
      <div className="absolute inset-0 w-full h-full bg-slate-950/30 backdrop-blur-xl border-b border-white/5 shadow-sm pointer-events-none" />

      {/* --- CONTENT LAYER --- */}
      <div className="relative container mx-auto px-6 h-24">
        <div className="flex h-full items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-4 group cursor-pointer select-none">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white drop-shadow-md">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none mb-1 group-hover:text-sky-400 transition-colors">
                PrevHero
              </h1>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  XRPL Health
                </span>
              </div>
            </div>
          </div>

          {/* WALLET */}
          <div className="flex items-center gap-6">
            <div className={`overflow-hidden transition-all duration-500 ease-out ${statusMessage ? 'max-w-[400px] opacity-100 scale-100' : 'max-w-0 opacity-0 scale-95'}`}>
              {statusMessage && (
                <div className={`flex items-center gap-2 whitespace-nowrap text-xs font-semibold px-4 py-2 rounded-full border shadow-lg ${
                    statusMessage.type === "success" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : 
                    statusMessage.type === "error" ? "bg-rose-500/10 text-rose-300 border-rose-500/20" : 
                    "bg-blue-500/10 text-blue-300 border-blue-500/20"
                  }`}
                >
                  {statusMessage.message}
                </div>
              )}
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
            <WalletConnector />
          </div>
        </div>
      </div>
    </header>
  );
}