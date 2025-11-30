"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "./providers/WalletProvider";
import ValidationModes from "./ValidationModes";
import QRValidation from "./QRValidation";
import ProviderCode from "./ProviderCode";
import ProgressUI from "./ProgressUI";
import {
  submitPreventionAction,
  fetchPreventionCertificatesFromChain,
} from "../lib/xrpl";
import { supabase } from "../lib/supabaseClient";

export default function PreventionDashboard() {
  const { accountInfo, isConnected, walletManager, showStatus } = useWallet();

  // State
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
  const [profileError, setProfileError] = useState(null);
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

  const [actions, setActions] = useState([
    { id: "tdap", label: "Tetanus Booster", type: "vaccine", min_age: 18, max_age: 99, icon: "💉" },
    { id: "flu", label: "Seasonal Influenza", type: "vaccine", min_age: 18, max_age: 99, icon: "🦠" },
    { id: "covid", label: "COVID-19 Booster", type: "vaccine", min_age: 18, max_age: 99, icon: "🛡️" },
    { id: "hpv", label: "HPV Vaccine", type: "vaccine", min_age: 18, max_age: 26, icon: "🔬" },
    { id: "shingles", label: "Shingles Vaccine", type: "vaccine", min_age: 60, max_age: 99, icon: "💊" },
    { id: "pneumococcal", label: "Pneumococcal", type: "vaccine", min_age: 65, max_age: 99, icon: "🫁" },
  ]);
  const [screenings, setScreenings] = useState([]);

  const actionLabelById = useMemo(() => {
    const map = new Map();
    actions.forEach((a) => map.set(a.id, a.label));
    return map;
  }, [actions]);

  const profileValid =
    profileForm.firstName.trim() !== "" &&
    profileForm.lastName.trim() !== "" &&
    profileForm.birthYear !== "";

  const currentYear = new Date().getFullYear();
  const userAge = profileForm.birthYear
    ? currentYear - Number(profileForm.birthYear)
    : null;

  // Filter actions
  const filteredActions = actions.filter((action) => {
    if (userAge === null || Number.isNaN(userAge)) return false;
    const min = action.min_age ?? action.min ?? 0;
    const max = action.max_age ?? action.max ?? 200;
    return userAge >= min && userAge <= max;
  });

  const filteredScreenings = screenings.filter((s) => {
    if (userAge === null || Number.isNaN(userAge)) return false;
    if (profileForm.gender && s.gender && s.gender !== "any" && s.gender !== profileForm.gender) {
      return false;
    }
    const min = s.min_age ?? 0;
    const max = s.max_age ?? 200;
    return userAge >= min && userAge <= max;
  });

  const pickAgeBandFromAge = (age) => {
    if (age < 0 || age > 130 || Number.isNaN(age)) return { id: null, label: "" };
    if (age < 1) return { id: "0-11m", label: "Infant (0-11m)" };
    if (age < 2) return { id: "12-23m", label: "Toddler (12-23m)" };
    if (age <= 5) return { id: "2-5", label: "Early Childhood (2-5)" };
    if (age <= 10) return { id: "6-10", label: "Child (6-10)" };
    if (age <= 14) return { id: "11-14", label: "Pre-Teen (11-14)" };
    if (age <= 18) return { id: "15-18", label: "Teen (15-18)" };
    if (age <= 26) return { id: "19-26", label: "Young Adult (19-26)" };
    if (age <= 44) return { id: "27-44", label: "Adult (27-44)" };
    if (age <= 64) return { id: "45-64", label: "Middle Age (45-64)" };
    return { id: "65-plus", label: "Senior (65+)" };
  };

  const doneActionIds = useMemo(() => new Set(certificates.map((c) => c.id)), [certificates]);

  // XRPL Transaction
  async function validateOnChain(action) {
    if (!isConnected || !accountInfo?.address) {
      showStatus("Please connect your wallet first", "warning");
      return;
    }

    if (doneActionIds.has(action.id)) {
      showStatus("Already validated on-chain", "info");
      return;
    }

    try {
      setIsProcessing(true);
      showStatus("Waiting for wallet signature...", "info");

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

      if (supabaseReady) {
        await supabase.from("certificates").upsert(
          {
            wallet: accountInfo.address,
            action_id: action.id,
            label: action.label,
            date: new Date().toISOString(),
            tx_hash: txHash,
            validation_mode: validationMode || "self",
          },
          { onConflict: "wallet,action_id" }
        );
      }

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

  // Auto-run transaction
  useEffect(() => {
    if (validationMode === "self" && pendingAction) {
      validateOnChain(pendingAction);
    }
  }, [validationMode, pendingAction]);

  // Update age band
  useEffect(() => {
    if (!profileForm.birthYear) {
      setAgeBandId(null);
      setAgeBandLabel("");
      return;
    }
    const age = currentYear - Number(profileForm.birthYear);
    const band = pickAgeBandFromAge(age);
    setAgeBandId(band.id);
    setAgeBandLabel(band.label);
  }, [profileForm.birthYear]);

  function startValidation(action) {
    setPendingAction(action);
    setValidationMode("choose");
  }

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!supabaseReady || !accountInfo?.address) return;
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("wallet", accountInfo.address)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          setProfile(data);
          setProfileForm({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            birthYear: data.birth_year || "",
            gender: data.gender || "",
            country: data.country || "fr",
          });
          const age = data.birth_year ? currentYear - Number(data.birth_year) : null;
          const band = age !== null ? pickAgeBandFromAge(age) : { id: null, label: "" };
          setAgeBandId(band.id);
          setAgeBandLabel(band.label);
          setShowProfileForm(false);
        } else {
          setShowProfileForm(true);
        }
      } catch (err) {
        console.error("Profile load failed", err);
        setProfileError("Could not load profile. Using local mode.");
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadProfile();
  }, [accountInfo?.address, supabaseReady]);

  // Save profile CORRIGÉ
  async function saveProfile() {
    if (!supabaseReady || !accountInfo?.address) return;
    setIsSavingProfile(true);
    setProfileError(null);
    try {
      const payload = {
        wallet: accountInfo.address,
        first_name: profileForm.firstName,
        last_name: profileForm.lastName,
        birth_year: profileForm.birthYear ? Number(profileForm.birthYear) : null,
        gender: profileForm.gender || null,
        country: profileForm.country || null,
      };
      
      // FIX: Ajout de onConflict: 'wallet' pour gérer l'update si le profil existe déjà
      const { data, error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: 'wallet' })
        .select()
        .single();
        
      if (error) throw error;
      
      setProfile(data);
      setShowProfileForm(false);
      showStatus("Profile saved successfully", "success");
    } catch (err) {
      console.error("Save profile failed", err);
      setProfileError("Failed to save profile: " + err.message);
      showStatus("Failed to save profile", "error");
    } finally {
      setIsSavingProfile(false);
    }
  }

  // Load certificates
  useEffect(() => {
    const loadFromChain = async () => {
      if (!accountInfo?.address) return;
      setChainError(null);
      setIsLoadingChain(true);
      try {
        const onChain = await fetchPreventionCertificatesFromChain(accountInfo.address);
        setCertificates((prev) => {
          const merged = [...prev];
          onChain.forEach((c) => {
            const already = merged.find((item) => item.id === c.actionId);
            if (!already) {
              merged.push({
                id: c.actionId,
                label: actionLabelById.get(c.actionId) || c.actionId,
                date: c.date,
                txHash: c.txHash,
                owner: accountInfo.address,
              });
            }
          });
          return merged;
        });
      } catch (err) {
        console.error("Failed to fetch on-chain certificates", err);
        setChainError("Could not sync with blockchain.");
      } finally {
        setIsLoadingChain(false);
      }
    };
    loadFromChain();
  }, [accountInfo?.address, actionLabelById]);

  // Load vaccines
  useEffect(() => {
    const loadVaccines = async () => {
      if (!supabaseReady || !ageBandId) return;
      try {
        const { data, error } = await supabase
          .from("vaccines")
          .select("id,label,age_band_id,type,notes,min_age,max_age")
          .eq("age_band_id", ageBandId);
        if (error) throw error;
        setActions(
          (data || []).map((d) => ({
            id: d.id,
            label: d.label,
            type: d.type,
            min_age: d.min_age,
            max_age: d.max_age,
            notes: d.notes,
            icon: "💉",
          }))
        );
      } catch (err) {
        console.error("Failed to load vaccines", err);
      }
    };
    loadVaccines();
  }, [supabaseReady, ageBandId]);

  // Load screenings
  useEffect(() => {
    const loadScreenings = async () => {
      if (!supabaseReady) return;
      try {
        const { data, error } = await supabase
          .from("screenings")
          .select("id,label,min_age,max_age,gender,notes");
        if (error) throw error;
        setScreenings(data || []);
      } catch (err) {
        console.error("Failed to load screenings", err);
      }
    };
    loadScreenings();
  }, [supabaseReady]);

  return (
    <div className="relative space-y-12">
      
      {/* --- DYNAMIC BACKGROUND (Aurora Blobs) --- */}
      {/* IMPORTANT : z-0 pour le fond, et le contenu du dashboard sera en z-10 pour passer au-dessus */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-slate-950"></div>
        
        {/* Blob 1 : Purple/Pink (Haut Droite) - Opacité boostée */}
        <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-purple-500/30 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000 opacity-70"></div>
        
        {/* Blob 2 : Sky/Blue (Haut Gauche) */}
        <div className="absolute top-[0%] -left-[10%] w-[600px] h-[600px] bg-sky-500/30 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-4000 opacity-70"></div>
        
        {/* Blob 3 : Pink/Rose (Milieu) */}
        <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-6000 opacity-60"></div>

        {/* Blob 4 : Emerald (Bas) */}
        <div className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] bg-emerald-500/20 rounded-full blur-[100px] mix-blend-screen animate-blob opacity-60"></div>
        
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* WRAPPER CONTENU (z-10 pour passer au-dessus du fond) */}
      <div className={`relative z-10 space-y-8 ${showProfileForm ? "blur-sm pointer-events-none transition-all duration-300" : ""}`}>
        
        {/* --- SECTION PROFIL --- */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 shadow-2xl hover:border-white/20 transition-all duration-500">
          {/* Glow Effect Local */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              {/* Avatar Placeholder */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-sky-500/30 border border-white/10">
                {profile ? profile.first_name[0] : "👤"}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                  {profile ? `Hello, ${profile.first_name}` : "Welcome to PrevHero"}
                </h2>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  {profile ? (
                    <>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">Verified</span>
                      <span>•</span>
                      <span>{ageBandLabel}</span>
                      <span>•</span>
                      <span>{profile.country?.toUpperCase()}</span>
                    </>
                  ) : (
                    <span className="italic text-slate-400">Anonymous User</span>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowProfileForm(true)}
              className="px-6 py-3 rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 hover:shadow-lg transition-all active:scale-95"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* --- SECTION ACTIONS (GRID) --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              Recommended Actions
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
                {filteredActions.length}
              </span>
            </h3>
          </div>

          {userAge === null || Number.isNaN(userAge) ? (
            <div className="p-12 rounded-3xl border border-dashed border-white/10 bg-white/5 text-center backdrop-blur-sm">
              <p className="text-lg text-slate-200 font-semibold mb-2">Let's get started!</p>
              <p className="text-slate-400">Please set your birth year in the profile to see tailored recommendations.</p>
            </div>
          ) : filteredActions.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5">
              {filteredActions.map((action) => {
                const isDone = doneActionIds.has(action.id);
                return (
                  <div
                    key={action.id}
                    className={`relative group p-6 rounded-3xl border transition-all duration-300 backdrop-blur-md ${
                      isDone 
                        ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10" 
                        : "border-white/10 bg-white/[0.03] hover:border-sky-500/30 hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-900/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 text-sky-400 border border-white/5'}`}>
                          {action.icon || "💉"}
                        </div>
                        <div>
                          <h4 className={`font-bold text-lg ${isDone ? "text-emerald-100" : "text-white"}`}>
                            {action.label}
                          </h4>
                          <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{action.type}</span>
                        </div>
                      </div>
                      {isDone && (
                        <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </div>
                    
                    {action.notes && <p className="text-sm text-slate-400 mb-6 leading-relaxed line-clamp-2 pl-1">{action.notes}</p>}

                    <button
                      disabled={isProcessing || !isConnected || isDone}
                      onClick={() => startValidation(action)}
                      className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all transform active:scale-95 ${
                        isDone
                          ? "bg-transparent text-emerald-500/50 cursor-default"
                          : "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:brightness-110"
                      } disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                    >
                      {isDone ? "Completed" : isProcessing ? "Processing..." : "Validate Action"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-3xl border border-white/5 bg-white/5 text-center text-slate-400">
              You're all caught up! No specific recommendations for now.
            </div>
          )}
        </div>

        {/* --- SECTION SCREENINGS (LIST) --- */}
        {userAge !== null && !Number.isNaN(userAge) && filteredScreenings.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-200 px-2">Screening Checklist</h3>
            <div className="space-y-3">
              {filteredScreenings.map((s) => (
                <div key={s.id} className="flex items-center gap-5 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                  <div className="flex-1">
                    <p className="text-slate-200 font-semibold">{s.label}</p>
                    <p className="text-sm text-slate-500">Recommended for ages {s.min_age}-{s.max_age}</p>
                  </div>
                  {s.notes && <span className="text-xs text-slate-400 italic px-3 py-1 rounded-full bg-white/5 border border-white/5">{s.notes}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- STATUS CHAIN --- */}
        {(isLoadingChain || chainError) && (
          <div className="flex justify-center py-4">
            {isLoadingChain && <p className="text-xs text-slate-500 animate-pulse flex items-center gap-2"><span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></span>Syncing with XRPL...</p>}
            {chainError && <p className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">{chainError}</p>}
          </div>
        )}

        {/* --- MODES DE VALIDATION --- */}
        {validationMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
              <button 
                onClick={() => { setValidationMode(null); setPendingAction(null); }}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              {validationMode === "choose" && <ValidationModes onModeSelected={setValidationMode} />}
              {validationMode === "qr" && <QRValidation onBack={() => setValidationMode("choose")} />}
              {validationMode === "provider" && (
                <ProviderCode onBack={() => setValidationMode("choose")} onValidated={() => validateOnChain(pendingAction)} />
              )}
            </div>
          </div>
        )}

        {/* --- CERTIFICATS --- */}
        {certificates.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-white/5">
            <h3 className="text-xl font-bold text-white px-2 flex items-center gap-2">
              My Certificates
              <span className="text-xs font-bold text-sky-300 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">On-Chain</span>
            </h3>
            <div className="grid gap-3">
              {certificates.map((c) => {
                const explorerBase = accountInfo?.network?.toLowerCase().includes("test")
                  ? "https://testnet.xrpscan.com/tx/"
                  : "https://xrpscan.com/tx/";
                
                return (
                  <div key={`${c.id}-${c.txHash}`} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-sky-500/30 transition-all hover:bg-slate-900/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-slate-200 font-bold">{c.label}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{new Date(c.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {c.txHash ? (
                      <a
                        href={`${explorerBase}${c.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-4 py-2 rounded-full bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-colors border border-sky-500/10 font-medium flex items-center gap-1 hover:shadow-[0_0_10px_rgba(14,165,233,0.3)]"
                      >
                        View Proof ↗
                      </a>
                    ) : (
                      <span className="text-xs text-slate-600 animate-pulse">Pending...</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- PROGRESS --- */}
        <ProgressUI certificates={certificates} />
      </div>

      {/* --- MODAL PROFIL (FULL SCREEN BLUR) --- */}
      {showProfileForm && isConnected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl p-8 relative">
            
            {/* Header Modal */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Edit Profile</h3>
              <p className="text-slate-400">Complete your details to get personalized recommendations.</p>
            </div>

            {profileError && <p className="text-sm text-rose-400 mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">{profileError}</p>}

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">First Name</label>
                <input
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all placeholder:text-slate-600"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Last Name</label>
                <input
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all placeholder:text-slate-600"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Birth Year</label>
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all placeholder:text-slate-600"
                  value={profileForm.birthYear}
                  onChange={(e) => setProfileForm((p) => ({ ...p, birthYear: e.target.value }))}
                  placeholder="2000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Country</label>
                <select
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all appearance-none"
                  value={profileForm.country}
                  onChange={(e) => setProfileForm((p) => ({ ...p, country: e.target.value }))}
                >
                  {countryOptions.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-white/5">
              <button
                onClick={saveProfile}
                disabled={!profileValid || isSavingProfile}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-sky-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingProfile ? "Saving..." : "Save Profile"}
              </button>
              <button
                onClick={() => setShowProfileForm(false)}
                className="px-8 py-4 rounded-2xl bg-transparent border border-white/10 text-slate-300 font-medium hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}