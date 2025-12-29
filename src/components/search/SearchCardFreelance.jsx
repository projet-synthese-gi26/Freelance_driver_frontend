"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

import { planningService } from '@/service/planningService';
import { sessionService } from '@/service/sessionService';

// Le composant accepte maintenant la prop 'planning' au lieu de 'driverData' & 'vehicleData'
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
            toast.error(error.response?.data?.message || "Échec de la demande.");
        } finally {
            setIsLoadingBooking(false);
        }
    };
    
    const goToDriverDetails = () => {
        // Encodage pour la sécurité de l'URL
        const profileId = encodeURIComponent(planning.authorId);
        const planningId = encodeURIComponent(planning.id);
        
        // Similaire au mobile, on passe l'ID du chauffeur et du planning
        router.push(`/freelance-profile?driverId=${profileId}&planningId=${planningId}`);
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

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-center p-3 sm:p-4 bg-blue-50/50 border-b border-blue-100">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 mr-3 sm:mr-4 flex-shrink-0">
                    <Image 
                        src={planning.authorImageUrl || "/img/default-avatar.jpeg"} 
                        alt={planning.authorName} 
                        fill
                        className="rounded-full object-cover border-2 border-white shadow-sm"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">{planning.authorName}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{planning.title}</p>
                </div>
                <button 
                    onClick={goToDriverDetails}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm"
                >
                    Détails <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </button>
            </div>

            {/* Body */}
            <div className="p-3 sm:p-4 space-y-3">
                {/* Trajet */}
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

                {/* Date & Prix */}
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
            
            {/* Actions */}
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