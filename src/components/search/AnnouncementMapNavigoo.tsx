"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { PointOfInterestData } from 'navigoo';
import { PublicOfferView } from '@/service/announcementService';

interface AnnouncementMapNavigooProps {
  announcements: PublicOfferView[];
  onAnnouncementSelect?: (announcement: PublicOfferView) => void;
  className?: string;
}

// Coordonnées par défaut (Yaoundé)
const DEFAULT_CENTER: [number, number] = [3.8480, 11.5021];
const DEFAULT_ZOOM = 12;

const AnnouncementMapNavigoo: React.FC<AnnouncementMapNavigooProps> = ({
  announcements,
  onAnnouncementSelect,
  className = ''
}) => {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<PublicOfferView | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  // Fonction pour obtenir des coordonnées aléatoires autour de Yaoundé (simulation)
  // En production, utiliser les vraies coordonnées de l'annonce
  const getRandomCoords = (base: [number, number], offset: number = 0.08): [number, number] => {
    return [
      base[0] + (Math.random() - 0.5) * offset * 2,
      base[1] + (Math.random() - 0.5) * offset * 2
    ];
  };

  // Convertir une annonce en POI pour Navigoo
  const announcementToPOI = useCallback((announcement: PublicOfferView): PointOfInterestData => {
    // Vérifier si l'annonce a déjà des coordonnées stockées
    // Si non, utiliser des coordonnées simulées autour de Yaoundé
    let coords: [number, number];
    
    // TODO: Remplacer par les vraies coordonnées quand disponibles dans l'API
    // Pour l'instant, utiliser un hash de l'ID pour avoir des coordonnées consistantes
    const hash = announcement.id ? announcement.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) : 0;
    
    // Générer des coordonnées consistantes basées sur l'ID de l'annonce
    const latOffset = ((hash % 100) - 50) / 1000; // -0.05 à 0.05
    const lngOffset = (((hash >> 8) % 100) - 50) / 1000; // -0.05 à 0.05
    
    coords = [
      DEFAULT_CENTER[0] + lngOffset,
      DEFAULT_CENTER[1] + latOffset
    ];
    
    return {
      id: announcement.id,
      coords,
      name: announcement.authorName || 'Client',
      category: 'Annonce Client',
      description: `${announcement.pickupLocation} → ${announcement.dropoffLocation}`,
      imageUrl: announcement.authorImageUrl || '/dark_avatar.svg'
    };
  }, []);

  // Initialiser la carte Navigoo
  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (mapInstanceRef.current || !mapRef.current) return;

      try {
        // Import dynamique pour éviter les problèmes SSR
        const NavigooMap = (await import('navigoo')).default;
        
        if (!mounted) return;

        const map = new NavigooMap('announcement-map-container', {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM
        });

        mapInstanceRef.current = map;
        setIsMapReady(true);

        // Ajouter les POIs pour chaque annonce
        announcements.forEach((announcement) => {
          const poi = announcementToPOI(announcement);
          map.addPointOfInterest(poi);
        });

      } catch (error) {
        console.error('Erreur lors de l\'initialisation de Navigoo:', error);
      }
    };

    initMap();

    return () => {
      mounted = false;
    };
  }, []);

  // Mettre à jour les POIs quand les annonces changent
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;
    
    // D'abord, effacer tous les POIs existants pour éviter les doublons
    try {
      map.clearAllPointsOfInterest();
    } catch (e) {
      console.warn('Impossible de nettoyer les POIs:', e);
    }
    
    // Ensuite, ajouter les nouveaux POIs
    announcements.forEach((announcement) => {
      const poi = announcementToPOI(announcement);
      try {
        map.addPointOfInterest(poi);
      } catch (e) {
        console.warn('Impossible d\'ajouter le POI:', e);
      }
    });
  }, [announcements, isMapReady]);

  // Fonction pour trouver l'annonce la plus proche
  const findClosestAnnouncement = useCallback(() => {
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
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
        }
      );
    }
  }, []);

  // Afficher l'itinéraire vers une annonce
  const showRouteToAnnouncement = useCallback((announcement: PublicOfferView) => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    const poi = announcementToPOI(announcement);
    
    try {
      map.routeFromUserToPOI(poi);
    } catch (error) {
      console.error('Erreur routeFromUserToPOI:', error);
    }
  }, []);

  // Gérer le clic sur une annonce
  const handleAnnouncementClick = (announcement: PublicOfferView) => {
    setSelectedAnnouncement(announcement);
    if (onAnnouncementSelect) {
      onAnnouncementSelect(announcement);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Conteneur de la carte */}
      <div 
        id="announcement-map-container" 
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
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button
          onClick={findClosestAnnouncement}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
          title="Annonce la plus proche"
        >
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>

      {/* Indicateur de chargement */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* Légende */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <div className="text-sm font-semibold mb-2">Légende</div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span>Annonces clients ({announcements.length})</span>
        </div>
        {userPosition && (
          <div className="flex items-center gap-2 text-xs mt-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Votre position</span>
          </div>
        )}
      </div>

      {/* Info de l'annonce sélectionnée */}
      {selectedAnnouncement && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
          <button 
            onClick={() => setSelectedAnnouncement(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <img 
              src={selectedAnnouncement.authorImageUrl || '/dark_avatar.svg'} 
              alt={selectedAnnouncement.authorName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold">{selectedAnnouncement.authorName || 'Client'}</div>
              <div className="text-xs text-gray-500">{selectedAnnouncement.startDate} à {selectedAnnouncement.startTime}</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            <div className="font-medium">{selectedAnnouncement.pickupLocation}</div>
            <div className="text-xs">→ {selectedAnnouncement.dropoffLocation}</div>
          </div>

          {selectedAnnouncement.baggageInfo && (
            <div className="text-xs text-gray-500 mb-2">
              🧳 {selectedAnnouncement.baggageInfo}
            </div>
          )}
          
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-bold text-green-600">
              {selectedAnnouncement.cost} XAF
            </div>
            {selectedAnnouncement.isNegotiable && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Négociable
              </span>
            )}
          </div>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => showRouteToAnnouncement(selectedAnnouncement)}
              className="flex-1 bg-emerald-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-emerald-600 transition-colors"
            >
              Itinéraire
            </button>
            <button
              onClick={() => onAnnouncementSelect && onAnnouncementSelect(selectedAnnouncement)}
              className="flex-1 bg-slate-900 text-white py-2 px-3 rounded-lg text-sm hover:bg-slate-800 transition-colors"
            >
              Postuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementMapNavigoo;
