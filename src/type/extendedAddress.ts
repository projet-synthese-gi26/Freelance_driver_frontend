import { Address } from './address';

export interface ExtendedAddress extends Address {
  // Champs supplémentaires pour l'UI
  street: string;
  city: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
  isSelected?: boolean;
}
