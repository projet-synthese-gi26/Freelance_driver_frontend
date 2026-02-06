"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { 
  UsersIcon, 
  Cog6ToothIcon, 
  EyeDropperIcon, 
  BriefcaseIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon, 
  ChevronUpIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Vehicle } from '@/type/vehicle';
import { vehicleService } from '@/service/vehicleService';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

// Composant interne pour une ligne de spécification
const SpecItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | undefined }) => (
  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
      <Icon className="h-4 w-4" />
    </span>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="truncate text-sm font-semibold text-slate-900" title={value}>{value || 'N/A'}</p>
    </div>
  </div>
);

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
  const t = useTranslations('Dashboard.shared.vehicleCard');
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(['/img/car-list-1.jpg']);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (!vehicle.vehicleId) return;
    vehicleService.getVehicleImages(vehicle.vehicleId)
      .then((images) => {
        if (!isMounted) return;
        if (images.length > 0) {
          const urls = images.map((img) => img.imagePath).filter(Boolean);
          setImageUrls(urls.length > 0 ? urls : ['/img/car-list-1.jpg']);
          setCurrentImageIndex(0);
        } else {
          setImageUrls(['/img/car-list-1.jpg']);
          setCurrentImageIndex(0);
        }
      })
      .catch(() => {
        if (isMounted) {
          setImageUrls(['/img/car-list-1.jpg']);
          setCurrentImageIndex(0);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [vehicle.vehicleId]);

  const amenities = useMemo(() => ([
    vehicle.airConditioned ? 'A/C' : null,
    vehicle.wifi ? 'Wi-Fi' : null,
    vehicle.comfortable ? 'Confort' : null,
    vehicle.soft ? 'Soft seats' : null,
    vehicle.screen ? 'Screen' : null,
    vehicle.carParking ? 'Parking' : null,
    vehicle.pickupAndDrop ? 'Pickup/Drop' : null,
    vehicle.petsAllow ? 'Pets' : null,
  ].filter(Boolean)) as string[], [vehicle]);

  const currentImage = imageUrls[currentImageIndex] || '/img/car-list-1.jpg';
  const canNavigate = imageUrls.length > 1;
  const handlePrevImage = () => {
    if (!canNavigate) return;
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };
  const handleNextImage = () => {
    if (!canNavigate) return;
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_-30px_rgba(15,23,42,0.6)] transition hover:-translate-y-1 hover:shadow-[0_35px_70px_-45px_rgba(15,23,42,0.85)]">
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <Image
          src={currentImage}
          alt={vehicle.brand || 'Vehicle'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          priority={false}
        />
        {canNavigate && (
          <div className="absolute inset-y-0 left-3 z-10 flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="rounded-full bg-white/90 p-2 text-slate-900 shadow-sm transition hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        {canNavigate && (
          <div className="absolute inset-y-0 right-3 z-10 flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="rounded-full bg-white/90 p-2 text-slate-900 shadow-sm transition hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Vehicle</p>
              <h3 className="text-xl font-semibold text-white">{vehicle.brand || 'Vehicle'}</h3>
            </div>
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
              {vehicle.totalSeatNumber ? `${vehicle.totalSeatNumber} seats` : 'Seats N/A'}
            </span>
          </div>
        </div>
        {onEdit && onDelete && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(vehicle); }}
<<<<<<< HEAD
              className="rounded-full bg-white/90 p-2 text-slate-900 shadow-sm transition hover:bg-white"
              title="Edit"
=======
              className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-sm transition-colors"
              title={t('actions.edit')}
>>>>>>> 8f18b3c78874340355c40ebe213831a7e1513d02
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(vehicle); }}
<<<<<<< HEAD
              className="rounded-full bg-white/90 p-2 text-rose-600 shadow-sm transition hover:bg-white"
              title="Delete"
=======
              className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-sm transition-colors"
              title={t('actions.delete')}
>>>>>>> 8f18b3c78874340355c40ebe213831a7e1513d02
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

<<<<<<< HEAD
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">{vehicle.registrationNumber || 'Registration N/A'}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{vehicle.vehicleSerialNumber || 'Serial N/A'}</span>
          {vehicle.registrationExpiryDate && (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Exp. {new Date(vehicle.registrationExpiryDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <SpecItem icon={UsersIcon} label="Seats" value={vehicle.totalSeatNumber ? `${vehicle.totalSeatNumber}` : undefined} />
          <SpecItem icon={Cog6ToothIcon} label="Tank" value={vehicle.tankCapacity ? `${vehicle.tankCapacity} L` : undefined} />
          <SpecItem icon={EyeDropperIcon} label="Fuel" value={vehicle.fuelTypeId || undefined} />
          <SpecItem icon={BriefcaseIcon} label="Luggage" value={vehicle.luggageMaxCapacity ? `${vehicle.luggageMaxCapacity}` : undefined} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Amenities</p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600"
            >
              Details
              {isExpanded ? (
                <ChevronUpIcon className="h-3 w-3" />
              ) : (
                <ChevronDownIcon className="h-3 w-3" />
              )}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(amenities.length ? amenities : ['No amenities']).map((item) => (
              <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                {item}
              </span>
            ))}
          </div>
          {isExpanded && (
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Mileage at start</span>
                <span className="font-semibold text-slate-900">{vehicle.mileageAtStart ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Mileage since commissioning</span>
                <span className="font-semibold text-slate-900">{vehicle.mileageSinceCommissioning ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle age</span>
                <span className="font-semibold text-slate-900">{vehicle.vehicleAgeAtStart ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. fuel / km</span>
                <span className="font-semibold text-slate-900">{vehicle.averageFuelConsumptionPerKm ?? 'N/A'}</span>
              </div>
            </div>
          )}
=======
      {/* --- CORPS DE LA CARTE --- */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {vehicle.brand || t('fallback.vehicle')}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>{vehicle.registrationNumber || t('fallback.registration')}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{vehicle.vehicleSerialNumber || t('fallback.serial')}</span>
          </p>
        </div>
        
        {/* Grille des spécifications */}
        <div className="flex flex-wrap justify-between gap-y-2 mb-4">
          <SpecItem icon={UsersIcon} label={t('specs.seats')} value={vehicle.totalSeatNumber ? `${vehicle.totalSeatNumber}` : undefined} />
          <SpecItem icon={Cog6ToothIcon} label={t('specs.tank')} value={vehicle.tankCapacity ? `${vehicle.tankCapacity} L` : undefined} />
          <SpecItem icon={EyeDropperIcon} label={t('specs.fuel')} value={vehicle.fuelTypeId || undefined} />
          <SpecItem icon={BriefcaseIcon} label={t('specs.luggage')} value={vehicle.luggageMaxCapacity ? `${vehicle.luggageMaxCapacity}` : undefined} />
        </div>
        
        {/* Séparateur */}
        <div className="border-t border-gray-100 my-2"></div>
        
        {/* Bouton Détails Techniques (Extensible) */}
        <div className="mt-auto pt-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex justify-between items-center w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
            >
                <span className="text-sm font-semibold text-gray-700">{t('technicalDetails')}</span>
                {isExpanded ? (
                  <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                )}
            </button>

            {isExpanded && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex justify-between">
                        <span>{t('details.serialNumber')}</span>
                        <span className="font-medium">{vehicle.vehicleSerialNumber || t('na')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t('details.registrationExpiry')}</span>
                        <span className="font-medium">{vehicle.registrationExpiryDate ? new Date(vehicle.registrationExpiryDate).toLocaleDateString() : t('na')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t('details.mileage')}</span>
                        <span className="font-medium">{vehicle.mileageSinceCommissioning ?? t('na')}</span>
                    </div>
                </div>
            )}
>>>>>>> 8f18b3c78874340355c40ebe213831a7e1513d02
        </div>
      </div>
    </div>
  );
};