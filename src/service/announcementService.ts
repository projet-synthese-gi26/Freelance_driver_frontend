// src/services/announcementService.ts

import apiClient from './apiClient';
import axios from 'axios'; // Import pour les appels publics
// Adaptez les chemins d'importation selon votre structure "src/type/..."
import { Announcement as AnnouncementClientType, AnnouncementStatus } from '@/type/announcement';
import { Planning as PlanningType } from '@/type/planning';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interface pour la vue publique
export interface PublicOfferView {
  id: string;
  title: string;
  pickupLocation: string;
  dropoffLocation: string;
  fullLocation: string;
  cost: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  paymentMethod: string;
  baggageInfo: string;
  isNegotiable: boolean;
  authorName: string;
  authorId: string;
  authorPhoneNumber: string;
  authorImageUrl?: string;
  status: AnnouncementStatus;
  reservedByDriverId?: string;
  reservedByDriverName?: string;
  createdAt?: string;
}

// Fonction de mapping (Product -> PublicOfferView)
export const mapProductToPublicView = (product: any): PublicOfferView => {
    const pickup = product.pickupLocation || 'Non défini';
    const dropoff = product.dropoffLocation || 'Non défini';
    const id = product.id || product.key?.id || product.resource_id || 'UNKNOWN_ID';

    const mappedProduct: PublicOfferView = { 
        id: id,
        title: product.name || 'Annonce sans titre',
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        fullLocation: `${pickup} ➔ ${dropoff}`,
        cost: product.defaultSellPrice || 0,
        startDate: product.startDate || '',
        startTime: product.startTime || '',
        endDate: product.endDate || '',
        endTime: product.endTime || '',
        paymentMethod: product.paymentMethod || 'Non précisé',
        baggageInfo: product.shortDescription || 'Aucun bagage',
        isNegotiable: product.isNegotiable || false,
        authorName: product.authorName || product.clientName || 'Anonyme', 
        authorId: product.authorId || product.clientId || '',
        authorPhoneNumber: product.authorPhoneNumber || product.clientPhoneNumber || '',
        authorImageUrl: product.authorProfileImageUrl || product.clientProfileImageUrl || undefined,
        status: product.status || 'Draft',
        reservedByDriverId: product.reservedByDriverId || undefined, 
        reservedByDriverName: product.reservedByDriverName || undefined, 
        createdAt: product.createdAt || undefined,
    };
    return mappedProduct;
};

/**
 * Traduit un objet "Product" du backend pour les vues privées
 */
const mapBackendProductToPrivateView = (product: any): AnnouncementClientType | PlanningType => {
  return {
    id: product.key?.id || product.id || '',
    title: product.name || 'Sans titre',
    pickupLocation: product.pickupLocation || '',
    dropoffLocation: product.dropoffLocation || '',
    startDate: product.startDate || '',
    startTime: product.startTime || '',
    endDate: product.endDate || '',
    endTime: product.endTime || '',
    cost: product.defaultSellPrice?.toString() || '0',
    baggageInfo: product.shortDescription || '',
    status: product.status || 'Draft',
    isNegotiable: product.isNegotiable || false,
    paymentMethod: product.paymentMethod || 'cash',
    clientId: product.clientId || '',
    clientName: product.clientName || '',
    clientPhoneNumber: product.clientPhoneNumber || '',
    paymentOption: product.metadata?.paymentOption,
    regularAmount: product.metadata?.regularAmount?.toString(),
    discountPercentage: product.metadata?.discountPercentage,
    discountedAmount: product.metadata?.discountedAmount?.toString(),
  };
};

/**
 * Prépare le payload pour le backend
 */
const mapFormToBackendPayload = (formData: Partial<AnnouncementClientType | PlanningType>) => {
  return {
    name: formData.title,
    defaultSellPrice: parseFloat((formData as AnnouncementClientType).cost || (formData as PlanningType).regularAmount || '0'),
    shortDescription: (formData as AnnouncementClientType).baggageInfo,
    pickupLocation: formData.pickupLocation,
    dropoffLocation: formData.dropoffLocation,
    startDate: formData.startDate,
    startTime: formData.startTime,
    endDate: formData.endDate,
    endTime: formData.endTime,
    status: formData.status,
    isNegotiable: formData.isNegotiable,
    paymentMethod: formData.paymentMethod,
    clientId: formData.clientId,
    clientName: formData.clientName,
    clientPhoneNumber: formData.clientPhoneNumber,
    metadata: { 
        paymentOption: (formData as PlanningType).paymentOption || 'fixed',
        regularAmount: (formData as PlanningType).regularAmount || '0',
        discountPercentage: (formData as PlanningType).discountPercentage || '0',
        discountedAmount: (formData as PlanningType).discountedAmount || '0',
    },
  };
};

export const announcementService = {
    // --- Fonctions de RECHERCHE PUBLIQUE (Sans Token) ---

    getPublishedAnnouncements: async (): Promise<PublicOfferView[]> => {
      const response = await axios.get(`${API_URL}/api/announcements`);
      return response.data.map(mapProductToPublicView);
    },

    getPublishedPlannings: async (): Promise<PublicOfferView[]> => {
      const response = await axios.get(`${API_URL}/api/planning/published`);
      return response.data.map(mapProductToPublicView);
    },

    // --- Fonctions de GESTION pour le CLIENT (Avec Token) ---

    getMyAnnouncements: async (): Promise<AnnouncementClientType[]> => {
        const response = await apiClient.get('/api/announcements/my-announcements');
        return response.data.map((p: any) => mapBackendProductToPrivateView(p) as AnnouncementClientType);
    },
    
    createAnnouncement: async (announcement: Partial<AnnouncementClientType>): Promise<AnnouncementClientType> => {
        const payload = mapFormToBackendPayload(announcement);
        const response = await apiClient.post('/api/announcements', payload);
        return mapBackendProductToPrivateView(response.data) as AnnouncementClientType;
    },

    updateAnnouncement: async (id: string, announcement: Partial<AnnouncementClientType>): Promise<AnnouncementClientType> => {
        const payload = mapFormToBackendPayload(announcement);
        const response = await apiClient.put(`/api/announcements/${id}`, payload);
        return mapBackendProductToPrivateView(response.data) as AnnouncementClientType;
    },

    deleteAnnouncement: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/announcements/${id}`);
    },

    // --- Fonctions de GESTION pour le CONDUCTEUR (Avec Token) ---

    getMyPlannings: async (): Promise<PlanningType[]> => {
        const response = await apiClient.get('/api/planning');
        return response.data.map((p: any) => mapBackendProductToPrivateView(p) as PlanningType);
    },

    createPlanning: async (planning: Partial<PlanningType>): Promise<PlanningType> => {
        const payload = mapFormToBackendPayload(planning);
        const response = await apiClient.post('/api/planning', payload);
        return mapBackendProductToPrivateView(response.data) as PlanningType;
    },

    updatePlanning: async (id: string, planning: Partial<PlanningType>): Promise<PlanningType> => {
        const payload = mapFormToBackendPayload(planning);
        const response = await apiClient.put(`/api/planning/${id}`, payload);
        return mapBackendProductToPrivateView(response.data) as PlanningType;
    },

    deletePlanning: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/planning/${id}`);
    },
    
    getPlanningsByDriver: async (driverId: string): Promise<PublicOfferView[]> => {
        // Cette route peut être publique selon votre config backend
        const response = await axios.get(`${API_URL}/api/planning/user/${driverId}`);
        return response.data.map(mapProductToPublicView);
    },

    // --- Fonctions de Réservation (Avec Token) ---

    applyToAnnouncement: async (announcementId: string): Promise<PublicOfferView> => {
      try {
        console.log(`▶️ [announcementService] Conducteur postule à l'annonce ID: ${announcementId}`);
        const response = await apiClient.post(`/api/announcements/${announcementId}/apply`, {});
        return mapProductToPublicView(response.data);
      } catch (error) {
        console.error('Error applying to announcement:', error);
        throw error;
      }
    },

    confirmDriverForAnnouncement: async (announcementId: string, driverId: string): Promise<PublicOfferView> => {
      try {
        console.log(`▶️ Client confirme le chauffeur ${driverId} pour l'annonce ${announcementId}`);
        const response = await apiClient.post(
          `/api/announcements/${announcementId}/confirm?driverId=${driverId}`,
          {}
        );
        return mapProductToPublicView(response.data);
      } catch (error) {
        console.error('Error confirming driver:', error);
        throw error;
      }
    },

    cancelPostulation: async (announcementId: string): Promise<PublicOfferView> => {
      try {
        console.log(`▶️ Conducteur annule sa postulation pour l'annonce ${announcementId}`);
        const response = await apiClient.post(
          `/api/announcements/${announcementId}/cancel-postulation`,
          {}
        );
        return mapProductToPublicView(response.data);
      } catch (error) {
        console.error('Error cancelling postulation:', error);
        throw error;
      }
    },

    getMyAcceptedRides: async (): Promise<PublicOfferView[]> => {
        const response = await apiClient.get('/api/announcements/my-rides');
        return response.data.map(mapProductToPublicView);
    },
    
    getMyReservedRides: async (): Promise<PublicOfferView[]> => { 
      try {
        const response = await apiClient.get('/api/planning/my-reservations');
        return response.data.map(mapProductToPublicView);
      } catch (error: any) {
        console.error('Error fetching client reservations:', error);
        throw error;
      }
    },
};