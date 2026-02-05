/*"use client";
import React, { useState, useMemo } from "react";
import Select from "@/components/general/CustomSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    preferredLanguage: string | null;
    experience: string | null;
    sortBy: string | null;
    amenities: string[];
    languages: string[];
    referringBy: string | null;
    priceCategory: string | null;
};

// Interface pour les props du composant
interface SearchResultProps {
    results?: any[]; // Accepte les données de l'API
}

const SearchResult = ({ results = [] }: SearchResultProps) => {
    const [filters, setFilters] = useState<FilterState>({
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        paymentType: null,
        experience: null,
        preferredLanguage: null,
        sortBy: null,
        amenities: [],
        languages: [],
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

    // Logique de filtrage adaptée aux données API
    const filteredListings = useMemo(() => {
        // Utilise les données passées en props (results)
        const data = Array.isArray(results) ? results : [];

        return data.filter(item => {
            // Exemple de filtrage côté client sur la date
            if (filters.startDate && item.startDate) {
                const itemDate = new Date(item.startDate);
                // Si la date du planning est avant la date filtrée, on rejette
                if (itemDate < filters.startDate) return false;
            }
            
            // Vous pouvez ajouter ici d'autres logiques de filtrage
            // basées sur les champs de l'objet Planning (item.paymentOption, etc.)
            
            return true;
        });
    }, [results]);

    const resetFilters = () => {
        setFilters({
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            paymentType: null,
            experience: null,
            preferredLanguage: null,
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
                                    onChange={(selectedOption: any) => handleFilterChange('paymentType', selectedOption?.value)}
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
                                    onChange={(selectedOption: any) => handleFilterChange('experience', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"

                                />
                            </div>

                            <div className="">
                                <label className="block font-medium text-gray-700 mb-1">Sort By</label>
                                <Select
                                    options={sortOptions}
                                    value={sortOptions.find(option => option.value === filters.sortBy)}
                                    onChange={(selectedOption: any) => handleFilterChange('sortBy', selectedOption?.value)}
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
                                    onChange={(selectedOptions: any) => handleFilterChange('amenities', selectedOptions.map((option: { value: any; }) => option.value))}
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
                                    onChange={(selectedOption: any) => handleFilterChange('referringBy', selectedOption?.value)}
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
                                    onChange={(selectedOption: any) => handleFilterChange('priceCategory', selectedOption?.value)}
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
                                    maxMenuHeight={180}
                                    onChange={(selectedOption: any) => handleFilterChange('preferredLanguage', selectedOption?.value)}
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
                            <p className="font-bold">Search results</p>
                            <p className="font-bold">{filteredListings.length}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredListings.map((item) => (
                            <SearchCardFreelance
                                key={item.id}
                                planning={item}
                                onActionCompleted={() => {}}
                            />
                        ))}

                        {filteredListings.length === 0 && (
                            <div className="text-center p-10 bg-white rounded-lg">
                                <p className="text-gray-500">Aucun résultat ne correspond à votre recherche.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;

*/


"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Add import
// import Select from "react-select";
import Select from "@/components/general/CustomSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { carlistings } from "@/data/carlisting";
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


// Interface pour les props du composant
interface SearchResultProps {
    results?: any[]; // Accepte les données de l'API
}

const SearchResult = ({ results = [] }: SearchResultProps) => {
    const searchParams = useSearchParams();

    // Initialisation des filtres à partir des paramètres d'URL ou des valeurs par défaut
    const [filters, setFilters] = useState<FilterState>({
        startDate: searchParams?.get('startDate') ? new Date(searchParams.get('startDate')!) : null,
        endDate: searchParams?.get('endDate') ? new Date(searchParams.get('endDate')!) : null,
        startTime: searchParams?.get('startTime') ? new Date(searchParams.get('startTime')!) : null,
        endTime: searchParams?.get('endTime') ? new Date(searchParams.get('endTime')!) : null,
        paymentType: searchParams?.get('paymentMethod') || null,
        experience: searchParams?.get('experience') || null,
        preferredLanguage: searchParams?.get('preferredLanguage') || null,
        sortBy: null,
        amenities: [],
        languages: [],
        referringBy: null,
        priceCategory: searchParams?.get('pricingMethod') || null,
    });

    // Mettre à jour les filtres si l'URL change (utile pour la navigation arrière/avant)
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            startDate: searchParams?.get('startDate') ? new Date(searchParams.get('startDate')!) : prev.startDate,
            endDate: searchParams?.get('endDate') ? new Date(searchParams.get('endDate')!) : prev.endDate,
            paymentType: searchParams?.get('paymentMethod') || prev.paymentType,
             // ... update other fields as needed, or reset if params missing?
             // For now, let's assume one-way init or manual change is fine.
             // But if user searches again, params change.
        }));
    }, [searchParams]);

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


    const priceRange = useMemo(() => {
        const data = Array.isArray(results) ? results : [];
        const amounts = data
            .map((item) => Number(item.regularAmount ?? 0))
            .filter((value) => Number.isFinite(value));
        if (!amounts.length) {
            return { min: 0, max: 0 };
        }
        return {
            min: Math.min(...amounts),
            max: Math.max(...amounts),
        };
    }, [results]);

    const filteredListings = useMemo(() => {
        const data = Array.isArray(results) ? results : [];
        const range = priceRange.max - priceRange.min;
        const lowThreshold = priceRange.min + range * 0.33;
        const highThreshold = priceRange.min + range * 0.66;
        const filtered = data.filter(item => {
            // Logique de filtrage côté client basique
            if (filters.paymentType && item.paymentOption !== filters.paymentType) {
                 // Note: vérifier si item.paymentOption correspond aux valeurs de paymentType
                 // Dans Structure.ts paymentOptions a des valeurs comme 'cash', 'credit_card'
            }

            // Filtrage par Lieu de départ (si présent dans l'URL mais pas dans FilterState, on peut le lire directement)
            const departureParam = searchParams?.get('departure');
            if (departureParam) {
                 if (!item.departureLocation?.toLowerCase().includes(departureParam.toLowerCase())) {
                     return false;
                 }
            }

            const destinationParam = searchParams?.get('destination');
            if (destinationParam) {
                 if (!item.dropoffLocation?.toLowerCase().includes(destinationParam.toLowerCase())) {
                     return false;
                 }
            }
            
            if (filters.priceCategory && filters.priceCategory !== 'all_price') {
                const amount = Number(item.regularAmount ?? 0);
                if (filters.priceCategory === 'low_price' && amount > lowThreshold) {
                    return false;
                }
                if (filters.priceCategory === 'average_price' && (amount < lowThreshold || amount > highThreshold)) {
                    return false;
                }
                if (filters.priceCategory === 'high_price' && amount < highThreshold) {
                    return false;
                }
                if (filters.priceCategory === 'best_price' && amount > lowThreshold) {
                    return false;
                }
            }

            return true; 
        });

        if (filters.sortBy === 'priceLow') {
            return [...filtered].sort((a, b) => Number(a.regularAmount ?? 0) - Number(b.regularAmount ?? 0));
        }
        if (filters.sortBy === 'priceHigh') {
            return [...filtered].sort((a, b) => Number(b.regularAmount ?? 0) - Number(a.regularAmount ?? 0));
        }

        return filtered;
    }, [filters, priceRange, results, searchParams]);

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
                        {filteredListings.map((planning) => (
                            <div key={planning.id} className="bg-white rounded-lg ">
                                <SearchCardFreelance planning={planning} />
                            </div>
                        ))}
                        {filteredListings.length === 0 && (
                            <div className="bg-white rounded-lg p-10 text-center text-gray-500">
                                Aucun résultat ne correspond à votre recherche.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
