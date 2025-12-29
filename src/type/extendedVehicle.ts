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
  amenities?: string;
  size?: string;
  fuelType?: string;
  manufacturer?: string;
  tankCapacity?: string;
  registrationExpiryDate?: string;
  vehicleAge?: string;
  avgFuelConsumption?: string;
  mileageSinceCommission?: string;
  isActive?: boolean;
  images?: string[];
}
