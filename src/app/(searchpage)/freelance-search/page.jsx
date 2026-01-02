/*"use client";
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
            toast.error("Erreur de chargement des plannings.");
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
        
        return filtered;
    }, [location, destination, startDate, allPlannings]);

    // La fonction handleSearch n'est plus nécessaire si le filtrage est en temps réel,
    // mais on la garde au cas où vous voudriez un bouton de recherche explicite.
    const handleSearch = (e) => {
        e.preventDefault();
        // Le filtrage est déjà fait par useMemo, ce bouton peut rester pour la forme.
        toast.success("Filtres appliqués !");
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 md:p-6">
                
               
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border">
                    <h2 className="text-xl font-bold mb-5 text-gray-800">Trouver un Chauffeur</h2>
                    <form onSubmit={handleSearch} className="space-y-4">
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

                
                {isLoading ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 mt-4">Chargement des chauffeurs disponibles...</p>
                    </div>
                ) : filteredPlannings.length > 0 ? (
                    <div>
                        <p className="text-sm text-gray-600 font-medium mb-4">{filteredPlannings.length} chauffeur(s) trouvé(s)</p>
                        
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredPlannings.map(planning => (
                                <SearchCardFreelance key={planning.id} planning={planning} onActionCompleted={loadPlannings} />
                            ))}
                        </div>
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


*/


"use client"
import React, {useEffect, useRef, useState} from 'react';
//import Select from 'react-select';
import Select from '@/components/general/CustomSelect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSearchParams} from "next/navigation";
import SearchResult from "@/components/search/SearchResultSection";
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {createAutocomplete} from "@/scripts/autocomplete"

import {
    meetingPointOptions,
    driverType,
    tripIntention,
    tripType,
    paymentMethod,
    pricingMethod,
    languageOptions,
} from "@/data/Structure";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import { planningService } from '@/service/planningService';
import { toast } from 'react-hot-toast';



const Search = () => {
    const searchParams = useSearchParams();
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
        <div className=" text p-2 md:pb-4 flex-col sm:flex-row gap-3 sm:gap-5 text-lg bg-gray-200">
            <div className="container mx-auto p-6 font-inter">
                <div className="mb-5 text-center">
                    <h1 className="font-bold bigtitle text-black mb-3">
                        Unlock the Freedom of On-Demand Driving
                    </h1>
                    <h2 className="title text-black font-medium leading-tight">
                        Find and book the best driver
                    </h2>
                </div>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex flex-wrap gap-2 lg:{flex flex-wrap gap-1}">
                        <div className="relative flex-auto w-full md:w-[30%] xl:w-[30%] h-max">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                <div className="relative auto-search-wrapper w-full lg:w-3/4">
                                    <input
                                        type="text"
                                        id="location"
                                        ref={locationRef}
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Select your location"
                                        className=" pl-10 border rounded w-full"
                                    />
                                    {iconsLoaded && (
                                        <FontAwesomeIcon
                                            icon={faLocationCrosshairs}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            style={{width: '15px', height: '15px'}}
                                        />
                                    )}
                                </div>

                                <div className="relative auto-search-wrapper w-full lg:w-3/4">
                                    <input
                                        type="text"
                                        id="destination"
                                        ref={destinationRef}
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder="Select your destination"
                                        className=" pl-10 border rounded w-full"
                                    />
                                    {iconsLoaded && (
                                        <FontAwesomeIcon
                                            icon={faLocationCrosshairs}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            style={{width: '15px', height: '15px'}}
                                        />
                                    )}
                                </div>

                                <Select
                                    options={driverType}
                                    placeholder="Driver type"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                    onChange={(selectedOption) => handleInputChange('driverType', selectedOption?.value)}
                                />

                                <Select
                                    options={paymentMethod}
                                    placeholder="Payment Method"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                    onChange={(selectedOption) => handleInputChange('driverType', selectedOption?.value)}
                                />

                                <Select
                                    options={tripType}
                                    placeholder="Trip type"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                    onChange={(selectedOption) => handleInputChange('tripType', selectedOption?.value)}
                                />

                                <Select
                                    options={meetingPointOptions}
                                    placeholder="Select meetup point"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                    onChange={(selectedOption) => handleInputChange('meetupPoint', selectedOption?.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <label className="whitespace-nowrap font-medium">From:</label>
                                        <DatePicker
                                            minDate={currentDate}
                                            selected={formData.startDate}
                                            onChange={(date) => handleInputChange('startDate', date)}
                                            dateFormat="dd/MM/yyyy"
                                            className="px-2 border rounded w-32"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="whitespace-nowrap font-medium">At:</label>
                                        <DatePicker
                                            selected={formData.startTime}
                                            onChange={(time) => handleInputChange('startTime', time)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="HH:mm aa"
                                            className="px-2 border rounded w-24"
                                            minTime={getMinTime(formData.startDate)}
                                            maxTime={new Date(formData.startDate.getFullYear(), formData.startDate.getMonth(), formData.startDate.getDate(), 23, 45)}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <label className="whitespace-nowrap font-medium">To:</label>
                                        <DatePicker
                                            minDate={currentDate}
                                            selected={formData.endDate}
                                            onChange={(date) => handleInputChange('endDate', date)}
                                            dateFormat="dd/MM/yyyy"
                                            className="px-2 border rounded w-32"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="whitespace-nowrap font-medium">At:</label>
                                        <DatePicker
                                            selected={formData.endTime}
                                            onChange={(time) => handleInputChange('endTime', time)}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="HH:mm aa"
                                            className="px-2 border rounded w-24"
                                            minTime={formData.endDate > formData.startDate ?
                                                new Date(formData.endDate.getFullYear(), formData.endDate.getMonth(), formData.endDate.getDate(), 0, 0) :
                                                formData.startTime}
                                            maxTime={new Date(formData.endDate.getFullYear(), formData.endDate.getMonth(), formData.endDate.getDate(), 23, 45)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <Select
                                    options={languageOptions}
                                    placeholder="Preferred language"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                    onChange={(selectedOption) => handleInputChange('preferredLanguage', selectedOption?.value)}
                                />
                                <Select
                                    options={tripIntention}
                                    placeholder="Trip intention"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                    onChange={(selectedOption) => handleInputChange('tripIntention', selectedOption?.value)}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"  // Ajout de cette ligne
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
                                </button>
                            </div>

                            {showAdvanced && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <input
                                        type="number"
                                        placeholder="Experience (years)"
                                        className="px-2 border rounded"
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
                                    />
                                    <Select
                                        options={[1, 2, 3, 4, 5].map(n => ({value: n, label: '⭐'.repeat(n)}))}
                                        placeholder="Average rating"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                        onChange={(selectedOption) => handleInputChange('averageRating', selectedOption?.value)}
                                    />
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    searchResults.length > 0 && <SearchResult results={searchResults}/>
                )}                       placeholder="Pricing method"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                        onChange={(selectedOption) => handleInputChange('pricingMethod', selectedOption?.value)}
                                    />
                                </div>
                            )}

                            <div className="w-full flex justify-end">
                                <button type="submit"
                                        className="bg-black text-white px-2 py-2 sm:px-4  sm:py-2 rounded-md hover:bg-gray-800 flex items-center justify-center text w-full sm:w-auto">

                                    Find a driver
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {searchResults.length > 0 &&
                    <SearchResult results={searchResults}/>
                }
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

