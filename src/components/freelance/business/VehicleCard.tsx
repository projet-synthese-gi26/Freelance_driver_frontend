"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { 
  UsersIcon, 
  Cog6ToothIcon, 
  EyeDropperIcon, 
  BriefcaseIcon, 
  CheckCircleIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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

const AmenityChip = ({ text }: { text: string }) => (
  <div className="flex items-center bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
    <CheckCircleIcon className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
    <span className="text-xs text-blue-700 font-medium whitespace-nowrap">{text}</span>
  </div>
);

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const photoUrls = vehicle.photoUrls && vehicle.photoUrls.length > 0 
    ? vehicle.photoUrls 
    : ['/img/default-car.png']; 

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < photoUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* --- SECTION GALERIE D'IMAGES (Haut de carte) --- */}
      <div className="relative h-48 sm:h-56 w-full bg-gray-100 shrink-0">
        <Image 
          src={photoUrls[currentImageIndex]} 
          alt={`${vehicle.manufacturer} ${vehicle.model}`} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300"
          priority={false}
        />

        {/* Badge Catégorie */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {vehicle.category}
          </span>
        </div>

        {/* Flèches de navigation (Toujours visibles sur mobile pour ergonomie, effet hover sur desktop) */}
        {photoUrls.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
              className={`absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full backdrop-blur-md transition-all
                ${currentImageIndex === 0 ? 'opacity-0 pointer-events-none' : 'bg-white/80 hover:bg-white text-gray-800 shadow-sm'}
              `}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleNextImage}
              disabled={currentImageIndex === photoUrls.length - 1}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full backdrop-blur-md transition-all
                ${currentImageIndex === photoUrls.length - 1 ? 'opacity-0 pointer-events-none' : 'bg-white/80 hover:bg-white text-gray-800 shadow-sm'}
              `}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {photoUrls.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {photoUrls.map((_, index) => (
              <div 
                key={index} 
                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} 
              />
            ))}
          </div>
        )}

        {/* Actions Rapides (Modifier/Supprimer) - Absolues en haut à droite */}
        {onEdit && onDelete && (
          <div className="absolute top-3 right-3 flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(vehicle); }}
              className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-sm transition-colors"
              title="Modifier"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(vehicle); }}
              className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-sm transition-colors"
              title="Supprimer"
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
            {vehicle.manufacturer} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>{vehicle.fuelType}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{vehicle.transmission}</span>
          </p>
        </div>
        
        {/* Grille des spécifications */}
        <div className="flex flex-wrap justify-between gap-y-2 mb-4">
          <SpecItem icon={UsersIcon} label="Places" value={vehicle.seats} />
          <SpecItem icon={Cog6ToothIcon} label="Boîte" value={vehicle.transmission} />
          <SpecItem icon={EyeDropperIcon} label="Carburant" value={vehicle.fuelType} />
          <SpecItem icon={BriefcaseIcon} label="Charge" value={vehicle.loadCapacity ? `${vehicle.loadCapacity} kg` : undefined} />
        </div>
        
        {/* Séparateur */}
        <div className="border-t border-gray-100 my-2"></div>
        
        {/* Équipements (S'il y en a) */}
        {vehicle.amenities && vehicle.amenities.length > 0 && (
          <div className="mt-2 mb-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Inclus</h4>
            <div className="flex flex-wrap gap-2">
              {vehicle.amenities.slice(0, 3).map((amenity, idx) => (
                <AmenityChip key={idx} text={amenity} />
              ))}
              {vehicle.amenities.length > 3 && (
                <span className="text-xs text-gray-400 self-center">+{vehicle.amenities.length - 3}</span>
              )}
            </div>
          </div>
        )}
        
        {/* Bouton Détails Techniques (Extensible) */}
        <div className="mt-auto pt-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex justify-between items-center w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
            >
                <span className="text-sm font-semibold text-gray-700">Détails techniques</span>
                {isExpanded ? (
                  <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                )}
            </button>

            {isExpanded && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Immatriculation</span>
                        <span className="font-medium text-gray-900">{vehicle.serialNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Réservoir</span>
                        <span className="font-medium text-gray-900">{vehicle.tankCapacity ? `${vehicle.tankCapacity} L` : 'N/A'}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-500">Catégorie</span>
                        <span className="font-medium text-gray-900">{vehicle.category}</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};