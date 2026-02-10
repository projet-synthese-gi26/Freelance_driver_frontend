import { Vehicle } from './vehicle';

export interface ExtendedVehicle extends Partial<Omit<Vehicle, 'immatriculation' | 'serial_number'>> {
  immatriculation?: string;
  serial_number?: string;
  id?: string;
  rating?: string;
  trips?: string;
  seats?: string;
  luggageCapacity?: string;
  transmission?: string;
  
  //MODIFICATION DE LA LIGNE ICI
  amenities?: string[];
  
  size?: string;
  fuelType?: string;
  manufacturer?: string;
  tankCapacity?: number | null;
  registrationExpiryDate?: string;
  vehicleAge?: string;
  avgFuelConsumption?: string;
  isActive?: boolean;
  images?: string[];
}