"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';

import AddVehicleForm from '@/components/freelance/business/AddVehicleForm';
import { VehicleCard } from '@/components/freelance/business/VehicleCard'; // Assurez-vous du bon import
import { vehicleService } from '@/service/vehicleService';
import { useAuthContext } from '@/components/context/authContext';
import { Vehicle } from '@/type/vehicle';
import EmptyJumbotron from '@/components/EmptyJumbotron';

const Page = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  
  // Gestion de l'affichage (Liste vs Formulaire)
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const userId = user?.user?.id;
      if (!userId) {
        setVehicles([]);
        return;
      }
      const data = await vehicleService.getVehiclesByDriver(userId);
      setVehicles(data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load vehicles.");
    } finally {
      setLoading(false);
    }
  }, [user?.user?.id]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewMode('edit');
  };

  const handleDeleteClick = async (vehicle: Vehicle) => {
    if (!confirm(`Are you sure you want to delete this vehicle?`)) return;

    try {
        await vehicleService.deleteVehicle(vehicle.vehicleId);
        setVehicles(prev => prev.filter(v => v.vehicleId !== vehicle.vehicleId));
        toast.success("Vehicle deleted.");
    } catch (error) {
        toast.error("Error while deleting vehicle.");
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
        <h1 className="text-2xl font-bold text-gray-800">My Vehicles</h1>
        <button
            onClick={() => {
                setSelectedVehicle(null);
                setViewMode('add');
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
            <PlusIcon className="w-5 h-5" />
            <span>New Vehicle</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : vehicles.length === 0 ? (
        <EmptyJumbotron 
            title="No vehicles" 
            message="You haven't added any vehicles yet." 
            icon="/img/car-list-1.jpg"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map(vehicle => (
                <VehicleCard 
                    key={vehicle.vehicleId}
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