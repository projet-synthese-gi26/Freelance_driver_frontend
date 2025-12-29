// src/services/driverSearchService.ts
import axios from 'axios'; // Utilisation d'axios direct pour éviter l'auth
import { Planning } from '@/type/planning';

// On utilise la variable d'environnement pour l'URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
   * Récupère tous les plannings publiés et disponibles pour la recherche (Public).
   */
  getAvailableDrivers: async (): Promise<AvailableDriver[]> => {
    try {
      console.log("▶️ [driverSearchService] Recherche publique des conducteurs...");
      
      // Appel direct sans header Authorization pour éviter le 401 si le token est périmé
      const response = await axios.get(`${API_URL}/api/search/drivers`);
      
      console.log(`✅ [driverSearchService] ${response.data.length} conducteurs trouvés.`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des conducteurs disponibles:', error);
      throw error;
    }
  },
};