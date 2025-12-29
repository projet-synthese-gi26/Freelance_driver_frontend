// src/services/reviewService.ts

import apiClient from './apiClient';

/**
 * Interface décrivant la structure d'un objet Avis.
 * Vous pouvez déplacer ceci dans src/type/review.ts si vous préférez.
 */
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

/**
 * Service pour gérer toutes les opérations liées aux avis et évaluations.
 */
export const reviewService = {
  /**
   * Récupère tous les avis laissés pour un utilisateur spécifique.
   */
  getReviewsForUser: async (userId: string): Promise<Review[]> => {
    console.log(`▶️ [reviewService] Récupération des avis pour l'utilisateur ID: ${userId}`);
    try {
      const response = await apiClient.get(`/api/reviews/user/${userId}`);
      console.log(`✅ [reviewService] ${response.data.length} avis trouvés pour l'utilisateur ${userId}.`);
      return response.data;
    } catch (error) {
      console.error(`❌ [reviewService] Erreur lors de la récupération des avis pour l'utilisateur ${userId}:`, error);
      return [];
    }
  },

  /**
   * Permet à l'utilisateur connecté de créer un nouvel avis.
   */
  createReview: async (targetUserId: string, score: number, comment: string): Promise<Review> => {
    const payload = { targetUserId, score, comment };
    console.log(`▶️ [reviewService] Envoi d'un nouvel avis pour l'utilisateur ID: ${targetUserId}`, payload);
    const response = await apiClient.post('/api/reviews', payload);
    console.log("✅ [reviewService] Avis créé avec succès.");
    return response.data;
  },

  /**
   * Permet d'envoyer une évaluation détaillée par critères.
   */
  rateByCriteria: async (entityId: string, ratings: { [key: string]: number }): Promise<void> => {
    const payload = { entityId, ratings };
    console.log(`▶️ [reviewService] Envoi d'une évaluation par critères pour l'entité ID: ${entityId}`, payload);
    await apiClient.post('/api/reviews/criteria', payload);
    console.log("✅ [reviewService] Évaluation par critères envoyée avec succès.");
  },
};