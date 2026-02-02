"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { 
  UsersIcon, 
  Cog6ToothIcon, 
  EyeDropperIcon, 
  BriefcaseIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Vehicle } from '@/type/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

// Composant interne pour une ligne de spécification
const SpecItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | undefined }) => (
  // w-[48%] permet d'avoir 2 items par ligne avec un petit espace, flexible sur mobile et desktop
  <div className="flex items-center w-[48%] mb-3">
    <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-500 flex-shrink-0" />
    <div className="ml-2 overflow-hidden">
      <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-800 truncate" title={value}>{value || 'N/A'}</p>
    </div>
  </div>
);

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const imageUrl = '/img/default-car.png';

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* --- SECTION GALERIE D'IMAGES (Haut de carte) --- */}
      <div className="relative h-48 sm:h-56 w-full bg-gray-100 shrink-0">
        <Image 
          src={imageUrl} 
          alt={vehicle.brand || 'Vehicle'} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300"
          priority={false}
        />

        {/* Actions Rapides (Modifier/Supprimer) - Absolues en haut à droite */}
        {onEdit && onDelete && (
          <div className="absolute top-3 right-3 flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(vehicle); }}
              className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-sm transition-colors"
              title="Edit"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(vehicle); }}
              className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-sm transition-colors"
              title="Delete"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* --- CORPS DE LA CARTE --- */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {vehicle.brand || 'Vehicle'}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>{vehicle.registrationNumber || 'Registration N/A'}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{vehicle.vehicleSerialNumber || 'Serial N/A'}</span>
          </p>
        </div>
        
        {/* Grille des spécifications */}
        <div className="flex flex-wrap justify-between gap-y-2 mb-4">
          <SpecItem icon={UsersIcon} label="Seats" value={vehicle.totalSeatNumber ? `${vehicle.totalSeatNumber}` : undefined} />
          <SpecItem icon={Cog6ToothIcon} label="Tank" value={vehicle.tankCapacity ? `${vehicle.tankCapacity} L` : undefined} />
          <SpecItem icon={EyeDropperIcon} label="Fuel" value={vehicle.fuelTypeId || undefined} />
          <SpecItem icon={BriefcaseIcon} label="Luggage" value={vehicle.luggageMaxCapacity ? `${vehicle.luggageMaxCapacity}` : undefined} />
        </div>
        
        {/* Séparateur */}
        <div className="border-t border-gray-100 my-2"></div>
        
        {/* Bouton Détails Techniques (Extensible) */}
        <div className="mt-auto pt-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex justify-between items-center w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
            >
                <span className="text-sm font-semibold text-gray-700">Technical details</span>
                {isExpanded ? (
                  <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                )}
            </button>

            {isExpanded && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex justify-between">
                        <span>Serial number</span>
                        <span className="font-medium">{vehicle.vehicleSerialNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Registration expiry</span>
                        <span className="font-medium">{vehicle.registrationExpiryDate ? new Date(vehicle.registrationExpiryDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Mileage</span>
                        <span className="font-medium">{vehicle.mileageSinceCommissioning ?? 'N/A'}</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};