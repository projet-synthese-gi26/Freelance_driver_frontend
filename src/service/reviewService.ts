// src/services/reviewService.ts

import apiClient from './apiClient';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Review {
  id: string;
  targetUserId: string;
  authorFirstName: string;
  authorLastName: string;
  authorProfileImageUrl?: string;
  score: number;
  comment: string;
  createdAt: string;
}

export const reviewService = {
  /**
   * Récupère tous les avis (Public - Sans Token).
   */
  getReviewsForUser: async (userId: string): Promise<Review[]> => {
    console.log(`▶️ [reviewService] Récupération publique des avis pour l'utilisateur ID: ${userId}`);
    try {
      const response = await axios.get(`${API_URL}/api/reviews/user/${userId}`);
      console.log(`✅ [reviewService] ${response.data.length} avis trouvés.`);
      return response.data;
    } catch (error) {
      console.error(`❌ [reviewService] Erreur lors de la récupération des avis:`, error);
      return [];
    }
  },

  /**
   * Créer un avis (Privé - Avec Token).
   */
  createReview: async (targetUserId: string, score: number, comment: string): Promise<Review> => {
    const payload = { targetUserId, score, comment };
    console.log(`▶️ [reviewService] Envoi d'un nouvel avis pour l'utilisateur ID: ${targetUserId}`, payload);
    const response = await apiClient.post('/api/reviews', payload);
    console.log("✅ [reviewService] Avis créé avec succès.");
    return response.data;
  },

  rateByCriteria: async (entityId: string, ratings: { [key: string]: number }): Promise<void> => {
    const payload = { entityId, ratings };
    await apiClient.post('/api/reviews/criteria', payload);
  },
};