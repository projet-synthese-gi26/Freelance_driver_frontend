"use client";
import React, { useState } from 'react';
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';

// IMPORTS API
import { profileService } from '@/service/profileService';

const CURRENCY = "XAF";

const SearchCardFreelance = ({ planning }) => {
    const router = useRouter();
    const [driverDetails, setDriverDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Fonction pour charger les détails complets du chauffeur (profil, véhicule, etc.)
    // au clic sur "See more".
    const fetchDriverDetails = async () => {
        if (driverDetails) return; // Ne pas recharger si déjà fait
        setLoadingDetails(true);
        try {
            // Utiliser le service pour récupérer le profil complet
            const fullProfile = await profileService.getPublicDriverProfile(planning.authorId);
            setDriverDetails(fullProfile);
        } catch (error) {
            console.error("Erreur chargement détails chauffeur:", error);
            toast.error("Impossible de charger les détails du chauffeur.");
        } finally {
            setLoadingDetails(false);
        }
    };
    
    const handleSeeMore = async () => {
        await fetchDriverDetails();
        // Une fois les détails chargés, vous pouvez les afficher dans une modale
        // Pour l'instant, on se contente de charger et d'afficher un log
        console.log("Détails complets du chauffeur:", driverDetails);
        toast.info("Détails du chauffeur chargés. Voir la console.");
    };

    const handleBook = () => {
        // Logique de réservation : rediriger vers la page de réservation avec les infos
        // Pour l'instant, on simule une redirection
        toast.success(`Redirection vers la page de réservation pour ${planning.title}`);
        // router.push(`/booking?planningId=${planning.id}`);
    };
    
    // Valeurs par défaut robustes
    const imageUrl = planning.authorImageUrl || "/img/default-avatar.jpeg";
    const authorName = planning.authorName || "Chauffeur";

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row gap-5">
                {/* Image */}
                <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                    <Image
                        src={imageUrl}
                        alt={authorName}
                        fill
                        className="object-cover rounded-xl"
                    />
                </div>

                {/* Contenu principal */}
                <div className="flex-grow flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{authorName}</h2>
                            <p className="text-sm text-gray-500">{planning.title}</p>
                            <div className="flex items-center mt-1">
                                <StarIcon className="w-5 h-5 text-yellow-400 mr-1"/>
                                <span className="text-sm font-semibold">4.8</span>
                                <span className="text-xs text-gray-400 ml-2">(12 avis)</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">{planning.cost.toLocaleString()} XAF</p>
                            <p className="text-xs text-gray-500">par {planning.paymentMethod}</p>
                        </div>
                    </div>
                    
                    {/* Trajet */}
                    <div className="flex items-center gap-3 my-4 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase">Départ</p>
                            <p className="font-semibold text-gray-800 truncate">{planning.pickupLocation}</p>
                        </div>
                        <div className="text-blue-500 font-bold">➔</div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase">Arrivée</p>
                            <p className="font-semibold text-gray-800 truncate">{planning.dropoffLocation}</p>
                        </div>
                    </div>

                    {/* Actions (Footer de la carte) */}
                    <div className="mt-auto flex justify-end items-center gap-3 pt-3 border-t border-gray-100">
                        <button
                            onClick={handleSeeMore}
                            disabled={loadingDetails}
                            className="px-4 py-2 text-blue-600 font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                            {loadingDetails ? 'Chargement...' : 'Voir Profil'}
                        </button>
                        <button
                            onClick={handleBook}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
                        >
                            Réserver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchCardFreelance;