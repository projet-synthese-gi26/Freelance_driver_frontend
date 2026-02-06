// src/services/vehicleService.ts

import apiClient from './apiClient';
import { Vehicle, VehicleImage, VehiclePayload, VehicleSimplifiedPayload } from '@/type/vehicle';

const pickFirst = <T,>(...values: T[]): T | undefined => {
  for (const value of values) {
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
};

const mapApiToVehicle = (payload: any): Vehicle => ({
  vehicleId: (pickFirst(payload.vehicleId, payload.vehicle_id, payload.id) as any) ?? '',
  vehicleMakeId: (pickFirst(payload.vehicleMakeId, payload.vehicle_make_id, payload.makeId, payload.make_id) as any) ?? null,
  vehicleModelId: (pickFirst(payload.vehicleModelId, payload.vehicle_model_id, payload.modelId, payload.model_id) as any) ?? null,
  transmissionTypeId: (pickFirst(payload.transmissionTypeId, payload.transmission_type_id) as any) ?? null,
  manufacturerId: (pickFirst(payload.manufacturerId, payload.manufacturer_id) as any) ?? null,
  vehicleSizeId: (pickFirst(payload.vehicleSizeId, payload.vehicle_size_id) as any) ?? null,
  vehicleTypeId: (pickFirst(payload.vehicleTypeId, payload.vehicle_type_id) as any) ?? null,
  fuelTypeId: (pickFirst(payload.fuelTypeId, payload.fuel_type_id) as any) ?? null,
  vehicleSerialNumber: (pickFirst(payload.vehicleSerialNumber, payload.vehicle_serial_number, payload.serialNumber, payload.serial_number) as any) ?? null,
  vehicleSerialPhoto: (pickFirst(payload.vehicleSerialPhoto, payload.vehicle_serial_photo, payload.serialPhoto, payload.serial_photo) as any) ?? null,
  registrationNumber: (pickFirst(payload.registrationNumber, payload.registration_number) as any) ?? null,
  registrationPhoto: (pickFirst(payload.registrationPhoto, payload.registration_photo) as any) ?? null,
  registrationExpiryDate: (pickFirst(payload.registrationExpiryDate, payload.registration_expiry_date) as any) ?? null,
  tankCapacity: (pickFirst(payload.tankCapacity, payload.tank_capacity) as any) ?? null,
  luggageMaxCapacity: (pickFirst(payload.luggageMaxCapacity, payload.luggage_max_capacity) as any) ?? null,
  totalSeatNumber: (pickFirst(payload.totalSeatNumber, payload.total_seat_number) as any) ?? null,
  averageFuelConsumptionPerKm: (pickFirst(payload.averageFuelConsumptionPerKm, payload.average_fuel_consumption_per_km, payload.average_fuel_consumption_per_kilometer) as any) ?? null,
  mileageAtStart: (pickFirst(payload.mileageAtStart, payload.mileage_at_start) as any) ?? null,
  mileageSinceCommissioning: (pickFirst(payload.mileageSinceCommissioning, payload.mileage_since_commissioning) as any) ?? null,
  vehicleAgeAtStart: (pickFirst(payload.vehicleAgeAtStart, payload.vehicle_age_at_start) as any) ?? null,
  brand: (pickFirst(payload.brand, payload.brand_name) as any) ?? null,
  createdAt: (pickFirst(payload.createdAt, payload.created_at) as any) ?? null,
  updatedAt: (pickFirst(payload.updatedAt, payload.updated_at) as any) ?? null,
  airConditioned: (pickFirst(payload.airConditioned, payload.air_conditioned) as any) ?? null,
  comfortable: payload.comfortable ?? null,
  soft: payload.soft ?? null,
  screen: payload.screen ?? null,
  wifi: payload.wifi ?? null,
  tollCharge: (pickFirst(payload.tollCharge, payload.toll_charge) as any) ?? null,
  carParking: (pickFirst(payload.carParking, payload.car_parking) as any) ?? null,
  alarm: payload.alarm ?? null,
  stateTax: (pickFirst(payload.stateTax, payload.state_tax) as any) ?? null,
  driverAllowance: (pickFirst(payload.driverAllowance, payload.driver_allowance) as any) ?? null,
  pickupAndDrop: (pickFirst(payload.pickupAndDrop, payload.pickup_and_drop) as any) ?? null,
  internet: payload.internet ?? null,
  petsAllow: (pickFirst(payload.petsAllow, payload.pets_allow) as any) ?? null,
});

const mapApiToVehicleImage = (payload: any): VehicleImage => ({
  vehicleIllustrationImageId: payload.vehicleIllustrationImageId ?? payload.id ?? '',
  vehicleId: payload.vehicleId ?? payload.vehicle_id ?? '',
  imagePath: payload.imagePath ?? payload.imageURL ?? payload.url ?? payload.path ?? '',
});

export const vehicleService = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get('/vehicles');
    return Array.isArray(response.data) ? response.data.map(mapApiToVehicle) : [];
  },
  getVehiclesByDriver: async (userId: string): Promise<Vehicle[]> => {
    try {
      const response = await apiClient.get(`/vehicles/user/${userId}`);
      return Array.isArray(response.data) ? response.data.map(mapApiToVehicle) : [];
    } catch (error) {
      console.error('❌ [vehicleService] Error loading vehicles by user:', error);
      return [];
    }
  },
  getVehicle: async (id: string): Promise<Vehicle> => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return mapApiToVehicle(response.data);
  },
  createVehicle: async (payload: VehicleSimplifiedPayload): Promise<Vehicle> => {
    const response = await apiClient.post('/vehicles/simplified', payload);
    return mapApiToVehicle(response.data);
  },
  updateVehicle: async (id: string, payload: VehiclePayload): Promise<Vehicle> => {
    const response = await apiClient.put(`/vehicles/${id}`, payload);
    return mapApiToVehicle(response.data);
  },
  patchVehicle: async (id: string, payload: Partial<VehiclePayload>): Promise<Vehicle> => {
    const response = await apiClient.patch(`/vehicles/${id}`, payload);
    return mapApiToVehicle(response.data);
  },
  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },
  getVehicleImages: async (id: string): Promise<VehicleImage[]> => {
    const response = await apiClient.get(`/vehicles/${id}/images`);
    const payload = response.data;
    const imageList = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.images)
          ? payload.images
          : Array.isArray(payload?.content)
            ? payload.content
            : [];
    return imageList.map(mapApiToVehicleImage);
  },
  uploadVehicleImage: async (id: string, file: File): Promise<VehicleImage> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/vehicles/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapApiToVehicleImage(response.data);
  },
  deleteVehicleImage: async (imageId: string): Promise<void> => {
    await apiClient.delete(`/vehicles/images/${imageId}`);
  },
};