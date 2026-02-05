// src/services/planningService.ts

import apiClient from './apiClient';
import { Planning, PlanningPayload } from '@/type/planning';

const mapBackendPlanning = (planning: any): Planning => ({
  id: planning.id,
  authorId: planning.authorId ?? planning.userId ?? planning.driverId ?? null,
  authorName: planning.authorName ?? null,
  authorImageUrl: planning.authorImageUrl ?? null,
  orgId: planning.orgId ?? null,
  clientId: planning.clientId ?? null,
  clientName: planning.clientName ?? null,
  clientPhoneNumber: planning.clientPhoneNumber ?? null,
  profileImageUrl: planning.profileImageUrl ?? null,
  title: planning.title ?? '',
  departureLocation: planning.departureLocation ?? planning.pickupLocation ?? '',
  pickupLocation: planning.pickupLocation ?? planning.departureLocation ?? '',
  dropoffLocation: planning.dropoffLocation ?? planning.arrivalLocation ?? planning.destinationLocation ?? '',
  startDate: planning.startDate ?? '',
  startTime: planning.startTime ?? '',
  endDate: planning.endDate ?? '',
  endTime: planning.endTime ?? '',
  reservedById: planning.reservedById ?? null,
  paymentMethod: planning.paymentMethod ?? null,
  status: planning.status,
  createdAt: planning.createdAt ?? null,
  updatedAt: planning.updatedAt ?? null,
  tripType: planning.tripType,
  meetupPoint: planning.meetupPoint ?? '',
  tripIntention: planning.tripIntention,
  pricingMethod: planning.pricingMethod,
  metadata: planning.metadata ?? [],
  paymentOption: planning.paymentOption,
  regularAmount: planning.regularAmount?.toString() ?? planning.cost?.toString() ?? planning.amount?.toString() ?? '0',
  cost: planning.cost ?? planning.regularAmount ?? planning.amount ?? null,
  discountPercentage: planning.discountPercentage?.toString() ?? '0',
  discountedAmount: planning.discountedAmount?.toString() ?? '0',
  negotiable: Boolean(planning.negotiable ?? planning.isNegotiable),
  reviewableType: planning.reviewableType,
  reactableType: planning.reactableType,
  reviewableId: planning.reviewableId,
  reactableId: planning.reactableId,
  averageRating: planning.averageRating ?? 0,
  reactionCounts: planning.reactionCounts ?? {},
  assetId: planning.assetId,
  ownerId: planning.ownerId,
});

const mapPlanningPayload = (planning: PlanningPayload) => ({
  ...planning,
  isNegotiable: planning.negotiable,
  regularAmount: planning.regularAmount?.toString() ?? '0',
  discountPercentage: planning.discountPercentage?.toString() ?? '0',
  discountedAmount: planning.discountedAmount?.toString() ?? '0',
});

export const planningService = {
  getMyPlannings: async (): Promise<Planning[]> => {
    const response = await apiClient.get('/api/v1/driver/plannings');
    return response.data.map(mapBackendPlanning);
  },

  getPublishedPlannings: async (): Promise<Planning[]> => {
    const response = await apiClient.get('/api/v1/driver/plannings');
    const plannings = Array.isArray(response.data) ? response.data.map(mapBackendPlanning) : [];
    return plannings.filter((planning) => planning.status === 'Published');
  },

  getPlanningsByDriver: async (userId: string): Promise<Planning[]> => {
    const response = await apiClient.get(`/api/v1/driver/plannings/user/${userId}`);
    return Array.isArray(response.data) ? response.data.map(mapBackendPlanning) : [];
  },

  getPlanningById: async (id: string): Promise<Planning> => {
    const response = await apiClient.get(`/api/v1/driver/plannings/${id}`);
    return mapBackendPlanning(response.data);
  },

  createPlanning: async (planning: PlanningPayload): Promise<Planning> => {
    const payload = mapPlanningPayload(planning);
    const response = await apiClient.post('/api/v1/driver/plannings', payload);
    return mapBackendPlanning(response.data);
  },

  updatePlanning: async (id: string, planning: PlanningPayload): Promise<Planning> => {
    const payload = mapPlanningPayload(planning);
    const response = await apiClient.put(`/api/v1/driver/plannings/${id}`, payload);
    return mapBackendPlanning(response.data);
  },

  deletePlanning: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/driver/plannings/${id}`);
  },
};