// src/services/vehicleService.ts

import apiClient from './apiClient';
import { sessionService } from './sessionService';
import { mediaService } from './mediaService';
import { Vehicle } from '@/type/vehicle';

const VEHICLE_CATEGORY_ID = "e2a7f23e-a3a3-4b0c-852a-227a1c1d6a7e";

const mapProductToVehicle = (product: any): Vehicle => {
  const meta = product.metadata || {};
  const photoUrls = meta.photoUrls
    ? meta.photoUrls.split(',').filter((url: string) => url)
    : (product.clientProfileImageUrl ? [product.clientProfileImageUrl] : []);

  return {
    id: product.key?.id || '',
    photoUrls: photoUrls,
    model: product.name || '',
    manufacturer: meta.manufacturer || '',
    seats: meta.seats || '0',
    transmission: meta.transmission || '',
    fuelType: meta.fuelType || '',
    category: meta.category || '',
    serialNumber: meta.serialNumber || '',
    tankCapacity: meta.tankCapacity || '',
    loadCapacity: meta.loadCapacity || '',
    amenities: meta.amenities ? meta.amenities.split(',').map((a: string) => a.trim()) : [],
  };
};

const mapVehicleToProductPayload = (vehicle: Partial<Vehicle>) => {
  return {
    name: vehicle.model || '',
    clientProfileImageUrl: vehicle.photoUrls?.[0] || null,
    shortDescription: `${vehicle.manufacturer || 'Marque'} - ${vehicle.seats || 'N/A'} places`,
    categoryId: VEHICLE_CATEGORY_ID,
    metadata: {
      manufacturer: vehicle.manufacturer || '',
      seats: vehicle.seats || '',
      transmission: vehicle.transmission || '',
      fuelType: vehicle.fuelType || '',
      category: vehicle.category || '',
      serialNumber: vehicle.serialNumber || '',
      tankCapacity: vehicle.tankCapacity || '',
      loadCapacity: vehicle.loadCapacity || '',
      amenities: vehicle.amenities?.join(', ') || '',
      photoUrls: vehicle.photoUrls?.join(',') || '',
    },
    defaultSellPrice: 0,
    status: 'AVAILABLE',
  };
};

export const vehicleService = {
  /**
   * Récupère tous les véhicules de l'organisation de l'utilisateur connecté.
   */
  getAllVehicles: async (): Promise<Vehicle[]> => {
    // Sur le web, l'organisation ID est récupérée de manière synchrone ou via une promesse rapide du localStorage
    const organizationId = await sessionService.getUserOrganizationId();
    console.log(`▶️ [vehicleService] Récupération de tous les véhicules pour l'organisation ${organizationId}`);
    
    // apiClient ajoute automatiquement le token Bearer
    const response = await apiClient.get(
      `/api/mock-products/${organizationId}?categoryId=${VEHICLE_CATEGORY_ID}`
    );
    
    console.log(`✅ [vehicleService] ${response.data.length} véhicules trouvés.`);
    return response.data.map(mapProductToVehicle);
  },

  /**
   * Récupère les véhicules d'un chauffeur spécifique (Public).
   */
  getVehiclesByDriver: async (driverId: string): Promise<Vehicle[]> => {
    console.log(`▶️ [vehicleService] Récupération des véhicules publics pour le chauffeur ID: ${driverId}`);
    const response = await apiClient.get(`/api/vehicles/user/${driverId}`);
    console.log(`✅ [vehicleService] ${response.data.length} véhicules publics trouvés.`);
    return response.data.map(mapProductToVehicle);
  },

  /**
   * Crée un nouveau véhicule.
   */
  createVehicle: async (vehicle: Partial<Vehicle>, driverId: string): Promise<Vehicle> => {
    const organizationId = await sessionService.getUserOrganizationId();
    const payload = mapVehicleToProductPayload(vehicle);
    // @ts-ignore : On ajoute dynamiquement clientId au payload
    payload.clientId = driverId;
    
    const finalPayload = { ...payload, id: vehicle.id }; 
    
    console.log(`▶️ [vehicleService] Création d'un nouveau véhicule...`, finalPayload);
    const response = await apiClient.post(`/api/mock-products/${organizationId}`, finalPayload);
    return mapProductToVehicle(response.data);
  },

  /**
   * Met à jour un véhicule existant.
   */
  updateVehicle: async (id: string, vehicle: Partial<Vehicle>, driverId: string): Promise<Vehicle> => {
    const organizationId = await sessionService.getUserOrganizationId();
    const payload = mapVehicleToProductPayload(vehicle);
    // @ts-ignore
    payload.clientId = driverId;
    
    console.log(`▶️ [vehicleService] Mise à jour du véhicule ID ${id}...`, payload);
    const response = await apiClient.put(`/api/mock-products/${organizationId}/${id}`, payload);
    return mapProductToVehicle(response.data);
  },

  /**
   * Supprime un véhicule.
   */
  deleteVehicle: async (id: string): Promise<void> => {
    const organizationId = await sessionService.getUserOrganizationId();
    console.log(`▶️ [vehicleService] Suppression du véhicule ID ${id}`);
    await apiClient.delete(`/api/mock-products/${organizationId}/${id}`);
  },

  /**
   * Téléverse une photo de véhicule.
   * NOTE: Sur le web, le paramètre `file` est un objet `File` (input type="file"), pas une string URI.
   */
  uploadVehiclePhoto: async (file: File, vehicleId: string): Promise<string> => {
    // Utilise la version Web de mediaService qui gère les objets File
    const response = await mediaService.uploadFileAndGetResponse(file, 'vehicles', vehicleId);
    return response.url;
  },
};