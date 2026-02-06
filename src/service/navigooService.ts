// src/service/navigooService.ts
// Service pour l'intégration de Navigoo - Gestion des POI et carte

import apiClient from './apiClient';
import axios from 'axios';
import { planningService } from './planningService';
import { announcementService } from './announcementService';
import { 
  NavigooPoi, 
  AddressByOrgResponse, 
  ProfileByAddressResponse,
  RouteInfo,
  DEFAULT_MAP_CENTER,
  PoiCategory
} from '@/type/navigoo';
import { Planning } from '@/type/planning';
import { Announcement } from '@/type/announcement';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Calcule la distance en kilomètres entre deux coordonnées GPS
 * Formule de Haversine
 */
export const getDistance = (
  coord1: [number, number], 
  coord2: [number, number]
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1[0])) * Math.cos(toRad(coord2[0])) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => deg * (Math.PI / 180);

/**
 * Trouve le POI le plus proche d'une position donnée
 */
export const findClosestPoi = (
  userCoords: [number, number], 
  pois: NavigooPoi[]
): NavigooPoi | null => {
  if (!pois || pois.length === 0) return null;
  
  let closest: NavigooPoi | null = null;
  let minDistance = Infinity;
  
  for (const poi of pois) {
    const distance = getDistance(userCoords, poi.coords);
    if (distance < minDistance) {
      minDistance = distance;
      closest = poi;
    }
  }
  
  return closest;
};

/**
 * Service Navigoo principal
 */
export const navigooService = {
  
  /**
   * Récupère la position actuelle de l'utilisateur
   */
  getUserPosition: (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Erreur géolocalisation:', error.message);
          // Retourne le centre par défaut (Yaoundé) en cas d'erreur
          resolve(DEFAULT_MAP_CENTER);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  },

  /**
   * Récupère l'adresse par ID d'organisation
   * NOTE: Route placeholder - à implémenter côté backend
   */
  getAddressByOrgId: async (orgId: string): Promise<AddressByOrgResponse | null> => {
    try {
      // Route placeholder - remplacer par la vraie route quand disponible
      const response = await apiClient.get(`/api/v1/addresses/org/${orgId}`);
      return response.data;
    } catch (error) {
      console.warn(`Adresse non trouvée pour org ${orgId}:`, error);
      return null;
    }
  },

  /**
   * Récupère le profil par ID d'adresse
   * NOTE: Route placeholder - à implémenter côté backend
   */
  getProfileByAddressId: async (addressId: string): Promise<ProfileByAddressResponse | null> => {
    try {
      // Route placeholder - remplacer par la vraie route quand disponible
      const response = await apiClient.get(`/api/v1/profiles/by-address/${addressId}`);
      return response.data;
    } catch (error) {
      console.warn(`Profil non trouvé pour adresse ${addressId}:`, error);
      return null;
    }
  },

  /**
   * Récupère les POI des chauffeurs disponibles (pour vue client)
   * Basé sur les plannings avec status = 'Published'
   */
  getAvailableDriversPoi: async (): Promise<NavigooPoi[]> => {
    const pois: NavigooPoi[] = [];
    
    try {
      // Récupérer les plannings publiés
      const plannings = await planningService.getPublishedPlannings();
      
      for (const planning of plannings) {
        if (planning.status !== 'Published') continue;
        
        // Essayer de récupérer l'adresse via orgId
        let coords: [number, number] = DEFAULT_MAP_CENTER;
        
        if (planning.orgId) {
          const address = await navigooService.getAddressByOrgId(planning.orgId);
          if (address?.latitude && address?.longitude) {
            coords = [address.latitude, address.longitude];
          }
        }
        
        // Créer le POI
        const poi: NavigooPoi = {
          id: planning.id,
          coords,
          name: planning.clientName || 'Chauffeur',
          category: 'Chauffeur disponible',
          description: `${planning.departureLocation} → ${planning.dropoffLocation}`,
          imageUrl: planning.profileImageUrl ?? undefined,
          
          // Données métier
          orgId: planning.orgId ?? undefined,
          userId: planning.clientId ?? undefined,
          phoneNumber: planning.clientPhoneNumber ?? undefined,
          profileImageUrl: planning.profileImageUrl ?? undefined,
          
          // Infos planning
          planningId: planning.id,
          departureLocation: planning.departureLocation,
          dropoffLocation: planning.dropoffLocation,
          startDate: planning.startDate,
          startTime: planning.startTime,
          status: planning.status,
          averageRating: planning.averageRating,
          
          poiType: 'driver_available'
        };
        
        pois.push(poi);
      }
    } catch (error) {
      console.error('Erreur récupération POI chauffeurs:', error);
    }
    
    return pois;
  },

  /**
   * Récupère les POI des clients avec annonces (pour vue chauffeur)
   * Basé sur les annonces publiées
   */
  getClientsWithAnnouncementsPoi: async (): Promise<NavigooPoi[]> => {
    const pois: NavigooPoi[] = [];
    
    try {
      // Récupérer les annonces publiées
      const announcements = await announcementService.getMyAnnouncements();
      
      for (const announcement of announcements) {
        if (announcement.status !== 'Published') continue;
        
        // Essayer de récupérer l'adresse via orgId
        let coords: [number, number] = DEFAULT_MAP_CENTER;
        
        if (announcement.orgId) {
          const address = await navigooService.getAddressByOrgId(announcement.orgId);
          if (address?.latitude && address?.longitude) {
            coords = [address.latitude, address.longitude];
          }
        }
        
        // Créer le POI
        const poi: NavigooPoi = {
          id: announcement.id,
          coords,
          name: announcement.clientName || 'Client',
          category: 'Client avec annonce',
          description: `${announcement.departureLocation} → ${announcement.dropoffLocation}`,
          imageUrl: announcement.profileImageUrl ?? undefined,
          
          // Données métier
          orgId: announcement.orgId ?? undefined,
          userId: announcement.clientId ?? undefined,
          phoneNumber: announcement.clientPhoneNumber ?? undefined,
          profileImageUrl: announcement.profileImageUrl ?? undefined,
          
          // Infos annonce
          announcementId: announcement.id,
          departureLocation: announcement.departureLocation,
          dropoffLocation: announcement.dropoffLocation,
          startDate: announcement.startDate,
          startTime: announcement.startTime,
          status: announcement.status,
          cost: announcement.cost,
          tripType: announcement.tripType,
          negotiable: announcement.negotiable,
          
          poiType: 'client_with_announce'
        };
        
        pois.push(poi);
      }
    } catch (error) {
      console.error('Erreur récupération POI clients:', error);
    }
    
    return pois;
  },

  /**
   * Récupère les POI selon le type de vue (client ou chauffeur)
   */
  getPoisByViewType: async (viewType: 'client' | 'driver'): Promise<NavigooPoi[]> => {
    if (viewType === 'client') {
      return navigooService.getAvailableDriversPoi();
    } else {
      return navigooService.getClientsWithAnnouncementsPoi();
    }
  },

  /**
   * Calcule un itinéraire entre deux points via OSRM
   */
  calculateRoute: async (
    start: [number, number], 
    end: [number, number]
  ): Promise<[number, number][] | null> => {
    try {
      // OSRM Demo server (pour développement)
      // En production, utiliser votre propre serveur OSRM
      const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      
      const response = await axios.get(url);
      
      if (response.data.routes && response.data.routes.length > 0) {
        const coordinates = response.data.routes[0].geometry.coordinates;
        // Convertir de [lng, lat] à [lat, lng]
        return coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
      }
      
      return null;
    } catch (error) {
      console.error('Erreur calcul itinéraire:', error);
      return null;
    }
  },

  /**
   * Recherche d'adresse via Nominatim (OpenStreetMap)
   */
  searchAddress: async (query: string): Promise<{
    lat: number;
    lon: number;
    display_name: string;
  }[]> => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur recherche adresse:', error);
      return [];
    }
  },

  /**
   * Géocodage inverse - coordonnées vers adresse
   */
  reverseGeocode: async (lat: number, lon: number): Promise<string | null> => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      return response.data.display_name || null;
    } catch (error) {
      console.error('Erreur géocodage inverse:', error);
      return null;
    }
  },

  /**
   * Données mock pour les tests (à utiliser quand le backend n'est pas prêt)
   */
  getMockDriversPoi: (): NavigooPoi[] => {
    return [
      {
        id: 'mock-driver-1',
        coords: [3.8691, 11.5126],
        name: 'Jean Dupont',
        category: 'Chauffeur disponible',
        description: 'Bastos → Mvan',
        imageUrl: '/img/chauffeur.png',
        orgId: 'org-1',
        userId: 'user-1',
        phoneNumber: '+237 699 123 456',
        profileImageUrl: '/img/chauffeur.png',
        planningId: 'planning-1',
        departureLocation: 'Bastos',
        dropoffLocation: 'Mvan',
        startDate: '2026-02-05',
        startTime: '08:00',
        status: 'Published',
        averageRating: 4.5,
        poiType: 'driver_available'
      },
      {
        id: 'mock-driver-2',
        coords: [3.8580, 11.4921],
        name: 'Marie Ngo',
        category: 'Chauffeur disponible',
        description: 'Melen → Mokolo',
        imageUrl: '/img/chauffeur_nouveau.png',
        orgId: 'org-2',
        userId: 'user-2',
        phoneNumber: '+237 677 456 789',
        profileImageUrl: '/img/chauffeur_nouveau.png',
        planningId: 'planning-2',
        departureLocation: 'Melen',
        dropoffLocation: 'Mokolo',
        startDate: '2026-02-05',
        startTime: '09:30',
        status: 'Published',
        averageRating: 4.8,
        poiType: 'driver_available'
      },
      {
        id: 'mock-driver-3',
        coords: [3.8750, 11.5200],
        name: 'Paul Kamga',
        category: 'Chauffeur disponible',
        description: 'Nlongkak → Essos',
        imageUrl: '/img/chauffeur_ancien.png',
        orgId: 'org-3',
        userId: 'user-3',
        phoneNumber: '+237 655 789 012',
        profileImageUrl: '/img/chauffeur_ancien.png',
        planningId: 'planning-3',
        departureLocation: 'Nlongkak',
        dropoffLocation: 'Essos',
        startDate: '2026-02-05',
        startTime: '10:00',
        status: 'Published',
        averageRating: 4.2,
        poiType: 'driver_available'
      }
    ];
  },

  getMockClientsPoi: (): NavigooPoi[] => {
    return [
      {
        id: 'mock-client-1',
        coords: [3.8520, 11.5080],
        name: 'Alice Mbarga',
        category: 'Client avec annonce',
        description: 'Recherche trajet Mvan → Bastos',
        orgId: 'org-c1',
        userId: 'user-c1',
        phoneNumber: '+237 690 111 222',
        announcementId: 'announce-1',
        departureLocation: 'Mvan',
        dropoffLocation: 'Bastos',
        startDate: '2026-02-06',
        startTime: '07:00',
        status: 'Published',
        cost: '5000',
        tripType: 'ONE_WAY',
        negotiable: true,
        poiType: 'client_with_announce'
      },
      {
        id: 'mock-client-2',
        coords: [3.8620, 11.4850],
        name: 'Bruno Essomba',
        category: 'Client avec annonce',
        description: 'Recherche trajet Nsimeyong → Omnisport',
        orgId: 'org-c2',
        userId: 'user-c2',
        phoneNumber: '+237 677 333 444',
        announcementId: 'announce-2',
        departureLocation: 'Nsimeyong',
        dropoffLocation: 'Omnisport',
        startDate: '2026-02-06',
        startTime: '14:00',
        status: 'Published',
        cost: '3500',
        tripType: 'ROUND_TRIP',
        negotiable: false,
        poiType: 'client_with_announce'
      }
    ];
  }
};

export default navigooService;
