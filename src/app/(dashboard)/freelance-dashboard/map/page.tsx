// src/app/(dashboard)/freelance-dashboard/map/page.tsx
// Page carte pour les chauffeurs - Affiche les clients avec annonces

'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { NavigooPoi, RouteInfo } from '@/type/navigoo';
import { navigooService } from '@/service/navigooService';
import { 
  MapIcon, 
  ArrowPathIcon, 
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

// Import dynamique du composant carte (obligatoire pour SSR)
const NavigooMap = dynamic(
  () => import('@/components/navigoo/NavigooMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-500">Chargement de la carte...</p>
        </div>
      </div>
    )
  }
);

// Import dynamique de la sidebar
const NavigooSidebar = dynamic(
  () => import('@/components/navigoo/NavigooSidebar'),
  { ssr: false }
);

// Import dynamique du PoiInfoCard
const PoiInfoCard = dynamic(
  () => import('@/components/navigoo/PoiInfoCard'),
  { ssr: false }
);

const DriverMapPage: React.FC = () => {
  const router = useRouter();
  const [selectedPoi, setSelectedPoi] = useState<NavigooPoi | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteInfo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // Gérer le clic sur un POI
  const handlePoiClick = useCallback((poi: NavigooPoi) => {
    setSelectedPoi(poi);
    setShowInfoCard(true);
    setIsSidebarOpen(false);
  }, []);

  // Voir le profil complet
  const handleViewProfile = useCallback((poi: NavigooPoi) => {
    setShowInfoCard(false);
    setIsSidebarOpen(true);
  }, []);

  // Calculer l'itinéraire
  const handleCalculateRoute = useCallback(async (poi: NavigooPoi) => {
    try {
      const userPos = await navigooService.getUserPosition();
      setCurrentRoute({
        start: userPos,
        end: poi.coords
      });
      setShowInfoCard(false);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Erreur calcul itinéraire:', error);
    }
  }, []);

  // Contacter le client
  const handleContact = useCallback((poi: NavigooPoi) => {
    if (poi.userId) {
      router.push(`/freelance-dashboard/chat?userId=${poi.userId}`);
    }
  }, [router]);

  // Postuler à l'annonce
  const handleApply = useCallback((poi: NavigooPoi) => {
    if (poi.announcementId) {
      router.push(`/freelance-dashboard/business/rides?applyTo=${poi.announcementId}`);
    }
  }, [router]);

  // Fermer la carte info
  const handleCloseInfoCard = useCallback(() => {
    setShowInfoCard(false);
    setSelectedPoi(null);
  }, []);

  // Fermer la sidebar
  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Rafraîchir les données
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setMapKey(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MapIcon className="w-7 h-7 text-blue-600" />
            Carte des Annonces
          </h1>
          <p className="text-gray-500 mt-1">
            Trouvez les clients qui recherchent un chauffeur
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Actualiser</span>
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span className="hidden md:inline">Filtres</span>
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un quartier, une destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <select className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                <option value="">Tous les trajets</option>
                <option value="ONE_WAY">Aller simple</option>
                <option value="ROUND_TRIP">Aller-retour</option>
              </select>

              <select className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                <option value="">Tous les prix</option>
                <option value="low">Moins de 5000 FCFA</option>
                <option value="medium">5000 - 10000 FCFA</option>
                <option value="high">Plus de 10000 FCFA</option>
              </select>

              <select className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                <option value="">Négociable</option>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <BellAlertIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-800 font-medium">Opportunités de trajets</p>
            <p className="text-sm text-blue-600 mt-1">
              Cliquez sur un marqueur bleu 🔵 pour voir les détails d'une annonce client.
              Utilisez le bouton "Plus proche" pour trouver le client le plus près de vous.
            </p>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <NavigooMap
          key={mapKey}
          viewType="driver"
          onPoiClick={handlePoiClick}
          showUserPosition={true}
          enableRouting={true}
          route={currentRoute}
          useMockData={true}
          className="w-full"
        />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-2xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-500">Annonces actives</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-2xl font-bold text-green-600">5</p>
          <p className="text-sm text-gray-500">Près de vous (&lt;5km)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-2xl font-bold text-orange-600">8 500</p>
          <p className="text-sm text-gray-500">Prix moyen (FCFA)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-2xl font-bold text-purple-600">65%</p>
          <p className="text-sm text-gray-500">Prix négociables</p>
        </div>
      </div>

      {/* Carte d'info POI */}
      {showInfoCard && selectedPoi && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 z-[1000]">
          <PoiInfoCard
            poi={selectedPoi}
            onClose={handleCloseInfoCard}
            onViewProfile={handleViewProfile}
            onCalculateRoute={handleCalculateRoute}
            onContact={handleContact}
          />
        </div>
      )}

      {/* Sidebar profil */}
      <NavigooSidebar
        poi={selectedPoi}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onCalculateRoute={handleCalculateRoute}
        onContact={handleContact}
        viewType="driver"
      />

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DriverMapPage;
