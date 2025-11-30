"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import PreventionDashboard from "../components/PreventionDashboard";
import { Header } from "../components/Header";
import { useWallet } from "../components/providers/WalletProvider";

export default function HomePage() {
  const { isConnected } = useWallet();

  return (
    // min-h-screen assure que la page fait au moins la hauteur de l'écran
    <div className="relative min-h-screen font-sans overflow-x-hidden bg-[#FDF8F6] selection:bg-purple-200 selection:text-purple-900">
      
      {/* --- FOND GLOBAL (Déplacé ici pour ne pas être coincé dans la carte) --- */}
      {isConnected && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[#FDF8F6]"></div>
          {/* Blob Violet animé */}
          <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-purple-200/30 rounded-full blur-[100px] animate-blob"></div>
          {/* Texture granuleuse */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
        </div>
      )}

      <Header />
      
      <main className="relative z-10">
        {isConnected ? (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-slate-500 text-lg">Manage your prevention actions and certificates.</p>
            </div>
            
            {/* La carte contient maintenant uniquement le dashboard, plus le fond */}
            <section className="rounded-[2.5rem] border border-white/50 bg-white/60 backdrop-blur-xl p-1 shadow-xl shadow-slate-200/20">
              <PreventionDashboard />
            </section>
          </div>
        ) : (
          <LandingPage />
        )}
      </main>
    </div>
  );
}

function LandingPage() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

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
                header.classList.add('ring-4', 'ring-purple-400', 'ring-opacity-50');
                setTimeout(() => header.classList.remove('ring-4', 'ring-purple-400', 'ring-opacity-50'), 1500);
            }
        }
    }, 500);
  };

  const glassCardClass = "rounded-[2.5rem] border border-white/50 bg-white/40 backdrop-blur-xl p-10 shadow-lg shadow-purple-500/5 hover:bg-white/50 hover:border-white/80 hover:shadow-purple-500/10 transition-all duration-500";

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#FDF8F6]"></div>
        <div 
            className="absolute top-[-10%] left-[20%] w-[700px] h-[700px] bg-purple-600/50 rounded-full blur-[100px] mix-blend-multiply animate-aurora-1 will-change-transform"
            style={{ transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px)` }} 
        />
        <div 
            className="absolute bottom-[5%] right-[5%] w-[600px] h-[600px] bg-pink-600/50 rounded-full blur-[90px] mix-blend-multiply animate-aurora-2 will-change-transform"
            style={{ transform: `translate(${mousePosition.x * 35}px, ${mousePosition.y * 35}px)` }} 
        />
        <div 
            className="absolute top-[30%] left-[-15%] w-[800px] h-[800px] bg-violet-600/40 rounded-full blur-[110px] mix-blend-multiply animate-aurora-3 will-change-transform"
            style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` }} 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-32 pb-32">
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-200 bg-white/60 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-top-8 duration-1000 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
            </span>
            <span className="text-xs font-bold text-purple-700 tracking-wide uppercase">New Prevention Protocol</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm max-w-5xl leading-[1.1] mb-8">
            Your Health. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 animate-gradient-x">
              Immortalized.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed font-normal mb-12">
            Secure your medical history on the <strong>XRPL</strong>. 
            Prove your health status with zero-knowledge principles and earn rewards for staying healthy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <button onClick={() => setShowOnboarding(true)} className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 transform">Start Now</button>
            <button onClick={scrollToFeatures} className="px-8 py-4 rounded-full border border-slate-200 bg-white/60 text-slate-900 font-medium text-lg hover:bg-white/80 backdrop-blur-md transition-colors flex items-center gap-2 active:scale-95 transform shadow-sm">
              Learn More <svg className="w-4 h-4 animate-bounce text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </section>

        <section id="features" className="container mx-auto px-6 scroll-mt-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Everything you need.</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">A powerful suite of tools to manage your health identity on the blockchain.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <div className={`md:col-span-2 group relative overflow-hidden flex flex-col justify-between ${glassCardClass}`}>
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center mb-6 text-2xl shadow-sm">🛡️</div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">Sovereign Identity</h3>
                <p className="text-slate-600 text-lg leading-relaxed">Your health data belongs to you. Not a clinic, not an insurer. Connect your wallet and take full control.</p>
              </div>
              <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-400/20 rounded-full blur-[80px] group-hover:bg-purple-400/30 transition-colors duration-700"></div>
            </div>
            <div className={`md:row-span-2 group relative overflow-hidden flex flex-col ${glassCardClass}`}>
              <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center mb-6 text-2xl shadow-sm">✨</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Future Rewards</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">Building your "PrevHero" reputation unlocks real-world value.</p>
              <div className="space-y-3 relative z-10 mt-auto">
                {["Insurance Discounts", "Gym Memberships", "Wellness Airdrops"].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-white/50 backdrop-blur-md transition-transform hover:scale-105">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">{i + 1}</div>
                    <span className="text-slate-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`group relative overflow-hidden flex flex-col justify-center ${glassCardClass}`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-emerald-400/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center mb-6 text-2xl shadow-sm">⚡</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Blazing Fast</h3>
                <p className="text-slate-600">Transactions settle in 3-5s.</p>
              </div>
            </div>
            <div className={`group relative overflow-hidden flex flex-col justify-center ${glassCardClass}`}>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-[60px] -ml-16 -mb-16 group-hover:bg-blue-400/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center mb-6 text-2xl shadow-sm">🔒</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Privacy First</h3>
                <p className="text-slate-600">Zero-knowledge principles.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-bold tracking-widest uppercase text-sm mb-2 block">The Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Simple. Secure. Forever.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Step num="01" title="Connect" desc="Link your Xaman or Crossmark wallet. No email needed." color="text-purple-600" bg="bg-purple-100/50" />
            <Step num="02" title="Validate" desc="Get a vaccination or screening. Scan a QR code to prove it." color="text-pink-600" bg="bg-pink-100/50" />
            <Step num="03" title="Earn" desc="Receive your NFT certificate and boost your health score." color="text-orange-600" bg="bg-orange-100/50" />
          </div>
        </section>
      </div>

      {showOnboarding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-400/30 rounded-full blur-[60px]"></div>
            <div className="relative z-10 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to secure your health?</h3>
                <p className="text-slate-500 leading-relaxed">To use PrevHero, you need a crypto wallet.</p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button onClick={triggerWalletConnection} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-95">Connect Wallet</button>
                <button onClick={() => setShowOnboarding(false)} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">I don't have a wallet yet</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADMIN LOGIN BUTTON (Ajout ici) --- */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => router.push('/admin/login')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
          title="Admin Access"
        >
          <Shield className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </div>

    </div>
  );
}

function Step({ num, title, desc, color, bg }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-3xl border border-white/60 bg-white/40 backdrop-blur-lg shadow-sm hover:shadow-xl hover:bg-white/50 transition-all">
      <div className={`w-16 h-16 rounded-2xl ${bg} ${color} flex items-center justify-center text-2xl font-bold mb-2 backdrop-blur-sm`}>{num}</div>
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}