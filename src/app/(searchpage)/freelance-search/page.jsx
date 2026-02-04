

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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-8 font-inter">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Unlock the Freedom of On-Demand Driving
                    </h1>
                    <p className="text-lg text-gray-600">
                        Find and book the best driver
                    </p>
                </div>

                {/* Search Form Card */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                        {/* Location Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                                <div className="relative auto-search-wrapper">
                                    <input
                                        type="text"
                                        id="location"
                                        ref={locationRef}
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Enter your location"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                    />
                                    {iconsLoaded && (
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faLocationCrosshairs}
                                                className="text-green-600"
                                                style={{width: '14px', height: '14px'}}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                                <div className="relative auto-search-wrapper">
                                    <input
                                        type="text"
                                        id="destination"
                                        ref={destinationRef}
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder="Enter your destination"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                    />
                                    {iconsLoaded && (
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon
                                                icon={faLocationCrosshairs}
                                                className="text-red-600"
                                                style={{width: '14px', height: '14px'}}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Filters Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Driver Type</label>
                                <Select
                                    options={driverType}
                                    placeholder="Select..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: '0.75rem',
                                            borderWidth: '2px',
                                            borderColor: '#e5e7eb',
                                            backgroundColor: '#f9fafb',
                                            padding: '4px',
                                            '&:hover': { borderColor: '#3b82f6' }
                                        })
                                    }}
                                    onChange={(selectedOption) => handleInputChange('driverType', selectedOption?.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
                                <Select
                                    options={paymentMethod}
                                    placeholder="Select..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: '0.75rem',
                                            borderWidth: '2px',
                                            borderColor: '#e5e7eb',
                                            backgroundColor: '#f9fafb',
                                            padding: '4px',
                                            '&:hover': { borderColor: '#3b82f6' }
                                        })
                                    }}
                                    onChange={(selectedOption) => handleInputChange('paymentMethod', selectedOption?.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
                                <Select
                                    options={tripType}
                                    placeholder="Select..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: '0.75rem',
                                            borderWidth: '2px',
                                            borderColor: '#e5e7eb',
                                            backgroundColor: '#f9fafb',
                                            padding: '4px',
                                            '&:hover': { borderColor: '#3b82f6' }
                                        })
                                    }}
                                    onChange={(selectedOption) => handleInputChange('tripType', selectedOption?.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meetup Point</label>
                                <Select
                                    options={meetingPointOptions}
                                    placeholder="Select..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: '0.75rem',
                                            borderWidth: '2px',
                                            borderColor: '#e5e7eb',
                                            backgroundColor: '#f9fafb',
                                            padding: '4px',
                                            '&:hover': { borderColor: '#3b82f6' }
                                        })
                                    }}
                                    onChange={(selectedOption) => handleInputChange('meetupPoint', selectedOption?.value)}
                                />
                            </div>
                        </div>

                        {/* Date Time Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-sm">De</span>
                                    </div>
                                    <div>
                                        <DatePicker
                                            minDate={currentDate}
                                            selected={formData.startDate}
                                            onChange={(date) => handleInputChange('startDate', date)}
                                            dateFormat="dd/MM/yyyy"
                                            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl w-36 focus:border-blue-500 focus:outline-none bg-white"
                                        />
                                    </div>
                                    <span className="text-gray-400">à</span>
                                    <DatePicker
                                        selected={formData.startTime}
                                        onChange={(time) => handleInputChange('startTime', time)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="HH:mm"
                                        className="px-4 py-2.5 border-2 border-gray-200 rounded-xl w-24 focus:border-blue-500 focus:outline-none bg-white"
                                        minTime={getMinTime(formData.startDate)}
                                        maxTime={new Date(formData.startDate.getFullYear(), formData.startDate.getMonth(), formData.startDate.getDate(), 23, 45)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-orange-600 font-semibold text-sm">À</span>
                                    </div>
                                    <div>
                                        <DatePicker
                                            minDate={currentDate}
                                            selected={formData.endDate}
                                            onChange={(date) => handleInputChange('endDate', date)}
                                            dateFormat="dd/MM/yyyy"
                                            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl w-36 focus:border-blue-500 focus:outline-none bg-white"
                                        />
                                    </div>
                                    <span className="text-gray-400">à</span>
                                    <DatePicker
                                        selected={formData.endTime}
                                        onChange={(time) => handleInputChange('endTime', time)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="HH:mm"
                                        className="px-4 py-2.5 border-2 border-gray-200 rounded-xl w-24 focus:border-blue-500 focus:outline-none bg-white"
                                        minTime={formData.endDate > formData.startDate ?
                                            new Date(formData.endDate.getFullYear(), formData.endDate.getMonth(), formData.endDate.getDate(), 0, 0) :
                                            formData.startTime}
                                        maxTime={new Date(formData.endDate.getFullYear(), formData.endDate.getMonth(), formData.endDate.getDate(), 23, 45)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Filters */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
                                <Select
                                    options={languageOptions}
                                    placeholder="Select language..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: '0.75rem',
                                            borderWidth: '2px',
                                            borderColor: '#e5e7eb',
                                            backgroundColor: '#f9fafb',
                                            padding: '4px',
                                            '&:hover': { borderColor: '#3b82f6' }
                                        })
                                    }}
                                    onChange={(selectedOption) => handleInputChange('preferredLanguage', selectedOption?.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Intention</label>
                                <Select
                                    options={tripIntention}
                                    placeholder="Select intention..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: '0.75rem',
                                            borderWidth: '2px',
                                            borderColor: '#e5e7eb',
                                            backgroundColor: '#f9fafb',
                                            padding: '4px',
                                            '&:hover': { borderColor: '#3b82f6' }
                                        })
                                    }}
                                    onChange={(selectedOption) => handleInputChange('tripIntention', selectedOption?.value)}
                                />
                            </div>
                        </div>

                        {/* Advanced Options Toggle */}
                        <div className="flex justify-between items-center mb-4">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                <svg className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
                            </button>
                        </div>

                        {showAdvanced && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                                    <input
                                        type="number"
                                        placeholder="Min years..."
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Rating</label>
                                    <Select
                                        options={[1, 2, 3, 4, 5].map(n => ({value: n, label: '⭐'.repeat(n)}))}
                                        placeholder="Min rating..."
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        maxMenuHeight={180}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: '0.75rem',
                                                borderWidth: '2px',
                                                borderColor: '#e5e7eb',
                                                backgroundColor: 'white',
                                                padding: '4px'
                                            })
                                        }}
                                        onChange={(selectedOption) => handleInputChange('averageRating', selectedOption?.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Method</label>
                                    <Select
                                        options={pricingMethod}
                                        placeholder="Select..."
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        maxMenuHeight={180}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                borderRadius: '0.75rem',
                                                borderWidth: '2px',
                                                borderColor: '#e5e7eb',
                                                backgroundColor: 'white',
                                                padding: '4px'
                                            })
                                        }}
                                        onChange={(selectedOption) => handleInputChange('pricingMethod', selectedOption?.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={handleFindAll}
                                disabled={isLoading}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-gray-200"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                )}
                                Find All
                            </button>
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                )}
                                Find a Driver
                            </button>
                        </div>
                    </div>
                </form>

                {/* Results Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">{searchResults.length}</span>
                        </div>
                        <span className="font-medium text-gray-700">
                            chauffeur(s) trouvé(s)
                        </span>
                    </div>
                    <div className="flex bg-white rounded-xl shadow-sm p-1.5 border border-gray-200">
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                viewMode === 'map' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <MapIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Carte</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <span className="hidden sm:inline">Liste</span>
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Vue Carte */}
                        {viewMode === 'map' && (
                            <div className="mb-6">
                                <DriverMapNavigoo 
                                    plannings={searchResults}
                                    onDriverSelect={(planning) => {
                                        // Navigation vers le profil du chauffeur
                                        router.push(`/freelance-profile?planningId=${planning.id}`);
                                    }}
                                    className="shadow-lg"
                                />
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    Cliquez sur un chauffeur pour voir son profil et calculer l'itinéraire
                                </p>
                            </div>
                        )}

                        {/* Vue Liste */}
                        {viewMode === 'list' && searchResults.length > 0 && (
                            <SearchResult results={searchResults}/>
                        )}

                        {/* Message si aucun résultat */}
                        {searchResults.length === 0 && (
                            <div className="text-center py-10 bg-white rounded-lg shadow">
                                <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">Aucun chauffeur trouvé</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Cliquez sur "Find All" pour voir tous les chauffeurs disponibles
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="lg:mb-[15rem]">

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

