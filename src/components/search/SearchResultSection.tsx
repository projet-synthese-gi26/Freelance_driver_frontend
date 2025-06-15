"use client";
import React, { useState, useMemo } from "react";
// import Select from "react-select";
import Select from "@/components/general/CustomSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { carlistings } from "@/data/carlisting";
import SearchCardFreelance from "@/components/search/SearchCardFreelance";


import {
    paymentOptions,
    experienceOptions,
    sortOptions,
    amenitiesOptions,
    referringOptions,
    priceCategoryOptions,
    languageOptions
} from "@/data/Structure"


type FilterState = {
    startDate: Date | null;
    endDate: Date | null;
    startTime: Date | null;
    endTime: Date | null;
    paymentType: string | null;
    preferredLanguage:string | null;
    experience: string | null;
    sortBy: string | null;
    amenities: string[]; // tableau de chaînes de caractères
    languages: string[]; // tableau de chaînes de caractères
    referringBy: string | null;
    priceCategory: string | null;
};


const SearchResult = () => {
    const [filters, setFilters] = useState<FilterState>({
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        paymentType: null,
        experience: null,
        preferredLanguage:null,
        sortBy: null,
        amenities: [], // Initialisation comme tableau vide
        languages: [], // Initialisation comme tableau vide
        referringBy: null,
        priceCategory: null,
    });

    const handleFilterChange = (name: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const currentDate = new Date();

    const getMinTime = (selectedDate: Date | null) => {
        if (selectedDate && selectedDate.toDateString() === currentDate.toDateString()) {
            return new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate(),
                currentDate.getHours(),
                Math.ceil(currentDate.getMinutes() / 15) * 15
            );
        }
        return new Date(selectedDate?.getFullYear() || 0, selectedDate?.getMonth() || 0, selectedDate?.getDate() || 0, 0, 0);
    };


    const filteredListings = useMemo(() => {
        return carlistings.filter(car => {
            // Implement your filtering logic here
            return true; // Placeholder
        });
    }, [filters, carlistings]);

    const resetFilters = () => {
        setFilters({
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            paymentType: null,
            experience: null,
            preferredLanguage:null,
            sortBy: null,
            amenities: [],
            languages: [],
            referringBy: null,
            priceCategory: null,
        });
    };


    return (
        <div className="w-full text max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/4">
                    <div className="bg-white rounded-2xl p-6">
                        <h4 className="font-bold mb-2 border-b ">Filter</h4>
                        <div className="space-y-2">
                            <div className="">
                                <label className="block font-medium text-gray-700">Start Date</label>
                                <DatePicker
                                    selected={filters.startDate}
                                    onChange={(date) => handleFilterChange('startDate', date)}
                                    className="w-full px-6 border rounded-md"
                                    dateFormat="dd/MM/yyyy"
                                    minDate={currentDate}
                                />
                            </div>
                            <div className="">
                                <label className="block font-medium text-gray-700">Start Time</label>
                                <DatePicker
                                    selected={filters.startTime}
                                    onChange={(time) => handleFilterChange('startTime', time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="HH:mm aa"
                                    className="w-full px-6 border rounded-md"
                                    minTime={getMinTime(filters.startDate)}
                                    maxTime={new Date(0, 0, 0, 23, 45)}
                                />
                            </div>
                            <div className="">
                                <label className="block font-medium text-gray-700">End Date</label>
                                <DatePicker
                                    selected={filters.endDate}
                                    onChange={(date) => handleFilterChange('endDate', date)}
                                    className="w-full px-6 border rounded-md"
                                    dateFormat="dd/MM/yyyy"
                                    minDate={filters.startDate || currentDate}
                                />
                            </div>
                            <div className="">
                                <label className="block font-medium text-gray-700">End Time</label>
                                <DatePicker
                                    selected={filters.endTime}
                                    onChange={(time) => handleFilterChange('endTime', time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="HH:mm aa"
                                    className="w-full px-6 border rounded-md"
                                    minTime={filters.endDate && filters.endDate > (filters.startDate || currentDate) ?
                                        new Date(0, 0, 0, 0, 0) :
                                        (filters.startTime || new Date(0, 0, 0, 0, 0))}
                                    maxTime={new Date(0, 0, 0, 23, 45)}
                                />
                            </div>
                            <div className="">
                                <label className="block font-medium text-gray-700">Priced Method</label>
                                <Select
                                    options={paymentOptions}
                                    maxMenuHeight={150}
                                    value={paymentOptions.find(option => option.value === filters.paymentType)}
                                    onChange={(selectedOption:any) => handleFilterChange('paymentType', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="">
                                <label className="block font-medium text-gray-700 mb-1">Experience</label>
                                <Select
                                    options={experienceOptions}
                                    maxMenuHeight={80}
                                    value={experienceOptions.find(option => option.value === filters.experience)}
                                    onChange={(selectedOption:any) => handleFilterChange('experience', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"

                                />
                            </div>

                            <div className="">
                                <label className="block font-medium text-gray-700 mb-1">Sort By</label>
                                <Select
                                    options={sortOptions}
                                    value={sortOptions.find(option => option.value === filters.sortBy)}
                                    onChange={(selectedOption:any) => handleFilterChange('sortBy', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="">
                                <label className="block font-medium text-gray-700 mb-1">Amenities</label>
                                <Select
                                    options={amenitiesOptions}
                                    isMulti
                                    maxMenuHeight={100}
                                    value={amenitiesOptions.filter(option => filters.amenities.includes(option.value))}
                                    onChange={(selectedOptions:any) => handleFilterChange('amenities', selectedOptions.map((option: { value: any; }) => option.value))}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="">
                                <label className="block font-medium text-gray-700 mb-1">Refering By</label>
                                <Select
                                    options={referringOptions}
                                    maxMenuHeight={150}
                                    value={referringOptions.find(option => option.value === filters.referringBy)}
                                    onChange={(selectedOption:any) => handleFilterChange('referringBy', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="">
                                <label className="block font-medium text-gray-700 mb-1">Price Category</label>
                                <Select
                                    options={priceCategoryOptions}
                                    maxMenuHeight={150}
                                    value={priceCategoryOptions.find(option => option.value === filters.priceCategory)}
                                    onChange={(selectedOption:any) => handleFilterChange('priceCategory', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            <div className="">
                                <Select
                                    options={languageOptions}
                                    value={languageOptions.find(option => option.value === filters.preferredLanguage)}
                                    placeholder="Preferred language"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                    onChange={(selectedOption:any) => handleFilterChange('preferredLanguage', selectedOption?.value)}
                                />
                            </div>


                        </div>

                        <button
                            className="w-full py-1 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition duration-300 mt-8"
                            onClick={resetFilters}
                        >
                            Reset filtre
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-3/4">
                    <div className="bg-white rounded-lg py-4 px-6 shadow-lg mb-6">

                        <div className="flex justify-between items-center">
                            <p className=" font-bold">Search results</p>
                            <p className="font-bold">{filteredListings.length}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredListings.map((carListing) => (
                            // <div key={carListing.id} className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105">
                            <div key={carListing.driverData.driver_id}
                                 className="bg-white rounded-lg ">
                                <SearchCardFreelance {...carListing} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;