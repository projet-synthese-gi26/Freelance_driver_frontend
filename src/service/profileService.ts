// src/services/profileService.ts

import apiClient from './apiClient';
import { mediaService } from './mediaService';
import { sessionService } from './sessionService';
import { UserSessionContext } from '@/type/profile'; 
// import { UploadMediaResponse } from '@/type/media';

export const profileService = { 
  /**
   * Met à jour les informations du profil du CONDUCTEUR connecté.
   */
  updateDriverProfile: async (profileData: any): Promise<UserSessionContext> => {
    console.log("▶️ [profileService] Mise à jour du profil conducteur avec:", profileData);
    // apiClient gère les headers
    const response = await apiClient.put(
      `/api/profiles/driver/me`,
      profileData
    );
    console.log("✅ [profileService] Profil conducteur mis à jour. Contexte reçu:", response.data);
    return response.data;
  },

  /**
   * Met à jour les informations du profil du CLIENT connecté.
   */
  updateClientProfile: async (profileData: any): Promise<UserSessionContext> => {
    console.log("▶️ [profileService] Mise à jour du profil client avec:", profileData);
    const response = await apiClient.put(
      `/api/profiles/client/me`,
      profileData
    );
    console.log("✅ [profileService] Profil client mis à jour. Contexte reçu:", response.data);
    return response.data;
  },

  /**
   * Étape 1 de la mise à jour de l'avatar : téléverse le fichier.
   * NOTE: Sur le web, prend un objet `File` en entrée.
   */
  uploadAvatar: async (file: File): Promise<string> => { 
    // Récupération synchrone depuis le localStorage via sessionService (pas besoin d'await sur AsyncStorage)
    const context = sessionService.getUserSessionContext();
    const userId = context?.userId;
    
    if (!userId) throw new Error("ID utilisateur non trouvé pour l'upload d'avatar");

    // <-- Appel à la méthode Web qui accepte un File
    const uploadResponse = await mediaService.uploadFileAndGetResponse(file, 'avatars', userId); 
    
    if (uploadResponse && uploadResponse.url) {
      console.log("DEBUG: profileService.uploadAvatar - URL valide prête à être retournée:", uploadResponse.url);
      return uploadResponse.url;
    } else {
      console.error("ERREUR: profileService.uploadAvatar - URL non reçue.");
      throw new Error("L'upload de l'avatar a échoué: URL non reçue.");
    }
  },

  /**
   * Étape 2 de la mise à jour de l'avatar du CONDUCTEUR.
   */
  updateDriverAvatarUrl: async (newAvatarUrl: string): Promise<UserSessionContext> => {
    console.log(`▶️ [profileService] Sauvegarde de la nouvelle URL d'avatar (via DRIVER): ${newAvatarUrl}`);
    
    const payload = { profileImageUrl: newAvatarUrl };
    const response = await apiClient.put(
      `/api/profiles/me/avatar`, 
      payload
    );
    console.log("✅ [profileService] URL de l'avatar mise à jour. Contexte reçu:", response.data);
    return response.data;
  },

  /**
   * Étape 2 de la mise à jour de l'avatar du CLIENT.
   */
  updateClientAvatarUrl: async (newAvatarUrl: string): Promise<UserSessionContext> => {
    console.log(`▶️ [profileService] Sauvegarde de la nouvelle URL d'avatar (via CLIENT): ${newAvatarUrl}`);
    
    const payload = { profileImageUrl: newAvatarUrl };
    const response = await apiClient.put(
      `/api/profiles/me/avatar`, 
      payload
    );
    console.log("✅ [profileService] URL de l'avatar mise à jour. Contexte reçu:", response.data);
    return response.data;
  },

  /**
   * Récupère le profil public d'un chauffeur (ou client) par son ID.
   */
  getPublicDriverProfile: async (userId: string) => {
    console.log(`▶️ [profileService] Récupération du profil public pour l'ID: ${userId}`);
    const response = await apiClient.get(`/api/profiles/user/${userId}`);
    console.log(`✅ [profileService] Profil public de ${userId} récupéré.`);
    return response.data;
  },
};