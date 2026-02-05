"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import { vehicleService } from '@/service/vehicleService';
import { Vehicle, VehiclePayload, VehicleSimplifiedPayload } from '@/type/vehicle';

const VEHICLE_OPTIONS = {
  brands: ["Toyota", "Honda", "Ford", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Hyundai"],
  seats: ["2", "4", "5", "7", "8", "9"],
};

interface AddVehicleFormProps {
  vehicleToEdit?: Vehicle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ vehicleToEdit, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  
  // Initialisation du formulaire
  const [formData, setFormData] = useState<VehiclePayload>({
    brand: "Toyota",
    totalSeatNumber: 5,
    vehicleSerialNumber: "",
    registrationNumber: "",
    registrationExpiryDate: "",
    tankCapacity: 0,
    luggageMaxCapacity: 0,
    averageFuelConsumptionPerKm: 0,
    mileageAtStart: 0,
    mileageSinceCommissioning: 0,
    vehicleAgeAtStart: 0,
    airConditioned: false,
    comfortable: false,
    soft: false,
    screen: false,
    wifi: false,
    tollCharge: false,
    carParking: false,
    alarm: false,
    stateTax: false,
    driverAllowance: false,
    pickupAndDrop: false,
    internet: false,
    petsAllow: false,
  });

  // Fichiers sélectionnés pour l'upload (spécifique web)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        brand: vehicleToEdit.brand || '',
        totalSeatNumber: vehicleToEdit.totalSeatNumber || 0,
        vehicleSerialNumber: vehicleToEdit.vehicleSerialNumber || '',
        registrationNumber: vehicleToEdit.registrationNumber || '',
        registrationExpiryDate: vehicleToEdit.registrationExpiryDate || '',
        tankCapacity: vehicleToEdit.tankCapacity || 0,
        luggageMaxCapacity: vehicleToEdit.luggageMaxCapacity || 0,
        averageFuelConsumptionPerKm: vehicleToEdit.averageFuelConsumptionPerKm || 0,
        mileageAtStart: vehicleToEdit.mileageAtStart || 0,
        mileageSinceCommissioning: vehicleToEdit.mileageSinceCommissioning || 0,
        vehicleAgeAtStart: vehicleToEdit.vehicleAgeAtStart || 0,
        airConditioned: vehicleToEdit.airConditioned ?? false,
        comfortable: vehicleToEdit.comfortable ?? false,
        soft: vehicleToEdit.soft ?? false,
        screen: vehicleToEdit.screen ?? false,
        wifi: vehicleToEdit.wifi ?? false,
        tollCharge: vehicleToEdit.tollCharge ?? false,
        carParking: vehicleToEdit.carParking ?? false,
        alarm: vehicleToEdit.alarm ?? false,
        stateTax: vehicleToEdit.stateTax ?? false,
        driverAllowance: vehicleToEdit.driverAllowance ?? false,
        pickupAndDrop: vehicleToEdit.pickupAndDrop ?? false,
        internet: vehicleToEdit.internet ?? false,
        petsAllow: vehicleToEdit.petsAllow ?? false,
        vehicleMakeId: vehicleToEdit.vehicleMakeId || null,
        vehicleModelId: vehicleToEdit.vehicleModelId || null,
        transmissionTypeId: vehicleToEdit.transmissionTypeId || null,
        manufacturerId: vehicleToEdit.manufacturerId || null,
        vehicleSizeId: vehicleToEdit.vehicleSizeId || null,
        vehicleTypeId: vehicleToEdit.vehicleTypeId || null,
        fuelTypeId: vehicleToEdit.fuelTypeId || null,
        vehicleSerialPhoto: vehicleToEdit.vehicleSerialPhoto || null,
        registrationPhoto: vehicleToEdit.registrationPhoto || null,
      });
      if (vehicleToEdit.vehicleId) {
        vehicleService.getVehicleImages(vehicleToEdit.vehicleId).then(images => {
          setPreviewUrls(images.map(img => img.imagePath));
        });
      }
    }
  }, [vehicleToEdit]);

  const handleChange = (field: keyof VehiclePayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      // Créer des URLs de prévisualisation locales
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    if (index < previewUrls.length) {
        const newFiles = [...selectedFiles];
        if (index < newFiles.length) {
          newFiles.splice(index, 1);
          setSelectedFiles(newFiles);
        }
    }
    
    // Mettre à jour l'affichage
    const newPreviews = [...previewUrls];
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.brand) {
        toast.error("Brand is required.");
        return;
    }

    setLoading(true);
    try {
        let createdVehicle: Vehicle | null = null;
        if (vehicleToEdit?.vehicleId) {
            createdVehicle = await vehicleService.updateVehicle(vehicleToEdit.vehicleId, formData);
            toast.success("Vehicle updated.");
        } else {
            const simplifiedPayload: VehicleSimplifiedPayload = {
                makeName: formData.brand || "Unknown",
                modelName: formData.brand || "Unknown",
                transmissionType: "Unknown",
                manufacturerName: formData.brand || "Unknown",
                sizeName: "Unknown",
                typeName: "Unknown",
                fuelTypeName: "Unknown",
                vehicleSerialNumber: formData.vehicleSerialNumber || "",
                vehicleSerialPhoto: formData.vehicleSerialPhoto || "",
                registrationNumber: formData.registrationNumber || "",
                registrationPhoto: formData.registrationPhoto || "",
                registrationExpiryDate: formData.registrationExpiryDate
                    ? new Date(formData.registrationExpiryDate).toISOString()
                    : new Date().toISOString(),
                tankCapacity: formData.tankCapacity ?? 0,
                luggageMaxCapacity: formData.luggageMaxCapacity ?? 0,
                totalSeatNumber: formData.totalSeatNumber ?? 0,
                averageFuelConsumptionPerKm: formData.averageFuelConsumptionPerKm ?? 0,
                mileageAtStart: formData.mileageAtStart ?? 0,
                mileageSinceCommissioning: formData.mileageSinceCommissioning ?? 0,
                vehicleAgeAtStart: formData.vehicleAgeAtStart ?? 0,
                brand: formData.brand || "",
                airConditioned: formData.airConditioned ?? false,
                comfortable: formData.comfortable ?? false,
                soft: formData.soft ?? false,
                screen: formData.screen ?? false,
                wifi: formData.wifi ?? false,
                tollCharge: formData.tollCharge ?? false,
                carParking: formData.carParking ?? false,
                alarm: formData.alarm ?? false,
                stateTax: formData.stateTax ?? false,
                driverAllowance: formData.driverAllowance ?? false,
                pickupAndDrop: formData.pickupAndDrop ?? false,
                internet: formData.internet ?? false,
                petsAllow: formData.petsAllow ?? false,
            };
            createdVehicle = await vehicleService.createVehicle(simplifiedPayload);
            toast.success("Vehicle created.");
        }

        if (createdVehicle && selectedFiles.length > 0) {
            const uploadPromises = selectedFiles.map(file => 
                vehicleService.uploadVehicleImage(createdVehicle!.vehicleId, file)
            );
            await Promise.all(uploadPromises);
        }

        onSuccess();
    } catch (error) {
        console.error("Erreur sauvegarde:", error);
        toast.error("Unable to save vehicle.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {vehicleToEdit ? 'Edit vehicle' : 'Add vehicle'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section Photos */}
        <div>
            <label className="block font-medium text-gray-700 mb-2">Photos</label>
            <div className="flex flex-wrap gap-4">
                {previewUrls.map((url, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                        <Image src={url} alt={`preview ${index}`} fill className="object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Camera className="w-6 h-6 text-blue-500 mb-1" />
                    <span className="text-xs text-gray-500">Add</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
            </div>
        </div>

        {/* Informations Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block font-medium text-gray-700 mb-1">Brand</label>
                <select 
                    value={formData.brand || ''}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-50"
                >
                    {VEHICLE_OPTIONS.brands.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
            <div>
                <label className="block font-medium text-gray-700 mb-1">Registration Number</label>
                <input 
                    type="text" 
                    value={formData.registrationNumber || ''}
                    onChange={(e) => handleChange('registrationNumber', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="ABC-123"
                    required
                />
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                <select
                  className="w-full p-2 border rounded-lg bg-gray-50"
                  value={formData.totalSeatNumber?.toString() || ''}
                  onChange={e => handleChange('totalSeatNumber', Number(e.target.value))}
                >
                    {VEHICLE_OPTIONS.seats.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration expiry</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg bg-gray-50"
                  value={formData.registrationExpiryDate ? formData.registrationExpiryDate.split('T')[0] : ''}
                  onChange={e => handleChange('registrationExpiryDate', e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tank capacity (L)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  value={formData.tankCapacity ?? 0}
                  onChange={e => handleChange('tankCapacity', Number(e.target.value))}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Luggage capacity</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  value={formData.luggageMaxCapacity ?? 0}
                  onChange={e => handleChange('luggageMaxCapacity', Number(e.target.value))}
                />
            </div>
        </div>

        {/* Autres détails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial number</label>
                <input
                  type="text"
                  value={formData.vehicleSerialNumber || ''}
                  onChange={e => handleChange('vehicleSerialNumber', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage at start</label>
                <input
                  type="number"
                  value={formData.mileageAtStart ?? 0}
                  onChange={e => handleChange('mileageAtStart', Number(e.target.value))}
                  className="w-full p-2 border rounded-lg"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle age at start</label>
                <input
                  type="number"
                  value={formData.vehicleAgeAtStart ?? 0}
                  onChange={e => handleChange('vehicleAgeAtStart', Number(e.target.value))}
                  className="w-full p-2 border rounded-lg"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Average fuel consumption per km</label>
                <input
                  type="number"
                  value={formData.averageFuelConsumptionPerKm ?? 0}
                  onChange={e => handleChange('averageFuelConsumptionPerKm', Number(e.target.value))}
                  className="w-full p-2 border rounded-lg"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage since commissioning</label>
                <input
                  type="number"
                  value={formData.mileageSinceCommissioning ?? 0}
                  onChange={e => handleChange('mileageSinceCommissioning', Number(e.target.value))}
                  className="w-full p-2 border rounded-lg"
                />
            </div>
        </div>

        {/* Amenities */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                    { key: 'airConditioned', label: 'Air conditioned' },
                    { key: 'comfortable', label: 'Comfortable' },
                    { key: 'soft', label: 'Soft seats' },
                    { key: 'screen', label: 'Screen' },
                    { key: 'wifi', label: 'Wi-Fi' },
                    { key: 'tollCharge', label: 'Toll charge' },
                    { key: 'carParking', label: 'Car parking' },
                    { key: 'alarm', label: 'Alarm' },
                    { key: 'stateTax', label: 'State tax' },
                    { key: 'driverAllowance', label: 'Driver allowance' },
                    { key: 'pickupAndDrop', label: 'Pickup & drop' },
                    { key: 'internet', label: 'Internet' },
                    { key: 'petsAllow', label: 'Pets allowed' },
                ].map(item => (
                    <label key={item.key} className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={Boolean((formData as VehiclePayload)[item.key as keyof VehiclePayload])}
                            onChange={e => handleChange(item.key as keyof VehiclePayload, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {item.label}
                    </label>
                ))}
            </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                disabled={loading}
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 flex items-center"
                disabled={loading}
            >
                {loading && <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>}
                {vehicleToEdit ? 'Update' : 'Save'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicleForm;