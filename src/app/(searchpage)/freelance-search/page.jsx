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



const Search = () => {
    const searchParams = useSearchParams();
    const locationBase = searchParams.get('location');
    const destinationBase = searchParams.get('destination');
    const locationRef = useRef(null);
    const destinationRef = useRef(null);
    const currentDate = new Date();
    const [serverCurrentDate, setServerCurrentDate] = useState(new Date());

    const [searchResults, setSearchResults] =  useState([]);
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


    const handleSearch = (e) => {
        e.preventDefault();

        const searchData = {...formData};
        searchData["experience"]=Number(searchData["experience"]);
        ['startDate', 'endDate', 'startTime', 'endTime'].forEach(key => {
            if (searchData[key] instanceof Date) {
                searchData[key] = searchData[key].toISOString();
            }
        });


        const fakeSearchResults = [""];
        setSearchResults(fakeSearchResults);

        console.log("Search Data:", searchData);
        // Ici, vous pouvez envoyer searchData à votre API ou effectuer d'autres actions
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