"use client";

import { useState } from 'react';
import { Plus, X, Globe, Users, Activity, Bell, TrendingUp, MapPin, Calendar, Play, Pause, CheckCircle } from 'lucide-react';

// Données fictives
const MOCK_CAMPAIGNS = [
  {
    id: '1',
    name: 'Campagne Hépatite B Afrique',
    type: 'vaccine',
    actionId: 'hepatitis_b',
    countries: ['SN', 'CI', 'BF', 'ML'],
    status: 'active',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    stats: {
      totalParticipants: 24580,
      targetPopulation: 50000,
      countriesReached: 4,
      avgAge: 28,
      maleCount: 12100,
      femaleCount: 12480
    }
  },
  {
    id: '2',
    name: 'Dépistage Diabète Mondial',
    type: 'screening',
    actionId: 'diabetes',
    countries: ['FR', 'DE', 'ES', 'IT', 'PT'],
    status: 'active',
    startDate: '2025-02-01',
    endDate: '2025-12-31',
    stats: {
      totalParticipants: 18920,
      targetPopulation: 100000,
      countriesReached: 5,
      avgAge: 52,
      maleCount: 9200,
      femaleCount: 9720
    }
  },
  {
    id: '3',
    name: 'COVID-19 Boost Asie',
    type: 'vaccine',
    actionId: 'covid',
    countries: ['VN', 'TH', 'KH', 'LA'],
    status: 'paused',
    startDate: '2024-11-01',
    endDate: '2025-05-31',
    stats: {
      totalParticipants: 42150,
      targetPopulation: 80000,
      countriesReached: 4,
      avgAge: 35,
      maleCount: 20800,
      femaleCount: 21350
    }
  }
];

const MOCK_ALERTS = [
  { id: '1', campaignId: '1', country: 'SN', message: 'Nouvelle campagne de vaccination Hépatite B disponible!', sentAt: '2025-01-15', recipientsCount: 4200 },
  { id: '2', campaignId: '1', country: 'CI', message: 'Nouvelle campagne de vaccination Hépatite B disponible!', sentAt: '2025-01-15', recipientsCount: 3800 },
  { id: '3', campaignId: '2', country: 'FR', message: 'Participez au dépistage diabète gratuit!', sentAt: '2025-02-01', recipientsCount: 12500 },
];

const COUNTRY_NAMES = {
  'SN': 'Sénégal', 'CI': 'Côte d\'Ivoire', 'BF': 'Burkina Faso', 'ML': 'Mali',
  'FR': 'France', 'DE': 'Allemagne', 'ES': 'Espagne', 'IT': 'Italie', 'PT': 'Portugal',
  'VN': 'Vietnam', 'TH': 'Thaïlande', 'KH': 'Cambodge', 'LA': 'Laos'
};

export default function NGODashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalParticipants = campaigns.reduce((sum, c) => sum + c.stats.totalParticipants, 0);
  const totalCountries = [...new Set(campaigns.flatMap(c => c.countries))].length;

  const viewCampaignStats = (campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab('stats');
  };

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 opacity-80" />
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Actives</span>
          </div>
          <p className="text-3xl font-extrabold">{activeCampaigns}</p>
          <p className="text-sm opacity-90 mt-1">Campagnes en cours</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{totalParticipants.toLocaleString()}</p>
          <p className="text-sm text-slate-600 mt-1">Participants totaux</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{totalCountries}</p>
          <p className="text-sm text-slate-600 mt-1">Pays couverts</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{MOCK_ALERTS.length}</p>
          <p className="text-sm text-slate-600 mt-1">Alertes envoyées</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-2 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/80'}`}
        >
          Mes Campagnes
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'alerts' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/80'}`}
        >
          Alertes
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white/80'}`}
        >
          Statistiques
        </button>
      </div>

      {/* Tab Content - Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Campagnes actives</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle campagne
            </button>
          </div>

          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{campaign.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${campaign.status === 'active' ? 'bg-emerald-100 text-emerald-700' : campaign.status === 'paused' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                        {campaign.status === 'active' ? '● En cours' : campaign.status === 'paused' ? '⏸ Pause' : '✓ Terminé'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {campaign.type === 'vaccine' ? '💉 Vaccin' : '🔬 Dépistage'}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {campaign.countries.length} pays
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowAlertModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      Alerte
                    </button>
                    <button
                      onClick={() => viewCampaignStats(campaign)}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
                    >
                      Stats
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Progression</span>
                    <span className="font-bold text-slate-900">
                      {campaign.stats.totalParticipants.toLocaleString()} / {campaign.stats.targetPopulation.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                      style={{width: `${(campaign.stats.totalParticipants / campaign.stats.targetPopulation) * 100}%`}}
                    ></div>
                  </div>
                </div>

                {/* Countries */}
                <div className="flex flex-wrap gap-2">
                  {campaign.countries.map(code => (
                    <span key={code} className="px-3 py-1 bg-white/60 rounded-lg text-sm font-medium text-slate-700">
                      {COUNTRY_NAMES[code] || code}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content - Alerts */}
      {activeTab === 'alerts' && (
        <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Alertes nationales déployées</h2>
              <p className="text-slate-500">Historique des notifications envoyées par campagne et par pays</p>
            </div>
          </div>

          <div className="space-y-3">
            {MOCK_ALERTS.map((alert) => {
              const campaign = campaigns.find(c => c.id === alert.campaignId);
              return (
                <div key={alert.id} className="p-4 bg-white/60 rounded-2xl border border-white/50 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Bell className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">{campaign?.name}</div>
                      <div className="text-sm text-slate-600 mt-1">{alert.message}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {COUNTRY_NAMES[alert.country]}
                        </span>
                        <span>{new Date(alert.sentAt).toLocaleDateString('fr-FR')}</span>
                        <span>{alert.recipientsCount.toLocaleString()} destinataires</span>
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content - Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {selectedCampaign ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedCampaign.name}</h2>
                  <p className="text-slate-500">Statistiques détaillées de la campagne</p>
                </div>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition"
                >
                  Retour
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
                  <Users className="w-8 h-8 text-purple-600 mb-3" />
                  <p className="text-3xl font-extrabold text-slate-900">{selectedCampaign.stats.totalParticipants.toLocaleString()}</p>
                  <p className="text-sm text-slate-600 mt-1">Participants uniques</p>
                </div>

                <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
                  <Globe className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-3xl font-extrabold text-slate-900">{selectedCampaign.stats.countriesReached}</p>
                  <p className="text-sm text-slate-600 mt-1">Pays atteints</p>
                </div>

                <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
                  <TrendingUp className="w-8 h-8 text-emerald-600 mb-3" />
                  <p className="text-3xl font-extrabold text-slate-900">{selectedCampaign.stats.avgAge} ans</p>
                  <p className="text-sm text-slate-600 mt-1">Âge moyen</p>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Répartition par genre</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-700">Hommes</span>
                      <span className="font-bold text-blue-600">
                        {selectedCampaign.stats.maleCount.toLocaleString()}
                        ({Math.round((selectedCampaign.stats.maleCount / selectedCampaign.stats.totalParticipants) * 100)}%)
                      </span>
                    </div>
                    <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                        style={{width: `${(selectedCampaign.stats.maleCount / selectedCampaign.stats.totalParticipants) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-700">Femmes</span>
                      <span className="font-bold text-pink-600">
                        {selectedCampaign.stats.femaleCount.toLocaleString()}
                        ({Math.round((selectedCampaign.stats.femaleCount / selectedCampaign.stats.totalParticipants) * 100)}%)
                      </span>
                    </div>
                    <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-400 to-pink-600"
                        style={{width: `${(selectedCampaign.stats.femaleCount / selectedCampaign.stats.totalParticipants) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Pays participants</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedCampaign.countries.map((code, idx) => (
                    <div key={code} className="p-4 bg-white/60 rounded-xl border border-white/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{COUNTRY_NAMES[code]}</span>
                        <span className="text-2xl font-extrabold text-orange-600">
                          {Math.floor(selectedCampaign.stats.totalParticipants / selectedCampaign.countries.length).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-16 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg text-center">
              <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Sélectionnez une campagne pour voir ses statistiques détaillées</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Create Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Créer une nouvelle campagne</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nom de la campagne</label>
                <input type="text" placeholder="Ex: Campagne Polio Asie" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-3 rounded-xl border-2 border-purple-600 bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition">
                    💉 Vaccin
                  </button>
                  <button className="px-4 py-3 rounded-xl border-2 border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition">
                    🔬 Dépistage
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Vaccin/Dépistage</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>Hépatite B</option>
                  <option>COVID-19</option>
                  <option>Grippe</option>
                  <option>HPV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pays ciblés (un par ligne pour créer une campagne par pays)</label>
                <textarea
                  placeholder="Ex:&#10;France&#10;Allemagne&#10;Espagne"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32"
                ></textarea>
                <p className="text-xs text-slate-500 mt-2">💡 Pour campagnes multinationales, une alerte sera créée par pays</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date de début</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date de fin</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Population cible</label>
                <input type="number" placeholder="Ex: 50000" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea
                  placeholder="Décrivez l'objectif de la campagne..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
                >
                  Créer la campagne
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Deploy Alert */}
      {showAlertModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Déployer une alerte nationale</h3>
              <button onClick={() => setShowAlertModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Campagne:</strong> {selectedCampaign.name}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Une alerte sera envoyée dans chaque pays participant
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message de l'alerte</label>
                <textarea
                  placeholder="Ex: Nouvelle campagne de vaccination disponible! Participez dès maintenant."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pays ciblés ({selectedCampaign.countries.length})</label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl">
                  {selectedCampaign.countries.map(code => (
                    <span key={code} className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-slate-700 border border-slate-200">
                      {COUNTRY_NAMES[code] || code}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Bell className="w-5 h-5" />
                  Envoyer {selectedCampaign.countries.length} alerte{selectedCampaign.countries.length > 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}