"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import { vehicleService } from '@/service/vehicleService';
import { sessionService } from '@/service/sessionService';
import { Vehicle } from '@/type/vehicle';
import { v4 as uuidv4 } from 'uuid';

// OPTIONS (Identiques au mobile)
const VEHICLE_OPTIONS = {
  manufacturers: ["Toyota", "Honda", "Ford", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Hyundai"],
  transmissions: ["Manual", "Automatic", "Semi-automatic"],
  fuelTypes: ["Petrol", "Diesel", "Hybrid", "Electric"],
  categories: ["Compact", "Sedan", "SUV", "Minivan", "Utility"],
  seats: ["2", "4", "5", "7", "8", "9"],
  amenities: ["Air conditioning", "Bluetooth", "GPS", "Backup camera", "Heated seats", "Sunroof"],
};

interface AddVehicleFormProps {
  vehicleToEdit?: Vehicle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ vehicleToEdit, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  
  // Initialisation du formulaire
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    photoUrls: [],
    model: "",
    manufacturer: "Toyota",
    seats: "5",
    transmission: "Automatic",
    fuelType: "Petrol",
    category: "Sedan",
    serialNumber: "",
    tankCapacity: "",
    loadCapacity: "",
    amenities: [],
  });

  // Fichiers sélectionnés pour l'upload (spécifique web)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData(vehicleToEdit);
      setPreviewUrls(vehicleToEdit.photoUrls || []);
    }
  }, [vehicleToEdit]);

  const handleChange = (field: keyof Vehicle, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleAmenity = (amenity: string) => {
    const current = formData.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    handleChange('amenities', updated);
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
    // Si l'image est une URL existante (backend)
    if (index < (formData.photoUrls?.length || 0)) {
        const newPhotoUrls = [...(formData.photoUrls || [])];
        newPhotoUrls.splice(index, 1);
        setFormData(prev => ({...prev, photoUrls: newPhotoUrls}));
    } else {
        // C'est un nouveau fichier local
        const localIndex = index - (formData.photoUrls?.length || 0);
        const newFiles = [...selectedFiles];
        newFiles.splice(localIndex, 1);
        setSelectedFiles(newFiles);
    }
    
    // Mettre à jour l'affichage
    const newPreviews = [...previewUrls];
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.model || !formData.manufacturer) {
        toast.error("Le modèle et la marque sont obligatoires.");
        return;
    }

    setLoading(true);
    try {
        const userContext = await sessionService.getUserContext();
        const driverId = userContext?.id;
        
        if (!driverId) {
            toast.error("Erreur session. Veuillez vous reconnecter.");
            return;
        }

        // 1. Préparer l'ID du véhicule
        const vehicleId = vehicleToEdit?.id || uuidv4();
        
        // 2. Upload des nouvelles images
        let uploadedUrls: string[] = [];
        if (selectedFiles.length > 0) {
            const uploadPromises = selectedFiles.map(file => 
                vehicleService.uploadVehiclePhoto(file, vehicleId)
            );
            uploadedUrls = await Promise.all(uploadPromises);
        }
        
        // 3. Fusionner les URLs (anciennes + nouvelles)
        const finalPhotoUrls = [...(formData.photoUrls || []), ...uploadedUrls];
        
        const vehicleData = {
            ...formData,
            id: vehicleId,
            photoUrls: finalPhotoUrls
        };

        // 4. Sauvegarder le véhicule
        if (vehicleToEdit) {
            await vehicleService.updateVehicle(vehicleId, vehicleData, driverId);
            toast.success("Véhicule mis à jour !");
        } else {
            await vehicleService.createVehicle(vehicleData, driverId);
            toast.success("Véhicule créé !");
        }

        onSuccess();
    } catch (error) {
        console.error("Erreur sauvegarde:", error);
        toast.error("Erreur lors de la sauvegarde.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {vehicleToEdit ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
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
                    <span className="text-xs text-gray-500">Ajouter</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
            </div>
        </div>

        {/* Informations Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block font-medium text-gray-700 mb-1">Marque</label>
                <select 
                    value={formData.manufacturer}
                    onChange={(e) => handleChange('manufacturer', e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-50"
                >
                    {VEHICLE_OPTIONS.manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
            <div>
                <label className="block font-medium text-gray-700 mb-1">Modèle</label>
                <input 
                    type="text" 
                    value={formData.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Ex: Yaris"
                    required
                />
            </div>
        </div>

        {/* Spécifications */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select className="w-full p-2 border rounded-lg bg-gray-50" value={formData.category} onChange={e => handleChange('category', e.target.value)}>
                    {VEHICLE_OPTIONS.categories.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select className="w-full p-2 border rounded-lg bg-gray-50" value={formData.transmission} onChange={e => handleChange('transmission', e.target.value)}>
                    {VEHICLE_OPTIONS.transmissions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
                <select className="w-full p-2 border rounded-lg bg-gray-50" value={formData.fuelType} onChange={e => handleChange('fuelType', e.target.value)}>
                    {VEHICLE_OPTIONS.fuelTypes.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Places</label>
                <select className="w-full p-2 border rounded-lg bg-gray-50" value={formData.seats} onChange={e => handleChange('seats', e.target.value)}>
                    {VEHICLE_OPTIONS.seats.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
        </div>

        {/* Autres détails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
                <input type="text" value={formData.serialNumber} onChange={e => handleChange('serialNumber', e.target.value)} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Réservoir (L)</label>
                <input type="number" value={formData.tankCapacity} onChange={e => handleChange('tankCapacity', e.target.value)} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Charge (Kg)</label>
                <input type="number" value={formData.loadCapacity} onChange={e => handleChange('loadCapacity', e.target.value)} className="w-full p-2 border rounded-lg" />
            </div>
        </div>

        {/* Équipements */}
        <div>
            <label className="block font-medium text-gray-700 mb-2">Équipements</label>
            <div className="flex flex-wrap gap-2">
                {VEHICLE_OPTIONS.amenities.map(amenity => (
                    <button
                        key={amenity}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            formData.amenities?.includes(amenity)
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                    >
                        {amenity}
                    </button>
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
                Annuler
            </button>
            <button
                type="submit"
                className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 flex items-center"
                disabled={loading}
            >
                {loading && <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>}
                {vehicleToEdit ? 'Mettre à jour' : 'Enregistrer'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicleForm;