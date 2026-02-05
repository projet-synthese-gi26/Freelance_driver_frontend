// src/services/vehicleService.ts

import apiClient from './apiClient';
import { Vehicle, VehicleImage, VehiclePayload, VehicleSimplifiedPayload } from '@/type/vehicle';

const mapApiToVehicle = (payload: any): Vehicle => ({
  vehicleId: payload.vehicleId ?? '',
  vehicleMakeId: payload.vehicleMakeId ?? null,
  vehicleModelId: payload.vehicleModelId ?? null,
  transmissionTypeId: payload.transmissionTypeId ?? null,
  manufacturerId: payload.manufacturerId ?? null,
  vehicleSizeId: payload.vehicleSizeId ?? null,
  vehicleTypeId: payload.vehicleTypeId ?? null,
  fuelTypeId: payload.fuelTypeId ?? null,
  vehicleSerialNumber: payload.vehicleSerialNumber ?? null,
  vehicleSerialPhoto: payload.vehicleSerialPhoto ?? null,
  registrationNumber: payload.registrationNumber ?? null,
  registrationPhoto: payload.registrationPhoto ?? null,
  registrationExpiryDate: payload.registrationExpiryDate ?? null,
  tankCapacity: payload.tankCapacity ?? null,
  luggageMaxCapacity: payload.luggageMaxCapacity ?? null,
  totalSeatNumber: payload.totalSeatNumber ?? null,
  averageFuelConsumptionPerKm: payload.averageFuelConsumptionPerKm ?? null,
  mileageAtStart: payload.mileageAtStart ?? null,
  mileageSinceCommissioning: payload.mileageSinceCommissioning ?? null,
  vehicleAgeAtStart: payload.vehicleAgeAtStart ?? null,
  brand: payload.brand ?? null,
  createdAt: payload.createdAt ?? null,
  updatedAt: payload.updatedAt ?? null,
  airConditioned: payload.airConditioned ?? null,
  comfortable: payload.comfortable ?? null,
  soft: payload.soft ?? null,
  screen: payload.screen ?? null,
  wifi: payload.wifi ?? null,
  tollCharge: payload.tollCharge ?? null,
  carParking: payload.carParking ?? null,
  alarm: payload.alarm ?? null,
  stateTax: payload.stateTax ?? null,
  driverAllowance: payload.driverAllowance ?? null,
  pickupAndDrop: payload.pickupAndDrop ?? null,
  internet: payload.internet ?? null,
  petsAllow: payload.petsAllow ?? null,
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
    const response = await apiClient.get(`/vehicles/user/${userId}`);
    return Array.isArray(response.data) ? response.data.map(mapApiToVehicle) : [];
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