"use client";

import { useState, useRef, useEffect } from "react";
import PreventionDashboard from "../components/PreventionDashboard";
import { Header } from "../components/Header";
import { useWallet } from "../components/providers/WalletProvider";

export default function HomePage() {
  const { isConnected } = useWallet();

  return (
    // Fond clair défini dans globals, texte sombre par défaut
    <div className="min-h-screen font-sans overflow-x-hidden selection:bg-purple-200 selection:text-purple-900">
      <Header />

      <main>
        {isConnected ? (
          /* --- DASHBOARD (Connecté) --- */
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-slate-500 text-lg">Manage your prevention actions and certificates.</p>
            </div>
            {/* Fond blanc, ombre douce, bordure légère */}
            <section className="rounded-[2.5rem] border border-slate-200/60 bg-white p-1 shadow-xl shadow-slate-200/50">
              <PreventionDashboard />
            </section>
          </div>
        ) : (
          /* --- LANDING PAGE (Non Connecté) --- */
          <LandingPage />
        )}
      </main>
    </div>
  );
}

// --- LANDING PAGE COMPONENT ---
function LandingPage() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleMouseMove = (e) => {
    if (typeof window === 'undefined') return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / innerWidth;
    const y = (e.clientY - innerHeight / 2) / innerHeight;
    setMousePosition({ x, y });
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerWalletConnection = () => {
    setShowOnboarding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        const walletBtn = document.querySelector('xrpl-wallet-connector');
        if(walletBtn) {
            walletBtn.shadowRoot?.querySelector('button')?.click();
            const header = document.querySelector('header');
            if(header) {
                header.classList.add('ring-2', 'ring-purple-500', 'ring-offset-2');
                setTimeout(() => header.classList.remove('ring-2', 'ring-purple-500', 'ring-offset-2'), 1000);
            }
        }
    }, 800);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full"
    >
      {/* --- BACKGROUND FIXE (Pastel Aurora) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#FDF8F6]"></div>
        {/* Blobs couleurs pastels (Purple/Pink/Orange) */}
        <div className="absolute -top-[20%] right-[10%] w-[800px] h-[800px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse-slow transition-transform duration-700 ease-out" style={{ transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)` }} />
        <div className="absolute top-[10%] -left-[10%] w-[700px] h-[700px] bg-pink-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-80 transition-transform duration-700 ease-out" style={{ transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)` }} />
        <div className="absolute bottom-[-20%] left-[30%] w-[900px] h-[600px] bg-orange-100/60 rounded-full blur-[120px] mix-blend-multiply transition-transform duration-700 ease-out" style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150"></div>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 flex flex-col gap-32 pb-32">
        
        {/* HERO SECTION */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-white/50 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-top-8 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
            </span>
            <span className="text-xs font-bold text-purple-700 tracking-wide uppercase">New Prevention Protocol</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm max-w-5xl leading-[1.1] mb-8">
            Your Health. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 animate-gradient-x">
              Immortalized.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed font-normal mb-12">
            Secure your medical history on the <strong>XRPL</strong>. 
            Prove your health status with zero-knowledge principles and earn rewards for staying healthy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <button 
              onClick={() => setShowOnboarding(true)}
              className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/10 active:scale-95 transform"
            >
              Start Now
            </button>
            <button 
              onClick={scrollToFeatures}
              className="px-8 py-4 rounded-full border border-slate-200 bg-white/60 text-slate-900 font-medium text-lg hover:bg-white/80 backdrop-blur-md transition-colors flex items-center gap-2 active:scale-95 transform shadow-sm"
            >
              Learn More 
              <svg className="w-4 h-4 animate-bounce text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </section>

        {/* FEATURES SECTION (Bento Grid Light) */}
        <section id="features" className="container mx-auto px-6 scroll-mt-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Everything you need.</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">A powerful suite of tools to manage your health identity on the blockchain.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <div className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 flex flex-col justify-between hover:border-purple-200 shadow-xl shadow-slate-200/40 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 text-2xl">🛡️</div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">Sovereign Identity</h3>
                <p className="text-slate-500 text-lg leading-relaxed">Your health data belongs to you. Not a clinic, not an insurer. Connect your wallet and take full control.</p>
              </div>
              <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-100 rounded-full blur-[80px] group-hover:bg-purple-200/50 transition-colors duration-700"></div>
            </div>
            <div className="md:row-span-2 group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 flex flex-col hover:border-pink-200 shadow-xl shadow-slate-200/40 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center mb-6 text-2xl">✨</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Future Rewards</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">Building your "PrevHero" reputation unlocks real-world value.</p>
              <div className="space-y-3 relative z-10 mt-auto">
                {["Insurance Discounts", "Gym Memberships", "Wellness Airdrops"].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-xs font-bold text-white">{i + 1}</div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 flex flex-col justify-center hover:border-emerald-200 shadow-xl shadow-slate-200/40 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-[60px] -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 text-2xl">⚡</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Blazing Fast</h3>
                <p className="text-slate-500">Transactions settle in 3-5s. No waiting rooms on-chain.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 flex flex-col justify-center hover:border-blue-200 shadow-xl shadow-slate-200/40 transition-all duration-500">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-[60px] -ml-16 -mb-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 text-2xl">🔒</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Privacy First</h3>
                <p className="text-slate-500">Zero-knowledge principles. Verify status without revealing data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-bold tracking-widest uppercase text-sm mb-2 block">The Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Simple. Secure. Forever.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Step num="01" title="Connect" desc="Link your Xaman or Crossmark wallet. No email needed." color="text-purple-600" bg="bg-purple-100" />
            <Step num="02" title="Validate" desc="Get a vaccination or screening. Scan a QR code to prove it." color="text-pink-600" bg="bg-pink-100" />
            <Step num="03" title="Earn" desc="Receive your NFT certificate and boost your health score." color="text-orange-600" bg="bg-orange-100" />
          </div>
        </section>
      </div>

      {/* --- MODALE ONBOARDING (Light) --- */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
            
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-100 rounded-full blur-[60px]"></div>
            
            <div className="relative z-10 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to secure your health?</h3>
                <p className="text-slate-500 leading-relaxed">
                  To use PrevHero, you need a crypto wallet. It acts as your <strong>digital passport</strong>: you own your data, and no one can take it away from you.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left text-sm space-y-3">
                <div className="flex gap-3">
                  <div className="text-emerald-500 font-bold">✓</div>
                  <span className="text-slate-600">No email or password required.</span>
                </div>
                <div className="flex gap-3">
                  <div className="text-emerald-500 font-bold">✓</div>
                  <span className="text-slate-600">Your history is stored on the XRPL blockchain.</span>
                </div>
                <div className="flex gap-3">
                  <div className="text-emerald-500 font-bold">✓</div>
                  <span className="text-slate-600">Totally free to start on Testnet.</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={triggerWalletConnection}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-lg hover:shadow-lg hover:shadow-slate-500/20 transition-all active:scale-95"
                >
                  Connect Wallet
                </button>
                <button 
                  onClick={() => setShowOnboarding(false)}
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  I don't have a wallet yet (Learn More)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function Step({ num, title, desc, color, bg }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all">
      <div className={`w-16 h-16 rounded-2xl ${bg} ${color} flex items-center justify-center text-2xl font-bold mb-2`}>{num}</div>
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}