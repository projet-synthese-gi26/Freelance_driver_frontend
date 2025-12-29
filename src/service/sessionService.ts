// src/service/sessionService.ts

import Cookies from 'js-cookie';
import { UserSessionContext } from '@/type/profile';

const TOKEN_KEY = 'authToken';
const PROFILE_KEY = 'userProfile';

export const sessionService = {
  /**
   * Récupère le token d'authentification depuis les cookies.
   */
  getAuthToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  /**
   * Génère les headers d'autorisation pour les requêtes API.
   */
  getAuthHeaders: () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  },

  /**
   * Récupère l'ID de l'organisation de l'utilisateur connecté.
   */
  getUserOrganizationId: (): string => {
    try {
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

  /**
   * Sauvegarde la session complète (Token + Profil) lors du login ou de l'inscription.
   * C'est la fonction qui manquait et causait l'erreur.
   */
  saveSession: (token: string, context: UserSessionContext) => {
    // 1. Sauvegarder le token dans les cookies (expire dans 7 jours)
    // 'secure: true' est recommandé en production (HTTPS)
    Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'Strict' });

    // 2. Sauvegarder le profil dans le localStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(context));
    }
    console.log("✅ [sessionService] Session sauvegardée avec succès (Token + Profil).");
  },

  /**
   * Met à jour uniquement le contexte utilisateur (profil) sans toucher au token.
   * Utile lors d'une mise à jour de profil (nom, avatar, etc.).
   */
  saveSessionContext: (context: UserSessionContext) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(context));
        console.log("✅ [sessionService] Contexte profil mis à jour.");
    }
  },

  /**
   * Récupère l'objet contexte utilisateur complet de manière synchrone.
   */
  getUserSessionContext: (): UserSessionContext | null => {
    if (typeof window === 'undefined') return null;
    const profileString = localStorage.getItem(PROFILE_KEY);
    return profileString ? JSON.parse(profileString) : null;
  },

  /**
   * Helper de compatibilité pour les composants migrés du mobile.
   * Simule un appel asynchrone pour récupérer des infos de base de l'utilisateur.
   */
  getUserContext: async () => {
    if (typeof window === 'undefined') return null;
    const profileString = localStorage.getItem(PROFILE_KEY);
    if (!profileString) return null;

    const context: UserSessionContext = JSON.parse(profileString);
    
    // Mappe les données pour correspondre à ce que vos composants attendent
    return {
        id: context.userId,
        name: context.clientProfile?.firstName || context.driverProfile?.firstName || 'Utilisateur',
        email: context.clientProfile?.contactEmail || context.driverProfile?.driver_email || '', // Adaptez selon votre modèle exact
        phoneNumber: context.clientProfile?.phoneNumber || context.driverProfile?.phoneNumber || '',
        roles: context.roles
    };
  },

  /**
   * Déconnecte l'utilisateur en supprimant token et profil.
   */
  clearUserData: () => {
    Cookies.remove(TOKEN_KEY);
    if (typeof window !== 'undefined') {
        localStorage.removeItem(PROFILE_KEY);
        localStorage.removeItem('userData');
    }
    console.log("🧹 [sessionService] Données utilisateur effacées.");
  },
  
  /**
   * Vérifie si l'utilisateur est connecté (basé sur la présence du token).
   */
  isLoggedIn: () => {
      return !!Cookies.get(TOKEN_KEY);
  }
};