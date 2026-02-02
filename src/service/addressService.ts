// src/services/addressService.ts

import apiClient from './apiClient';
import { Address, AddressPayload } from '@/type/address';

const mapApiToAddress = (payload: any): Address => ({
    id: payload.id ?? '',
    addressableId: payload.addressableId ?? null,
    addressableType: payload.addressableType ?? null,
    type: payload.type ?? null,
    addressLine1: payload.addressLine1 ?? null,
    addressLine2: payload.addressLine2 ?? null,
    city: payload.city ?? null,
    state: payload.state ?? null,
    locality: payload.locality ?? null,
    zipCode: payload.zipCode ?? null,
    postalCode: payload.postalCode ?? null,
    poBox: payload.poBox ?? null,
    isDefault: payload.isDefault ?? null,
    countryId: payload.countryId ?? null,
    neighborhood: payload.neighborhood ?? null,
    informalDescription: payload.informalDescription ?? null,
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    createdAt: payload.createdAt ?? null,
    updatedAt: payload.updatedAt ?? null,
    deletedAt: payload.deletedAt ?? null,
});

/**
 * Service pour gérer toutes les opérations CRUD pour les adresses.
 */
export const addressService = {
    /**
     * Récupère toutes les adresses de l'utilisateur actuellement connecté.
     * Le token est injecté automatiquement par apiClient.
     */
    getAllAddresses: async (): Promise<Address[]> => {
        const response = await apiClient.get('/api/v1/client/profile/addresses');
        return Array.isArray(response.data) ? response.data.map(mapApiToAddress) : [];
    },

    /**
     * Crée une nouvelle adresse pour l'utilisateur connecté.
     */
    createAddress: async (payload: AddressPayload): Promise<Address> => {
        const response = await apiClient.post('/api/v1/client/profile/addresses', payload);
        return mapApiToAddress(response.data);
    },

    /**
     * Met à jour une adresse existante.
     */
    updateAddress: async (id: string, payload: AddressPayload): Promise<Address> => {
        const response = await apiClient.put(`/api/v1/client/profile/addresses/${id}`, payload);
        return mapApiToAddress(response.data);
    },

    /**
     * Supprime une adresse.
     */
    deleteAddress: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/v1/client/profile/addresses/${id}`);
    },

    getDriverAddresses: async (): Promise<Address[]> => {
        const response = await apiClient.get('/api/v1/driver/profile/addresses');
        return Array.isArray(response.data) ? response.data.map(mapApiToAddress) : [];
    },

    createDriverAddress: async (payload: AddressPayload): Promise<Address> => {
        const response = await apiClient.post('/api/v1/driver/profile/addresses', payload);
        return mapApiToAddress(response.data);
    },

    updateDriverAddress: async (id: string, payload: AddressPayload): Promise<Address> => {
        const response = await apiClient.put(`/api/v1/driver/profile/addresses/${id}`, payload);
        return mapApiToAddress(response.data);
    },

    deleteDriverAddress: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/v1/driver/profile/addresses/${id}`);
    },
};