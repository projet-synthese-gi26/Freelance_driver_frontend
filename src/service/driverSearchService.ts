// src/services/driverSearchService.ts

import apiClient from './apiClient';
import { Planning } from '@/type/planning'; // Adaptation du chemin d'import pour Next.js

// On pourrait enrichir ce type si le backend renvoie plus d'infos que juste le planning
export interface AvailableDriver extends Planning {
    // Par exemple, on pourrait ajouter des infos sur le conducteur
    driverInfo?: {
        name: string;
        rating: number;
    };
}

export const driverSearchService = {
  /**
   * Récupère tous les plannings publiés et disponibles pour la recherche.
   */
  getAvailableDrivers: async (): Promise<AvailableDriver[]> => {
    try {
      console.log("Recherche des conducteurs disponibles via le backend...");
      
      // Utilisation de apiClient : 
      // 1. L'URL de base est gérée par la variable d'environnement dans apiClient.ts
      // 2. Pas besoin de token ici (endpoint public), mais apiClient fonctionne quand même
      const response = await apiClient.get<AvailableDriver[]>('/api/search/drivers');
      
      console.log("Conducteurs disponibles reçus:", response.data.length);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des conducteurs disponibles:', error);
      throw error;
    }
  },
};