import apiClient from './apiClient';
import publicClient from './publicClient';
import type { BillingPlan, BillingSubscription } from '@/type/billing';

export const billingService = {
  listPlans: async (): Promise<BillingPlan[]> => {
    const response = await publicClient.get('/api/v1/public/billing/plans');
    return Array.isArray(response.data) ? (response.data as BillingPlan[]) : [];
  },

  getMySubscription: async (): Promise<BillingSubscription> => {
    const response = await apiClient.get('/api/v1/driver/billing/subscription');
    return response.data as BillingSubscription;
  },

  subscribe: async (planCode: string): Promise<BillingSubscription> => {
    const response = await apiClient.post('/api/v1/driver/billing/subscribe', { planCode });
    return response.data as BillingSubscription;
  },

  cancel: async (): Promise<BillingSubscription> => {
    const response = await apiClient.post('/api/v1/driver/billing/cancel');
    return response.data as BillingSubscription;
  },
};
