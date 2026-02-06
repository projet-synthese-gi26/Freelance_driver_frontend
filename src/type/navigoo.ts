// src/type/navigoo.ts
// Types pour l'intégration de Navigoo (carte interactive)

/**
 * Interface représentant un Point d'Intérêt (POI) sur la carte
 * Conforme à la documentation Navigoo.js
 */
export interface PointOfInterestData {
  id: string | number;
  coords: [number, number]; // [latitude, longitude]
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
}

/**
 * Interface pour les informations d'itinéraire
 */
export interface RouteInfo {
  start: [number, number]; // [latitude, longitude]
  end: [number, number];   // [latitude, longitude]
}

/**
 * Type de vue de la carte (client ou chauffeur)
 */
export type MapViewType = 'client' | 'driver';

/**
 * Catégories de POI
 */
export type PoiCategory = 
  | 'driver_available'      // Chauffeur disponible (pour vue client)
  | 'client_with_announce'  // Client avec annonce (pour vue chauffeur)
  | 'user_position'         // Position de l'utilisateur
  | 'destination'           // Destination
  | 'pickup';               // Point de ramassage

/**
 * POI enrichi avec les données métier de l'application
 */
export interface NavigooPoi extends PointOfInterestData {
  // Données supplémentaires pour l'affichage
  orgId?: string;
  userId?: string;
  phoneNumber?: string;
  email?: string;
  profileImageUrl?: string;
  
  // Pour les chauffeurs
  planningId?: string;
  departureLocation?: string;
  dropoffLocation?: string;
  startDate?: string;
  startTime?: string;
  status?: string;
  averageRating?: number;
  
  // Pour les clients (annonces)
  announcementId?: string;
  cost?: string;
  tripType?: string;
  negotiable?: boolean;
  
  // Type de POI
  poiType: PoiCategory;
}

/**
 * Options de configuration pour le composant NavigooMap
 */
export interface NavigooMapOptions {
  center: [number, number];
  zoom: number;
  tileServerUrl?: string;
  showUserPosition?: boolean;
  enableRouting?: boolean;
  enableSearch?: boolean;
}

/**
 * État de la carte Navigoo
 */
export interface NavigooMapState {
  isLoading: boolean;
  error: string | null;
  pois: NavigooPoi[];
  selectedPoi: NavigooPoi | null;
  userPosition: [number, number] | null;
  currentRoute: RouteInfo | null;
  highlightedPosition: [number, number] | null;
}

/**
 * Données de profil pour la sidebar
 */
export interface NavigooProfileData {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  profileImageUrl?: string;
  rating?: number;
  description?: string;
  
  // Pour les chauffeurs
  vehicleDetails?: string;
  languages?: string[];
  specialities?: string[];
  
  // Pour les clients
  memberSince?: string;
  totalRides?: number;
}

/**
 * Réponse de l'API pour les adresses par organisation
 * (Route placeholder à implémenter côté backend)
 */
export interface AddressByOrgResponse {
  id: string;
  addressableId: string;
  addressableType: string;
  latitude: number;
  longitude: number;
  city?: string;
  neighborhood?: string;
  addressLine1?: string;
}

/**
 * Réponse de l'API pour le profil par adresse
 * (Route placeholder à implémenter côté backend)
 */
export interface ProfileByAddressResponse {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  phoneNumber?: string;
  email?: string;
  avatarUrl?: string;
  biography?: string;
  languages?: string[];
  averageRating?: number;
  // Chauffeur spécifique
  vehicleDetails?: string;
  specialities?: string[];
}

/**
 * Constantes pour les couleurs des marqueurs
 */
export const POI_COLORS = {
  driver_available: '#22c55e',      // Vert - chauffeur disponible
  client_with_announce: '#3b82f6',  // Bleu - client avec annonce
  user_position: '#ef4444',         // Rouge - position utilisateur
  destination: '#f59e0b',           // Orange - destination
  pickup: '#8b5cf6',                // Violet - point de pickup
} as const;

/**
 * Coordonnées par défaut (Centre du Cameroun - Yaoundé)
 */
export const DEFAULT_MAP_CENTER: [number, number] = [3.8480, 11.5021];
export const DEFAULT_MAP_ZOOM = 13;

/**
 * URL du serveur de tuiles OpenStreetMap par défaut
 */
export const DEFAULT_TILE_SERVER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
