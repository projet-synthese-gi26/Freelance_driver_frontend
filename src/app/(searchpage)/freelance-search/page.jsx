

"use client"
import React, {useEffect, useRef, useState} from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import SearchResult from "@/components/search/SearchResultSection";
import {createAutocomplete} from "@/scripts/autocomplete"
import dynamic from 'next/dynamic';

import {
    LightBulbIcon,
    MagnifyingGlassIcon,
    MapIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";
import { planningService } from '@/service/planningService';
import { toast } from 'react-hot-toast';

// Import dynamique du composant carte pour éviter les erreurs SSR
const DriverMapNavigoo = dynamic(
    () => import('@/components/search/DriverMapNavigoo'),
    { 
        ssr: false,
        loading: () => (
            <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        )
    }
);



const Search = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const locationBase = searchParams.get('departure');
    const destinationBase = searchParams.get('destination');
    const locationRef = useRef(null);
    const destinationRef = useRef(null);

    const [searchResults, setSearchResults] =  useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState(locationBase || '');
    const [destination, setDestination] = useState(destinationBase || '');
    const [viewMode, setViewMode] = useState('map'); // 'map' ou 'list'
    const loadPublishedPlannings = async () => {
        setIsLoading(true);
        try {
            const allPlannings = await planningService.getPublishedPlannings();
            setSearchResults(allPlannings);
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Erreur lors de la recherche.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const locationAutocomplete = createAutocomplete('location', (selectedValue) => {
            setLocation(selectedValue);
        });
        const destinationAutocomplete = createAutocomplete('destination', (selectedValue) => {
            setDestination(selectedValue);
        });

        loadPublishedPlannings();

        return () => {
            if (locationAutocomplete && locationAutocomplete.destroy) locationAutocomplete.destroy();
            if (destinationAutocomplete && destinationAutocomplete.destroy) destinationAutocomplete.destroy();
        };

    }, []);


    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const allPlannings = await planningService.getPublishedPlannings();

            const params = new URLSearchParams(searchParams?.toString());
            if (location?.trim()) params.set('departure', location.trim());
            else params.delete('departure');

            if (destination?.trim()) params.set('destination', destination.trim());
            else params.delete('destination');

            router.push(`/freelance-search?${params.toString()}`);
            setSearchResults(allPlannings);
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Erreur lors de la recherche.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFindAll = async () => {
        setIsLoading(true);
        try {
            const allPlannings = await planningService.getPublishedPlannings();
            setSearchResults(allPlannings);
            toast.success(`${allPlannings.length} chauffeurs trouvés.`);
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Erreur lors de la recherche.");
        } finally {
            setIsLoading(false);
        }
    };

    const goToClientSearch = () => {
        const params = new URLSearchParams(searchParams?.toString());
        router.push(`/client-search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-200 to-blue-300">
            <div className="container mx-auto px-4 py-8 font-inter">
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm font-semibold text-slate-700">
                            Are you a client? Find a driver.
                        </div>
                        <button
                            type="button"
                            onClick={goToClientSearch}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                        >
                            Go to client search
                        </button>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="mb-8 flex flex-col items-center gap-2 text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-sm ring-1 ring-slate-200">
                        <MagnifyingGlassIcon className="h-7 w-7 text-slate-700" />
                    </div>
                </div>

                {/* Search Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <form onSubmit={handleSearch}>
                        {/* Main Search Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Location */}
                            <div className="relative auto-search-wrapper">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <span className="inline-flex items-center gap-2">
                                        <MapPinIcon className="h-4 w-4 text-slate-500" />
                                        Lieu de départ
                                    </span>
                                </label>
                                <MapPinIcon className="pointer-events-none absolute left-3 top-[44px] h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    id="location"
                                    ref={locationRef}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Ex: Yaoundé Centre"
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                />
                            </div>

                            {/* Destination */}
                            <div className="relative auto-search-wrapper">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <span className="inline-flex items-center gap-2">
                                        <MapPinIcon className="h-4 w-4 text-slate-500" />
                                        Destination
                                    </span>
                                </label>
                                <MapPinIcon className="pointer-events-none absolute left-3 top-[44px] h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    id="destination"
                                    ref={destinationRef}
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Ex: Douala"
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={handleFindAll}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5" />
                                Voir tous les chauffeurs
                            </button>
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                        Rechercher
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
                            <MapPinIcon className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-extrabold text-slate-900">
                                {searchResults.length}
                            </span>
                            <span className="text-sm font-semibold text-slate-600">chauffeur{searchResults.length > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    
                    {/* View Toggle */}
                    <div className="flex bg-white rounded-xl shadow-md p-1 border border-gray-200">
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                viewMode === 'map' 
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <MapIcon className="w-5 h-5" />
                            <span>Carte</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                viewMode === 'list' 
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <span>Liste</span>
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                        <p className="text-gray-500">Recherche en cours...</p>
                    </div>
                ) : (
                    <>
                        {/* Map View */}
                        {viewMode === 'map' && (
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                                <DriverMapNavigoo 
                                    plannings={searchResults}
                                    onDriverSelect={(planning) => {
                                        router.push(`/freelance-profile?planningId=${planning.id}`);
                                    }}
                                    className="h-[500px]"
                                />
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-100">
                                    <p className="text-sm text-gray-600 text-center">
                                        <span className="inline-flex items-center justify-center gap-2">
                                            <LightBulbIcon className="h-4 w-4 text-slate-500" />
                                            Cliquez sur un marqueur pour voir le profil du chauffeur et calculer l'itinéraire
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && searchResults.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <SearchResult results={searchResults} showSidebarFilters={true} />
                            </div>
                        )}

                        {/* Empty State */}
                        {searchResults.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapIcon className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Aucun chauffeur trouvé
                                </h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    Essayez de modifier vos critères de recherche ou cliquez sur "Voir tous les chauffeurs"
                                </p>
                                <button
                                    onClick={handleFindAll}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Voir tous les chauffeurs
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>


            <style jsx global>{`
                @import "/styles/css/autocomplete.css";

                .auto-search-wrapper {
                    width: 100%;
                }

                .auto-search-wrapper input {
                    width: 100% !important;
                    position: relative;
                }

                .auto-search-wrapper > div {
                    position: absolute !important;
                    top: 100% !important;
                    left: 0 !important;
                    right: 0 !important;
                    z-index: 1000 !important;
                    border: 1px solid #ddd !important;
                    border-top: none !important;
                    background-color: white !important;
                    max-height: 200px !important;
                    overflow-y: auto !important;
                    margin-top: 0 !important;
                }
            `}</style>
        </div>
    );
};
export default Search;

