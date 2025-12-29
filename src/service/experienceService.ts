import axios from 'axios';
import { sessionService } from './sessionService';

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND;

const DRIVER_LICENSE_CATEGORY_ID = "f1c2b3d4-e5f6-7890-1234-567890abcdef";
const CV_CATEGORY_ID = "a1b2c3d4-e5f6-7890-1234-567890fedcba";
const EXPERIENCE_CATEGORY_ID = "e1f2a3b4-c5d6-7890-1234-567890abcdef";

export const experienceService = {
  getDocument: async <T>(categoryId: string): Promise<T | null> => {
    const headers = sessionService.getAuthHeaders();
    // Ajoute ici la logique pour récupérer le document selon la catégorie
    const response = await axios.get(`${API_BASE_URL}/api/documents/${categoryId}`, { headers });
    return response.data || null;
  },
  // Ajoute ici d'autres méthodes si besoin
};
