import apiClient from './apiClient';
import { Contact, ContactPayload } from '@/type/contact';

const mapApiToContact = (payload: any): Contact => ({
  id: payload.id ?? '',
  contactableId: payload.contactableId ?? null,
  contactableType: payload.contactableType ?? null,
  firstName: payload.firstName ?? null,
  lastName: payload.lastName ?? null,
  title: payload.title ?? null,
  isEmailVerified: payload.isEmailVerified ?? null,
  isPhoneNumberVerified: payload.isPhoneNumberVerified ?? null,
  isFavorite: payload.isFavorite ?? null,
  phoneNumber: payload.phoneNumber ?? null,
  secondaryPhoneNumber: payload.secondaryPhoneNumber ?? null,
  faxNumber: payload.faxNumber ?? null,
  email: payload.email ?? null,
  secondaryEmail: payload.secondaryEmail ?? null,
  emailVerifiedAt: payload.emailVerifiedAt ?? null,
  phoneVerifiedAt: payload.phoneVerifiedAt ?? null,
  createdAt: payload.createdAt ?? null,
  updatedAt: payload.updatedAt ?? null,
  deletedAt: payload.deletedAt ?? null,
});

export const contactService = {
  getClientContacts: async (): Promise<Contact[]> => {
    const response = await apiClient.get('/api/v1/client/profile/contacts');
    return Array.isArray(response.data) ? response.data.map(mapApiToContact) : [];
  },
  createClientContact: async (payload: ContactPayload): Promise<Contact> => {
    const response = await apiClient.post('/api/v1/client/profile/contacts', payload);
    return mapApiToContact(response.data);
  },
  updateClientContact: async (id: string, payload: ContactPayload): Promise<Contact> => {
    const response = await apiClient.put(`/api/v1/client/profile/contacts/${id}`, payload);
    return mapApiToContact(response.data);
  },
  deleteClientContact: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/client/profile/contacts/${id}`);
  },
  getDriverContacts: async (): Promise<Contact[]> => {
    const response = await apiClient.get('/api/v1/driver/profile/contacts');
    return Array.isArray(response.data) ? response.data.map(mapApiToContact) : [];
  },
  createDriverContact: async (payload: ContactPayload): Promise<Contact> => {
    const response = await apiClient.post('/api/v1/driver/profile/contacts', payload);
    return mapApiToContact(response.data);
  },
  updateDriverContact: async (id: string, payload: ContactPayload): Promise<Contact> => {
    const response = await apiClient.put(`/api/v1/driver/profile/contacts/${id}`, payload);
    return mapApiToContact(response.data);
  },
  deleteDriverContact: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/driver/profile/contacts/${id}`);
  },
};
