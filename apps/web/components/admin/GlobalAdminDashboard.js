"use client";

import { useState } from 'react';
import { Plus, X, Shield, Users, Gift, QrCode, CheckCircle, XCircle, Clock, Settings, Activity, DollarSign } from 'lucide-react';

// Données fictives
const MOCK_ADMIN_REQUESTS = [
  { id: '1', email: 'sante@gouv.fr', organization: 'Ministère de la Santé France', roleRequested: 'government', status: 'pending', reason: 'Gestion des vaccinations nationales', createdAt: '2025-11-28' },
  { id: '2', email: 'contact@msf.org', organization: 'Médecins Sans Frontières', roleRequested: 'ngo', status: 'pending', reason: 'Campagnes vaccinales internationales', createdAt: '2025-11-29' },
  { id: '3', email: 'admin@who.int', organization: 'WHO Regional Office', roleRequested: 'ngo', status: 'approved', reason: 'Programmes de dépistage globaux', createdAt: '2025-11-25' },
];

const MOCK_ADMIN_USERS = [
  { id: '1', email: 'admin@prevhero.com', organization: 'PrevHero', role: 'global_admin', status: 'active', lastLogin: '2025-11-30' },
  { id: '2', email: 'sante@gouv.sn', organization: 'Ministère Santé Sénégal', role: 'government', countryCode: 'SN', status: 'active', lastLogin: '2025-11-29' },
  { id: '3', email: 'contact@who.int', organization: 'WHO', role: 'ngo', status: 'active', lastLogin: '2025-11-28' },
];

const MOCK_BENEFITS = [
  { id: '1', partnerName: 'Pharmacie Plus', benefitType: 'discount', title: '-20% sur tous les produits', discountPercentage: 20, code: 'PREV20', validUntil: '2025-12-31', minCertificates: 5, countries: null, status: 'active' },
  { id: '2', partnerName: 'FitGym', benefitType: 'voucher', title: '1 mois gratuit', code: 'FIT1MONTH', validUntil: '2026-06-30', minCertificates: 10, countries: ['FR', 'BE'], status: 'active' },
  { id: '3', partnerName: 'HealthyFood', benefitType: 'discount', title: '-15% épicerie bio', discountPercentage: 15, code: 'BIO15', validUntil: '2025-12-31', minCertificates: 3, countries: null, status: 'active' },
];

const MOCK_MEDICAL_PROVIDERS = [
  { id: '1', providerCode: 'FRHOP-A8F3D2', organizationName: 'Hôpital Saint-Louis', organizationType: 'hospital', countryCode: 'FR', authorizedActions: ['vaccine', 'screening'], status: 'active', usesCount: 1284 },
  { id: '2', providerCode: 'SNCLI-B9E4C1', organizationName: 'Clinique Dantec', organizationType: 'clinic', countryCode: 'SN', authorizedActions: ['vaccine'], status: 'active', usesCount: 856 },
  { id: '3', providerCode: 'DELAB-C2D5A3', organizationName: 'Labor Berlin', organizationType: 'lab', countryCode: 'DE', authorizedActions: ['screening'], status: 'active', usesCount: 2103 },
];

export default function GlobalAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddBenefitModal, setShowAddBenefitModal] = useState(false);
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const pendingRequests = MOCK_ADMIN_REQUESTS.filter(r => r.status === 'pending').length;
  const totalAdmins = MOCK_ADMIN_USERS.length;
  const activeBenefits = MOCK_BENEFITS.filter(b => b.status === 'active').length;
  const totalProviders = MOCK_MEDICAL_PROVIDERS.length;

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-lg shadow-slate-500/30">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 opacity-80" />
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Admins</span>
          </div>
          <p className="text-3xl font-extrabold">{totalAdmins}</p>
          <p className="text-sm opacity-90 mt-1">Comptes admin actifs</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            {pendingRequests > 0 && <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{pendingRequests}</span>}
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{pendingRequests}</p>
          <p className="text-sm text-slate-600 mt-1">Demandes en attente</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Gift className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{activeBenefits}</p>
          <p className="text-sm text-slate-600 mt-1">Avantages partenaires</p>
        </div>

        <div className="p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <QrCode className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{totalProviders}</p>
          <p className="text-sm text-slate-600 mt-1">Centres médicaux</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-2 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-white/80'}`}
        >
          Vue d'ensemble
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'requests' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-white/80'}`}
        >
          Demandes
          {pendingRequests > 0 && <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingRequests}</span>}
        </button>
        <button
          onClick={() => setActiveTab('benefits')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'benefits' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-white/80'}`}
        >
          Avantages
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'providers' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-white/80'}`}
        >
          Centres médicaux
        </button>
      </div>

      {/* Tab Content - Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Comptes administrateurs</h2>
              <div className="space-y-3">
                {MOCK_ADMIN_USERS.slice(0, 4).map(admin => (
                  <div key={admin.id} className="p-3 bg-white/60 rounded-xl border border-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className={`w-5 h-5 ${admin.role === 'global_admin' ? 'text-slate-900' : admin.role === 'government' ? 'text-purple-600' : 'text-orange-600'}`} />
                      <div>
                        <div className="font-bold text-sm text-slate-900">{admin.organization}</div>
                        <div className="text-xs text-slate-500">{admin.email}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${admin.role === 'global_admin' ? 'bg-slate-100 text-slate-700' : admin.role === 'government' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                      {admin.role === 'global_admin' ? 'Global' : admin.role === 'government' ? 'Gov' : 'NGO'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Activité récente</h2>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-900">Demande approuvée</span>
                  </div>
                  <p className="text-xs text-emerald-700">WHO Regional Office - NGO</p>
                  <p className="text-xs text-emerald-600 mt-1">Il y a 2 jours</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Gift className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-900">Nouveau partenaire</span>
                  </div>
                  <p className="text-xs text-blue-700">FitGym - Avantage fitness</p>
                  <p className="text-xs text-blue-600 mt-1">Il y a 3 jours</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-purple-900">QR Code généré</span>
                  </div>
                  <p className="text-xs text-purple-700">Labor Berlin - Allemagne</p>
                  <p className="text-xs text-purple-600 mt-1">Il y a 5 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content - Requests */}
      {activeTab === 'requests' && (
        <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Demandes de comptes admin</h2>
              <p className="text-slate-500">Approuver ou rejeter les nouvelles demandes</p>
            </div>
          </div>

          <div className="space-y-3">
            {MOCK_ADMIN_REQUESTS.map(request => (
              <div key={request.id} className="p-4 bg-white/60 rounded-2xl border border-white/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900">{request.organization}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${request.status === 'pending' ? 'bg-orange-100 text-orange-700' : request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {request.status === 'pending' ? '⏳ En attente' : request.status === 'approved' ? '✓ Approuvé' : '✗ Rejeté'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${request.roleRequested === 'government' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                        {request.roleRequested === 'government' ? 'Gouvernement' : 'ONG'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mb-2">
                      <strong>Email:</strong> {request.email}
                    </div>
                    <div className="text-sm text-slate-600 mb-2">
                      <strong>Raison:</strong> {request.reason}
                    </div>
                    <div className="text-xs text-slate-500">
                      Demande créée le {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRequestModal(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approuver
                      </button>
                      <button className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Rejeter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content - Benefits */}
      {activeTab === 'benefits' && (
        <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Avantages partenaires</h2>
              <p className="text-slate-500">Gérer les réductions et avantages offerts aux utilisateurs</p>
            </div>
            <button
              onClick={() => setShowAddBenefitModal(true)}
              className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter avantage
            </button>
          </div>

          <div className="grid gap-4">
            {MOCK_BENEFITS.map(benefit => (
              <div key={benefit.id} className="p-5 bg-white/60 rounded-2xl border border-white/50 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Gift className="w-6 h-6 text-purple-600" />
                      <h3 className="font-bold text-slate-900 text-lg">{benefit.partnerName}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        ● Actif
                      </span>
                    </div>
                    <p className="text-slate-700 mb-3">{benefit.title}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Code promo</div>
                        <div className="font-mono font-bold text-purple-600">{benefit.code}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Validité</div>
                        <div className="font-medium text-slate-700">{new Date(benefit.validUntil).toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Min. certificats</div>
                        <div className="font-bold text-slate-900">{benefit.minCertificates}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Portée</div>
                        <div className="font-medium text-slate-700">{benefit.countries ? benefit.countries.join(', ') : 'Mondial'}</div>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-700">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content - Medical Providers */}
      {activeTab === 'providers' && (
        <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Centres médicaux autorisés</h2>
              <p className="text-slate-500">Gérer les QR codes et codes d'accès pour validation d'actes médicaux</p>
            </div>
            <button
              onClick={() => setShowAddProviderModal(true)}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouveau centre
            </button>
          </div>

          <div className="grid gap-4">
            {MOCK_MEDICAL_PROVIDERS.map(provider => (
              <div key={provider.id} className="p-5 bg-white/60 rounded-2xl border border-white/50 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <QrCode className="w-6 h-6 text-blue-600" />
                      <h3 className="font-bold text-slate-900 text-lg">{provider.organizationName}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        ● Actif
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {provider.organizationType === 'hospital' ? 'Hôpital' : provider.organizationType === 'clinic' ? 'Clinique' : 'Laboratoire'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Code provider</div>
                        <div className="font-mono font-bold text-blue-600">{provider.providerCode}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Pays</div>
                        <div className="font-medium text-slate-700">{provider.countryCode}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Actes autorisés</div>
                        <div className="flex gap-1">
                          {provider.authorizedActions.includes('vaccine') && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">💉 Vaccin</span>}
                          {provider.authorizedActions.includes('screening') && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">🔬 Dépistage</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Utilisations</div>
                        <div className="font-bold text-slate-900">{provider.usesCount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition">
                    Voir QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Benefit */}
      {showAddBenefitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Ajouter un avantage partenaire</h3>
              <button onClick={() => setShowAddBenefitModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nom du partenaire</label>
                <input type="text" placeholder="Ex: Pharmacie Plus" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Type d'avantage</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Réduction (%)</option>
                  <option>Montant fixe</option>
                  <option>Voucher/Bon</option>
                  <option>Service gratuit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Titre de l'offre</label>
                  <input type="text" placeholder="Ex: -20% sur tous les produits" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Code promo</label>
                  <input type="text" placeholder="Ex: PREV20" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Pourcentage/Montant</label>
                  <input type="number" placeholder="20" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Validité jusqu'au</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Minimum de certificats requis</label>
                  <input type="number" placeholder="5" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Portée géographique</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Mondial</option>
                    <option>Pays spécifiques</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea placeholder="Détails de l'avantage..." className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={() => setShowAddBenefitModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition">
                  Annuler
                </button>
                <button onClick={() => setShowAddBenefitModal(false)} className="flex-1 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Provider */}
      {showAddProviderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Ajouter un centre médical</h3>
              <button onClick={() => setShowAddProviderModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nom de l'organisation</label>
                <input type="text" placeholder="Ex: Hôpital Saint-Louis" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Type d'organisation</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Hôpital</option>
                    <option>Clinique</option>
                    <option>Pharmacie</option>
                    <option>Laboratoire</option>
                    <option>ONG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Code pays</label>
                  <input type="text" placeholder="Ex: FR" maxLength="2" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Actes médicaux autorisés</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 bg-purple-50 border-2 border-purple-200 rounded-xl cursor-pointer hover:bg-purple-100 transition">
                    <input type="checkbox" className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">💉 Vaccinations</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl cursor-pointer hover:bg-emerald-100 transition">
                    <input type="checkbox" className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-emerald-900">🔬 Dépistages</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Adresse</label>
                <textarea placeholder="Adresse complète du centre" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email de contact</label>
                  <input type="email" placeholder="contact@centre.fr" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone</label>
                  <input type="tel" placeholder="+33 1 23 45 67 89" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-900">
                  💡 Un code provider unique et un QR code seront automatiquement générés après validation
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={() => setShowAddProviderModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition">
                  Annuler
                </button>
                <button onClick={() => setShowAddProviderModal(false)} className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition">
                  Générer QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Approve Request */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Approuver la demande</h3>
              <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-sm text-emerald-900 mb-2">
                <strong>Organisation:</strong> {selectedRequest.organization}
              </p>
              <p className="text-sm text-emerald-900 mb-2">
                <strong>Email:</strong> {selectedRequest.email}
              </p>
              <p className="text-sm text-emerald-900">
                <strong>Rôle demandé:</strong> {selectedRequest.roleRequested === 'government' ? 'Gouvernement' : 'ONG'}
              </p>
            </div>

            {selectedRequest.roleRequested === 'government' && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Code pays (domaine d'action)</label>
                <input type="text" placeholder="Ex: FR" maxLength="2" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent uppercase" />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe temporaire</label>
              <input type="text" value="temp-password-123" readOnly className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 font-mono" />
              <p className="text-xs text-slate-500 mt-2">Ce mot de passe sera envoyé par email à l'admin</p>
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={() => setShowRequestModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition">
                Annuler
              </button>
              <button onClick={() => setShowRequestModal(false)} className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Approuver et envoyer email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}