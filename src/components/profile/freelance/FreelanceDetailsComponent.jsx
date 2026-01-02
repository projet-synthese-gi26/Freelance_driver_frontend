import { ProtectedButton } from '@/components/general/ProtectedButton';
import Comment from "./Comment";
import React, { useState, useEffect } from "react";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import MyTable from "./MyTable";
import CarDetails from "./CarDetails";
import Information from "./Information";
import DriverExperiences from './DriverExperienceCard';
import { experienceService } from '@/service/experienceService';
import { planningService } from '@/service/planningService';
import { reviewService } from '@/service/reviewService';
import {useRouter} from "next/navigation";
import {v4 as uuidv4} from "uuid";
import ReviewForm from './ReviewForm';


export default function  FreelanceDetailsComponent ({ data,isModal = false })   {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    let vehicleData = data.vehicleData;
    let driverData = data.driverData;
    if (vehicleData && !Array.isArray(vehicleData.illustration_images)) {
        vehicleData.illustration_images = [];
    }

    // State for fetched data
    const [experiences, setExperiences] = useState([]);
    const [plannings, setPlannings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const driverId = driverData.driver_id || driverData.id;
        if (!driverId) return;
        setLoading(true);
        Promise.all([
            experienceService.getPortfolioByDriver(driverId),
            planningService.getPlanningsByDriver(driverId),
            reviewService.getReviewsForUser(driverId)
        ]).then(([portfolio, planningsList, reviewsList]) => {
            setExperiences(portfolio.experiences || []);
            setPlannings(planningsList || []);
            setReviews(reviewsList || []);
        }).finally(() => setLoading(false));
    }, [data]);

    const storeProfileData = (profileId, profileData) => {
        localStorage.setItem(profileId, JSON.stringify(profileData));
    };


    const OpenFreelanceProfilePage = () => {
        // Use the driver ID to navigate to the dynamic profile page
        const driverId = driverData.driver_id || driverData.id;
        if (driverId) {
            const url = `/freelance-profile/${driverId}`;
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
                                <DriverExperiences driverExperiences={experiences}/>


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
                                                        <th className="border border-gray-400 px-4 py-2">Date</th>
                                                        <th className="border border-gray-400 px-4 py-2">Prix</th>
                                                        <th className="border border-gray-400 px-4 py-2">Book</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {plannings.map((p) => (
                                                        <tr key={p.id}>
                                                            <td className="border border-gray-400 px-4 py-2">{p.pickupLocation}</td>
                                                            <td className="border border-gray-400 px-4 py-2">{p.dropoffLocation}</td>
                                                            <td className="border border-gray-400 px-4 py-2">{p.startDate}</td>
                                                            <td className="border border-gray-400 px-4 py-2">{Number(p.cost).toLocaleString()} XAF</td>
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
                            {driverData.has_vehicle && (
                                <div className="p-3 bg-white rounded-2xl mb-8">
                                    <CarDetails vehicleData={vehicleData} isModal={isModal}/>
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
                                        <ReviewForm driverId={driverData.driver_id} onSuccess={() => { setIsModalOpen(false); }} />
                                    </div>
                                </div>
                            )}

                            <Comment comments={reviews} isModal={isModal} rated_entity_type={"Driver"} rated_entity_id={driverData.driver_id} commentsPerPage={10}/>


                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}