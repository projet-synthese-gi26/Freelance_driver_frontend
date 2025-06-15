
"use client"
import React, {useEffect, useRef, useState} from 'react';
import { createAutocomplete } from '@/scripts/autocomplete'; // Ensure the path is correct
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { MapIcon } from "@heroicons/react/24/outline";
import {ProtectedButton} from "@/components/general/ProtectedButton";
import CalendarModal from "@/components/general/Calendar";
import OnboardingModal from '@/components/OnboardingModal/OnboardingModal';


const SearchComponent = () => {


    const router = useRouter();
    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [iconsLoaded, setIconsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const locationRef = useRef(null);
    const destinationRef = useRef(null);
    const [isModal,setIsModal] = useState(false);
    useEffect(() => {
        const locationAutocomplete = createAutocomplete('location', (selectedValue) => {
            setLocation(selectedValue);
        });
        // const destinationAutocomplete = createAutocomplete('destination', (selectedValue) => {
        //     setDestination(selectedValue);
        // });

        // Set a small timeout to ensure icons are loaded
        const timer = setTimeout(() =>{
            setIconsLoaded(true);
            setIsLoading(false);
        }, 100);

        return () => {
            clearTimeout(timer);
            if (locationAutocomplete && locationAutocomplete.destroy) locationAutocomplete.destroy();
            // if (destinationAutocomplete && destinationAutocomplete.destroy) destinationAutocomplete.destroy();
        };
    }, []);

    const handleSearch = () => {
        // Encode the location and destination for URL safety
        if(location === '')
            return router.push(`/freelance-search`);

        const encodedLocation = encodeURIComponent(location);
        // const encodedDestination = encodeURIComponent(destination);

        // Push to the search page with query parameters
        router.push(`/freelance-search?location=${encodedLocation}`);
    };

    const handleApp=()=>{
        router.push(`/freelance-announce`);


    }





    return (
        <>
        <div className="container mx-auto text p-4 -mb-0 font-inter sm:ml-0">
            {isModal && <OnboardingModal onClose={()=>setIsModal(false)}/>}

            {/*<CalendarModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleConfirm} />*/}
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="relative auto-search-wrapper w-full sm:w-3/4">
                    <input
                        type="text"
                        id="location"
                        ref={locationRef}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter a location"
                        className="p-2 pl-10 border rounded w-full text"
                    />
                    {iconsLoaded && (
                        <FontAwesomeIcon
                            icon={faLocationCrosshairs}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            style={{ width: '16px', height: '16px', '@media (minWidth: 640px)': { width: '20px', height: '20px' } }}
                        />
                    )}
                </div>

                {/*<div className="relative auto-search-wrapper w-full sm:w-3/4">*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        id="destination"*/}
                {/*        ref={destinationRef}*/}
                {/*        value={destination}*/}
                {/*        onChange={(e) => setDestination(e.target.value)}*/}
                {/*        placeholder="Enter your destination"*/}
                {/*        className="p-2 pl-10 border rounded w-full text"*/}
                {/*    />*/}
                {/*    {iconsLoaded && (*/}
                {/*        <FontAwesomeIcon*/}
                {/*            icon={faLocationCrosshairs}*/}
                {/*            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"*/}
                {/*            style={{ width: '16px', height: '16px', '@media (minWidth: 640px)': { width: '20px', height: '20px' } }}*/}
                {/*        />*/}
                {/*    )}*/}
                {/*</div>*/}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleSearch}
                    style={{
                        // fontSize: '16px',
                        fontWeight: '500',
                    }}
                    className="bg-black text-white px-2 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-gray-800 flex items-center justify-center text w-full sm:w-auto"
                >
                    <span className="mr-2">Looking for a driver</span>
                    <MagnifyingGlassIcon className='w-4 h-4 sm:w-5 sm:h-5 text-white'/>
                </button>
                <ProtectedButton
                    onProtectedClick={handleApp}
                    // onClick={handlePublishRide}
                  style={` style={{
                        color: 'rgb(0, 0, 0)',
                        backgroundColor: 'rgb(238, 238, 238)',
                        fontFamily: 'UberMoveText, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif',
                        // fontSize: '16px',
                        fontWeight: '500',
                    }}`}
                    className="px-2 sm:px-4 py-2 sm:py-3 rounded-md hover:bg-gray-200 flex items-center justify-center w-full sm:w-auto"
                >

                        Publish your ride


                    <MapIcon className='w-4 h-4 sm:w-5 sm:h-5 text-black'/>
                </ProtectedButton>

            </div>

            <style jsx global>{`
                @import "/styles/css/autocomplete.css";
                
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
        </>
    );
};

export default SearchComponent;