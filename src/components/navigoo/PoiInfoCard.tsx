// src/components/navigoo/PoiInfoCard.tsx
// Carte d'information pour un POI sélectionné

'use client';

import React from 'react';
import Image from 'next/image';
import { NavigooPoi, POI_COLORS } from '@/type/navigoo';
import { 
  MapPinIcon, 
  PhoneIcon, 
  StarIcon, 
  CalendarIcon, 
  ClockIcon,
  BanknotesIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface PoiInfoCardProps {
  poi: NavigooPoi;
  onClose: () => void;
  onViewProfile: (poi: NavigooPoi) => void;
  onCalculateRoute?: (poi: NavigooPoi) => void;
  onContact?: (poi: NavigooPoi) => void;
}

const PoiInfoCard: React.FC<PoiInfoCardProps> = ({
  poi,
  onClose,
  onViewProfile,
  onCalculateRoute,
  onContact
}) => {
  const isDriver = poi.poiType === 'driver_available';
  const accentColor = isDriver ? POI_COLORS.driver_available : POI_COLORS.client_with_announce;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400 opacity-50" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-w-sm w-full animate-slideUp">
      {/* Header avec image */}
      <div 
        className="relative h-32 bg-gradient-to-r from-gray-100 to-gray-200"
        style={{ 
          background: `linear-gradient(135deg, ${accentColor}20 0%, ${accentColor}40 100%)` 
        }}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition shadow-sm"
        >
          <XMarkIcon className="w-4 h-4 text-gray-600" />
        </button>

        {/* Badge type */}
        <div 
          className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: accentColor }}
        >
          {isDriver ? '🚗 Chauffeur' : '👤 Client'}
        </div>

        {/* Photo profil */}
        <div className="absolute -bottom-10 left-4">
          <div 
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200"
          >
            {poi.profileImageUrl ? (
              <Image
                src={poi.profileImageUrl}
                alt={poi.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-300">
                {isDriver ? '🚗' : '👤'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="pt-12 px-4 pb-4">
        {/* Nom et rating */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800">{poi.name}</h3>
          {poi.averageRating && (
            <div className="flex items-center gap-1 mt-1">
              {renderStars(poi.averageRating)}
              <span className="text-sm text-gray-600 ml-1">
                ({poi.averageRating.toFixed(1)})
              </span>
            </div>
          )}
        </div>

        {/* Trajet */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPinIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-gray-700 truncate">{poi.departureLocation || 'Non défini'}</span>
          </div>
          <div className="border-l-2 border-dashed border-gray-300 h-4 ml-2"></div>
          <div className="flex items-center gap-2 text-sm">
            <MapPinIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-gray-700 truncate">{poi.dropoffLocation || 'Non défini'}</span>
          </div>
        </div>

        {/* Infos complémentaires */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {poi.startDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4" />
              <span>{new Date(poi.startDate).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
          {poi.startTime && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>{poi.startTime}</span>
            </div>
          )}
          {poi.cost && (
            <div className="flex items-center gap-2 text-sm font-semibold text-primary col-span-2">
              <BanknotesIcon className="w-4 h-4" />
              <span>{poi.cost} FCFA</span>
              {poi.negotiable && (
                <span className="text-xs text-gray-500 font-normal">(négociable)</span>
              )}
            </div>
          )}
        </div>

        {/* Téléphone (masqué partiellement) */}
        {poi.phoneNumber && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <PhoneIcon className="w-4 h-4" />
            <span>{poi.phoneNumber.slice(0, -3)}***</span>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-2">
          {onCalculateRoute && (
            <button
              onClick={() => onCalculateRoute(poi)}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
            >
              <MapPinIcon className="w-4 h-4" />
              Itinéraire
            </button>
          )}
          <button
            onClick={() => onViewProfile(poi)}
            className="flex-1 flex items-center justify-center gap-2 text-white py-2.5 px-4 rounded-lg font-medium transition text-sm"
            style={{ backgroundColor: accentColor }}
          >
            Voir profil
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Bouton contact */}
        {onContact && (
          <button
            onClick={() => onContact(poi)}
            className="w-full mt-2 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
          >
            <PhoneIcon className="w-4 h-4" />
            Contacter
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PoiInfoCard;
