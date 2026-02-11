import React, { useState, useEffect, useMemo } from 'react'; // <--- AJOUT DE useMemo
import { StarIcon } from "@heroicons/react/24/solid";
import {
    CalendarDaysIcon,
    ClockIcon,
    HandThumbUpIcon,
    MapPinIcon,
    UserGroupIcon,
    BriefcaseIcon,
    Cog6ToothIcon,
    TruckIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RightModal from "@/components/modal/RightModal";
import { v4 as uuidv4 } from 'uuid';
import { planningService } from '@/service/planningService';
import { profileService } from '@/service/profileService';
import { vehicleService } from '@/service/vehicleService';
import { addressService } from '@/service/addressService';
import { reviewService } from '@/service/reviewService';
import { reactionService } from '@/service/reactionService';
import { complianceService } from '@/service/complianceService';

const CURRENCY = "XAF";

const SearchCardFreelance = ({ planning }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [detailedData, setDetailedData] = useState(null);
    const [syndicateProfile, setSyndicateProfile] = useState(null);
    const [syndicateCheck, setSyndicateCheck] = useState(null);
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
            driver_profile_image: planning.authorImageUrl || planning.profileImageUrl || "/img/default-avatar.jpeg",
            driver_last_name,
            driver_first_name,
            driverLocation: planning.departureLocation,
            driver_experiences: [],
            driver_languages: [],
            driver_specialities: [],
            driver_keywords: [],
            driver_availability_table: []
        };
    }, [planning]); // Se recrée uniquement si 'planning' change

    // --- CORRECTION ICI : Utilisation de useMemo ---
    const initialVehicleData = useMemo(() => ({
        total_seat_number: null,
        luggage_max_capacity: null,
        mileage_at_mileage_since_commissioning: null,
        fuel_type_name: null,
        transmission_type_name: null,
        model: null,
        manufacturer: null,
    }), []); // Tableau vide car données statiques par défaut


    // Fetch vehicle and profile info on mount for card display
    useEffect(() => {
        let isMounted = true;
        const fetchCardDetails = async () => {
            if (!planning.authorId) {
                setIsLoadingDetails(false);
                return;
            }
            setIsLoadingDetails(true);
            try {
                const reactableId = planning.reactableId ?? planning.reactable_id;
                const reactableTypeRaw = planning.reactableType ?? planning.reactable_type;
                const reactableType = typeof reactableTypeRaw === 'string' ? reactableTypeRaw.toUpperCase() : undefined;

                // Utilisation de Promise.all pour paralléliser et accélérer
                const [profile, vehicles, addresses, reviews, reactions, complianceDetails, complianceCheck] = await Promise.all([
                    profileService.getPublicDriverProfile(planning.authorId),
                    vehicleService.getVehiclesByDriver(planning.authorId),
                    addressService.getDriverAddressesByUserId(planning.authorId),
                    reviewService.getReviewsForUser(planning.authorId),
                    reactableId && reactableType
                        ? reactionService.getReactionsByTarget(reactableId, reactableType)
                        : Promise.resolve([]),
                    complianceService.getDetails(planning.authorId).catch(() => null),
                    complianceService.check(planning.authorId).catch(() => null)
                ]);

                const mainVehicle = vehicles.length > 0 ? vehicles[0] : null;
                const vehicleImages = mainVehicle?.vehicleId
                    ? await vehicleService.getVehicleImages(mainVehicle.vehicleId)
                    : [];
                const mainAddress = addresses?.[0];
                const ratingValues = reviews.map((review) => review.rating || 0).filter((rating) => rating > 0);
                const averageRating = ratingValues.length > 0
                    ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length
                    : 0;
                const likeCount = reactions.filter((reaction) => reaction.type === "LIKE").length;

                const resolvedDriverActorId = profile?.actor?.id || reactableId;

                const resolvedProfileImage =
                    profile?.driverProfile?.profileImageUrl ||
                    profile?.user?.photoUri ||
                    profile?.actor?.avatarUrl ||
                    initialDriverData.driver_profile_image ||
                    "/img/default-avatar.jpeg";

                const resolvedFirstName =
                    profile?.driverProfile?.firstName ||
                    profile?.user?.firstName ||
                    initialDriverData.driver_first_name ||
                    '';
                const resolvedLastName =
                    profile?.driverProfile?.lastName ||
                    profile?.user?.lastName ||
                    initialDriverData.driver_last_name ||
                    '';
                
                const mappedDriverData = {
                    ...initialDriverData,
                    driver_id: planning.authorId,
                    driver_actor_id: resolvedDriverActorId,
                    driver_last_name: resolvedLastName,
                    driver_first_name: resolvedFirstName,
                    driver_profile_image: resolvedProfileImage,
                    driver_languages: profile?.driverProfile?.language ? [profile.driverProfile.language] : [],
                    driver_phone_number: profile?.driverProfile?.phoneNumber || "N/A",
                    driver_email: profile?.driverProfile?.contactEmail || "N/A",
                    driver_license_number: profile?.driverProfile?.licenseNumber || "N/A",
                    Description: profile?.driverProfile?.biography || "Aucune description disponible.",
                    driverLocation: mainAddress?.city || initialDriverData.driverLocation,
                    driver_experiences: [],
                    driver_specialities: ["Transport de personnes"],
                    driver_keywords: ["Ponctuel", "Sérieux"],
                    driver_availability_table: [],
                    driver_portfolio: [],
                    driver_certifications: [],
                    transmission_types: [],
                    preferred_language: [],
                    has_vehicle: vehicles.length > 0,
                    driver_statistics: { average_rating: averageRating, review_total_number: reviews.length },
                    driver_reviews: reviews,
                    driver_reactions: { likeCount }
                };

                const mappedVehicleData = mainVehicle ? {
                    vehicleId: mainVehicle.vehicleId,
                    total_seat_number: mainVehicle.totalSeatNumber ?? null,
                    luggage_max_capacity: mainVehicle.luggageMaxCapacity ?? null,
                    mileage_at_mileage_since_commissioning: mainVehicle.mileageSinceCommissioning ?? null,
                    // IDs are not user-friendly; keep them nullable and let UI hide if no label is available
                    fuel_type_name: null,
                    transmission_type_name: null,
                    model_name: null,
                    manufacturer_name: null,
                    brand_name: mainVehicle.brand || null,
                    size_name: null,
                    type_name: null,
                    registration_number: mainVehicle.registrationNumber || null,
                    vehicle_serial_number: mainVehicle.vehicleSerialNumber || null,
                    tank_capacity: mainVehicle.tankCapacity ?? null,
                    vehicle_age_at_start: mainVehicle.vehicleAgeAtStart ?? null,
                    average_fuel_consumption_per_kilometer: mainVehicle.averageFuelConsumptionPerKm ?? null,
                    mileage_since_commissioning: mainVehicle.mileageSinceCommissioning ?? null,
                    registration_expiry_date: mainVehicle.registrationExpiryDate || null,
                    vehicle_amenities: [
                        mainVehicle.airConditioned ? 'A/C' : null,
                        mainVehicle.wifi ? 'Wi-Fi' : null,
                        mainVehicle.comfortable ? 'Confort' : null,
                        mainVehicle.soft ? 'Soft' : null,
                        mainVehicle.screen ? 'Screen' : null,
                        mainVehicle.tollCharge ? 'Toll' : null,
                        mainVehicle.carParking ? 'Parking' : null,
                        mainVehicle.alarm ? 'Alarm' : null,
                        mainVehicle.stateTax ? 'State tax' : null,
                        mainVehicle.driverAllowance ? 'Driver allowance' : null,
                        mainVehicle.pickupAndDrop ? 'Pickup/Drop' : null,
                        mainVehicle.internet ? 'Internet' : null,
                        mainVehicle.petsAllow ? 'Pets' : null
                    ].filter(Boolean),
                    illustration_images: vehicleImages.map((image) => image.imagePath).filter(Boolean),
                    vehicle_reviews: []
                } : {
                    ...initialVehicleData,
                    illustration_images: [],
                    vehicle_reviews: []
                };

                if (isMounted) {
                    setDetailedData({ driverData: mappedDriverData, vehicleData: mappedVehicleData });
                    setSyndicateProfile(complianceDetails);
                    setSyndicateCheck(complianceCheck);
                }
            } catch (error) {
                if (isMounted) {
                    setDetailedData(null);
                    setSyndicateProfile(null);
                    setSyndicateCheck(null);
                }
                console.error("Erreur chargement détails:", error);
            } finally {
                if (isMounted) setIsLoadingDetails(false);
            }
        };

        fetchCardDetails();
        return () => { isMounted = false; };
    }, [planning.authorId, initialDriverData, initialVehicleData]); // Dépendances stables grâce à useMemo

    const isSyndicated = Boolean(
        (syndicateCheck && String(syndicateCheck.globalStatus || '').toUpperCase() === 'AUTHORIZED') ||
        (syndicateCheck && syndicateCheck.details && syndicateCheck.details.membershipCurrent === true) ||
        (syndicateProfile && syndicateProfile.isVerified)
    );
    const syndicateDisplayName = syndicateProfile
        ? [syndicateProfile.firstName, syndicateProfile.lastName].filter(Boolean).join(' ').trim()
        : '';

    // Si on a déjà chargé les détails, on les utilise, sinon on utilise les données initiales
    const driverData = detailedData?.driverData || initialDriverData;
    const vehicleData = detailedData?.vehicleData || initialVehicleData;

    const driverImageSrc = driverData?.driver_profile_image && String(driverData.driver_profile_image).trim() !== ''
        ? driverData.driver_profile_image
        : "/img/default-avatar.jpeg";

    const isUuidLike = (value) => {
        if (!value) return false;
        const v = String(value).trim();
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
    };

    const safeLabel = (value, fallback = "N/A") => {
        if (value === null || value === undefined) return fallback;
        const v = String(value).trim();
        if (!v) return fallback;
        if (isUuidLike(v)) return fallback;
        return v;
    };

    const hasMeaningfulValue = (value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'number') return Number.isFinite(value);
        const v = String(value).trim();
        if (!v) return false;
        if (v.toLowerCase() === 'n/a') return false;
        if (isUuidLike(v)) return false;
        return true;
    };

    const formatDateTime = (dateValue, timeValue) => {
        if (!dateValue) return "N/A";
        const parsedDate = new Date(dateValue);
        if (Number.isNaN(parsedDate.getTime())) return "N/A";
        const formattedDate = parsedDate.toLocaleDateString('fr-FR');
        if (!timeValue) return formattedDate;
        const rawTime = String(timeValue);
        const parsedTime = new Date(rawTime);
        if (!Number.isNaN(parsedTime.getTime())) {
            return `${formattedDate} ${parsedTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
        }
        // Fallback: if it's already a "HH:mm" or "HH:mm:ss" string, trim seconds
        const match = rawTime.match(/\b(\d{1,2}):(\d{2})(?::(\d{2}))?\b/);
        if (match) {
            return `${formattedDate} ${match[1].padStart(2, '0')}:${match[2]}`;
        }
        return formattedDate;
    };

    const formatPrice = (value) => {
        const amount = Number(value);
        if (!Number.isFinite(amount)) return `0 ${CURRENCY}`;
        return `${amount.toLocaleString('fr-FR')} ${CURRENCY}`;
    };

    const humanizeEnum = (value) => {
        if (!value) return '';
        const raw = String(value).trim();
        const key = raw.toLowerCase().replace(/\s+/g, '_');

        const map = {
            cash: 'Cash',
            credit_card: 'Carte',
            card: 'Carte',
            mobile_money: 'Mobile Money',
            momo: 'Mobile Money',
            om: 'Orange Money',
            orange_money: 'Orange Money',
            paypal: 'PayPal',
            bank_transfer: 'Virement',
            transfer: 'Virement',

            daily: 'Par jour',
            day: 'Par jour',
            hourly: 'Par heure',
            hour: 'Par heure',
            weekly: 'Par semaine',
            week: 'Par semaine',
            monthly: 'Par mois',
            month: 'Par mois',

            per_km: 'Par km',
            perkm: 'Par km',
            km: 'Par km',
            'per_kilometer': 'Par km',
            'per_kilometre': 'Par km',

            one_way: 'Aller simple',
            oneway: 'Aller simple',
            round_trip: 'Aller-retour',
            roundtrip: 'Aller-retour',
            both: 'Aller/Retour',
        };

        if (map[key]) return map[key];
        return raw
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const vehicleTitle = useMemo(() => {
        const make = safeLabel(vehicleData?.manufacturer_name || vehicleData?.manufacturer || '', '');
        const model = safeLabel(vehicleData?.model_name || vehicleData?.model || '', '');
        const brand = safeLabel(vehicleData?.brand_name || '', '');
        const title = [make, model].filter(Boolean).join(' ');
        return title || brand || "Véhicule";
    }, [vehicleData]);

    const driverDisplayName = useMemo(() => {
        const last = safeLabel(driverData?.driver_last_name, '');
        const first = safeLabel(driverData?.driver_first_name, '');
        const full = [first, last].filter(Boolean).join(' ').trim();
        if (full) return full;
        const fromPlanning = safeLabel(planning?.authorName, '');
        if (fromPlanning) return fromPlanning;
        return 'Chauffeur';
    }, [driverData?.driver_last_name, driverData?.driver_first_name, planning?.authorName]);

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
            <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

                <div className="flex flex-col md:flex-row gap-5 p-5 md:p-6">
                    <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-slate-100 md:h-auto md:w-56">
                        <Image
                            fill
                            src={driverImageSrc}
                            alt={driverData.driver_first_name}
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            unoptimized
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                            <HandThumbUpIcon className="h-4 w-4 text-slate-700" />
                            {driverData?.driver_reactions?.likeCount ?? 0}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                                <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-900">
                                    {driverDisplayName}
                                    {isSyndicated ? (
                                        <span
                                            className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
                                            title="Chauffeur syndiqué"
                                        >
                                            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 011.415-1.415l2.793 2.793 6.793-6.793a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    ) : null}
                                </h2>

                                {isSyndicated ? (
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                            Syndicat
                                        </span>
                                        {syndicateDisplayName ? (
                                            <span className="text-xs font-semibold text-slate-600">
                                                {syndicateDisplayName}
                                            </span>
                                        ) : null}
                                        {syndicateProfile?.licenseNumber ? (
                                            <span className="text-xs font-semibold text-slate-600">
                                                Permis: {syndicateProfile.licenseNumber}
                                            </span>
                                        ) : null}
                                    </div>
                                ) : null}

                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                                        {vehicleTitle}
                                    </span>
                                    {driverData?.has_vehicle ? (
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                            Véhicule disponible
                                        </span>
                                    ) : null}
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-3">
                                    <div className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-sm font-semibold text-yellow-800">
                                        <StarIcon className="h-4 w-4 text-yellow-500" />
                                        {driverData.driver_statistics?.average_rating?.toFixed?.(1) || "0.0"}
                                        <span className="text-yellow-700/70">({driverData.driver_statistics?.review_total_number || 0})</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                                        <MapPinIcon className="h-4 w-4 text-slate-500" />
                                        <span className="truncate max-w-[260px]">{safeLabel(driverData.driverLocation, 'Localisation')}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                                    <span className="text-2xl font-extrabold text-blue-700">
                                        {formatPrice(planning.regularAmount ?? planning.cost ?? planning.discountedAmount)}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-500">/ jour</span>
                                </div>
                            </div>

                            <div className="flex w-full flex-col gap-2 md:w-auto md:min-w-[170px]">
                                <button
                                    onClick={handleSeeMore}
                                    disabled={isLoadingDetails}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-70"
                                >
                                    {isLoadingDetails ? 'Chargement...' : 'Voir plus'}
                                    <ArrowRightIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleBook}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                                >
                                    Réserver
                                    <TruckIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {planning.paymentOption ? (
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                    Paiement: {humanizeEnum(planning.paymentOption)}
                                </span>
                            ) : null}
                            {planning.pricingMethod ? (
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                    Méthode: {humanizeEnum(planning.pricingMethod)}
                                </span>
                            ) : null}
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${planning.negotiable ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                                Négociable: {planning.negotiable ? 'Oui' : 'Non'}
                            </span>
                        </div>

                        {(hasMeaningfulValue(vehicleData.total_seat_number) ||
                            hasMeaningfulValue(vehicleData.luggage_max_capacity) ||
                            hasMeaningfulValue(vehicleData.transmission_type_name) ||
                            hasMeaningfulValue(vehicleData.fuel_type_name)) && (
                            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {hasMeaningfulValue(vehicleData.total_seat_number) && (
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <UserGroupIcon className="h-5 w-5 text-slate-500" />
                                            <span className="text-xs font-semibold">Places</span>
                                        </div>
                                        <div className="mt-1 text-sm font-extrabold text-slate-900">{vehicleData.total_seat_number}</div>
                                    </div>
                                )}
                                {hasMeaningfulValue(vehicleData.luggage_max_capacity) && (
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <BriefcaseIcon className="h-5 w-5 text-slate-500" />
                                            <span className="text-xs font-semibold">Bagages</span>
                                        </div>
                                        <div className="mt-1 text-sm font-extrabold text-slate-900">{vehicleData.luggage_max_capacity} kg</div>
                                    </div>
                                )}
                                {hasMeaningfulValue(vehicleData.transmission_type_name) && (
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Cog6ToothIcon className="h-5 w-5 text-slate-500" />
                                            <span className="text-xs font-semibold">Boîte</span>
                                        </div>
                                        <div className="mt-1 truncate text-sm font-extrabold text-slate-900">{safeLabel(vehicleData.transmission_type_name, '')}</div>
                                    </div>
                                )}
                                {hasMeaningfulValue(vehicleData.fuel_type_name) && (
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <TruckIcon className="h-5 w-5 text-slate-500" />
                                            <span className="text-xs font-semibold">Carburant</span>
                                        </div>
                                        <div className="mt-1 truncate text-sm font-extrabold text-slate-900">{safeLabel(vehicleData.fuel_type_name, '')}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-100 bg-white p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MapPinIcon className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Trajet</span>
                                </div>
                                <div className="mt-2 font-semibold text-slate-900">
                                    {planning.departureLocation || planning.pickupLocation || "N/A"}
                                    <span className="mx-2 text-slate-300">→</span>
                                    {planning.dropoffLocation || "N/A"}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {humanizeEnum(planning.tripType) || 'N/A'} • {humanizeEnum(planning.tripIntention) || 'N/A'}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-white p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <CalendarDaysIcon className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Dates</span>
                                </div>
                                <div className="mt-2 font-semibold text-slate-900">
                                    {formatDateTime(planning.startDate, planning.startTime)}
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                    <ClockIcon className="h-4 w-4" />
                                    {formatDateTime(planning.endDate, planning.endTime)}
                                </div>
                            </div>
                        </div>

                        {driverData.driver_languages.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {driverData.driver_languages.slice(0, 3).map((lang) => (
                                    <span key={lang} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <RightModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pageContent={true}
                data={{ driverData, vehicleData, complianceProfile: syndicateProfile, complianceCheck: syndicateCheck }}
            />
        </div>
    );
};

export default SearchCardFreelance;