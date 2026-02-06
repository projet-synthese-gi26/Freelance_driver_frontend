// src/components/navigoo/NavigooSidebar.tsx
// Sidebar avec les détails complets du profil utilisateur

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NavigooPoi, POI_COLORS, NavigooProfileData } from '@/type/navigoo';
import { navigooService } from '@/service/navigooService';
import { 
  XMarkIcon,
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  StarIcon,
  CalendarIcon, 
  ClockIcon,
  BanknotesIcon,
  UserIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface NavigooSidebarProps {
  poi: NavigooPoi | null;
  isOpen: boolean;
  onClose: () => void;
  onCalculateRoute?: (poi: NavigooPoi) => void;
  onContact?: (poi: NavigooPoi) => void;
  viewType: 'client' | 'driver';
}

const NavigooSidebar: React.FC<NavigooSidebarProps> = ({
  poi,
  isOpen,
  onClose,
  onCalculateRoute,
  onContact,
  viewType
}) => {
  const [profileData, setProfileData] = useState<NavigooProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Charger les détails du profil quand un POI est sélectionné
  useEffect(() => {
    const loadProfile = async () => {
      if (!poi?.orgId) {
        setProfileData(null);
        return;
      }

      setIsLoadingProfile(true);
      try {
        // Simuler le chargement du profil (à remplacer par un vrai appel API)
        // Pour l'instant on utilise les données du POI
        const mockProfile: NavigooProfileData = {
          id: poi.userId || poi.id.toString(),
          name: poi.name,
          phoneNumber: poi.phoneNumber,
          profileImageUrl: poi.profileImageUrl,
          rating: poi.averageRating,
          description: poi.description,
          // Données simulées
          languages: ['Français', 'English'],
          specialities: poi.poiType === 'driver_available' 
            ? ['Transport VIP', 'Longue distance'] 
            : undefined,
          vehicleDetails: poi.poiType === 'driver_available' 
            ? 'Toyota Corolla 2020 - Climatisée' 
            : undefined,
          memberSince: '2024',
          totalRides: 45
        };
        
        setProfileData(mockProfile);
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (isOpen && poi) {
      loadProfile();
    }
  }, [poi, isOpen]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-5 h-5 text-gray-300" />
        );
      }
    }
    return stars;
  };

  if (!isOpen || !poi) return null;

  const isDriver = poi.poiType === 'driver_available';
  const accentColor = isDriver ? POI_COLORS.driver_available : POI_COLORS.client_with_announce;

  const profileUrl = isDriver 
    ? `/profile/driver/${poi.userId || poi.id}`
    : `/profile/client/${poi.userId || poi.id}`;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 z-[1001] transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[1002] overflow-y-auto animate-slideIn">
        {/* Header */}
        <div 
          className="relative h-48 bg-gradient-to-br"
          style={{ 
            background: `linear-gradient(135deg, ${accentColor}80 0%, ${accentColor} 100%)` 
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition shadow-lg"
          >
            <XMarkIcon className="w-5 h-5 text-gray-700" />
          </button>

          {/* Badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 rounded-full text-sm font-semibold flex items-center gap-2">
            {isDriver ? (
              <>
                <TruckIcon className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Chauffeur</span>
              </>
            ) : (
              <>
                <UserIcon className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600">Client</span>
              </>
            )}
          </div>

          {/* Photo et nom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex-shrink-0">
                {poi.profileImageUrl ? (
                  <Image
                    src={poi.profileImageUrl}
                    alt={poi.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-300">
                    {isDriver ? '🚗' : '👤'}
                  </div>
                )}
              </div>
              <div className="text-white pb-1">
                <h2 className="text-2xl font-bold drop-shadow-lg">{poi.name}</h2>
                {poi.averageRating && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">{renderStars(poi.averageRating)}</div>
                    <span className="text-white/90 text-sm">
                      {poi.averageRating.toFixed(1)} ({profileData?.totalRides || 0} trajets)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Section trajet */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {isDriver ? 'Trajet proposé' : 'Trajet recherché'}
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-0.5 h-10 bg-gray-300"></div>
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">Départ</p>
                        <p className="font-medium text-gray-800">{poi.departureLocation || 'Non défini'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Arrivée</p>
                        <p className="font-medium text-gray-800">{poi.dropoffLocation || 'Non défini'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section date/heure/prix */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Détails
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {poi.startDate && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <CalendarIcon className="w-5 h-5 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium text-gray-800">
                        {new Date(poi.startDate).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  )}
                  {poi.startTime && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <ClockIcon className="w-5 h-5 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Heure</p>
                      <p className="font-medium text-gray-800">{poi.startTime}</p>
                    </div>
                  )}
                  {poi.cost && (
                    <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                      <BanknotesIcon className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xs text-gray-500">Prix</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-primary">{poi.cost} FCFA</p>
                        {poi.negotiable && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                            Négociable
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section profil */}
              {profileData && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    À propos
                  </h3>
                  
                  {profileData.languages && profileData.languages.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                      <div className="flex gap-2">
                        {profileData.languages.map((lang, i) => (
                          <span key={i} className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {isDriver && profileData.vehicleDetails && (
                    <div className="flex items-start gap-2 mb-3">
                      <TruckIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-700">{profileData.vehicleDetails}</p>
                    </div>
                  )}

                  {isDriver && profileData.specialities && profileData.specialities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {profileData.specialities.map((spec, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-3 py-1.5 rounded-full font-medium"
                          style={{ 
                            backgroundColor: `${accentColor}20`,
                            color: accentColor
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {profileData.memberSince && (
                    <p className="text-sm text-gray-500 mt-3">
                      Membre depuis {profileData.memberSince}
                    </p>
                  )}
                </div>
              )}

              {/* Contact info */}
              {poi.phoneNumber && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Contact
                  </h3>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <PhoneIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-800">{poi.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="space-y-3 mt-8">
                {onCalculateRoute && (
                  <button
                    onClick={() => onCalculateRoute(poi)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition"
                  >
                    <MapPinIcon className="w-5 h-5" />
                    Voir l'itinéraire
                  </button>
                )}

                {onContact && (
                  <button
                    onClick={() => onContact(poi)}
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    Envoyer un message
                  </button>
                )}

                <Link
                  href={profileUrl}
                  className="w-full flex items-center justify-center gap-2 text-white py-3 px-4 rounded-xl font-semibold transition"
                  style={{ backgroundColor: accentColor }}
                >
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  Voir le profil complet
                </Link>
              </div>
            </>
          )}
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </>
  );
};

export default NavigooSidebar;
