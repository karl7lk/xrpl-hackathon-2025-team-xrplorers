"use client";

import { WalletConnector } from "./WalletConnector";
import { useWalletManager } from "../hooks/useWalletManager";
import { useWallet } from "./providers/WalletProvider";

export function Header() {
  useWalletManager();
  const { statusMessage } = useWallet();

  return (
    // Fond blanc cassé semi-transparent + flou
    <header className="sticky top-0 z-50 w-full transition-all">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 w-full h-full bg-[#FDF8F6]/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm pointer-events-none" />

      {/* --- CONTENT LAYER --- */}
      <div className="relative container mx-auto px-6 h-24">
        <div className="flex h-full items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-4 group cursor-pointer select-none">
            {/* Dégradé violet/rose pour le logo */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white drop-shadow-md">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none mb-1 group-hover:text-purple-600 transition-colors">
                PrevHero
              </h1>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
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
                <div className={`flex items-center gap-2 whitespace-nowrap text-xs font-semibold px-4 py-2 rounded-full border shadow-sm ${
                    statusMessage.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                    statusMessage.type === "error" ? "bg-rose-50 text-rose-700 border-rose-200" : 
                    "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {statusMessage.message}
                </div>
              )}
            </div>
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
            <WalletConnector />
          </div>
        </div>
      </div>
    </header>
  );
}