"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { PointOfInterestData } from 'navigoo';

// Types pour les plannings de chauffeurs
interface DriverPlanning {
  id: string;
  driverId?: string;
  driverName?: string;
  profileImageUrl?: string;
  pickupLocation: string;
  dropoffLocation: string;
  fullLocation?: string;
  startDate: string;
  endDate?: string;
  price?: number;
  currency?: string;
  rating?: number;
  experience?: number;
  latitude?: number;
  longitude?: number;
  vehicleType?: string;
  status?: string;
}

interface DriverMapNavigooProps {
  plannings: DriverPlanning[];
  onDriverSelect?: (planning: DriverPlanning) => void;
  className?: string;
}

// Coordonnées par défaut (Yaoundé)
const DEFAULT_CENTER: [number, number] = [3.8480, 11.5021];
const DEFAULT_ZOOM = 12;

const DriverMapNavigoo: React.FC<DriverMapNavigooProps> = ({
  plannings,
  onDriverSelect,
  className = ''
}) => {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverPlanning | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [closestDriver, setClosestDriver] = useState<DriverPlanning | null>(null);

  // Fonction pour obtenir des coordonnées aléatoires autour de Yaoundé (simulation)
  const getRandomCoords = (base: [number, number], offset: number = 0.05): [number, number] => {
    return [
      base[0] + (Math.random() - 0.5) * offset * 2,
      base[1] + (Math.random() - 0.5) * offset * 2
    ];
  };

  // Convertir un planning en POI pour Navigoo
  const planningToPOI = (planning: DriverPlanning): PointOfInterestData => {
    // Si le planning a des coordonnées, les utiliser, sinon générer des coordonnées aléatoires
    const coords: [number, number] = planning.latitude && planning.longitude 
      ? [planning.latitude, planning.longitude]
      : getRandomCoords(DEFAULT_CENTER);
    
    return {
      id: planning.id,
      coords,
      name: planning.driverName || 'Chauffeur',
      category: planning.vehicleType || 'Voiture',
      description: `${planning.pickupLocation} → ${planning.dropoffLocation}`,
      imageUrl: planning.profileImageUrl || '/dark_avatar.svg'
    };
  };

  // Initialiser la carte Navigoo
  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (mapInstanceRef.current || !mapRef.current) return;

      try {
        // Import dynamique pour éviter les problèmes SSR
        const NavigooMap = (await import('navigoo')).default;
        
        if (!mounted) return;

        const map = new NavigooMap('driver-map-container', {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM
        });

        mapInstanceRef.current = map;
        setIsMapReady(true);

        // Ajouter les POIs pour chaque planning
        plannings.forEach((planning) => {
          const poi = planningToPOI(planning);
          map.addPointOfInterest(poi);
        });

      } catch (error) {
        console.error('Erreur lors de l\'initialisation de Navigoo:', error);
      }
    };

    initMap();

    return () => {
      mounted = false;
      // Nettoyer si nécessaire
    };
  }, []);

  // Mettre à jour les POIs quand les plannings changent
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    // Pour le moment, on recrée la carte si les plannings changent
    // Une meilleure approche serait d'avoir une méthode updatePOIs
    const map = mapInstanceRef.current;
    
    plannings.forEach((planning) => {
      const poi = planningToPOI(planning);
      try {
        map.addPointOfInterest(poi);
      } catch (e) {
        // Le POI existe peut-être déjà
      }
    });
  }, [plannings, isMapReady]);

  // Fonction pour trouver le chauffeur le plus proche
  const findClosestDriver = useCallback(() => {
    if (!mapInstanceRef.current || !userPosition) return;

    const map = mapInstanceRef.current;
    
    try {
      map.showUserAndClosestPOI();
    } catch (error) {
      console.error('Erreur findClosestPOI:', error);
    }
  }, [userPosition]);

  // Obtenir la position de l'utilisateur
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserPosition(coords);
          
          // Centrer la carte sur la position de l'utilisateur
          if (mapInstanceRef.current) {
            // La carte devrait se recentrer automatiquement avec showUserAndClosestPOI
          }
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
        }
      );
    }
  }, []);

  // Afficher l'itinéraire vers un chauffeur
  const showRouteToDriver = useCallback((planning: DriverPlanning) => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    const poi = planningToPOI(planning);
    
    try {
      map.routeFromUserToPOI(poi);
    } catch (error) {
      console.error('Erreur routeFromUserToPOI:', error);
    }
  }, []);

  // Gérer le clic sur un chauffeur
  const handleDriverClick = (planning: DriverPlanning) => {
    setSelectedDriver(planning);
    if (onDriverSelect) {
      onDriverSelect(planning);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Conteneur de la carte */}
      <div 
        id="driver-map-container" 
        ref={mapRef}
        className="w-full h-[400px] rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />

      {/* Boutons de contrôle */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={getUserLocation}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          title="Ma position"
        >
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button
          onClick={findClosestDriver}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          title="Chauffeur le plus proche"
        >
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>

      {/* Indicateur de chargement */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Légende */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <div className="text-sm font-semibold mb-2">Légende</div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Chauffeurs disponibles ({plannings.length})</span>
        </div>
        {userPosition && (
          <div className="flex items-center gap-2 text-xs mt-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Votre position</span>
          </div>
        )}
      </div>

      {/* Info du chauffeur sélectionné */}
      {selectedDriver && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
          <button 
            onClick={() => setSelectedDriver(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <img 
              src={selectedDriver.profileImageUrl || '/dark_avatar.svg'} 
              alt={selectedDriver.driverName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold">{selectedDriver.driverName || 'Chauffeur'}</div>
              {selectedDriver.rating && (
                <div className="flex items-center text-yellow-500 text-sm">
                  {'★'.repeat(Math.floor(selectedDriver.rating))}
                  <span className="text-gray-500 ml-1">{selectedDriver.rating}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            <div>{selectedDriver.pickupLocation}</div>
            <div className="text-xs">→ {selectedDriver.dropoffLocation}</div>
          </div>
          
          {selectedDriver.price && (
            <div className="text-lg font-bold text-green-600">
              {selectedDriver.price} {selectedDriver.currency || 'XAF'}
            </div>
          )}
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => showRouteToDriver(selectedDriver)}
              className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              Itinéraire
            </button>
            <button
              onClick={() => onDriverSelect && onDriverSelect(selectedDriver)}
              className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600 transition-colors"
            >
              Voir profil
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverMapNavigoo;
