"use client"
import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {countries, languages} from "countries-list";
import {useRouter} from "next/navigation";
import SearchResult from "@/components/search/SearchResultSection";
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {createAutocomplete} from "@/scripts/autocomplete";
import {countryOptions,languageOptions,meetingPointOptions,
    paymentOptions,driverType,tripType,tripIntention,pricingMethod} from "@/data/Structure"

const SearchForm = () => {
    const router = useRouter();
    const [searchResults, setSearchResults] = useState(null);
    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [iconsLoaded, setIconsLoaded] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [formData, setFormData] = useState({
        departure:"",
        destination:"",
        startDate: new Date(),
        endDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        meetupPoint:"",
        driverType:'',
        tripType:'',
        tripIntention:'',
        experience:'',
        averageRating:'',
        pricingMethod:''
    });
    useEffect(() => {
        createAutocomplete('location');
        createAutocomplete('destination');
        // Set a small timeout to ensure icons are loaded
        const timer = setTimeout(() => setIconsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSearch = (e) => {
        e.preventDefault();

        const searchData = {...formData};
        searchData["experience"]=Number(searchData["experience"]);
        // Conversion des objets Date en chaînes pour l'affichage
        ['startDate', 'endDate', 'startTime', 'endTime'].forEach(key => {
            if (searchData[key] instanceof Date) {
                searchData[key] = searchData[key].toISOString();
            }
        });


        router.push("/searchResult")

        console.log("Search Data:", searchData);
        // Ici, vous pouvez envoyer searchData à votre API ou effectuer d'autres actions
    };
    return (
        <div
            className=" p-2 md:pb-4 flex-col sm:flex-row gap-3 sm:gap-5 text">
            <div className="container mx-auto p-4 font-inter">
                <div className="mb-10 text-center">
                    <h1 className="font-bold bigtitle">
                        Unlock the Freedom of On-Demand Driving
                    </h1>
                    <h2 className="title font-medium leading-tight">
                        Find and book the best driver
                    </h2>
                </div>

                <form onSubmit={handleSearch} className="mb-10">
                    <div className="flex flex-wrap gap-2 lg:{flex flex-wrap gap-1}">
                        <div className="relative flex-auto w-full md:w-[30%] xl:w-[30%] h-max">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="relative auto-search-wrapper w-full lg:w-3/4">
                                    <input
                                        type="text"
                                        id="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Select your location"
                                        className="p-2 pl-10 border rounded w-full text-lg"
                                    />
                                    {iconsLoaded && (
                                        <FontAwesomeIcon
                                            icon={faLocationCrosshairs}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            style={{width: '18px', height: '18px'}}
                                        />
                                    )}
                                </div>

                                <div className="relative auto-search-wrapper w-full lg:w-3/4">
                                    <input
                                        type="text"
                                        id="destination"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder="Select your destination"
                                        className="p-2 pl-10 border rounded w-full text-lg"
                                    />
                                    {iconsLoaded && (
                                        <FontAwesomeIcon
                                            icon={faLocationCrosshairs}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            style={{width: '18px', height: '18px'}}
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
                                    options={paymentOptions}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <label className="whitespace-nowrap font-medium">From:</label>
                                        <DatePicker
                                            selected={formData.startDate}
                                            onChange={(date) => handleInputChange('startDate', date)}
                                            dateFormat="dd/MM/yyyy"
                                            className="p-2 border rounded w-32"
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
                                            dateFormat="HH:mm"
                                            className="p-2 border rounded w-24"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <label className="whitespace-nowrap font-medium">To:</label>
                                        <DatePicker
                                            selected={formData.endDate}
                                            onChange={(date) => handleInputChange('endDate', date)}
                                            dateFormat="dd/MM/yyyy"
                                            className="p-2 border rounded w-32"
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
                                            dateFormat="HH:mm"
                                            className="p-2 border rounded w-24"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                            <div className="flex justify-between items-center mb-6">
                                <button
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
                                        className="p-2 border rounded"
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
                                    <Select
                                        options={pricingMethod}
                                        placeholder="Pricing method"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                        onChange={(selectedOption) => handleInputChange('pricingMethod', selectedOption?.value)}
                                    />
                                </div>
                            )}
                            <div className="w-full flex justify-end">
                                <button className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx>{`
                @import "/css/autocomplete.css";

                .auto-search-wrapper {
                    width: 100%;
                }

                .auto-search-wrapper input {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};
export default SearchForm;

