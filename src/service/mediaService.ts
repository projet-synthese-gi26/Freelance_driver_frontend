import apiClient from './apiClient';
import { UploadMediaResponse } from '@/type/media';
import { sessionService } from './sessionService';

export const mediaService = {
  uploadFileAndGetResponse: async (
    file: File, // Changement ici: on prend un objet File JS standard
    type: 'avatars' | 'vehicles' | 'documents', 
    resourceId: string
  ): Promise<UploadMediaResponse> => {
    
    const formData = new FormData();
    // Sur le web, on append directement le fichier
    formData.append('file', file);

    try {
      const url = `/api/media/upload?type=${type}&resourceId=${resourceId}`;
      console.log(`▶️ Uploading file type '${type}' to: ${url}`);
      
      // Axios gère automatiquement le boundary pour multipart/form-data
      const response = await apiClient.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur upload (type: '${type}'):`, error);
      throw error;
    }
  },

  // Helper pour compatibilité si nécessaire, mais préférez la méthode ci-dessus
  uploadFile: async (file: File, type: any, resourceId: string): Promise<string> => {
      const res = await mediaService.uploadFileAndGetResponse(file, type, resourceId);
      return res.url;
  }
};