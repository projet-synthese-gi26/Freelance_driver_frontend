import { ProtectedButton } from '@/components/general/ProtectedButton';
import Comment from "./Comment";
import React, { useState, useEffect } from "react";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import MyTable from "./MyTable";
import CarDetails from "./CarDetails";
import Information from "./Information";
import { vehicleService } from '@/service/vehicleService';
import { planningService } from '@/service/planningService';
import { reviewService } from '@/service/reviewService';
import { profileService } from '@/service/profileService';
import {useRouter} from "next/navigation";
import ReviewForm from './ReviewForm';
import { useAuthContext } from "@/components/context/authContext";


export default function  FreelanceDetailsComponent ({ data,isModal = false })   {
    const router = useRouter();
    const { user } = useAuthContext();
    const currentUserId = user?.user?.id;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlanning, setSelectedPlanning] = useState(null);
    const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
    const [isViewingVehicleComments, setIsViewingVehicleComments] = useState(false);
    const [vehicleReviewsRefreshKey, setVehicleReviewsRefreshKey] = useState(0);

    if (!data) {
        return (
            <div className="p-6 text-sm font-semibold text-slate-600">
                Chargement...
            </div>
        );
    }

    let vehicleData = data.vehicleData;
    let driverData = data.driverData;
    if (vehicleData && !Array.isArray(vehicleData.illustration_images)) {
        vehicleData.illustration_images = [];
    }

    const [resolvedVehicleData, setResolvedVehicleData] = useState(vehicleData || null);
    const [vehicleLoading, setVehicleLoading] = useState(false);

    // State for fetched data
    const [plannings, setPlannings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewerProfiles, setReviewerProfiles] = useState({});

    const mappedDriverReviews = React.useMemo(() => {
        const list = Array.isArray(reviews) ? reviews : [];
        return list.map((r) => {
            const profile = reviewerProfiles?.[r.authorId];
            const reviewerName = profile?.name || (r.authorId && currentUserId && r.authorId === currentUserId ? 'Vous' : (r.authorId || 'Utilisateur'));
            return {
                review_id: r.id,
                rated_entity_id: r.subjectId,
                rated_entity_type: r.subjectType,
                comment: r.comment ?? '',
                created_at: r.createdAt ?? '',
                updated_at: r.createdAt ?? '',
                note: Number(r.rating ?? 0),
                likes_count: Number(r.reactionCounts?.LIKE ?? 0),
                dislikes_count: Number(r.reactionCounts?.DISLIKE ?? 0),
                icon: '',
                reviewer_name: reviewerName,
                reviewer_avatar: profile?.photoUri || '',
            };
        });
    }, [reviews, reviewerProfiles, currentUserId]);

    useEffect(() => {
        const list = Array.isArray(reviews) ? reviews : [];
        const missingAuthorIds = Array.from(
            new Set(list.map((r) => r?.authorId).filter((id) => id && !reviewerProfiles?.[id]))
        );
        if (missingAuthorIds.length === 0) return;

        let isMounted = true;
        Promise.all(
            missingAuthorIds.map(async (userId) => {
                try {
                    const user = await profileService.getPublicUserById(userId);
                    const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
                    const photoUri = user?.photoUri || '';
                    return [userId, { name: name || userId, photoUri }];
                } catch {
                    return [userId, { name: userId, photoUri: '' }];
                }
            })
        ).then((entries) => {
            if (!isMounted) return;
            setReviewerProfiles((prev) => {
                const next = { ...(prev || {}) };
                for (const [userId, data] of entries) {
                    next[userId] = data;
                }
                return next;
            });
        });

        return () => {
            isMounted = false;
        };
    }, [reviews, reviewerProfiles]);

    useEffect(() => {
        const driverId = driverData.driver_id || driverData.id;
        if (!driverId) return;
        setLoading(true);
        Promise.all([
            planningService.getPlanningsByDriver(driverId),
            reviewService.getReviewsBySubject(driverId, 'DRIVER')
        ]).then(([planningsList, reviewsList]) => {
            setPlannings(planningsList || []);
            setReviews(reviewsList || []);
        }).finally(() => setLoading(false));
    }, [driverData.driver_id, driverData.id]);

    const handleReviewCreated = (createdReview) => {
        if (!createdReview?.id) return;
        const subjectType = String(createdReview?.subjectType || '').toUpperCase();
        if (subjectType === 'DRIVER') {
            setReviews((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                if (list.some((r) => r?.id === createdReview.id)) return list;
                return [...list, createdReview];
            });
            return;
        }
        if (subjectType === 'VEHICLE') {
            setVehicleReviewsRefreshKey((k) => k + 1);
        }
    };

    useEffect(() => {
        const driverId = driverData.driver_id || driverData.id;
        if (!driverId) return;
        if (vehicleData?.vehicleId || resolvedVehicleData?.vehicleId) return;
        let isMounted = true;
        setVehicleLoading(true);
        vehicleService.getVehiclesByDriver(driverId)
            .then(async (vehicles) => {
                if (!isMounted) return;
                const mainVehicle = vehicles?.[0];
                if (!mainVehicle?.vehicleId) {
                    setResolvedVehicleData(null);
                    return;
                }
                const images = await vehicleService.getVehicleImages(mainVehicle.vehicleId);
                const mappedVehicle = {
                    vehicleId: mainVehicle.vehicleId,
                    total_seat_number: mainVehicle.totalSeatNumber ?? "N/A",
                    luggage_max_capacity: mainVehicle.luggageMaxCapacity ?? "N/A",
                    mileage_at_mileage_since_commissioning: mainVehicle.mileageSinceCommissioning ?? "N/A",
                    fuel_type_name: mainVehicle.fuelTypeId || "N/A",
                    transmission_type_name: mainVehicle.transmissionTypeId || "N/A",
                    model_name: mainVehicle.vehicleModelId || "N/A",
                    manufacturer_name: mainVehicle.vehicleMakeId || "N/A",
                    brand_name: mainVehicle.brand || "N/A",
                    size_name: mainVehicle.vehicleSizeId || "N/A",
                    type_name: mainVehicle.vehicleTypeId || "N/A",
                    registration_number: mainVehicle.registrationNumber || "N/A",
                    vehicle_serial_number: mainVehicle.vehicleSerialNumber || "N/A",
                    tank_capacity: mainVehicle.tankCapacity ?? "N/A",
                    vehicle_age_at_start: mainVehicle.vehicleAgeAtStart ?? "N/A",
                    average_fuel_consumption_per_kilometer: mainVehicle.averageFuelConsumptionPerKm ?? "N/A",
                    mileage_since_commissioning: mainVehicle.mileageSinceCommissioning ?? "N/A",
                    registration_expiry_date: mainVehicle.registrationExpiryDate || "N/A",
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
                    illustration_images: images.map((image) => image.imagePath).filter(Boolean),
                    vehicle_reviews: []
                };
                setResolvedVehicleData(mappedVehicle);
            })
            .catch(() => {
                if (isMounted) setResolvedVehicleData(null);
            })
            .finally(() => {
                if (isMounted) setVehicleLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [driverData.driver_id, driverData.id, vehicleData, resolvedVehicleData?.vehicleId]);

    const storeProfileData = (profileId, profileData) => {
        localStorage.setItem(profileId, JSON.stringify(profileData));
    };

    const formatDate = (value) => {
        if (!value) return 'N/A';
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return 'N/A';
        return parsed.toLocaleDateString('fr-FR');
    };

    const formatDateTime = (dateValue, timeValue) => {
        if (!dateValue) return 'N/A';
        const parsed = new Date(dateValue);
        if (Number.isNaN(parsed.getTime())) return 'N/A';
        const dateLabel = parsed.toLocaleDateString('fr-FR');
        if (!timeValue) return dateLabel;
        const parsedTime = new Date(timeValue);
        if (!Number.isNaN(parsedTime.getTime())) {
            return `${dateLabel} ${parsedTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
        }
        return `${dateLabel} ${timeValue}`;
    };

    const formatPrice = (value) => {
        const amount = Number(value);
        if (!Number.isFinite(amount)) return '0 XAF';
        return `${amount.toLocaleString('fr-FR')} XAF`;
    };


    const OpenFreelanceProfilePage = () => {
        // Use the driver ID to navigate to the dynamic profile page
        const driverId = driverData.driver_id || driverData.id;
        if (driverId) {
            storeProfileData(driverId, { driverData, vehicleData: resolvedVehicleData || vehicleData });
            const url = `/freelance-profile?id=${driverId}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            console.error("Driver ID missing");
        }
    };

    return (

        <>
            {isModal && (
                <div className="text-center mt-2">
                    <button
                        onClick={OpenFreelanceProfilePage}
                        className="inline-flex items-center text-blue-500 hover:text-blue-700"
                    >
                        <span className="mr-2">Open profile in a new window</span>
                        <ArrowTopRightOnSquareIcon className="w-5 h-5"/>
                    </button>
                </div>
            )}
            {/*<div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">*/}
            <div className={`py-[30px] lg:py-[60px] text bg-[var(--bg-2)] px-3 ${isModal ? 'modal-specific-class' : ''}`}>


                {/*<div className="container max-w-[1600px]">*/}
                <div className={`container ${isModal ? 'max-w-full' : 'max-w-[1600px]'}`}>

                    {/*<div className="grid grid-cols-12 gap-4 lg:gap-6">*/}
                    <div className={`grid ${isModal ? 'grid-cols-1' : 'grid-cols-12'} gap-4 lg:gap-6`}>


                        {/*<div className="col-span-12 xl:col-span-4">*/}
                        <div className={isModal ? 'col-span-1' : 'col-span-12 xl:col-span-5'}>


                            <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-6 lg:px-6 mb-2">
                                <Information driverData={driverData}/>
                                <div className="border border-dashed my-2"></div>
                                <div>
                                    {driverData.driver_availability_table.length > 0 && driverData.driver_availability_table.some(entry => entry.is_available) && (
                                        <div className="items-center gap-1 overflow-x-auto">
                                            <MyTable
                                                className="min-w-[500px]"
                                                data={data}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="border border-dashed my-1"></div>
                                <div className="items-center">
                                    <div className="block text font-semibold clr-neutral-600 mb-1">
                                        Disponibilités (autres plannings publiés)
                                    </div>
                                    {plannings.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-200">
                                                        <th className="border border-gray-400 px-4 py-2">Départ</th>
                                                        <th className="border border-gray-400 px-4 py-2">Arrivée</th>
                                                        <th className="border border-gray-400 px-4 py-2">Date départ</th>
                                                        <th className="border border-gray-400 px-4 py-2">Date arrivée</th>
                                                        <th className="border border-gray-400 px-4 py-2">Prix</th>
                                                        <th className="border border-gray-400 px-4 py-2">See more</th>
                                                        <th className="border border-gray-400 px-4 py-2">Book</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {plannings.map((p) => (
                                                        <tr key={p.id}>
                                                            <td className="border border-gray-400 px-4 py-2">{p.departureLocation || p.pickupLocation || 'N/A'}</td>
                                                            <td className="border border-gray-400 px-4 py-2">{p.dropoffLocation || 'N/A'}</td>
                                                            <td className="border border-gray-400 px-4 py-2">{formatDateTime(p.startDate, p.startTime)}</td>
                                                            <td className="border border-gray-400 px-4 py-2">{formatDateTime(p.endDate, p.endTime)}</td>
                                                            <td className="border border-gray-400 px-4 py-2">{formatPrice(p.regularAmount ?? p.cost ?? p.discountedAmount)}</td>
                                                            <td className="border border-gray-400 px-4 py-2">
                                                                <button
                                                                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-700 hover:text-slate-900"
                                                                    onClick={() => {
                                                                        setSelectedPlanning(p);
                                                                        setIsPlanningModalOpen(true);
                                                                    }}
                                                                >
                                                                    See more
                                                                </button>
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2">
                                                                <button
                                                                    className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                                                    onClick={() => window.open(`/freelance-booking?id=${p.id}`, '_blank')}
                                                                >
                                                                    Book
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">Aucune disponibilité/planning publié.</div>
                                    )}
                                </div>

                                <div className="border border-dashed my-1"></div>
                                <div>
                                    <span className="block font-semibold clr-neutral-600 mb-1">
                                        Keywords
                                    </span>
                                    <p>{driverData.driver_keywords.join(" | ")}</p>
                                </div>
                                <div className="border border-dashed my-1"></div>
                                <span className="block  font-semibold clr-neutral-600 mb-1">
                                    Details
                                </span>
                                <div className="mb-0 text">{driverData.Description}</div>
                            </div>
                        </div>
                        {/*<div className="col-span-12 xl:col-span-8">*/}
                        <div className={isModal ? 'col-span-1' : 'col-span-12 xl:col-span-7'}>
                            {(driverData.has_vehicle || resolvedVehicleData?.vehicleId) && (
                                <div className="p-3 bg-white rounded-2xl mb-8">
                                    <CarDetails
                                        vehicleData={resolvedVehicleData || vehicleData}
                                        isModal={isModal}
                                        onVehicleCommentsToggle={setIsViewingVehicleComments}
                                        currentUserId={currentUserId}
                                        reviewsRefreshKey={vehicleReviewsRefreshKey}
                                    />
                                </div>
                            )}
                            {vehicleLoading && (
                                <div className="p-3 bg-white rounded-2xl mb-8 text-gray-500">
                                    Chargement des informations du véhicule...
                                </div>
                            )}
                            {

                            }

                            {/* Ajout d'un bouton pour écrire un avis, protégé par la connexion */}
                            <div className="mb-4">
                                <ProtectedButton
                                    onProtectedClick={() => setIsModalOpen(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                                >
                                    Écrire un avis
                                </ProtectedButton>
                            </div>

                            {/* Modal d'ajout d'avis */}
                            {isModalOpen && (
                                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                                    <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 relative">
                                        <button 
                                            onClick={() => setIsModalOpen(false)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                        >
                                            <span className="text-xl">×</span>
                                        </button>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre avis</h2>
                                        <ReviewForm
                                            driverId={driverData.driver_id}
                                            subjectId={isViewingVehicleComments ? (resolvedVehicleData || vehicleData)?.vehicleId : undefined}
                                            subjectType={isViewingVehicleComments ? 'VEHICLE' : 'DRIVER'}
                                            onSuccess={(createdReview) => {
                                                handleReviewCreated(createdReview);
                                                setIsModalOpen(false);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {isPlanningModalOpen && selectedPlanning && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
                                    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.85)]">
                                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Planning</p>
                                                <h2 className="text-2xl font-bold text-slate-900">Détails du planning</h2>
                                            </div>
                                            <button
                                                onClick={() => setIsPlanningModalOpen(false)}
                                                className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-slate-400 hover:text-slate-600"
                                                aria-label="Close"
                                            >
                                                <span className="text-lg">×</span>
                                            </button>
                                        </div>
                                        <div className="grid gap-4 px-6 py-6 sm:grid-cols-2">
                                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trajet</p>
                                                <p className="mt-2 text-lg font-semibold text-slate-900">
                                                    {selectedPlanning.departureLocation || selectedPlanning.pickupLocation || 'N/A'} → {selectedPlanning.dropoffLocation || 'N/A'}
                                                </p>
                                                <p className="mt-2 text-sm text-slate-600">
                                                    {selectedPlanning.tripType || 'N/A'} • {selectedPlanning.tripIntention || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Dates</p>
                                                <p className="mt-2 text-sm text-slate-700">Départ: {formatDateTime(selectedPlanning.startDate, selectedPlanning.startTime)}</p>
                                                <p className="text-sm text-slate-700">Arrivée: {formatDateTime(selectedPlanning.endDate, selectedPlanning.endTime)}</p>
                                            </div>
                                            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Prix</p>
                                                <p className="mt-2 text-2xl font-semibold text-slate-900">
                                                    {formatPrice(selectedPlanning.regularAmount ?? selectedPlanning.cost ?? selectedPlanning.discountedAmount)}
                                                </p>
                                                <p className="text-sm text-slate-500">{selectedPlanning.pricingMethod || 'N/A'}</p>
                                            </div>
                                            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Paiement</p>
                                                <p className="mt-2 text-sm text-slate-700">{selectedPlanning.paymentOption || 'N/A'}</p>
                                                <p className="text-sm text-slate-500">Négociable: {selectedPlanning.negotiable ? 'Oui' : 'Non'}</p>
                                            </div>
                                            {selectedPlanning.baggageInfo && (
                                                <div className="sm:col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Bagages</p>
                                                    <p className="mt-2 text-sm text-slate-700">{selectedPlanning.baggageInfo}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-5">
                                            <button
                                                onClick={() => setIsPlanningModalOpen(false)}
                                                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-400 hover:text-slate-800"
                                            >
                                                Fermer
                                            </button>
                                            <button
                                                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                                                onClick={() => window.open(`/freelance-booking?id=${selectedPlanning.id}`, '_blank')}
                                            >
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isViewingVehicleComments && (
                                <Comment comments={mappedDriverReviews} isModal={isModal} rated_entity_type={"Driver"} rated_entity_id={driverData.driver_id} commentsPerPage={10}/>
                            )}


                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}