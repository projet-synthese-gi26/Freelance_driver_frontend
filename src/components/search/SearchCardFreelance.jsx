/*"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

import { planningService } from '@/service/planningService';
import { sessionService } from '@/service/sessionService';

// Le composant accepte la prop 'planning'
const SearchCardFreelance = ({ planning, onActionCompleted }) => {
    const router = useRouter();
    const [isLoadingBooking, setIsLoadingBooking] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const userContext = await sessionService.getUserContext();
            setCurrentUserId(userContext?.id || null);
        };
        fetchUserId();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handleRequestBooking = async () => {
        if (!confirm(`Confirmer la demande de réservation pour le planning "${planning.title}" ?`)) return;

        setIsLoadingBooking(true);
        try {
            await planningService.requestPlanningBooking(planning.id);
            toast.success("Demande de réservation envoyée !");
            if (onActionCompleted) onActionCompleted();
        } catch (error) {
            console.error("Erreur réservation:", error);
            const errorMessage = error.response?.data?.message || "Échec de la demande.";
            toast.error(errorMessage);
        } finally {
            setIsLoadingBooking(false);
        }
    };
    
    // --- CORRECTION DE LA REDIRECTION ---
    const goToDriverDetails = () => {
        // Redirige vers la page de profil dynamique en utilisant l'ID du chauffeur
        router.push(`/freelance-profile/${planning.authorId}`);
    };

    const renderActionButtonOrStatus = () => {
        if (planning.status === 'Published' && !planning.reservedByDriverId) {
            return (
                <button 
                    onClick={handleRequestBooking} 
                    disabled={isLoadingBooking}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                    {isLoadingBooking ? 'Envoi...' : 'Demander à réserver'}
                </button>
            );
        }
        
        let statusText = planning.status;
        let statusColor = 'bg-gray-200 text-gray-700';

        if (planning.status === 'PendingDriverConfirmation') {
            statusText = 'En attente';
            statusColor = 'bg-yellow-100 text-yellow-800';
        } else if (planning.status === 'Ongoing') {
            statusText = 'Réservé';
            statusColor = 'bg-green-100 text-green-800';
        }

        return (
            <div className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-semibold ${statusColor}`}>
                {statusText}
            </div>
        );
    };

    const imageUrl = planning.authorImageUrl || "/img/default-avatar.jpeg";
    const authorName = planning.authorName || "Chauffeur";

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            
            <div className="flex items-center p-3 sm:p-4 bg-blue-50/50 border-b border-blue-100">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 mr-3 sm:mr-4 flex-shrink-0">
                    <Image 
                        src={imageUrl} 
                        alt={authorName} 
                        fill
                        className="rounded-full object-cover border-2 border-white shadow-sm"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">{authorName}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{planning.title}</p>
                </div>
                <button 
                    onClick={goToDriverDetails}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm"
                >
                    Détails <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </button>
            </div>

            
            <div className="p-3 sm:p-4 space-y-3">
                
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center self-stretch">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-100"></div>
                        <div className="w-0.5 flex-grow bg-gray-200 my-1"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Départ</p>
                            <p className="text-sm font-medium text-gray-800 truncate" title={planning.pickupLocation}>{planning.pickupLocation}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Arrivée</p>
                            <p className="text-sm font-medium text-gray-800 truncate" title={planning.dropoffLocation}>{planning.dropoffLocation}</p>
                        </div>
                    </div>
                </div>

                
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                    <div className="flex items-center text-gray-600 gap-1.5">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-xs sm:text-sm font-medium">{formatDate(planning.startDate)}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-base sm:text-lg font-bold text-green-600">{planning.cost.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                </div>
            </div>
            
            
            <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex gap-3">
                <button 
                    onClick={() => toast('Chat bientôt disponible!')}
                    className="flex-1 flex items-center justify-center border border-blue-200 text-blue-600 py-2.5 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
                >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    Chat
                </button>
                {renderActionButtonOrStatus()}
            </div>
        </div>
    );
};

export default SearchCardFreelance;


*/


import React, { useState } from 'react';
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RightModal from "@/components/modal/RightModal";
import { v4 as uuidv4 } from 'uuid';

const CURRENCY = "XAF";

const SearchCardFreelance = ({
                          driverData,
                          vehicleData,
                             }) => {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const data={
        vehicleData,
        driverData
    }

    const storeBookingData = (bookingId, bookingData) => {
        localStorage.setItem(bookingId, JSON.stringify(bookingData));
    };

    const handleBook = () => {
        const bookingId = uuidv4(); // Generate a unique ID-
        // const  driver_availability_id="1";
        // const data = {
        //
        //     vehicleData: JSON.stringify(vehicleData),
        //     driverData: JSON.stringify(driverData),
        //     driver_availability_id:JSON.stringify(driver_availability_id),
        //     currency_name:JSON.stringify(CURRENCY)
        // };
        // const queryString = new URLSearchParams(data).toString();
        // router.push(`freelance-booking?${queryString}`);

        const driver_availability_id = "1";
        const bookingData = {
            vehicleData:vehicleData,
            driverData:driverData,
            driver_availability_id:driver_availability_id,
            currency_name: CURRENCY
        };

        storeBookingData(bookingId, bookingData);

        // Navigate with just the booking ID
        router.push(`/freelance-booking?id=${bookingId}`);

    };

    return (
        <div key={driverData.driver_id} className="col-span-12 text mb-6">
            <div className="flex flex-col text md:flex-row rounded-2xl p-6 bg-white">

                <div className="bg-[#F5F6FF] rounded-xl shrink-0 w-full md:w-48 h-48 md:h-auto mr-0 md:mr-6 mb-4 md:mb-0 overflow-hidden">
                    <Image
                        width={192}
                        height={192}
                        src={driverData.driver_profile_image}
                        alt={"title"}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                </div>
                <div className="flex-grow overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                            <h2 className="title font-bold text-gray-800">{driverData.driver_last_name+" "+driverData.driver_first_name}</h2>
                            <div className="flex items-center">
                                <StarIcon className="w-5 h-5 text-yellow-400 mr-1"/>
                            </div>
                            <p className="text-gray-600">
                                <i className="las la-map-marker text-primary"></i> {driverData.driverLocation}
                            </p>
                            <p className="text-gray-600">
                                <i className="las la-briefcase text-primary"></i>
                                Experiences: {driverData.driver_experiences.join(", ")}
                            </p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <div className="flex flex-col md:flex-row gap-2 mt-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                              //  className="btn-primary bg-primary text-white hover:bg-blue-600 rounded-full font-medium px-3 py-1 transition-colors duration-300"
                                className="btn-primary bg-primary  text-white  sm:px-3  sm:py-1 rounded-md hover:bg-blue-600 font-medium px-3 py-1 flex items-center justify-center text w-full sm:w-auto transition-colors duration-300"
                            >
                                See more
                            </button>

                            <button
                                onClick={handleBook}
                                className="btn-secondary bg-green-600  text-white  sm:px-3  sm:py-1 rounded-md hover:bg-green-500 font-medium px-3 py-1 flex items-center justify-center text w-full sm:w-auto transition-colors duration-300"
                            >
                                Book
                            </button>
                            </div>
                        </div>
                    </div>

                    <ul className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {[
                            {icon: "la-user-friends", text: `${vehicleData.total_seat_number} seats`},
                            {icon: "la-shopping-bag", text: `${vehicleData.luggage_max_capacity} kg of bags`},
                            {icon: "la-tachometer-alt", text: `${vehicleData.mileage_at_mileage_since_commissioning} km` },
                            { icon: "la-gas-pump", text:` ${vehicleData.fuel_type_name}` },
                            { icon: "la-cog", text: `${vehicleData.transmission_type_name}` },
                        ].map((item, index) => (
                            <li key={index} className="bg-[#F5FCF8] rounded-lg p-2 text-center">
                                <i className={`las ${item.icon} text-[#279155] text-xl`}></i>
                                <span className="block text-gray-600">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="">
                        <p className="font-semibold">Languages: {driverData.driver_languages.join(", ")}</p>
                        <p className="font-semibold">Specialties: {driverData.driver_specialities.join(", ")}</p>
                        <p className="font-semibold">Keywords: {driverData.driver_keywords.join(" | ")}</p>
                    </div>
                </div>
            </div>
            <RightModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pageContent={true} data={data}>
                {/* Modal content remains the same */}
            </RightModal>
        </div>
    );
};

export default SearchCardFreelance;