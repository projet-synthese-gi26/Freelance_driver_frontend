// src/services/reviewService.ts

import apiClient from './apiClient';
import axios from 'axios';
import { Review, ReviewPayload, ReviewSubjectType } from '@/type/review';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const reviewService = {
  /**
   * Récupère tous les avis (Public - Sans Token).
   */
  getReviewsForUser: async (userId: string): Promise<Review[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/reviews/user/${userId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`❌ [reviewService] Erreur lors de la récupération des avis:`, error);
      return [];
    }
  },

  getReviewsBySubject: async (subjectId: string, subjectType: ReviewSubjectType): Promise<Review[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/reviews`, {
        params: { subjectId, subjectType },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`❌ [reviewService] Erreur lors de la récupération des avis:`, error);
      return [];
    }
  },

  /**
   * Créer un avis (Privé - Avec Token).
   */
  createReview: async (payload: ReviewPayload): Promise<Review> => {
    const response = await apiClient.post('/api/v1/reviews', payload);
    return response.data;
  },

  updateReview: async (id: string, payload: Partial<ReviewPayload>): Promise<Review> => {
    const response = await apiClient.put(`/api/v1/reviews/${id}`, payload);
    return response.data;
  },

  deleteReview: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/reviews/${id}`);
  },

  rateByCriteria: async (entityId: string, ratings: { [key: string]: number }): Promise<void> => {
    const payload = { entityId, ratings };
    await apiClient.post('/api/v1/reviews/criteria', payload);
  },
};