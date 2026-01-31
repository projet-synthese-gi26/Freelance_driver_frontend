// src/services/profileService.ts

import apiClient from './apiClient';
import { UserSessionContext } from '@/type/profile'; 
// import { UploadMediaResponse } from '@/type/media';

export const profileService = { 
  /**
   * Met à jour les informations du profil du CONDUCTEUR connecté.
   */
  updateDriverProfile: async (profileData: any): Promise<UserSessionContext> => {
    console.log("▶️ [profileService] Mise à jour du profil conducteur avec:", profileData);
    // apiClient gère les headers
    const response = await apiClient.put(`/api/v1/users`, profileData);
    console.log("✅ [profileService] Profil conducteur mis à jour. Contexte reçu:", response.data);
    return response.data;
  },

  /**
   * Met à jour les informations du profil du CLIENT connecté.
   */
  updateClientProfile: async (profileData: any): Promise<UserSessionContext> => {
    console.log("▶️ [profileService] Mise à jour du profil client avec:", profileData);
    const response = await apiClient.put(`/api/v1/users`, profileData);
    console.log("✅ [profileService] Profil client mis à jour. Contexte reçu:", response.data);
    return response.data;
  },

  /**
   * Étape 1 de la mise à jour de l'avatar : téléverse le fichier.
   * NOTE: Sur le web, prend un objet `File` en entrée.
   */
  getDriverProfile: async (): Promise<UserSessionContext> => {
    console.log("▶️ [profileService] Récupération du profil chauffeur");
    const response = await apiClient.get(`/api/v1/driver/profile`);
    return response.data;
  },

  /**
   * Étape 2 de la mise à jour de l'avatar du CONDUCTEUR.
   */
  updateProfilePicture: async (file: File): Promise<UserSessionContext> => {
    console.log("▶️ [profileService] Upload photo de profil via /api/v1/users/picture");
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/api/v1/users/picture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log("✅ [profileService] Photo de profil mise à jour.");
    return response.data;
  },

  /**
   * Récupère le profil public d'un chauffeur (ou client) par son ID.
   * TODO: ajuster si un endpoint public est disponible côté backend.
   */
  getPublicDriverProfile: async (userId: string) => {
    console.log(`▶️ [profileService] Récupération du profil public pour l'ID: ${userId}`);
    const response = await apiClient.get(`/api/profiles/user/${userId}`);
    console.log(`✅ [profileService] Profil public de ${userId} récupéré.`);
    return response.data;
  },
};