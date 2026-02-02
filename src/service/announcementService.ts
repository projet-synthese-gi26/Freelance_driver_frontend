// src/services/announcementService.ts

import apiClient from './apiClient';
import axios from 'axios';
import {
  Announcement,
  AnnouncementRequestPayload,
  AnnouncementStatus,
} from '@/type/announcement';

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

const mapBackendAnnonceToAnnouncement = (data: any): Announcement => ({
  id: data.id,
  orgId: data.orgId ?? null,
  clientId: data.clientId ?? null,
  clientName: data.clientName ?? null,
  clientPhoneNumber: data.clientPhoneNumber ?? null,
  profileImageUrl: data.profileImageUrl ?? null,
  title: data.title ?? '',
  departureLocation: data.departureLocation ?? '',
  dropoffLocation: data.dropoffLocation ?? '',
  startDate: data.startDate ?? '',
  startTime: data.startTime ?? '',
  endDate: data.endDate ?? '',
  endTime: data.endTime ?? '',
  reservedById: data.reservedById ?? null,
  paymentMethod: data.paymentMethod ?? null,
  status: data.status ?? 'Draft',
  createdAt: data.createdAt ?? null,
  updatedAt: data.updatedAt ?? null,
  tripType: data.tripType ?? 'ONE_WAY',
  meetupPoint: data.meetupPoint ?? '',
  tripIntention: data.tripIntention ?? 'PASSENGERS',
  pricingMethod: data.pricingMethod ?? 'FIXED',
  metadata: data.metadata ?? [],
  cost: data.cost?.toString?.() ?? '',
  baggageInfo: data.baggageInfo ?? '',
  negotiable: Boolean(data.negotiable),
  reviewableType: data.reviewableType,
  reactableType: data.reactableType,
  reviewableId: data.reviewableId,
  reactableId: data.reactableId,
  averageRating: data.averageRating,
  reactionCounts: data.reactionCounts,
  assetId: data.assetId,
  ownerId: data.ownerId,
});

const mapAnnouncementToPayload = (
  payload: Partial<AnnouncementRequestPayload>
): AnnouncementRequestPayload => ({
  title: payload.title ?? '',
  departureLocation: payload.departureLocation ?? '',
  dropoffLocation: payload.dropoffLocation ?? '',
  startDate: payload.startDate ?? '',
  startTime: payload.startTime ?? '',
  endDate: payload.endDate ?? '',
  endTime: payload.endTime ?? '',
  status: payload.status ?? 'Draft',
  reservedById: payload.reservedById ?? undefined,
  tripType: payload.tripType ?? 'ONE_WAY',
  meetupPoint: payload.meetupPoint ?? '',
  tripIntention: payload.tripIntention ?? 'PASSENGERS',
  pricingMethod: payload.pricingMethod ?? 'FIXED',
  isNegotiable: payload.isNegotiable ?? payload.negotiable ?? false,
  negotiable: payload.negotiable ?? payload.isNegotiable ?? false,
  paymentMethod: payload.paymentMethod ?? '',
  cost: payload.cost ?? '',
  baggageInfo: payload.baggageInfo ?? '',
});

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

    getMyAnnouncements: async (): Promise<Announcement[]> => {
        const response = await apiClient.get('/api/v1/client/annonces');
        return response.data.map((annonce: any) => mapBackendAnnonceToAnnouncement(annonce));
    },
    
    createAnnouncement: async (announcement: Partial<AnnouncementRequestPayload>): Promise<Announcement> => {
        const payload = mapAnnouncementToPayload(announcement);
        const response = await apiClient.post('/api/v1/client/annonces', payload);
        return mapBackendAnnonceToAnnouncement(response.data);
    },

    updateAnnouncement: async (id: string, announcement: Partial<AnnouncementRequestPayload>): Promise<Announcement> => {
        const payload = mapAnnouncementToPayload(announcement);
        const response = await apiClient.put(`/api/v1/client/annonces/${id}`, payload);
        return mapBackendAnnonceToAnnouncement(response.data);
    },

    deleteAnnouncement: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/v1/client/annonces/${id}`);
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