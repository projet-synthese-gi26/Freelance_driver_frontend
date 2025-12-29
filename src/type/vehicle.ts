// app/types/vehicle.ts

export interface Vehicle {
  id: string;
  photoUrls: string[]; // Un tableau d'URLs pour la galerie
  model: string;
  manufacturer: string;
  seats: string;
  transmission: string;
  fuelType: string;
  category: string;
  serialNumber?: string;
  tankCapacity?: string;
  loadCapacity?: string;
  amenities?: string[];
}