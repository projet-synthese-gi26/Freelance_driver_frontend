"use client";
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from "next/navigation";
import { toast } from 'react-hot-toast';
import Select from '@/components/general/CustomSelect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createAutocomplete } from "@/scripts/autocomplete";

// --- SERVICES & COMPONENTS ---
import { planningService } from '@/service/planningService';
import SearchCardFreelance from "@/components/search/SearchCardFreelance";
import EmptyJumbotron from '@/components/EmptyJumbotron';
import {
    driverType,
    tripIntention,
    paymentMethod,
} from "@/data/Structure";

const FreelanceSearchPage = () => {
    const searchParams = useSearchParams();
    
    // États pour le formulaire de recherche
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [driverTypeValue, setDriverType] = useState(null);
    const [tripIntentionValue, setTripIntention] = useState(null);

    // États pour les données et le chargement
    const [allPlannings, setAllPlannings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialisation Autocomplete
    useEffect(() => {
        const locAutocomplete = createAutocomplete('location', setLocation);
        const destAutocomplete = createAutocomplete('destination', setDestination);
        return () => {
            locAutocomplete?.destroy();
            destAutocomplete?.destroy();
        };
    }, []);

    // Chargement initial des plannings
    const loadPlannings = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await planningService.getPublishedPlannings();
            const sorted = data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            setAllPlannings(sorted);
        } catch (error) {
            console.error(error);
            toast.error("Error loading plannings.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPlannings();
    }, [loadPlannings]);

    // Filtrage dynamique en temps réel
    const filteredPlannings = useMemo(() => {
        let filtered = allPlannings;

        if (location) {
            const query = location.toLowerCase();
            filtered = filtered.filter(p => p.pickupLocation.toLowerCase().includes(query) || p.fullLocation.toLowerCase().includes(query));
        }
        if (destination) {
            filtered = filtered.filter(p => p.dropoffLocation.toLowerCase().includes(destination.toLowerCase()));
        }
        if (startDate) {
            filtered = filtered.filter(p => new Date(p.startDate) >= startDate);
        }
        if (driverTypeValue) {
            // Logique à implémenter si le backend ne filtre pas
        }
        if (tripIntentionValue) {
            // Logique à implémenter
        }
        
        return filtered;
    }, [location, destination, startDate, driverTypeValue, tripIntentionValue, allPlannings]);


    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 md:p-6">
                
                {/* FORMULAIRE DE RECHERCHE */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                    <h2 className="text-xl font-bold mb-5 text-gray-800">Trouver un Chauffeur</h2>
                    <form className="space-y-4">
                        {/* Ligne 1: Lieux */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative auto-search-wrapper">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Départ</label>
                                <input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ville de départ" className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="relative auto-search-wrapper">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Arrivée</label>
                                <input id="destination" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Ville d'arrivée" className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        {/* Ligne 2: Filtres */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                                <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat="dd/MM/yyyy" className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholderText="Quand ?" isClearable />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Type de Chauffeur</label>
                                <Select options={driverType} onChange={option => setDriverType(option)} placeholder="Tous" isClearable />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Intention</label>
                                <Select options={tripIntention} onChange={option => setTripIntention(option)} placeholder="Toutes" isClearable />
                            </div>
                        </div>
                    </form>
                </div>

                {/* --- SECTION DES RÉSULTATS --- */}
                {isLoading ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 mt-4">Chargement des chauffeurs disponibles...</p>
                    </div>
                ) : filteredPlannings.length > 0 ? (
                    <div className="space-y-6">
                        <p className="text-sm text-gray-600 font-medium">{filteredPlannings.length} planning(s) trouvé(s)</p>
                        {filteredPlannings.map(planning => (
                            <SearchCardFreelance key={planning.id} planning={planning} onActionCompleted={loadPlannings} />
                        ))}
                    </div>
                ) : (
                    <EmptyJumbotron 
                        title="Aucun résultat" 
                        message="Aucun chauffeur ne correspond à vos critères de recherche pour le moment." 
                    />
                )}
            </div>
            
            <style jsx global>{`
                @import "/styles/css/autocomplete.css";
                .auto-search-wrapper input { width: 100% !important; }
                .auto-search-wrapper > div {
                    position: absolute !important;
                    z-index: 1000 !important;
                    border: 1px solid #ddd !important;
                    background-color: white !important;
                }
                .react-datepicker-wrapper, .react-datepicker__input-container, .react-datepicker__input-container input {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};
export default FreelanceSearchPage;