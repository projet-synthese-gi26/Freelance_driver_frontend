// app/types/address.ts

export interface Address {
  id: string;
  title: string;       // Mappé sur product.name
  street: string;      // Mappé sur product.pickupLocation
  city: string;        // Mappé sur product.dropoffLocation
  zipCode: string;     // Mappé sur product.shortDescription
  country: string;     // Mappé sur product.baggageInfo
  isSelected?: boolean; // Uniquement pour l'état de l'UI
}