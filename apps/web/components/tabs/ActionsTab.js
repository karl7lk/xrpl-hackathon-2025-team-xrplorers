"use client";

import { useState } from "react";

export default function ActionsTab({ 
  userAge, 
  filteredActions, 
  filteredScreenings, 
  doneActionIds, 
  isConnected, 
  isProcessing, 
  onValidate 
}) {
  // État local pour le filtre actif
  const [activeFilter, setActiveFilter] = useState("all");

  // Définition des catégories de filtres
  const filterCategories = [
    { id: "all", label: "All Actions", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg> },
    { id: "vaccine", label: "Vaccines", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> }, // Placeholder icon
    { id: "screening", label: "Screenings", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg> },
    { id: "checkup", label: "Check-ups", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
  ];

  // Logique de filtrage combinée pour l'affichage
  const getDisplayItems = () => {
    let items = [];
    // On combine les actions (vaccins) et les screenings pour un affichage unifié
    if (activeFilter === 'all' || activeFilter === 'vaccine') {
      items = [...items, ...filteredActions.map(a => ({...a, category: 'vaccine', frequency: a.notes || "Recommended"}))];
    }
    if (activeFilter === 'all' || activeFilter === 'screening') {
      items = [...items, ...filteredScreenings.map(s => ({...s, category: 'screening', frequency: s.notes || "Routine", icon: "🩺"}))];
    }
    // (Ajouter d'autres types si nécessaire pour 'checkup' etc.)
    return items;
  };

  const displayItems = getDisplayItems();

  // Si profil incomplet
  if (userAge === null || Number.isNaN(userAge)) {
    return (
      <div className="p-12 rounded-[2rem] border border-dashed border-slate-300 bg-white/50 text-center mt-8">
        <p className="text-lg text-slate-700 font-semibold mb-2">Profile Incomplete</p>
        <p className="text-slate-500">Please go to the Dashboard tab and edit your profile to see tailored recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* 1. HEADER & FILTERS (Design Maquette) */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Prevention Actions</h2>
          <p className="text-slate-500 mt-1">Browse available actions tailored to your profile.</p>
        </div>

        {/* Barre de filtres "Pilules" */}
        <div className="flex flex-wrap gap-3">
          {filterCategories.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white border-transparent shadow-md shadow-purple-500/20"
                  : "bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50"
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. GRID DES ACTIONS (Nouveau Design de Carte) */}
      {displayItems.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {displayItems.map((item) => {
            const isDone = doneActionIds.has(item.id);
            const isVaccine = item.category === 'vaccine';

            return (
              <div
                key={item.id}
                className={`relative p-6 rounded-[2rem] border bg-white transition-all duration-300 flex flex-col justify-between group ${
                  isDone 
                    ? "border-emerald-200 bg-emerald-50/30" 
                    : "border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5"
                }`}
              >
                <div>
                  {/* Card Header: Title + Icon */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-bold text-xl text-slate-900 line-clamp-1">{item.label}</h4>
                      {/* Utilisation du type ou d'une description courte comme sous-titre */}
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        {isVaccine ? "Immunization" : "Early Detection"}
                      </p>
                    </div>
                    {/* Icone Carrée */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg transition-colors ${isDone ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-purple-500 shadow-purple-500/30 group-hover:bg-purple-600'}`}>
                      {item.icon || "🛡️"}
                    </div>
                  </div>

                  {/* Details Section (Lignes avec séparateurs) */}
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                      <span className="text-slate-400 font-medium">Age Range</span>
                      <span className="text-slate-700 font-bold">{item.min_age} - {item.max_age}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                      <span className="text-slate-400 font-medium">Frequency</span>
                      {/* On utilise 'notes' comme frequency si dispo, sinon une valeur par défaut */}
                      <span className="text-slate-700 font-bold capitalize">{item.frequency}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-sm">
                      <span className="text-slate-400 font-medium">Category</span>
                       <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${isVaccine ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Bouton d'action (Gradient) */}
                <button
                  disabled={isProcessing || !isConnected || isDone}
                  // Seuls les vaccins sont validables pour l'instant dans ton code d'origine
                  onClick={() => isVaccine ? onValidate(item) : null} 
                  className={`w-full py-4 rounded-xl text-sm font-bold transition-all shadow-lg ${
                    isDone
                      ? "bg-slate-100 text-slate-400 cursor-default border border-slate-200 shadow-none"
                      : isVaccine
                        ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-purple-500/30 hover:brightness-110 hover:shadow-purple-500/50 active:scale-95"
                        : "bg-slate-800 text-white cursor-not-allowed opacity-70 shadow-none" // Style pour les screenings non validables
                  }`}
                >
                  {isDone ? "Action Completed" : isVaccine ? "Validate This Action" : "Informational Only"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-[2rem] border border-slate-100 bg-white text-center text-slate-500">
          No actions found for the selected filter.
        </div>
      )}
    </div>
  );
}