// src/services/planningService.ts

import apiClient from './apiClient';
import { PublicOfferView, mapProductToPublicView } from './announcementService';
import { Planning as PlanningType, PlanningStatus } from '@/type/planning';

/**
 * Traduit un objet "Product" pour la vue privée Planning (Chauffeur)
 */
 const mapBackendProductToPlanningPrivateView = (product: any): PlanningType => {
  return {
    id: product.key?.id || product.id || '',
    title: product.name || 'Sans titre',
    pickupLocation: product.pickupLocation || '',
    dropoffLocation: product.dropoffLocation || '',
    startDate: product.startDate || '',
    startTime: product.startTime || '',
    endDate: product.endDate || '',
    endTime: product.endTime || '',
    paymentOption: product.metadata?.paymentOption,
    regularAmount: product.metadata?.regularAmount?.toString(),
    discountPercentage: product.metadata?.discountPercentage,
    discountedAmount: product.metadata?.discountedAmount?.toString(),
    status: product.status as PlanningStatus || 'Draft',
    clientId: product.clientId || '',
    clientName: product.clientName || '',
    clientPhoneNumber: product.clientPhoneNumber || '',
    profileImageUrl: product.clientProfileImageUrl || undefined,
  };
};

/**
 * Payload pour le backend
 */
 const mapPlanningFormToBackendPayload = (formData: Partial<PlanningType>) => {
  return {
    name: formData.title,
    defaultSellPrice: parseFloat(formData.regularAmount || '0'), 
    shortDescription: formData.baggageInfo,
    pickupLocation: formData.pickupLocation,
    dropoffLocation: formData.dropoffLocation,
    startDate: formData.startDate,
    startTime: formData.startTime,
    endDate: formData.endDate,
    endTime: formData.endTime,
    status: formData.status,
    isNegotiable: false,
    paymentMethod: 'cash',
    clientId: formData.clientId,
    clientName: formData.clientName,
    clientPhoneNumber: formData.clientPhoneNumber,
    clientProfileImageUrl: formData.profileImageUrl,
    metadata: { 
        paymentOption: formData.paymentOption || 'fixed',
        regularAmount: formData.regularAmount || '0',
        discountPercentage: formData.discountPercentage || '0',
        discountedAmount: formData.discountedAmount || '0',
    },
  };
};


export const planningService = {
    // --- RECHERCHE PUBLIQUE ---

    getPublishedPlannings: async (): Promise<PublicOfferView[]> => {
      const response = await apiClient.get('/api/planning/published');
      return response.data.map(mapProductToPublicView);
    },
    
    getPlanningsByDriver: async (driverId: string): Promise<PublicOfferView[]> => {
        const response = await apiClient.get(`/api/planning/user/${driverId}`);
        return response.data.map(mapProductToPublicView);
    },

    // --- CLIENT (Mes Réservations) ---

    getMyReservedRides: async (): Promise<PublicOfferView[]> => { 
      try {
        const response = await apiClient.get('/api/planning/my-reservations');
        return response.data.map(mapProductToPublicView);
      } catch (error) {
        console.error('Error fetching client reservations:', error);
        throw error;
      }
    },
    
    /**
     * Client demande à réserver un planning
     */
    requestPlanningBooking: async (planningId: string): Promise<PublicOfferView> => {
      try {
        console.log(`▶️ Client demande à réserver le planning ID: ${planningId}`);
        const response = await apiClient.post(`/api/planning/${planningId}/request-booking`, {});
        return mapProductToPublicView(response.data);
      } catch (error) {
        console.error('Error requesting planning booking:', error);
        throw error;
      }
    },

    /**
     * Client annule une réservation
     */
    cancelReservation: async (planningId: string): Promise<PublicOfferView> => {
      try {
        console.log(`▶️ Client annule sa réservation pour le planning ID: ${planningId}`);
        const response = await apiClient.post(`/api/planning/${planningId}/cancel-reservation`, {});
        return mapProductToPublicView(response.data);
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        throw error;
      }
    },

    // --- CHAUFFEUR (Mes Plannings) ---

    getMyPlannings: async (): Promise<PlanningType[]> => {
        const response = await apiClient.get('/api/planning');
        return response.data.map(mapBackendProductToPlanningPrivateView);
    },

    createPlanning: async (planning: Partial<PlanningType>): Promise<PlanningType> => {
        const payload = mapPlanningFormToBackendPayload(planning);
        const response = await apiClient.post('/api/planning', payload);
        return mapBackendProductToPlanningPrivateView(response.data);
    },

    updatePlanning: async (id: string, planning: Partial<PlanningType>): Promise<PlanningType> => {
        const payload = mapPlanningFormToBackendPayload(planning);
        const response = await apiClient.put(`/api/planning/${id}`, payload);
        return mapBackendProductToPlanningPrivateView(response.data);
    },

    deletePlanning: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/planning/${id}`);
    },

    /**
     * Chauffeur accepte une réservation
     */
    confirmPlanningBooking: async (planningId: string, clientId: string): Promise<PublicOfferView> => {
      try {
        console.log(`▶️ Chauffeur confirme la réservation ID: ${planningId}`);
        const response = await apiClient.post(
          `/api/planning/${planningId}/confirm-booking?clientId=${clientId}`,
          {}
        );
        return mapProductToPublicView(response.data);
      } catch (error) {
        console.error('Error confirming planning booking:', error);
        throw error;
      }
    },
};