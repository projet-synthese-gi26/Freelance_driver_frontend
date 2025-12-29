import Cookies from 'js-cookie';
import { UserSessionContext } from '@/type/profile';

const TOKEN_KEY = 'authToken';
const PROFILE_KEY = 'userProfile';

export const sessionService = {
  getAuthToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  getAuthHeaders: () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  },

  getUserOrganizationId: (): string => {
    try {
      // Sur le web, on utilise localStorage pour les objets complexes
      if (typeof window === 'undefined') return '';
      const profileString = localStorage.getItem(PROFILE_KEY);
      if (!profileString) throw new Error("Contexte utilisateur non trouvé.");
      
      const context: UserSessionContext = JSON.parse(profileString);
      const organizationId = context?.organisation?.organization_id;
      
      if (!organizationId) throw new Error("ID d'organisation non trouvé.");
      return organizationId;
    } catch (error) {
      console.error("Erreur récupération Org ID:", error);
      throw error;
    }
  },

  saveSessionContext: (context: UserSessionContext) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(context));
    }
  },

  getUserSessionContext: (): UserSessionContext | null => {
    if (typeof window === 'undefined') return null;
    const profileString = localStorage.getItem(PROFILE_KEY);
    return profileString ? JSON.parse(profileString) : null;
  },

  clearUserData: () => {
    Cookies.remove(TOKEN_KEY);
    if (typeof window !== 'undefined') {
        localStorage.removeItem(PROFILE_KEY);
        localStorage.removeItem('userData');
    }
  },
  
  isLoggedIn: () => {
      return !!Cookies.get(TOKEN_KEY);
  }
};