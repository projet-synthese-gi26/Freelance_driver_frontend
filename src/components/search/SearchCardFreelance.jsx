import React, { useState, useEffect, useMemo } from 'react'; // <--- AJOUT DE useMemo
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RightModal from "@/components/modal/RightModal";
import { v4 as uuidv4 } from 'uuid';
import { planningService } from '@/service/planningService';
import { profileService } from '@/service/profileService';
import { vehicleService } from '@/service/vehicleService';
import { toast } from 'react-hot-toast';

const CURRENCY = "XAF";

const SearchCardFreelance = ({ planning }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [detailedData, setDetailedData] = useState(null);
    const router = useRouter();

    // --- CORRECTION ICI : Utilisation de useMemo pour stabiliser l'objet ---
    const initialDriverData = useMemo(() => {
        let driver_last_name = '';
        let driver_first_name = '';
        
        if (typeof planning.authorName === 'string' && planning.authorName.trim() !== '') {
            const nameParts = planning.authorName.trim().split(' ');
            driver_first_name = nameParts[0] || '';
            driver_last_name = nameParts.slice(1).join(' ') || '';
        }

        return {
            driver_id: planning.authorId,
            driver_profile_image: planning.authorImageUrl || "/img/default-avatar.jpeg",
            driver_last_name,
            driver_first_name,
            driverLocation: planning.pickupLocation,
            driver_experiences: [],
            driver_languages: [],
            driver_specialities: [],
            driver_keywords: [],
            driver_availability_table: []
        };
    }, [planning]); // Se recrée uniquement si 'planning' change

    // --- CORRECTION ICI : Utilisation de useMemo ---
    const initialVehicleData = useMemo(() => ({
        total_seat_number: "N/A",
        luggage_max_capacity: "N/A",
        mileage_at_mileage_since_commissioning: "N/A",
        fuel_type_name: "N/A",
        transmission_type_name: "N/A"
    }), []); // Tableau vide car données statiques par défaut


    // Fetch vehicle and profile info on mount for card display
    useEffect(() => {
        let isMounted = true;
        const fetchCardDetails = async () => {
            setIsLoadingDetails(true);
            try {
                // Utilisation de Promise.all pour paralléliser et accélérer
                const [profile, vehicles] = await Promise.all([
                    profileService.getPublicDriverProfile(planning.authorId),
                    vehicleService.getVehiclesByDriver(planning.authorId)
                ]);

                const mainVehicle = vehicles.length > 0 ? vehicles[0] : null;
                
                const mappedDriverData = {
                    ...initialDriverData,
                    driver_id: planning.authorId,
                    driver_last_name: profile.driverProfile?.lastName || initialDriverData.driver_last_name,
                    driver_first_name: profile.driverProfile?.firstName || initialDriverData.driver_first_name,
                    driver_profile_image: profile.driverProfile?.profileImageUrl || initialDriverData.driver_profile_image,
                    driver_languages: profile.driverProfile?.language ? [profile.driverProfile.language] : [],
                    driver_phone_number: profile.driverProfile?.phoneNumber || "N/A",
                    driver_email: profile.driverProfile?.contactEmail || "N/A",
                    driver_license_number: profile.driverProfile?.licenseNumber || "N/A",
                    Description: profile.driverProfile?.biography || "Aucune description disponible.",
                    driver_experiences: [],
                    driver_specialities: ["Transport de personnes"],
                    driver_keywords: ["Ponctuel", "Sérieux"],
                    driver_availability_table: [],
                    driver_portfolio: [],
                    driver_certifications: [],
                    transmission_types: [],
                    preferred_language: [],
                    has_vehicle: vehicles.length > 0,
                    driver_statistics: { average_rating: 0, review_total_number: 0 },
                    driver_reviews: []
                };

                const mappedVehicleData = mainVehicle ? {
                    total_seat_number: mainVehicle.seats || "N/A",
                    luggage_max_capacity: mainVehicle.loadCapacity || "N/A",
                    mileage_at_mileage_since_commissioning: mainVehicle.mileage || "N/A",
                    fuel_type_name: mainVehicle.fuelType || "N/A",
                    transmission_type_name: mainVehicle.transmission || "N/A",
                    model: mainVehicle.model,
                    manufacturer: mainVehicle.manufacturer,
                    photoUrls: mainVehicle.photoUrls || [],
                    illustration_images: Array.isArray(mainVehicle.illustration_images) ? mainVehicle.illustration_images : []
                } : {
                    ...initialVehicleData,
                    model: undefined,
                    manufacturer: undefined,
                    photoUrls: [],
                    illustration_images: []
                };

                if (isMounted) {
                    setDetailedData({ driverData: mappedDriverData, vehicleData: mappedVehicleData });
                }
            } catch (error) {
                if (isMounted) {
                    setDetailedData(null);
                }
                console.error("Erreur chargement détails:", error);
            } finally {
                if (isMounted) setIsLoadingDetails(false);
            }
        };

        fetchCardDetails();
        return () => { isMounted = false; };
    }, [planning.authorId, initialDriverData, initialVehicleData]); // Dépendances stables grâce à useMemo

    // Si on a déjà chargé les détails, on les utilise, sinon on utilise les données initiales
    const driverData = detailedData?.driverData || initialDriverData;
    const vehicleData = detailedData?.vehicleData || initialVehicleData;

    const handleSeeMore = () => {
        setIsModalOpen(true);
    };

    const handleBook = async () => {
        const bookingId = uuidv4();
        let allPlannings = [];
        try {
            allPlannings = await planningService.getPlanningsByDriver(planning.authorId);
        } catch (e) {
            allPlannings = [planning]; 
        }
        
        const mappedAvailabilities = allPlannings.map(p => ({
            ...p,
            driver_availability_id: p.id,
            start_date: p.startDate || p.start_date,
            end_date: p.endDate || p.end_date,
            start_time: p.startTime || p.start_time,
            end_time: p.endTime || p.end_time,
            price: p.cost,
            driver_billing_method_name: p.billingMethod || 'daily',
            is_available: true
        }));

        const driverDataWithAvailability = {
            ...driverData,
            driver_availability_table: mappedAvailabilities
        };

        const bookingData = {
            vehicleData,
            driverData: driverDataWithAvailability,
            driver_availability_id: planning.id,
            currency_name: CURRENCY
        };
        localStorage.setItem(bookingId, JSON.stringify(bookingData));
        router.push(`/freelance-booking?id=${bookingId}`);
    };

    return (
        <div className="col-span-12 text mb-6">
            <div className="flex flex-col text md:flex-row rounded-2xl p-6 bg-white shadow-sm border border-gray-100">

                <div className="bg-[#F5F6FF] rounded-xl shrink-0 w-full md:w-48 h-48 md:h-auto mr-0 md:mr-6 mb-4 md:mb-0 overflow-hidden relative">
                    <Image
                        fill
                        src={driverData.driver_profile_image}
                        alt={driverData.driver_first_name}
                        className="object-cover transition-transform duration-300 hover:scale-110"
                        // Ajout d'un placeholder pour éviter le clignotement
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="flex-grow overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                            <h2 className="title font-bold text-gray-800">{driverData.driver_last_name} {driverData.driver_first_name}</h2>
                            <div className="flex items-center mb-1">
                                <StarIcon className="w-5 h-5 text-yellow-400 mr-1"/>
                                <span className="text-sm text-gray-500">(N/A avis)</span>
                            </div>
                            <p className="text-gray-600 mb-1">
                                <i className="las la-map-marker text-primary mr-1"></i> {driverData.driverLocation}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold text-primary">{planning.cost} {CURRENCY}</span> / jour
                            </p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <div className="flex flex-col md:flex-row gap-2 mt-2">
                            <button
                                onClick={handleSeeMore}
                                disabled={isLoadingDetails}
                                className="btn-primary bg-blue-600 text-white sm:px-3 sm:py-1 rounded-md hover:bg-blue-700 font-medium px-3 py-1 flex items-center justify-center w-full sm:w-auto transition-colors duration-300 disabled:opacity-70"
                            >
                                {isLoadingDetails ? 'Chargement...' : 'Voir plus'}
                            </button>


                            <button
                                onClick={handleBook}
                                className="btn-secondary bg-green-600 text-white sm:px-3 sm:py-1 rounded-md hover:bg-green-500 font-medium px-3 py-1 flex items-center justify-center w-full sm:w-auto transition-colors duration-300"
                            >
                                Réserver
                            </button>
                            </div>
                        </div>
                    </div>

                    <ul className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {[
                            {icon: "la-user-friends", text: `${vehicleData.total_seat_number} places`},
                            {icon: "la-shopping-bag", text: `${vehicleData.luggage_max_capacity} kg`},
                            {icon: "la-tachometer-alt", text: `${vehicleData.mileage_at_mileage_since_commissioning}` },
                            { icon: "la-gas-pump", text:` ${vehicleData.fuel_type_name}` },
                            { icon: "la-cog", text: `${vehicleData.transmission_type_name}` },
                        ].map((item, index) => (
                            <li key={index} className="bg-[#F5FCF8] rounded-lg p-2 text-center">
                                <i className={`las ${item.icon} text-[#279155] text-xl mb-1`}></i>
                                <span className="block text-gray-600 text-sm">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="text-sm text-gray-600">
                        {driverData.driver_languages.length > 0 && (
                            <p><span className="font-semibold">Langues:</span> {driverData.driver_languages.join(", ")}</p>
                        )}
                        {planning.baggageInfo && (
                             <p><span className="font-semibold">Bagages:</span> {planning.baggageInfo}</p>
                        )}
                    </div>
                </div>
            </div>
            
            <RightModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pageContent={true} data={{ driverData, vehicleData }}>
            </RightModal>
        </div>
    );
};

export default SearchCardFreelance;