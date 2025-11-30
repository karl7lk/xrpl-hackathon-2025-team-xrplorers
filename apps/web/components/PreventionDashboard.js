"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "./providers/WalletProvider";
import ValidationModes from "./ValidationModes";
import QRValidation from "./QRValidation";
import ProviderCode from "./ProviderCode";
import Notifications from "./Notifications";

// IMPORT DES NOUVEAUX ONGLETS
import DashboardTab from "./tabs/DashboardTab";
import ActionsTab from "./tabs/ActionsTab";
import CertificatesTab from "./tabs/CertificatesTab";
import RewardsTab from "./tabs/RewardsTab";

import {
  submitPreventionAction,
  fetchPreventionCertificatesFromChain,
} from "../lib/xrpl";
import { supabase } from "../lib/supabaseClient";

export default function PreventionDashboard() {
  const { accountInfo, isConnected, walletManager, showStatus } = useWallet();

  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState("dashboard");

  // --- DATA STATE ---
  const [certificates, setCertificates] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    birthYear: "",
    gender: "",
    country: "fr",
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [validationMode, setValidationMode] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingChain, setIsLoadingChain] = useState(false);
  const [chainError, setChainError] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  const supabaseReady = Boolean(supabase);
  const [ageBandId, setAgeBandId] = useState(null);
  const [ageBandLabel, setAgeBandLabel] = useState("");

  const countryOptions = [
    { code: "fr", label: "France" },
    { code: "de", label: "Germany" },
    { code: "es", label: "Spain" },
    { code: "it", label: "Italy" },
    { code: "uk", label: "United Kingdom" },
    { code: "ie", label: "Ireland" },
    { code: "nl", label: "Netherlands" },
    { code: "be", label: "Belgium" },
    { code: "pt", label: "Portugal" },
    { code: "pl", label: "Poland" },
  ];

  // Actions & Screenings Data
  const [actions, setActions] = useState([
    { id: "tdap", label: "Tetanus Booster", type: "vaccine", min_age: 18, max_age: 99, icon: "💉" },
    { id: "flu", label: "Seasonal Influenza", type: "vaccine", min_age: 18, max_age: 99, icon: "🦠" },
    { id: "covid", label: "COVID-19 Booster", type: "vaccine", min_age: 18, max_age: 99, icon: "🛡️" },
    { id: "hpv", label: "HPV Vaccine", type: "vaccine", min_age: 18, max_age: 26, icon: "🔬" },
    { id: "shingles", label: "Shingles Vaccine", type: "vaccine", min_age: 60, max_age: 99, icon: "💊" },
    { id: "pneumococcal", label: "Pneumococcal", type: "vaccine", min_age: 65, max_age: 99, icon: "🫁" },
  ]);
  const [screenings, setScreenings] = useState([]);

  // Helpers Logic
  const actionLabelById = useMemo(() => {
    const map = new Map();
    actions.forEach((a) => map.set(a.id, a.label));
    return map;
  }, [actions]);

  const profileValid = profileForm.firstName.trim() !== "" && profileForm.lastName.trim() !== "" && profileForm.birthYear !== "";
  const currentYear = new Date().getFullYear();
  const userAge = profileForm.birthYear ? currentYear - Number(profileForm.birthYear) : null;

  const filteredActions = actions.filter((action) => {
    if (userAge === null || Number.isNaN(userAge)) return false;
    const min = action.min_age ?? 0;
    const max = action.max_age ?? 200;
    return userAge >= min && userAge <= max;
  });

  const filteredScreenings = screenings.filter((s) => {
    if (userAge === null || Number.isNaN(userAge)) return false;
    if (profileForm.gender && s.gender && s.gender !== "any" && s.gender !== profileForm.gender) return false;
    const min = s.min_age ?? 0;
    const max = s.max_age ?? 200;
    return userAge >= min && userAge <= max;
  });

  const pickAgeBandFromAge = (age) => {
    if (age < 0 || age > 130 || Number.isNaN(age)) return { id: null, label: "" };
    if (age <= 18) return { id: "15-18", label: "Teen (15-18)" };
    if (age <= 26) return { id: "19-26", label: "Young Adult (19-26)" };
    if (age <= 44) return { id: "27-44", label: "Adult (27-44)" };
    return { id: "65-plus", label: "Senior (65+)" };
  };

  const doneActionIds = useMemo(() => new Set(certificates.map((c) => c.id)), [certificates]);

  // --- API CALLS ---
  async function validateOnChain(action) {
    if (!isConnected) return;
    try {
      setIsProcessing(true);
      const txHash = await submitPreventionAction(walletManager, accountInfo, action.id);
      setCertificates((prev) => [{ id: action.id, label: action.label, date: new Date().toISOString(), txHash, owner: accountInfo.address }, ...prev]);
      if (supabaseReady) await supabase.from("certificates").upsert({ wallet: accountInfo.address, action_id: action.id, label: action.label, tx_hash: txHash }, { onConflict: "wallet,action_id" });
      showStatus("Prevention validated on XRPL!", "success");
    } catch (err) { showStatus("Transaction failed", "error"); } 
    finally { setIsProcessing(false); setValidationMode(null); setPendingAction(null); }
  }

  useEffect(() => { if (validationMode === "self" && pendingAction) validateOnChain(pendingAction); }, [validationMode, pendingAction]);

  // Updates Age Band
  useEffect(() => {
    if (!profileForm.birthYear) { setAgeBandId(null); setAgeBandLabel(""); return; }
    const age = currentYear - Number(profileForm.birthYear);
    const band = pickAgeBandFromAge(age);
    setAgeBandId(band.id);
    setAgeBandLabel(band.label);
  }, [profileForm.birthYear]);

  function startValidation(action) { setPendingAction(action); setValidationMode("choose"); }

  // Load Profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!supabaseReady || !accountInfo?.address) return;
      setIsLoadingProfile(true);
      try {
        const { data } = await supabase.from("profiles").select("*").eq("wallet", accountInfo.address).single();
        if (data) {
          setProfile(data);
          setProfileForm({ firstName: data.first_name, lastName: data.last_name, birthYear: data.birth_year, gender: data.gender, country: data.country || "fr" });
        } else { setShowProfileForm(true); }
      } catch (err) { console.error(err); } 
      finally { setIsLoadingProfile(false); }
    };
    loadProfile();
  }, [accountInfo?.address, supabaseReady]);

  // Save Profile
  async function saveProfile() {
    setIsSavingProfile(true);
    try {
      const payload = { wallet: accountInfo.address, first_name: profileForm.firstName, last_name: profileForm.lastName, birth_year: Number(profileForm.birthYear), gender: profileForm.gender, country: profileForm.country };
      if (supabaseReady) await supabase.from("profiles").upsert(payload, { onConflict: 'wallet' });
      setProfile(payload); setShowProfileForm(false); showStatus("Saved!", "success");
    } catch (err) { showStatus("Error saving", "error"); } 
    finally { setIsSavingProfile(false); }
  }

  // Load Certificates
  useEffect(() => {
    const loadFromChain = async () => {
      if (!accountInfo?.address) return;
      setIsLoadingChain(true);
      try {
        const onChain = await fetchPreventionCertificatesFromChain(accountInfo.address);
        setCertificates(prev => {
          const merged = [...prev];
          onChain.forEach(c => {
            if (!merged.find(i => i.id === c.actionId)) merged.push({ id: c.actionId, label: actionLabelById.get(c.actionId) || c.actionId, date: c.date, txHash: c.txHash, owner: accountInfo.address });
          });
          return merged;
        });
      } catch (err) { setChainError("Sync error"); } 
      finally { setIsLoadingChain(false); }
    };
    loadFromChain();
  }, [accountInfo?.address, actionLabelById]);

  // Load Data
  useEffect(() => {
    const loadVaccines = async () => {
      if (!supabaseReady || !ageBandId) return;
      const { data } = await supabase.from("vaccines").select("*").eq("age_band_id", ageBandId);
      if(data) setActions(data.map(d => ({ ...d, icon: "💉" })));
    };
    loadVaccines();
  }, [supabaseReady, ageBandId]);

  useEffect(() => {
    const loadScreenings = async () => {
      if (!supabaseReady) return;
      const { data } = await supabase.from("screenings").select("*");
      if(data) setScreenings(data);
    };
    loadScreenings();
  }, [supabaseReady]);


  // --- RENDER ---
  if (activeTab === "notifications") return <Notifications onBack={() => setActiveTab("dashboard")} />;

  return (
    <div className="relative space-y-8">
      
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#FDF8F6]"></div>
        <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-purple-200/30 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      <div className="relative z-10 space-y-8">
        
        {/* Tabs */}
        <div className="flex justify-center pt-4">
          <div className="inline-flex p-1 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/40">
            {['dashboard', 'actions', 'certificates', 'rewards'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${
                  activeTab === tab ? "bg-purple-600 text-white shadow-md transform scale-105" : "text-slate-500 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeTab === "dashboard" && (
            <DashboardTab 
              profile={profile} 
              userAge={userAge} 
              ageBandLabel={ageBandLabel} 
              certificates={certificates}
              totalActionsCount={filteredActions.length} 
              onEditProfile={() => setShowProfileForm(true)} 
            />
          )}

          {activeTab === "actions" && (
            <ActionsTab 
              userAge={userAge}
              filteredActions={filteredActions}
              filteredScreenings={filteredScreenings}
              doneActionIds={doneActionIds}
              isConnected={isConnected}
              isProcessing={isProcessing}
              onValidate={startValidation}
            />
          )}

          {activeTab === "certificates" && (
            <CertificatesTab 
              certificates={certificates} 
              accountInfo={accountInfo} 
            />
          )}

          {activeTab === "rewards" && (
            <RewardsTab 
              certificates={certificates} 
            />
          )}

        </div>
      </div>

      {/* --- MODALE PROFIL AVEC FLOU ULTIME (Z-9999) --- */}
      {showProfileForm && isConnected && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-8 space-y-6 relative animate-in zoom-in-95 duration-300">
            
            <div className="text-center space-y-2">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">Required setup</p>
              <h3 className="text-3xl font-extrabold text-slate-900">Link your profile to this wallet</h3>
              <p className="text-slate-500 text-sm">Fill these details to personalize recommendations.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                value={profileForm.firstName} onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="First Name" />
              
              <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                value={profileForm.lastName} onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="Last Name" />
              
              <input type="number" min="1900" max="2100" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                value={profileForm.birthYear} onChange={(e) => setProfileForm((p) => ({ ...p, birthYear: e.target.value }))} placeholder="Birth Year" />
              
              <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                value={profileForm.gender || ""} onChange={(e) => setProfileForm((p) => ({ ...p, gender: e.target.value }))}>
                <option value="" disabled>Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="nonbinary">Non-binary</option>
              </select>

              <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none md:col-span-2" 
                value={profileForm.country} onChange={(e) => setProfileForm((p) => ({ ...p, country: e.target.value }))}>
                {countryOptions.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>

            <div className="flex gap-4 pt-2">
              <button onClick={saveProfile} disabled={!profileValid || isSavingProfile} className="flex-1 py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 shadow-lg shadow-purple-500/30 disabled:opacity-50">
                {isSavingProfile ? "Saving..." : "Save Profile"}
              </button>
              {profile && (
                <button onClick={() => setShowProfileForm(false)} className="px-8 py-4 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50">
                  Cancel
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {validationMode && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-2xl relative">
            <button onClick={() => setValidationMode(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
            {validationMode === "choose" && <ValidationModes onModeSelected={setValidationMode} />}
            {validationMode === "qr" && <QRValidation onBack={() => setValidationMode("choose")} />}
            {validationMode === "provider" && <ProviderCode onBack={() => setValidationMode("choose")} onValidated={() => validateOnChain(pendingAction)} />}
          </div>
        </div>
      )}
    </div>
  );
}