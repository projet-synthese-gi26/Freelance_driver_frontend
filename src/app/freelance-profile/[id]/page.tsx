"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { 
  UserCircleIcon, 
  DocumentTextIcon, 
  TruckIcon, 
  CalendarIcon, 
  StarIcon as StarOutlineIcon, 
  LanguageIcon, 
  PhoneIcon, 
  MapPinIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowLeftIcon,
  XMarkIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

// --- IMPORTS SERVICES & TYPES ---
import { profileService } from '@/service/profileService';
import { vehicleService } from '@/service/vehicleService';
import { planningService } from '@/service/planningService';
import { reviewService, Review } from '@/service/reviewService';
import { addressService } from '@/service/addressService';
import { experienceService } from '@/service/experienceService';
import { Vehicle } from '@/type/vehicle';
import { UserSessionContext } from '@/type/profile';
import { PublicOfferView } from '@/service/announcementService';
import { Address } from '@/type/address';
import { DriverLicense, CV, Experience } from '@/type/experience';
import { VehicleCard } from '@/components/freelance/business/VehicleCard';

// --- INTERFACES LOCALES ---
interface DriverDetailsData {
  profileContext: UserSessionContext;
  vehicles: Vehicle[];
  plannings: PublicOfferView[];
  reviews: Review[];
  addresses: Address[];
  portfolio: {
    license: DriverLicense | null;
    cv: CV | null;
    experiences: Experience[];
  };
}

// --- SOUS-COMPOSANTS ---
const StatCard = ({ icon: Icon, value, label }: { icon: any, value: string | number, label: string }) => (
  <div className="flex-1 text-center bg-gray-50 p-4 rounded-xl border border-gray-100">
    <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);

const Section = ({ title, icon: Icon, children, actionButton }: { title: string, icon: any, children: React.ReactNode, actionButton?: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <div className="flex items-center">
            <Icon className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        {actionButton}
    </div>
    {children}
  </div>
);

// --- COMPOSANT PAGE PRINCIPAL ---
export default function DriverProfilePage() {
  const params = useParams();
  const router = useRouter();
  const driverId = params.id as string;

  const [data, setData] = useState<DriverDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const loadDriverData = useCallback(async () => {
    if (!driverId) return;
    setIsLoading(true);
    try {
      const [profileData, vehiclesData, planningsData, reviewsData, addressesData, portfolioData] = await Promise.all([
        profileService.getPublicDriverProfile(driverId), 
        vehicleService.getVehiclesByDriver(driverId),
        planningService.getPlanningsByDriver(driverId),
        reviewService.getReviewsForUser(driverId),
        addressService.getAddressesByDriver(driverId),
        experienceService.getPortfolioByDriver(driverId),
      ]);
      setData({ profileContext: profileData, vehicles: vehiclesData, plannings: planningsData, reviews: reviewsData, addresses: addressesData, portfolio: portfolioData });
    } catch (error) {
      console.error("Échec du chargement du profil:", error);
      toast.error("Impossible de charger les détails du chauffeur.");
    } finally {
      setIsLoading(false);
    }
  }, [driverId]);

  useEffect(() => { loadDriverData(); }, [loadDriverData]);

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (myScore === 0) {
        toast.error("Veuillez sélectionner une note.");
        return;
    }
    setIsSubmittingReview(true);
    try {
        await reviewService.createReview(driverId, myScore, myComment);
        
        toast.success("Avis envoyé !");
        setReviewModalOpen(false);
        setMyComment('');
        setMyScore(0);
        
        await loadDriverData();
    } catch (error) {
        console.error(error);
        toast.error("Erreur lors de l'envoi de l'avis.");
    } finally {
        setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Chargement du profil...</div>;
  }
  
  if (!data || !data.profileContext.driverProfile) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Profil introuvable.</div>;
  }
  
  const { driverProfile } = data.profileContext;
  const mainAddress = data.addresses.length > 0 ? `${data.addresses[0].street}, ${data.addresses[0].city}` : 'Non renseignée';
  const averageRating = data.reviews.length > 0 ? (data.reviews.reduce((sum, r) => sum + r.score, 0) / data.reviews.length).toFixed(1) : 'N/A';
  
  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto p-4 md:p-6 space-y-8">
          
          <div className="mb-4">
              <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-semibold transition-colors"
              >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Retour aux résultats
              </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border text-center">
              <div className="relative w-32 h-32 mx-auto -mt-20 mb-4">
                  <Image 
                      src={driverProfile.profileImageUrl || "/img/default-avatar.jpeg"}
                      alt="Avatar"
                      fill
                      className="rounded-full object-cover border-4 border-white shadow-md"
                  />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{driverProfile.firstName} {driverProfile.lastName}</h1>
              <p className="text-gray-500 mt-2">{driverProfile.biography || "Chauffeur professionnel et fiable."}</p>
              
              <div className="flex justify-center gap-4 mt-6">
                  <StatCard icon={StarIcon} value={averageRating} label="Note Moyenne" />
                  <StatCard icon={ChatBubbleBottomCenterTextIcon} value={data.reviews.length} label="Avis Reçus" />
                  <StatCard icon={TruckIcon} value={data.vehicles.length} label="Véhicules" />
              </div>
          </div>

          <Section title="Informations & Contact" icon={UserCircleIcon}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2"><LanguageIcon className="w-5 h-5 text-gray-400"/><span>Langues : {driverProfile.language || 'N/A'}</span></div>
                  <div className="flex items-center gap-2"><PhoneIcon className="w-5 h-5 text-gray-400"/><span>Téléphone : {driverProfile.phoneNumber || 'N/A'}</span></div>
                  <div className="flex items-center gap-2 md:col-span-2"><MapPinIcon className="w-5 h-5 text-gray-400"/><span>Adresse principale : {mainAddress}</span></div>
               </div>
          </Section>
          
          <Section title="Véhicules" icon={TruckIcon}>
            {data.vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            ) : <p className="text-gray-500 text-center">Aucun véhicule enregistré.</p>}
          </Section>

          <Section title="Plannings Disponibles" icon={CalendarIcon}>
              {data.plannings.length > 0 ? (
                  <div className="space-y-3">
                      {data.plannings.map(p => (
                          <div key={p.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border">
                             <div>
                               <p className="font-semibold text-gray-800">{p.title}</p>
                               <p className="text-xs text-gray-500">{p.fullLocation}</p>
                             </div>
                             <span className="font-bold text-green-600">{p.cost} XAF</span>
                          </div>
                      ))}
                  </div>
              ) : <p className="text-gray-500 text-center">Aucun planning disponible.</p>}
          </Section>
          
          <Section 
            title="Avis" 
            icon={StarOutlineIcon}
            actionButton={
                <button
                    onClick={() => setReviewModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-blue-600 bg-blue-50 text-sm font-semibold rounded-lg hover:bg-blue-100 transition"
                >
                    <PencilSquareIcon className="w-4 h-4" />
                    Écrire un avis
                </button>
            }
          >
            {data.reviews.length > 0 ? (
               <div className="space-y-4">
                 {data.reviews.map(r => (
                    <div key={r.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold">{r.authorFirstName}</span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {r.score} <StarIcon className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">"{r.comment}"</p>
                    </div>
                 ))}
               </div>
            ) : <p className="text-gray-500 text-center py-4">Aucun avis pour le moment.</p>}
          </Section>
        </div>
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 relative">
                <button 
                    onClick={() => setReviewModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre avis</h2>
                <form onSubmit={handlePostReview}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setMyScore(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    {star <= myScore ? (
                                        <StarIcon className="w-10 h-10 text-yellow-400" />
                                    ) : (
                                        <StarOutlineIcon className="w-10 h-10 text-gray-300 hover:text-yellow-200" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire (optionnel)</label>
                        <textarea
                            value={myComment}
                            onChange={e => setMyComment(e.target.value)}
                            rows={4}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50"
                            placeholder="Partagez votre expérience..."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setReviewModalOpen(false)}
                            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmittingReview || myScore === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmittingReview ? 'Envoi...' : 'Envoyer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </>
  );
}