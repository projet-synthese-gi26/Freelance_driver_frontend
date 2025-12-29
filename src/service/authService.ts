
// src/service/authService.ts
import apiClient from './apiClient';
import { LoginPayload, RegistrationRequest, AuthResponse } from '@/type/auth';
import { sessionService } from './sessionService';
import { UserSessionContext } from '@/type/profile';

export const authService = {
  /**
   * Étape 1 Inscription : Envoi des données initiales.
   * Déclenche l'envoi de l'OTP par email.
   */
  registerInit: async (data: RegistrationRequest) => {
    console.log("▶️ [authService] Register Init via /api/register");
    // Le backend attend username = email
    const payload = { ...data, username: data.email };
    const response = await apiClient.post('/api/register', payload);
    return response.data;
  },

  /**
   * Étape 2 Inscription : Vérification OTP et Création finale du compte.
   */
  finalizeOnboarding: async (data: RegistrationRequest, otp: string) => {
    const endpoint = data.role === 'driver' 
      ? '/api/onboarding/driver' 
      : '/api/onboarding/client';
    
    console.log(`▶️ [authService] Finalizing onboarding via ${endpoint}`);
    
    const payload = { ...data, otp };
    const response = await apiClient.post<AuthResponse>(endpoint, payload);
    
    // Si succès, on sauvegarde la session immédiatement comme sur mobile
    if (response.data.token && response.data.profile) {
      sessionService.saveSession(response.data.token, response.data.profile);
    }
    
    return response.data;
  },

  /**
   * Connexion classique.
   */
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    console.log("▶️ [authService] Login via /api/auth/login");
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    
    // Note: On ne sauvegarde pas la session ici si on veut gérer 
    // la logique "Choix du profil" dans le composant, 
    // mais on peut le faire si le token est valide pour tous les rôles.
    // Pour l'instant, on retourne les data brutes pour que le composant décide.
    
    return response.data;
  },

  logout: () => {
    sessionService.clearUserData();
    window.location.href = '/login';
  }
};