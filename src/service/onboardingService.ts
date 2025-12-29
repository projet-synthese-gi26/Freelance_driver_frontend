import apiClient from './apiClient';
import { UserSessionContext } from '@/type/profile';

export const onboardingService = {
  becomeDriver: async (data: any): Promise<UserSessionContext> => {
    console.log("▶️ Demande pour devenir chauffeur...", data);
    const response = await apiClient.post('/api/profiles/roles/become-driver', data);
    return response.data;
  },

  becomeClient: async (data: any): Promise<UserSessionContext> => {
    console.log("▶️ Demande pour devenir client...", data);
    const response = await apiClient.post('/api/profiles/roles/become-client', data);
    return response.data;
  }
};