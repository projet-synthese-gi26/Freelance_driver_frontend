// app/types/vehicle.ts

export interface Vehicle {
  vehicleId: string;
  vehicleMakeId?: string | null;
  vehicleModelId?: string | null;
  transmissionTypeId?: string | null;
  manufacturerId?: string | null;
  vehicleSizeId?: string | null;
  vehicleTypeId?: string | null;
  fuelTypeId?: string | null;
  vehicleSerialNumber?: string | null;
  vehicleSerialPhoto?: string | null;
  registrationNumber?: string | null;
  registrationPhoto?: string | null;
  registrationExpiryDate?: string | null;
  tankCapacity?: number | null;
  luggageMaxCapacity?: number | null;
  totalSeatNumber?: number | null;
  averageFuelConsumptionPerKm?: number | null;
  mileageAtStart?: number | null;
  mileageSinceCommissioning?: number | null;
  vehicleAgeAtStart?: number | null;
  brand?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface VehiclePayload {
  vehicleMakeId?: string | null;
  vehicleModelId?: string | null;
  transmissionTypeId?: string | null;
  manufacturerId?: string | null;
  vehicleSizeId?: string | null;
  vehicleTypeId?: string | null;
  fuelTypeId?: string | null;
  vehicleSerialNumber?: string | null;
  vehicleSerialPhoto?: string | null;
  registrationNumber?: string | null;
  registrationPhoto?: string | null;
  registrationExpiryDate?: string | null;
  tankCapacity?: number | null;
  luggageMaxCapacity?: number | null;
  totalSeatNumber?: number | null;
  averageFuelConsumptionPerKm?: number | null;
  mileageAtStart?: number | null;
  mileageSinceCommissioning?: number | null;
  vehicleAgeAtStart?: number | null;
  brand?: string | null;
}

export interface VehicleImage {
  vehicleIllustrationImageId: string;
  vehicleId: string;
  imagePath: string;
}