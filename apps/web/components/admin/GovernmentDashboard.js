"use client";

import { useState } from 'react';
import { Plus, X, AlertCircle, CheckCircle, TrendingUp, Users, Activity, Calendar } from 'lucide-react';

// Données fictives
const MOCK_VACCINES = [
  { id: 'hepatitis_b', label: 'Hépatite B', type: 'mandatory', ageBand: '0-1 ans', stats: { count: 12450, coverage: 94 } },
  { id: 'dtc', label: 'DTC (Diphtérie, Tétanos, Coqueluche)', type: 'mandatory', ageBand: '0-1 ans', stats: { count: 12100, coverage: 91 } },
  { id: 'hpv', label: 'Papillomavirus (HPV)', type: 'mandatory', ageBand: '11-14 ans', stats: { count: 8920, coverage: 68 } },
  { id: 'flu', label: 'Grippe saisonnière', type: 'recommended', ageBand: '65+ ans', stats: { count: 25600, coverage: 72 } },
  { id: 'covid', label: 'COVID-19', type: 'recommended', ageBand: 'Tous âges', stats: { count: 48200, coverage: 85 } },
];

const MOCK_SCREENINGS = [
  { id: 'breast_cancer', label: 'Dépistage cancer du sein', type: 'mandatory', gender: 'female', ageBand: '50-74 ans', stats: { count: 18400, coverage: 62 } },
  { id: 'colorectal', label: 'Dépistage cancer colorectal', type: 'mandatory', ageBand: '50-74 ans', stats: { count: 22100, coverage: 58 } },
  { id: 'diabetes', label: 'Dépistage diabète', type: 'recommended', ageBand: '45+ ans', stats: { count: 31200, coverage: 71 } },
];

const MOCK_STATS_BY_AGE = [
  { age: '0-10', vaccines: 3850, screenings: 120 },
  { age: '11-20', vaccines: 2940, screenings: 450 },
  { age: '21-30', vaccines: 4120, screenings: 1200 },
  { age: '31-40', vaccines: 5240, screenings: 2800 },
  { age: '41-50', vaccines: 6890, screenings: 4100 },
  { age: '51-60', vaccines: 8420, screenings: 6700 },
  { age: '61-70', vaccines: 9120, screenings: 8200 },
  { age: '71+', vaccines: 7680, screenings: 7500 },
];

export default function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [requirements, setRequirements] = useState([...MOCK_VACCINES, ...MOCK_SCREENINGS]);

  const totalActions = requirements.reduce((sum, r) => sum + r.stats.count, 0);
  const avgCoverage = Math.round(requirements.reduce((sum, r) => sum + r.stats.coverage, 0) / requirements.length);
  const mandatoryCount = requirements.filter(r => r.type === 'mandatory').length;

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 opacity-80" />
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-extrabold">{totalActions.toLocaleString()}</p>
          <p className="text-sm opacity-90 mt-1">Actes enregistrés</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{avgCoverage}%</p>
          <p className="text-sm text-slate-600 mt-1">Couverture moyenne</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{mandatoryCount}</p>
          <p className="text-sm text-slate-600 mt-1">Prérequis obligatoires</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">2.4M</p>
          <p className="text-sm text-slate-600 mt-1">Population couverte</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-2 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/80'}`}
        >
          Vue d'ensemble
        </button>
        <button
          onClick={() => setActiveTab('requirements')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'requirements' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/80'}`}
        >
          Gestion prérequis
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/80'}`}
        >
          Statistiques
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Couverture vaccinale */}
          <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Couverture vaccinale nationale</h2>
                <p className="text-slate-500">Taux de vaccination par vaccin obligatoire</p>
              </div>
              <button className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition">
                📊 Export rapport
              </button>
            </div>

            <div className="space-y-4">
              {MOCK_VACCINES.filter(v => v.type === 'mandatory').map((vaccine) => (
                <div key={vaccine.id} className="p-4 bg-white/60 rounded-2xl border border-white/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <span className="font-bold text-slate-700">{vaccine.label}</span>
                      <span className="ml-3 text-sm text-slate-500">{vaccine.ageBand}</span>
                    </div>
                    <span className="font-mono text-purple-600 font-bold text-lg">{vaccine.stats.coverage}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{width: `${vaccine.stats.coverage}%`}}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {vaccine.stats.count.toLocaleString()} personnes vaccinées
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dépistages */}
          <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Dépistages obligatoires</h2>
            <div className="space-y-4">
              {MOCK_SCREENINGS.filter(s => s.type === 'mandatory').map((screening) => (
                <div key={screening.id} className="p-4 bg-white/60 rounded-2xl border border-white/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <span className="font-bold text-slate-700">{screening.label}</span>
                      <span className="ml-3 text-sm text-slate-500">{screening.ageBand}</span>
                      {screening.gender && <span className="ml-2 text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">{screening.gender === 'female' ? 'Femmes' : 'Hommes'}</span>}
                    </div>
                    <span className="font-mono text-purple-600 font-bold text-lg">{screening.stats.coverage}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{width: `${screening.stats.coverage}%`}}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {screening.stats.count.toLocaleString()} dépistages réalisés
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requirements' && (
        <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Gestion des prérequis sanitaires</h2>
              <p className="text-slate-500">Ajouter ou modifier les vaccins et dépistages obligatoires/conseillés</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter prérequis
            </button>
          </div>

          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.id} className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center justify-between hover:shadow-md transition">
                <div className="flex items-center gap-4 flex-1">
                  {req.type === 'mandatory' ?
                    <AlertCircle className="w-6 h-6 text-red-600" /> :
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  }
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{req.label}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                      <span>{req.ageBand}</span>
                      {req.gender && <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs">{req.gender}</span>}
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-bold ${req.type === 'mandatory' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {req.type === 'mandatory' ? 'Obligatoire' : 'Conseillé'}
                  </div>
                </div>
                <button className="ml-4 p-2 hover:bg-red-100 rounded-lg transition text-slate-400 hover:text-red-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Statistiques par tranche d'âge</h2>
            <div className="space-y-3">
              {MOCK_STATS_BY_AGE.map((stat) => (
                <div key={stat.age} className="p-4 bg-white/60 rounded-xl border border-white/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-900">{stat.age} ans</span>
                    <span className="text-sm text-slate-500">{(stat.vaccines + stat.screenings).toLocaleString()} actes totaux</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Vaccinations</div>
                      <div className="text-2xl font-bold text-purple-600">{stat.vaccines.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Dépistages</div>
                      <div className="text-2xl font-bold text-emerald-600">{stat.screenings.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Répartition par genre</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Femmes</span>
                    <span className="font-bold text-pink-600">52%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-400 to-pink-600 w-[52%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Hommes</span>
                    <span className="font-bold text-blue-600">48%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-[48%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Évolution mensuelle</h3>
              <div className="space-y-2">
                {['Janvier', 'Février', 'Mars', 'Avril'].map((month, idx) => (
                  <div key={month} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-20">{month}</span>
                    <div className="flex-1 h-8 bg-slate-200 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                        style={{width: `${65 + idx * 7}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{(8500 + idx * 1200).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter prérequis */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Ajouter un prérequis sanitaire</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Vaccin</option>
                  <option>Dépistage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nom</label>
                <input type="text" placeholder="Ex: Hépatite B" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tranche d'âge</label>
                  <input type="text" placeholder="Ex: 0-1 ans" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Genre</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Tous</option>
                    <option>Femmes</option>
                    <option>Hommes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Statut</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-3 rounded-xl border-2 border-red-600 bg-red-50 text-red-700 font-bold hover:bg-red-100 transition">
                    ⚠️ Obligatoire
                  </button>
                  <button className="px-4 py-3 rounded-xl border-2 border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition">
                    ✓ Conseillé
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}