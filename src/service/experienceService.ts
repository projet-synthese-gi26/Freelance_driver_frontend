import apiClient from './apiClient';
import { sessionService } from './sessionService';
import { DriverLicense, CV, Experience } from '@/type/experience';

// IDs de catégorie uniques et fixes pour chaque type de document/expérience.
const DRIVER_LICENSE_CATEGORY_ID = "f1c2b3d4-e5f6-7890-1234-567890abcdef";
const CV_CATEGORY_ID = "a1b2c3d4-e5f6-7890-1234-567890fedcba";
const EXPERIENCE_CATEGORY_ID = "e1f2a3b4-c5d6-7890-1234-567890abcdef";

// ==============================================================================
//                            FONCTIONS DE MAPPING
// ==============================================================================

/**
 * Traduit un objet "Product" du backend en un objet "Experience" pour l'UI.
 */
const mapProductToExperience = (p: any): Experience => ({
  id: p.key?.id || p.id,
  company: p.name || '',
  referent: p.shortDescription || '',
  startDate: p.startDate,
  endDate: p.endDate,
  currentlyWorking: p.metadata?.currentlyWorking === 'true',
});

/**
 * Traduit un objet "Experience" de l'UI en un payload "Product" pour le backend.
 */
const mapExperienceToProductPayload = (exp: Partial<Experience>, driverId: string) => ({
  name: exp.company,
  shortDescription: exp.referent,
  startDate: exp.startDate,
  endDate: exp.endDate,
  categoryId: EXPERIENCE_CATEGORY_ID,
  clientId: driverId, // On lie l'expérience au conducteur
  metadata: { 
    currentlyWorking: String(exp.currentlyWorking || false) 
  },
  defaultSellPrice: 0,
  status: 'METADATA', // Un statut pour indiquer que ce n'est pas une offre, mais une donnée
});

// ==============================================================================
//                            LE SERVICE API EXPORTÉ
// ==============================================================================

export const experienceService = {
  // Export des constantes pour utilisation dans les composants
  DRIVER_LICENSE_CATEGORY_ID,
  CV_CATEGORY_ID,
  EXPERIENCE_CATEGORY_ID,

  /**
   * Récupère un document unique (Permis ou CV) pour l'utilisateur connecté.
   */
  getDocument: async <T>(categoryId: string): Promise<T | null> => {
    try {
      const orgId = await sessionService.getUserOrganizationId();
      console.log(`▶️ [experienceService] Récupération du document avec la catégorie ID: ${categoryId}`);
      
      const response = await apiClient.get(`/api/mock-products/${orgId}?categoryId=${categoryId}`);
      
      if (response.data && response.data.length > 0) {
        const product = response.data[0];
        if (categoryId === DRIVER_LICENSE_CATEGORY_ID) {
          return { id: product.key?.id || product.id, photoUrl: product.clientProfileImageUrl } as T;
        }
        if (categoryId === CV_CATEGORY_ID) {
          return { id: product.key?.id || product.id, fileUrl: product.clientProfileImageUrl, fileName: product.name } as T;
        }
      }
      return null;
    } catch (error) {
      console.error("Erreur getDocument:", error);
      return null;
    }
  },

  /**
   * Sauvegarde (crée ou met à jour) un document (Permis ou CV).
   */
  saveDocument: async (id: string | null, fileUrl: string, fileName: string, categoryId: string, driverId: string) => {
    const orgId = await sessionService.getUserOrganizationId();
    const payload = {
      name: fileName,
      clientProfileImageUrl: fileUrl,
      categoryId: categoryId,
      clientId: driverId, // On lie le document au conducteur
      status: 'METADATA',
    };

    if (id) {
      console.log(`▶️ [experienceService] Mise à jour du document ID: ${id}`);
      await apiClient.put(`/api/mock-products/${orgId}/${id}`, payload);
    } else {
      console.log(`▶️ [experienceService] Création d'un nouveau document de catégorie ${categoryId}`);
      await apiClient.post(`/api/mock-products/${orgId}`, payload);
    }
  },

  /**
   * Récupère toutes les expériences professionnelles du conducteur connecté.
   */
  getAllExperiences: async (): Promise<Experience[]> => {
    try {
      const orgId = await sessionService.getUserOrganizationId();
      const response = await apiClient.get(`/api/mock-products/${orgId}?categoryId=${EXPERIENCE_CATEGORY_ID}`);
      return response.data.map(mapProductToExperience);
    } catch (error) {
      console.error("Erreur getAllExperiences:", error);
      return [];
    }
  },

  /**
   * Crée une nouvelle expérience professionnelle.
   */
  createExperience: async (exp: Partial<Experience>, driverId: string): Promise<Experience> => {
    const orgId = await sessionService.getUserOrganizationId();
    const payload = mapExperienceToProductPayload(exp, driverId);
    
    const response = await apiClient.post(`/api/mock-products/${orgId}`, payload);
    return mapProductToExperience(response.data);
  },

  /**
   * Met à jour une expérience professionnelle.
   */
  updateExperience: async (id: string, exp: Partial<Experience>, driverId: string): Promise<Experience> => {
    const orgId = await sessionService.getUserOrganizationId();
    const payload = mapExperienceToProductPayload(exp, driverId);
    
    const response = await apiClient.put(`/api/mock-products/${orgId}/${id}`, payload);
    return mapProductToExperience(response.data);
  },

  /**
   * Supprime une expérience professionnelle.
   */
  deleteExperience: async (id: string): Promise<void> => {
    const orgId = await sessionService.getUserOrganizationId();
    await apiClient.delete(`/api/mock-products/${orgId}/${id}`);
  },
  
  /**
   * Récupère l'ensemble du portfolio (Permis, CV, Expériences) d'un chauffeur spécifique (Public).
   * Utilisé par les clients sur la page de détails du chauffeur.
   */
  getPortfolioByDriver: async (driverId: string): Promise<{ license: DriverLicense | null, cv: CV | null, experiences: Experience[] }> => {
    console.log(`▶️ [experienceService] Récupération du portfolio pour le chauffeur ID: ${driverId}`);
    
    // Appel à l'endpoint public (géré par le backend pour renvoyer tout le portfolio)
    const response = await apiClient.get(`/api/experiences/user/${driverId}`);
    
    let license: DriverLicense | null = null;
    let cv: CV | null = null;
    const experiences: Experience[] = [];

    for (const product of response.data) {
        switch (product.categoryId) {
            case DRIVER_LICENSE_CATEGORY_ID:
                license = { id: product.key?.id || product.id, photoUrl: product.clientProfileImageUrl };
                break;
            case CV_CATEGORY_ID:
                cv = { id: product.key?.id || product.id, fileUrl: product.clientProfileImageUrl, fileName: product.name };
                break;
            case EXPERIENCE_CATEGORY_ID:
                experiences.push(mapProductToExperience(product));
                break;
        }
    }
    console.log(`✅ [experienceService] Portfolio trouvé: ${license ? '1 permis, ' : ''}${cv ? '1 CV, ' : ''}${experiences.length} expérience(s).`);
    return { license, cv, experiences };
  },
};
