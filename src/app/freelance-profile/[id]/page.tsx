"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import FreelanceDetailsComponent from '@/components/profile/freelance/FreelanceDetailsComponent';
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
import { reviewService } from '@/service/reviewService';
import { addressService } from '@/service/addressService';
import { Vehicle } from '@/type/vehicle';
import { UserSessionContext } from '@/type/profile';
import { Planning } from '@/type/planning';
import { Address } from '@/type/address';

// --- INTERFACES LOCALES ---
interface DriverDetailsData {
  profileContext: UserSessionContext & { driverProfile?: any };
  vehicles: Vehicle[];
  plannings: Planning[];
  reviews: any[];
  addresses: Address[];
  portfolio: {
    license: null;
    cv: null;
    experiences: any[];
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
  const driverId = params?.id as string;

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
      const [profileData, vehiclesData, planningsData, reviewsData, addressesData] = await Promise.all([
        profileService.getPublicDriverProfile(driverId),
        vehicleService.getVehiclesByDriver(driverId),
        planningService.getPlanningsByDriver(driverId),
        reviewService.getReviewsBySubject(driverId, "DRIVER"),
        addressService.getDriverAddressesByUserId(driverId),
      ]);

      if (!profileData) {
        throw new Error("driver profile not found");
      }
      setData({
        profileContext: profileData,
        vehicles: vehiclesData,
        plannings: planningsData,
        reviews: reviewsData,
        addresses: addressesData,
        portfolio: { license: null, cv: null, experiences: [] }
      });
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
        await reviewService.createReview({
          subjectId: driverId,
          subjectType: "DRIVER",
          reviewType: "RATING",
          rating: myScore,
          comment: myComment,
        });
        
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
  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Profil introuvable.</div>;
  }
  // Prépare les données pour FreelanceDetailsComponent
  const driverProfile = data.profileContext.driverProfile || data.profileContext.user;
  const driverActorId = data.profileContext.actor?.id;
  const driverData = {
    driver_id: driverProfile.id,
    driver_actor_id: driverActorId,
    driver_profile_image: driverProfile.profileImageUrl || driverProfile.photoUri || "/white-silhouette-avatar.png",
    driver_last_name: driverProfile.lastName || driverProfile.lastName,
    driver_first_name: driverProfile.firstName || driverProfile.firstName,
    driverLocation: data.addresses[0]?.city || '',
    driver_experiences: data.portfolio.experiences || [],
    driver_languages: driverProfile.language ? [driverProfile.language] : [],
    driver_specialities: [],
    driver_keywords: [],
    driver_availability_table: data.plannings.map(p => ({
      ...p,
      driver_availability_id: p.id,
      start_date: p.startDate,
      end_date: p.endDate,
      start_time: p.startTime,
      end_time: p.endTime,
      price: p.regularAmount,
      driver_billing_method_name: 'daily',
      is_available: true
    })),
    has_vehicle: data.vehicles.length > 0,
    Description: driverProfile.biography || '',
    driver_statistics: {
      average_rating: data.reviews.length > 0
        ? data.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / data.reviews.length
        : 0,
      review_total_number: data.reviews.length,
    },
    driver_reviews: data.reviews,
  };
  const vehicleData = data.vehicles[0] || {};
  return (
    <FreelanceDetailsComponent data={{ driverData, vehicleData }} isModal={false} />
  );
}