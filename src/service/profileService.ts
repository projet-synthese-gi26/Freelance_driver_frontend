// src/services/profileService.ts

import apiClient from './apiClient';
import publicClient from './publicClient';
import { UserSessionContext } from '@/type/profile'; 
import { sessionService } from './sessionService';
// import { UploadMediaResponse } from '@/type/media';

type PublicUserProfile = {
  id: string;
  username?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  photoUri?: string;
};

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

  getPublicDriverProfile: async (userId: string): Promise<UserSessionContext | null> => {
    const token = sessionService.getAuthToken();
    try {
      if (token) {
        const response = await apiClient.get(`/api/v1/driver/profile/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      }

      const response = await publicClient.get(`/api/v1/driver/profile/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.warn(`⚠️ [profileService] Public profile not found for user ${userId}:`, error?.response?.status);
      return null;
    }
  },

  getPublicUserById: async (userId: string): Promise<PublicUserProfile | null> => {
    try {
      const response = await publicClient.get(`/api/v1/users/${userId}`);
      const payload = response.data;
      const user = payload?.user ?? payload;
      if (!user) return null;
      return {
        id: user.id ?? userId,
        username: user.username,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUri: user.photoUri,
      };
    } catch (error: any) {
      console.warn(`⚠️ [profileService] Public user not found for id ${userId}:`, error?.response?.status);
      return null;
    }
  },

  /**
   * Étape 1 de la mise à jour de l'avatar : téléverse le fichier.
   * NOTE: Sur le web, prend un objet `File` en entrée.
   */
  getDriverProfile: async (): Promise<UserSessionContext> => {
    console.log("▶️ [profileService] Récupération du profil chauffeur");
    const response = await apiClient.get(`/api/v1/driver/profile`);
    console.log("✅ [profileService] Profil chauffeur reçu:", response.data);
    return response.data;
  },

  /**
   * Étape 2 de la mise à jour de l'avatar du CONDUCTEUR.
   */
  updateProfilePicture: async (file: File): Promise<UserSessionContext> => {
    console.log("▶️ [profileService] Upload photo de profil via /api/v1/users/picture");
    console.log("▶️ [profileService] Avatar file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    const formData = new FormData();
    formData.append('file', file);
    const token = sessionService.getAuthToken();
    console.log("▶️ [profileService] Token present:", Boolean(token));
    const currentContext = sessionService.getUserSessionContext();
    console.log("▶️ [profileService] Current context (full):", currentContext);
    console.log("▶️ [profileService] FormData entries:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  - ${key}: [File] name=${value.name} type=${value.type} size=${value.size}`);
      } else {
        console.log(`  - ${key}:`, value);
      }
    }
    console.log("▶️ [profileService] Upload headers:", {
      contentType: 'multipart/form-data',
      hasAuthorization: Boolean(token),
    });
    try {
      const response = await apiClient.post(`/api/v1/users/picture`, formData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        transformRequest: (data, headers) => {
          if (headers) {
            delete headers['Content-Type'];
            delete headers['content-type'];
          }
          return data;
        },
      });
      console.log("✅ [profileService] Photo de profil mise à jour. Réponse:", response.data);
      const updatedUser = response.data?.user ?? response.data;
      if (!currentContext) {
        return {
          accessToken: '',
          refreshToken: '',
          user: updatedUser,
        } as UserSessionContext;
      }
      const mergedContext: UserSessionContext = {
        ...currentContext,
        user: updatedUser,
      };
      sessionService.saveSessionContext(mergedContext);
      return mergedContext;
    } catch (error: any) {
      const response = error?.response;
      console.error("❌ [profileService] Upload photo failed", {
        message: error?.message,
        status: response?.status,
        data: response?.data,
        headers: response?.headers,
      });
      const fallbackUser = response?.data?.user ?? response?.data;
      if (fallbackUser?.photoUri || fallbackUser?.photoId) {
        console.warn("⚠️ [profileService] Backend returned error but payload looks valid. Applying profile update.");
        if (!currentContext) {
          return {
            accessToken: '',
            refreshToken: '',
            user: fallbackUser,
          } as UserSessionContext;
        }
        const mergedContext: UserSessionContext = {
          ...currentContext,
          user: fallbackUser,
        };
        sessionService.saveSessionContext(mergedContext);
        return mergedContext;
      }
      throw error;
    }
  },
};