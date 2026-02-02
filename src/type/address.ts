// app/types/address.ts

export type AddressableType = 'ORGANISATION' | 'ORGANIZATION';

export interface Address {
  id: string;
  addressableId?: string | null;
  addressableType?: AddressableType | null;
  type?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  locality?: string | null;
  zipCode?: string | null;
  postalCode?: string | null;
  poBox?: string | null;
  isDefault?: boolean | null;
  countryId?: string | null;
  neighborhood?: string | null;
  informalDescription?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface AddressPayload {
  addressableType: AddressableType;
  type?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  locality?: string | null;
  zipCode?: string | null;
  postalCode?: string | null;
  poBox?: string | null;
  isDefault?: boolean | null;
  neighborhood?: string | null;
  informalDescription?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}