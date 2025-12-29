"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';

import AddVehicleForm from '@/components/freelance/business/AddVehicleForm';
import { VehicleCard } from '@/components/freelance/business/VehicleCard'; // Assurez-vous du bon import
import { vehicleService } from '@/service/vehicleService';
import { Vehicle } from '@/type/vehicle';
import EmptyJumbotron from '@/components/EmptyJumbotron';

const Page = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Gestion de l'affichage (Liste vs Formulaire)
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger vos véhicules.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewMode('edit');
  };

  const handleDeleteClick = async (vehicle: Vehicle) => {
    if (!confirm(`Voulez-vous vraiment supprimer la ${vehicle.model} ?`)) return;

    try {
        await vehicleService.deleteVehicle(vehicle.id);
        setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
        toast.success("Véhicule supprimé.");
    } catch (error) {
        toast.error("Erreur lors de la suppression.");
    }
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    loadVehicles();
  };

  // --- Rendu du Formulaire ---
  if (viewMode === 'add' || viewMode === 'edit') {
    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <AddVehicleForm 
                vehicleToEdit={selectedVehicle}
                onSuccess={handleFormSuccess}
                onCancel={() => setViewMode('list')}
            />
        </div>
    );
  }

  // --- Rendu de la Liste ---
  return (
    <div className='p-4 md:p-6 max-w-7xl mx-auto'>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mes Véhicules</h1>
        <button
            onClick={() => {
                setSelectedVehicle(null);
                setViewMode('add');
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
            <PlusIcon className="w-5 h-5" />
            <span>Nouveau Véhicule</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Chargement...</div>
      ) : vehicles.length === 0 ? (
        <EmptyJumbotron 
            title="Aucun véhicule" 
            message="Vous n'avez pas encore ajouté de véhicule à votre flotte." 
            icon="/img/car-placeholder.png" // Assurez-vous d'avoir une icône ou utilisez celle par défaut
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map(vehicle => (
                <VehicleCard 
                    key={vehicle.id}
                    vehicle={vehicle}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            ))}
        </div>
      )}
    </div>
  );
}

export default Page;