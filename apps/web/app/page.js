"use client";
import PreventionDashboard from "../components/PreventionDashboard";

import { Header } from "../components/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* 🔹 HEADER AVEC CONNECT WALLET */}
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* 🔹 SECTION HERO */}
        <section className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <p className="inline-flex rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-medium tracking-wide uppercase text-sky-300">
              PrevHero · XRPL Hackathon
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              PrevHero
            </h1>

            <p className="text-lg text-slate-300">
              XRPL-powered health prevention tracker{" "}
              <span className="block text-slate-400 text-base">
                (vaccines, screenings, check-ups).
              </span>
            </p>

            <p className="text-sm text-slate-400">
              Connect your XRPL wallet, complete prevention actions, and turn
              them into verifiable certificates on-chain.
            </p>

            <div className="text-xs text-slate-500">
              💡 Use the <strong>“Connect Wallet”</strong> button in the header
              to link your XRPL address.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg space-y-4">
            <p className="text-sm font-medium text-slate-200">
              Why PrevHero?
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Keep track of vaccines, screenings, and health check-ups.</li>
              <li>• Get on-chain certificates you truly own.</li>
              <li>• Prepare for future partner rewards and incentives.</li>
            </ul>
            <p className="text-[11px] text-slate-500">
              No medical results are stored — only proofs that a prevention
              action happened.
            </p>
          </div>
        </section>

<section
  id="dashboard"
  className="rounded-2xl border border-slate-700 bg-slate-900/40 p-6"
>
  <PreventionDashboard />
</section>


        {/* 🔹 SECTION DEV TOOLS */}
        <section
          id="dev-tools"
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
        >
          <p className="text-sm font-semibold text-slate-200 mb-2">
            XRPL Dev Tools
          </p>
          <p className="text-sm text-slate-500">
            Use the built-in XRPL tools from Scaffold-XRP (faucet, network
            switcher, debug panel) to test your prevention certificates on
            Testnet.
          </p>
        </section>
      </main>
    </div>
  );
}
