

"use client"
import React, {useEffect, useRef, useState} from 'react';
//import Select from 'react-select';
import Select from '@/components/general/CustomSelect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSearchParams, useRouter } from "next/navigation";
import SearchResult from "@/components/search/SearchResultSection";
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {createAutocomplete} from "@/scripts/autocomplete"
import dynamic from 'next/dynamic';

import {
    meetingPointOptions,
    driverType,
    tripIntention,
    tripType,
    paymentMethod,
    pricingMethod,
    languageOptions,
} from "@/data/Structure";
import {MagnifyingGlassIcon, MapIcon} from "@heroicons/react/24/outline";
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
    const locationBase = searchParams.get('location');
    const destinationBase = searchParams.get('destination');
    const locationRef = useRef(null);
    const destinationRef = useRef(null);
    const currentDate = new Date();
    const [serverCurrentDate, setServerCurrentDate] = useState(new Date());

    const [searchResults, setSearchResults] =  useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState(locationBase || '');
    const [destination, setDestination] = useState(destinationBase || '');
    const [iconsLoaded, setIconsLoaded] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showMap, setShowMap] = useState(true); // Afficher la carte par défaut
    const [viewMode, setViewMode] = useState('map'); // 'map' ou 'list'
    const [formData, setFormData] = useState({
        location:"",
        destination:"",
        startDate: new Date(),
        endDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        meetupPoint:"",
        driverType:'',
        tripType:'',
        preferredLanguage:'',
        tripIntention:'',
        experience:'',
        averageRating:'',
        pricingMethod:''
    });
    useEffect(() => {
        const locationAutocomplete = createAutocomplete('location', (selectedValue) => {
            setLocation(selectedValue);
        });
        const destinationAutocomplete = createAutocomplete('destination', (selectedValue) => {
            setDestination(selectedValue);
        });

        // Set a small timeout to ensure icons are loaded
        const timer = setTimeout(() =>{
            setIconsLoaded(true);

        }, 100);



        return () => {
            clearTimeout(timer);
            if (locationAutocomplete && locationAutocomplete.destroy) locationAutocomplete.destroy();
            if (destinationAutocomplete && destinationAutocomplete.destroy) destinationAutocomplete.destroy();
        };

    }, []);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const searchData = {...formData};
        searchData["experience"]=Number(searchData["experience"]);
        ['startDate', 'endDate', 'startTime', 'endTime'].forEach(key => {
            if (searchData[key] instanceof Date) {
                searchData[key] = searchData[key].toISOString();
            }
        });

        try {
            const allPlannings = await planningService.getPublishedPlannings();
            
            const filtered = allPlannings.filter(p => {
                let match = true;
                if (location) {
                    const loc = location.toLowerCase();
                    if (!p.pickupLocation.toLowerCase().includes(loc) && !p.fullLocation.toLowerCase().includes(loc)) {
                        match = false;
                    }
                }
                if (destination) {
                    const dest = destination.toLowerCase();
                    if (!p.dropoffLocation.toLowerCase().includes(dest)) {
                        match = false;
                    }
                }
                
                // Filter by Start Date
                if (searchData.startDate) {
                    const planningDate = new Date(p.startDate);
                    const searchDate = new Date(searchData.startDate);
                    // Compare only dates (ignore time)
                    if (planningDate.setHours(0,0,0,0) < searchDate.setHours(0,0,0,0)) {
                        match = false;
                    }
                }

                return match;
            });

            setSearchResults(filtered);
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

    const isToday = (date) => {
        return date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear();
    };

    const getMinTime = (selectedDate) => {
        if (isToday(selectedDate)) {
            return new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate(),
                currentDate.getHours(),
                Math.ceil(currentDate.getMinutes() / 15) * 15
            );
        }
        return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8 font-inter">
                {/* Hero Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        🚗 Trouvez votre chauffeur idéal
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Recherchez parmi nos chauffeurs professionnels disponibles
                    </p>
                </div>

                {/* Search Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <form onSubmit={handleSearch}>
                        {/* Main Search Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Location */}
                            <div className="relative auto-search-wrapper">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    📍 Lieu de départ
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    ref={locationRef}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Ex: Yaoundé Centre"
                                    className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                />
                            </div>

                            {/* Destination */}
                            <div className="relative auto-search-wrapper">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    🎯 Destination
                                </label>
                                <input
                                    type="text"
                                    id="destination"
                                    ref={destinationRef}
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Ex: Douala"
                                    className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                />
                            </div>

                            {/* Date From */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    📅 Date de départ
                                </label>
                                <DatePicker
                                    minDate={currentDate}
                                    selected={formData.startDate}
                                    onChange={(date) => handleInputChange('startDate', date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    🕐 Heure
                                </label>
                                <DatePicker
                                    selected={formData.startTime}
                                    onChange={(time) => handleInputChange('startTime', time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Heure"
                                    dateFormat="HH:mm"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                    minTime={getMinTime(formData.startDate)}
                                    maxTime={new Date(formData.startDate.getFullYear(), formData.startDate.getMonth(), formData.startDate.getDate(), 23, 45)}
                                />
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <Select
                                options={driverType}
                                placeholder="Type de chauffeur"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                maxMenuHeight={180}
                                onChange={(selectedOption) => handleInputChange('driverType', selectedOption?.value)}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '0.75rem',
                                        borderWidth: '2px',
                                        borderColor: '#e5e7eb',
                                        padding: '4px',
                                        '&:hover': { borderColor: '#3b82f6' }
                                    })
                                }}
                            />
                            <Select
                                options={tripType}
                                placeholder="Type de trajet"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                maxMenuHeight={180}
                                onChange={(selectedOption) => handleInputChange('tripType', selectedOption?.value)}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '0.75rem',
                                        borderWidth: '2px',
                                        borderColor: '#e5e7eb',
                                        padding: '4px',
                                        '&:hover': { borderColor: '#3b82f6' }
                                    })
                                }}
                            />
                            <Select
                                options={paymentMethod}
                                placeholder="Paiement"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                maxMenuHeight={180}
                                onChange={(selectedOption) => handleInputChange('paymentMethod', selectedOption?.value)}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '0.75rem',
                                        borderWidth: '2px',
                                        borderColor: '#e5e7eb',
                                        padding: '4px',
                                        '&:hover': { borderColor: '#3b82f6' }
                                    })
                                }}
                            />
                            <Select
                                options={languageOptions}
                                placeholder="Langue"
                                className="react-select-container"
                                classNamePrefix="react-select"
                                maxMenuHeight={180}
                                onChange={(selectedOption) => handleInputChange('preferredLanguage', selectedOption?.value)}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '0.75rem',
                                        borderWidth: '2px',
                                        borderColor: '#e5e7eb',
                                        padding: '4px',
                                        '&:hover': { borderColor: '#3b82f6' }
                                    })
                                }}
                            />
                        </div>

                        {/* Advanced Options Toggle */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
                            >
                                <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                {showAdvanced ? 'Masquer les options avancées' : 'Plus d\'options'}
                            </button>
                        </div>

                        {/* Advanced Options */}
                        {showAdvanced && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expérience (années)</label>
                                    <input
                                        type="number"
                                        placeholder="Min. années"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
                                    />
                                </div>
                                <Select
                                    options={[1, 2, 3, 4, 5].map(n => ({value: n, label: '⭐'.repeat(n)}))}
                                    placeholder="Note minimale"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    onChange={(selectedOption) => handleInputChange('averageRating', selectedOption?.value)}
                                />
                                <Select
                                    options={pricingMethod}
                                    placeholder="Méthode de tarification"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    onChange={(selectedOption) => handleInputChange('pricingMethod', selectedOption?.value)}
                                />
                            </div>
                        )}

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
                        <h2 className="text-xl font-semibold text-gray-900">
                            {searchResults.length} chauffeur{searchResults.length > 1 ? 's' : ''} disponible{searchResults.length > 1 ? 's' : ''}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Sélectionnez un chauffeur pour voir son profil
                        </p>
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
                                        💡 Cliquez sur un marqueur pour voir le profil du chauffeur et calculer l'itinéraire
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && searchResults.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <SearchResult results={searchResults}/>
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

