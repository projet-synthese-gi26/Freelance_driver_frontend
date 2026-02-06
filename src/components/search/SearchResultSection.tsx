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
    showSidebarFilters?: boolean;
}

const SearchResult = ({ results = [], showSidebarFilters = true }: SearchResultProps) => {
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
import { usePathname, useRouter, useSearchParams } from "next/navigation"; // Add import
// import Select from "react-select";
import Select from "@/components/general/CustomSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { carlistings } from "@/data/carlisting";
import SearchCardFreelance from "@/components/search/SearchCardFreelance";
import {
    AdjustmentsHorizontalIcon,
    ArrowPathIcon,
    BanknotesIcon,
    CalendarDaysIcon,
    ClockIcon,
    FunnelIcon,
    LanguageIcon,
    SparklesIcon,
    Squares2X2Icon,
    TagIcon,
} from "@heroicons/react/24/outline";


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
    showSidebarFilters?: boolean;
}

const SearchResult = ({ results = [], showSidebarFilters = true }: SearchResultProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname() ?? '';

    const getStringParam = (key: string): string | null => {
        const value = searchParams?.get(key) ?? null;
        if (value === null) return null;
        const trimmed = value.trim();
        return trimmed ? trimmed : null;
    };

    const getDateParam = (key: string): Date | null => {
        const value = getStringParam(key);
        if (!value) return null;
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    const getArrayParam = (key: string): string[] => {
        const value = getStringParam(key);
        if (!value) return [];
        return value
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);
    };

    const updateQueryParams = (patch: Record<string, string | null | undefined>) => {
        const params = new URLSearchParams(searchParams?.toString());
        for (const [key, value] of Object.entries(patch)) {
            if (value === null || value === undefined || String(value).trim() === '') {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        }
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    };

    const selectStyles = useMemo(() => ({
        control: (base: any, state: any) => ({
            ...base,
            borderRadius: '0.75rem',
            borderWidth: '2px',
            borderColor: state.isFocused ? '#3b82f6' : '#e2e8f0',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.12)' : 'none',
            minHeight: '44px',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            '&:hover': { borderColor: '#3b82f6' },
        }),
        valueContainer: (base: any) => ({
            ...base,
            paddingLeft: '0.75rem',
            paddingRight: '0.75rem',
        }),
        placeholder: (base: any) => ({
            ...base,
            color: '#94a3b8',
            fontWeight: 600,
        }),
        singleValue: (base: any) => ({
            ...base,
            fontWeight: 600,
            color: '#0f172a',
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected
                ? 'rgba(59, 130, 246, 0.10)'
                : state.isFocused
                    ? 'rgba(15, 23, 42, 0.04)'
                    : '#ffffff',
            color: '#0f172a',
            fontWeight: state.isSelected ? 700 : 600,
            cursor: 'pointer',
        }),
        menu: (base: any) => ({
            ...base,
            borderRadius: '0.75rem',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
        }),
    }), []);

    const headerSelectStyles = useMemo(() => ({
        ...selectStyles,
        control: (base: any, state: any) => ({
            ...selectStyles.control(base, state),
            backgroundColor: 'rgba(255, 255, 255, 0.10)',
            borderColor: state.isFocused ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.20)',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(255, 255, 255, 0.12)' : 'none',
            '&:hover': { borderColor: 'rgba(255, 255, 255, 0.35)' },
        }),
        singleValue: (base: any) => ({
            ...base,
            fontWeight: 700,
            color: '#f8fafc',
        }),
        placeholder: (base: any) => ({
            ...base,
            color: 'rgba(248, 250, 252, 0.85)',
            fontWeight: 700,
        }),
        indicatorSeparator: (base: any) => ({
            ...base,
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
        }),
        dropdownIndicator: (base: any) => ({
            ...base,
            color: 'rgba(248, 250, 252, 0.85)',
            '&:hover': { color: '#ffffff' },
        }),
    }), [selectStyles]);

    // Initialisation des filtres à partir des paramètres d'URL ou des valeurs par défaut
    const [filters, setFilters] = useState<FilterState>({
        startDate: getDateParam('startDate'),
        endDate: getDateParam('endDate'),
        startTime: getDateParam('startTime'),
        endTime: getDateParam('endTime'),
        paymentType: getStringParam('paymentMethod'),
        experience: getStringParam('experience'),
        preferredLanguage: getStringParam('preferredLanguage'),
        sortBy: getStringParam('sortBy'),
        amenities: getArrayParam('amenities'),
        languages: getArrayParam('languages'),
        referringBy: getStringParam('referringBy'),
        priceCategory: getStringParam('priceCategory') ?? getStringParam('pricingMethod'),
    });

    // Mettre à jour les filtres si l'URL change (utile pour la navigation arrière/avant)
    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            startDate: getDateParam('startDate'),
            endDate: getDateParam('endDate'),
            startTime: getDateParam('startTime'),
            endTime: getDateParam('endTime'),
            paymentType: getStringParam('paymentMethod'),
            experience: getStringParam('experience'),
            preferredLanguage: getStringParam('preferredLanguage'),
            sortBy: getStringParam('sortBy'),
            amenities: getArrayParam('amenities'),
            languages: getArrayParam('languages'),
            referringBy: getStringParam('referringBy'),
            priceCategory: getStringParam('priceCategory') ?? getStringParam('pricingMethod'),
        }));
    
    }, [searchParams]);

    const handleFilterChange = (name: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value }));

        if (name === 'startDate') {
            updateQueryParams({ startDate: value instanceof Date ? value.toISOString() : null });
            return;
        }
        if (name === 'endDate') {
            updateQueryParams({ endDate: value instanceof Date ? value.toISOString() : null });
            return;
        }
        if (name === 'startTime') {
            updateQueryParams({ startTime: value instanceof Date ? value.toISOString() : null });
            return;
        }
        if (name === 'endTime') {
            updateQueryParams({ endTime: value instanceof Date ? value.toISOString() : null });
            return;
        }
        if (name === 'paymentType') {
            updateQueryParams({ paymentMethod: value ?? null });
            return;
        }
        if (name === 'experience') {
            updateQueryParams({ experience: value ?? null });
            return;
        }
        if (name === 'preferredLanguage') {
            updateQueryParams({ preferredLanguage: value ?? null });
            return;
        }
        if (name === 'sortBy') {
            updateQueryParams({ sortBy: value ?? null });
            return;
        }
        if (name === 'amenities') {
            updateQueryParams({ amenities: Array.isArray(value) && value.length ? value.join(',') : null });
            return;
        }
        if (name === 'languages') {
            updateQueryParams({ languages: Array.isArray(value) && value.length ? value.join(',') : null });
            return;
        }
        if (name === 'referringBy') {
            updateQueryParams({ referringBy: value ?? null });
            return;
        }
        if (name === 'priceCategory') {
            updateQueryParams({ priceCategory: value ?? null, pricingMethod: null });
            return;
        }
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
            const departureParam = (searchParams?.get('departure') || '').trim();
            if (departureParam) {
                 if (!item.departureLocation?.toLowerCase().includes(departureParam.toLowerCase())) {
                     return false;
                 }
            }

            const destinationParam = (searchParams?.get('destination') || '').trim();
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

        updateQueryParams({
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            paymentMethod: null,
            experience: null,
            preferredLanguage: null,
            sortBy: null,
            amenities: null,
            languages: null,
            referringBy: null,
            priceCategory: null,
            pricingMethod: null,
        });
    };


    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 py-4">
            <div className={`flex flex-col gap-6 ${showSidebarFilters ? 'lg:flex-row lg:gap-8' : ''}`}>
                {showSidebarFilters ? (
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:sticky lg:top-6">
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <AdjustmentsHorizontalIcon className="h-5 w-5 text-slate-500" />
                                <h4 className="font-bold text-slate-900">Filtres</h4>
                            </div>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                <ArrowPathIcon className="h-4 w-4" />
                                Réinitialiser
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="">
                                <label className="flex items-center gap-2 font-medium text-slate-700">
                                    <CalendarDaysIcon className="h-4 w-4 text-slate-500" />
                                    Date début
                                </label>
                                <DatePicker
                                    selected={filters.startDate}
                                    onChange={(date) => handleFilterChange('startDate', date)}
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    dateFormat="dd/MM/yyyy"
                                    minDate={currentDate}
                                />
                            </div>
                            <div className="">
                                <label className="flex items-center gap-2 font-medium text-slate-700">
                                    <ClockIcon className="h-4 w-4 text-slate-500" />
                                    Heure début
                                </label>
                                <DatePicker
                                    selected={filters.startTime}
                                    onChange={(time) => handleFilterChange('startTime', time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="HH:mm"
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    minTime={getMinTime(filters.startDate)}
                                    maxTime={new Date(0, 0, 0, 23, 45)}
                                />
                            </div>
                            <div className="">
                                <label className="flex items-center gap-2 font-medium text-slate-700">
                                    <CalendarDaysIcon className="h-4 w-4 text-slate-500" />
                                    Date fin
                                </label>
                                <DatePicker
                                    selected={filters.endDate}
                                    onChange={(date) => handleFilterChange('endDate', date)}
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    dateFormat="dd/MM/yyyy"
                                    minDate={filters.startDate || currentDate}
                                />
                            </div>
                            <div className="">
                                <label className="flex items-center gap-2 font-medium text-slate-700">
                                    <ClockIcon className="h-4 w-4 text-slate-500" />
                                    Heure fin
                                </label>
                                <DatePicker
                                    selected={filters.endTime}
                                    onChange={(time) => handleFilterChange('endTime', time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="HH:mm"
                                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    minTime={filters.endDate && filters.endDate > (filters.startDate || currentDate) ?
                                        new Date(0, 0, 0, 0, 0) :
                                        (filters.startTime || new Date(0, 0, 0, 0, 0))}
                                    maxTime={new Date(0, 0, 0, 23, 45)}
                                />
                            </div>
                            <div className="">
                                <label className="flex items-center gap-2 font-medium text-slate-700">
                                    <BanknotesIcon className="h-4 w-4 text-slate-500" />
                                    Moyen de paiement
                                </label>
                                <Select
                                    options={paymentOptions}
                                    maxMenuHeight={150}
                                    value={paymentOptions.find(option => option.value === filters.paymentType)}
                                    onChange={(selectedOption:any) => handleFilterChange('paymentType', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={selectStyles}
                                />
                            </div>

                            <div className="">
                                <label className="flex items-center gap-2 font-medium text-slate-700 mb-1">
                                    <SparklesIcon className="h-4 w-4 text-slate-500" />
                                    Expérience
                                </label>
                                <Select
                                    options={experienceOptions}
                                    maxMenuHeight={80}
                                    value={experienceOptions.find(option => option.value === filters.experience)}
                                    onChange={(selectedOption:any) => handleFilterChange('experience', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={selectStyles}

                                />
                            </div>

                            <div className="">
                                <label className="flex items-center gap-2 font-medium text-slate-700 mb-1">
                                    <FunnelIcon className="h-4 w-4 text-slate-500" />
                                    Trier par
                                </label>
                                <Select
                                    options={sortOptions}
                                    value={sortOptions.find(option => option.value === filters.sortBy)}
                                    onChange={(selectedOption:any) => handleFilterChange('sortBy', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={selectStyles}
                                />
                            </div>

                            <div className="">
                                <label className="flex items-center gap-2 font-medium text-slate-700 mb-1">
                                    <TagIcon className="h-4 w-4 text-slate-500" />
                                    Équipements
                                </label>
                                <Select
                                    options={amenitiesOptions}
                                    isMulti
                                    maxMenuHeight={100}
                                    value={amenitiesOptions.filter(option => filters.amenities.includes(option.value))}
                                    onChange={(selectedOptions:any) => handleFilterChange('amenities', selectedOptions.map((option: { value: any; }) => option.value))}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={selectStyles}
                                />
                            </div>

                            <div className="">
                                <label className="block font-medium text-slate-700 mb-1">Référencé par</label>
                                <Select
                                    options={referringOptions}
                                    maxMenuHeight={150}
                                    value={referringOptions.find(option => option.value === filters.referringBy)}
                                    onChange={(selectedOption:any) => handleFilterChange('referringBy', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={selectStyles}
                                />
                            </div>

                            <div className="">
                                <label className="block font-medium text-slate-700 mb-1">Catégorie de prix</label>
                                <Select
                                    options={priceCategoryOptions}
                                    maxMenuHeight={150}
                                    value={priceCategoryOptions.find(option => option.value === filters.priceCategory)}
                                    onChange={(selectedOption:any) => handleFilterChange('priceCategory', selectedOption?.value)}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={selectStyles}
                                />
                            </div>

                            <div className="">
                                <Select
                                    options={languageOptions}
                                    value={languageOptions.find(option => option.value === filters.preferredLanguage)}
                                    placeholder="Langue"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180} // Hauteur pour environ 3 éléments
                                    onChange={(selectedOption:any) => handleFilterChange('preferredLanguage', selectedOption?.value)}
                                    styles={selectStyles}
                                />
                            </div>


                        </div>

                        </div>
                    </div>
                ) : null}

                <div className={showSidebarFilters ? "w-full lg:w-3/4" : "w-full"}>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 shadow-sm mb-6 text-white">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Squares2X2Icon className="h-5 w-5 text-slate-200" />
                                    <p className="font-semibold">Résultats</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="hidden sm:flex min-w-[220px] items-center gap-2">
                                        <Select
                                            options={[
                                                { value: null, label: 'Trier: défaut' },
                                                { value: 'priceLow', label: 'Prix: croissant' },
                                                { value: 'priceHigh', label: 'Prix: décroissant' },
                                            ]}
                                            value={
                                                [
                                                    { value: null, label: 'Trier: défaut' },
                                                    { value: 'priceLow', label: 'Prix: croissant' },
                                                    { value: 'priceHigh', label: 'Prix: décroissant' },
                                                ].find((opt) => opt.value === (filters.sortBy || null))
                                            }
                                            onChange={(selectedOption: any) => handleFilterChange('sortBy', selectedOption?.value ?? null)}
                                            placeholder="Trier"
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            styles={headerSelectStyles}
                                        />
                                    </div>
                                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                                        {filteredListings.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredListings.map((planning) => (
                            <SearchCardFreelance key={planning.id} planning={planning} />
                        ))}
                        {filteredListings.length === 0 && (
                            <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-500 shadow-sm">
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
