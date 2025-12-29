// src/services/addressService.ts

import apiClient from './apiClient';
import { Address } from '@/type/address';

/**
 * Traduit un objet "Product" brut reçu du backend en un objet "Address" propre
 * et typé pour être utilisé par l'interface utilisateur.
 */
const mapProductToAddress = (product: any): Address => {
    return {
        id: product.key?.id || product.id || '',
        title: product.name || 'Adresse',
        street: product.pickupLocation || '',
        city: product.dropoffLocation || '',
        zipCode: product.shortDescription || '',
        country: product.baggageInfo || '',
    };
};

/**
 * Traduit un objet "Address" de l'interface utilisateur en un payload "Product"
 * prêt à être envoyé au backend.
 */
const mapAddressToProductPayload = (address: Partial<Address>, clientId: string) => {
    return {
        name: address.title,
        pickupLocation: address.street,
        dropoffLocation: address.city,
        shortDescription: address.zipCode,
        baggageInfo: address.country,
        
        clientId: clientId, // On lie l'adresse à son propriétaire

        // Champs par défaut nécessaires pour le modèle Product
        status: 'Published',
        defaultSellPrice: 0,
        paymentMethod: 'N/A',
        isNegotiable: false,
        startDate: new Date().toISOString().split('T')[0],
        startTime: '00:00',
    };
};

/**
 * Service pour gérer toutes les opérations CRUD pour les adresses.
 */
export const addressService = {
    /**
     * Récupère toutes les adresses de l'utilisateur actuellement connecté.
     * Le token est injecté automatiquement par apiClient.
     */
    getAllAddresses: async (): Promise<Address[]> => {
        console.log("▶️ [addressService] Récupération des adresses de l'utilisateur connecté.");
        const response = await apiClient.get('/api/addresses');
        console.log(`✅ [addressService] ${response.data.length} adresses trouvées.`);
        return response.data.map(mapProductToAddress);
    },

    /**
     * Récupère les adresses d'un utilisateur spécifique par son ID.
     */
    getAddressesByDriver: async (driverId: string): Promise<Address[]> => {
        console.log(`▶️ [addressService] Récupération des adresses publiques pour le chauffeur ID: ${driverId}`);
        const response = await apiClient.get(`/api/addresses/user/${driverId}`);
        console.log(`✅ [addressService] ${response.data.length} adresses publiques trouvées.`);
        return response.data.map(mapProductToAddress);
    },

    /**
     * Crée une nouvelle adresse pour l'utilisateur connecté.
     */
    createAddress: async (address: Partial<Address>, userId: string): Promise<Address> => {
        const payload = mapAddressToProductPayload(address, userId);
        console.log("▶️ [addressService] Création d'une nouvelle adresse...", payload);
        const response = await apiClient.post('/api/addresses', payload);
        return mapProductToAddress(response.data);
    },

    /**
     * Met à jour une adresse existante.
     */
    updateAddress: async (id: string, address: Partial<Address>, userId: string): Promise<Address> => {
        const payload = mapAddressToProductPayload(address, userId);
        console.log(`▶️ [addressService] Mise à jour de l'adresse ID ${id}...`, payload);
        const response = await apiClient.put(`/api/addresses/${id}`, payload);
        return mapProductToAddress(response.data);
    },

    /**
     * Supprime une adresse.
     */
    deleteAddress: async (id: string): Promise<void> => {
        console.log(`▶️ [addressService] Suppression de l'adresse ID ${id}`);
        await apiClient.delete(`/api/addresses/${id}`);
    },
};