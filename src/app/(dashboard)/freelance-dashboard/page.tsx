"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { PencilSquareIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"; // Using outline for consistency with existing design

// SERVICES & TYPES
import { profileService } from "@/service/profileService";
import { sessionService } from "@/service/sessionService";
import { useAuthContext } from "@/components/context/authContext";
import { DriverProfile } from "@/type/profile";

// Data for select options
// Assuming you have languageOptions available, similar to the client component
// If not, you might need to define them or fetch them.
// For now, I'll use a placeholder structure.
const languageOptions = [
    { value: "ENGLISH", label: "English" },
    { value: "FRENCH", label: "Français" },
    { value: "SPANISH", label: "Español" },
    // Add more languages as needed
];

// Interface pour les données du formulaire, similaire au DTO
interface DriverProfileFormData {
    firstName: string;
    lastName: string;
    nickname: string;
    birthDate: string;
    phoneNumber: string;
    nationality: string;
    gender: string;
    language: string;
    biography: string;
    vehicleDetails: string; // Specific to driver profile
    profileImageUrl?: string; // Added for internal form consistency, but handled separately
}

// Initial state pour le formulaire
const initialDriverProfileFormData: DriverProfileFormData = {
    firstName: '',
    lastName: '',
    nickname: '',
    birthDate: '',
    phoneNumber: '',
    nationality: '',
    gender: '',
    language: '',
    biography: '',
    vehicleDetails: '',
    profileImageUrl: '',
};

// Configuration des champs pour le rendu dynamique
interface FieldConfig {
    field: keyof DriverProfileFormData;
    title: string;
    type: 'text' | 'date' | 'email' | 'select' | 'textarea' | 'tel';
    optional?: boolean;
    options?: { value: string; label: string }[]; // Pour les champs de type 'select'
    className?: string; // Pour gérer la largeur des champs comme biography
}

export default function PersonalInfoPage() {
    const { user, checkAuth } = useAuthContext();
    const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);

    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(true); // Set to true initially for loading data
    const [formData, setFormData] = useState<DriverProfileFormData>(initialDriverProfileFormData);

    // Champs à afficher avec la nouvelle structure
    const fields: FieldConfig[] = [
        { field: 'firstName', title: 'Prénom', type: 'text' },
        { field: 'lastName', title: 'Nom', type: 'text' },
        { field: 'nickname', title: 'Surnom', type: 'text', optional: true },
        { field: 'birthDate', title: 'Date de Naissance', type: 'date' },
        { field: 'phoneNumber', title: 'Téléphone', type: 'tel' }, // Use 'tel' type
        { field: 'nationality', title: 'Nationalité', type: 'text' },
        {
            field: 'gender', title: 'Genre', type: 'select', options: [
                { value: "Male", label: "Homme" },
                { value: "Female", label: "Femme" },
                { value: "Other", label: "Autre" }
            ]
        },
        { field: 'language', title: 'Langue', type: 'select', options: languageOptions },
        { field: 'biography', title: 'Biographie', type: 'textarea', optional: true, className: 'md:col-span-2' },
        { field: 'vehicleDetails', title: 'Détails du véhicule (Résumé)', type: 'textarea', optional: true, className: 'md:col-span-2' },
    ];

    // Chargement initial des données utilisateur
    useEffect(() => {
        const loadProfile = async () => {
            if (user?.driverProfile) {
                setDriverProfile(user.driverProfile);
                setFormData({
                    firstName: user.driverProfile.firstName || '',
                    lastName: user.driverProfile.lastName || '',
                    nickname: user.driverProfile.nickname || '',
                    birthDate: user.driverProfile.birthDate || '',
                    phoneNumber: user.driverProfile.phoneNumber || '',
                    nationality: user.driverProfile.nationality || '',
                    gender: user.driverProfile.gender || '',
                    language: user.driverProfile.language || '',
                    biography: user.driverProfile.biography || '',
                    vehicleDetails: user.driverProfile.vehicleDetails || '',
                    profileImageUrl: user.driverProfile.profileImageUrl || '',
                });
                setLoading(false);
                return;
            }

            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const context = await profileService.getDriverProfile();
                const actor = context.actor as any;
                const profileFromApi: DriverProfile = {
                    id: actor?.id || '',
                    firstName: context.user?.firstName || '',
                    lastName: context.user?.lastName || '',
                    nickname: actor?.displayName || '',
                    birthDate: '',
                    phoneNumber: actor?.phoneNumber || context.user?.phone || '',
                    nationality: '',
                    gender: '',
                    language: actor?.languages?.[0] || '',
                    biography: '',
                    vehicleDetails: '',
                    profileImageUrl: context.user?.photoUri || actor?.avatarUrl || '',
                } as DriverProfile;

                setDriverProfile(profileFromApi);
                setFormData({
                    firstName: profileFromApi.firstName || '',
                    lastName: profileFromApi.lastName || '',
                    nickname: profileFromApi.nickname || '',
                    birthDate: profileFromApi.birthDate || '',
                    phoneNumber: profileFromApi.phoneNumber || '',
                    nationality: profileFromApi.nationality || '',
                    gender: profileFromApi.gender || '',
                    language: profileFromApi.language || '',
                    biography: profileFromApi.biography || '',
                    vehicleDetails: profileFromApi.vehicleDetails || '',
                    profileImageUrl: profileFromApi.profileImageUrl || '',
                });
            } catch (error) {
                console.error("❌ Erreur récupération profil chauffeur:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user]);

    const handleInputChange = (field: keyof DriverProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        const loadingToast = toast.loading("Sauvegarde des modifications...");
        try {
            // Le payload doit correspondre à ce que votre service `updateDriverProfile` attend
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                nickname: formData.nickname,
                birthDate: formData.birthDate,
                phoneNumber: formData.phoneNumber,
                nationality: formData.nationality,
                gender: formData.gender,
                language: formData.language,
                biography: formData.biography,
                vehicleDetails: formData.vehicleDetails,
                // profileImageUrl n'est pas envoyé ici car géré séparément
            };

            const updatedContext = await profileService.updateDriverProfile(payload);

            sessionService.saveSessionContext(updatedContext);
            await checkAuth(); // Rafraîchir le contexte global pour l'UI

            toast.success("Profil mis à jour avec succès !", { id: loadingToast });
            setEditable(false);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour.", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const loadingToast = toast.loading("Téléversement de la photo...");

            try {
                const updatedContext = await profileService.updateProfilePicture(file);

                sessionService.saveSessionContext(updatedContext);
                await checkAuth();

                // Mettre à jour localement l'URL de l'image de profil dans formData
                const newAvatarUrl = updatedContext.user?.photoUri || updatedContext.actor?.avatarUrl || '';
                setFormData(prev => ({ ...prev, profileImageUrl: newAvatarUrl }));

                toast.success("Photo de profil mise à jour !", { id: loadingToast });
            } catch (error) {
                console.error(error);
                toast.error("Échec du changement de photo.", { id: loadingToast });
            }
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-blue-600">Chargement du profil...</div>;
    if (!user) return <div className="p-10 text-center">Veuillez vous connecter.</div>;
    if (!driverProfile) return <div className="p-10 text-center text-red-500">Profil chauffeur introuvable.</div>;


    return (
        <div className="p-4 max-w-6xl mx-auto mb-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Informations Personnelles</h1>
                {!editable && (
                    <button
                        onClick={() => setEditable(true)}
                        className="flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600/20 transition" // Client-like button style
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                        <span className="font-medium">Modifier le profil</span>
                    </button>
                )}
            </div>

            {/* Photo de Profil */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative w-32 h-32">
                    <Image
                        src={formData.profileImageUrl || "/white-silhouette-avatar.png"}
                        alt="Profile"
                        fill
                        sizes="128px"
                        priority
                        className="rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {editable && (
                        <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
                            <PencilSquareIcon className="w-4 h-4 text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    )}
                </div>
                <p className="mt-2 text-gray-500 font-medium">
                    {formData.firstName} {formData.lastName}
                </p>
            </div>

            {/* Formulaire */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        {fields.map((item) => (
                            <div key={item.field} className={item.className || ''}> {/* Appliquer la classe pour la largeur */}
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {item.title} {item.optional && <span className="text-gray-400 font-normal italic">(Optionnel)</span>}
                                </label>

                                {editable ? (
                                    <>
                                        {item.type === 'select' ? (
                                            <select
                                                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 bg-white" // Couleur primaire ajustée
                                                value={formData[item.field] || ''}
                                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            >
                                                <option value="">Sélectionner {item.title}</option>
                                                {item.options?.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        ) : item.type === 'textarea' ? (
                                            <textarea
                                                rows={item.field === 'biography' ? 4 : 3} // Rows specific to biography vs vehicleDetails
                                                placeholder={item.field === 'vehicleDetails' ? "Marque, Modèle, Année..." : ""}
                                                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" // Couleur primaire ajustée
                                                value={formData[item.field] || ''}
                                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            />
                                        ) : (
                                            <input
                                                type={item.type}
                                                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" // Couleur primaire ajustée
                                                value={formData[item.field] || ''}
                                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="py-2.5 px-3 border-b border-gray-100 text-gray-700 min-h-[45px] bg-gray-50/40 rounded-t-md">
                                        {formData[item.field] || <span className="text-gray-400 italic text-sm">Non renseigné</span>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {editable && (
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition" // Couleur primaire ajustée
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="animate-pulse">Sauvegarde...</span>
                                ) : (
                                    <>
                                        <CheckIcon className="w-5 h-5 inline-block mr-2" />
                                        Sauvegarder les modifications
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    // Réinitialiser les données du formulaire à l'état initial
                                    if (driverProfile) { // Assurez-vous que driverProfile existe pour réinitialiser
                                        setFormData({
                                            firstName: driverProfile.firstName || '',
                                            lastName: driverProfile.lastName || '',
                                            nickname: driverProfile.nickname || '',
                                            birthDate: driverProfile.birthDate || '',
                                            phoneNumber: driverProfile.phoneNumber || '',
                                            nationality: driverProfile.nationality || '',
                                            gender: driverProfile.gender || '',
                                            language: driverProfile.language || '',
                                            biography: driverProfile.biography || '',
                                            vehicleDetails: driverProfile.vehicleDetails || '',
                                            profileImageUrl: driverProfile.profileImageUrl || '',
                                        });
                                    }
                                    setEditable(false);
                                }}
                                className="px-8 py-2.5 rounded-lg text-gray-500 border hover:bg-gray-50 transition"
                                disabled={loading}
                            >
                                <XMarkIcon className="w-5 h-5 inline-block mr-2" />
                                Annuler
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

/*"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from "next/navigation";
import { toast } from 'react-hot-toast';
import Select from '@/components/general/CustomSelect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { createAutocomplete } from "@/scripts/autocomplete";

// --- SERVICES & COMPONENTS ---
import { planningService } from '@/service/planningService';
import SearchCardFreelance from "@/components/search/SearchCardFreelance";
import {
    meetingPointOptions,
    driverType,
    tripIntention,
    tripType,
    paymentMethod,
    pricingMethod,
    languageOptions,
    paymentOptions,
    experienceOptions,
    sortOptions,
    amenitiesOptions,
    referringOptions,
    priceCategoryOptions,
} from "@/data/Structure";

const FreelanceSearchPage = () => {
    const searchParams = useSearchParams();
    const locationRef = useRef(null);
    const destinationRef = useRef(null);
    const currentDate = new Date();
    
    // États pour le formulaire de recherche principal
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [destination, setDestination] = useState(searchParams.get('destination') || '');
    const [iconsLoaded, setIconsLoaded] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    const [formData, setFormData] = useState({
        location: "",
        destination: "",
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        meetupPoint: "",
        driverType: '',
        tripType: '',
        preferredLanguage: '',
        tripIntention: '',
        experience: '',
        averageRating: '',
        pricingMethod: '',
        paymentMethod: ''
    });

    // États pour les filtres de la sidebar (style SearchResult)
    const [filters, setFilters] = useState({
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

    // États pour les données et le chargement
    const [allPlannings, setAllPlannings] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);

    // Initialisation Autocomplete
    useEffect(() => {
        const locationAutocomplete = createAutocomplete('location', (selectedValue) => {
            setLocation(selectedValue);
            setFormData(prev => ({ ...prev, location: selectedValue }));
        });
        const destinationAutocomplete = createAutocomplete('destination', (selectedValue) => {
            setDestination(selectedValue);
            setFormData(prev => ({ ...prev, destination: selectedValue }));
        });

        const timer = setTimeout(() => {
            setIconsLoaded(true);
        }, 100);

        return () => {
            clearTimeout(timer);
            if (locationAutocomplete && locationAutocomplete.destroy) locationAutocomplete.destroy();
            if (destinationAutocomplete && destinationAutocomplete.destroy) destinationAutocomplete.destroy();
        };
    }, []);

    // Chargement initial des plannings
    const loadPlannings = useCallback(async () => {
        setIsLoading(true);
        console.log("%c📡 [BACKEND] Tentative de récupération des plannings...", "color: #2196F3; font-weight: bold;");
        try {
            const data = await planningService.getPublishedPlannings();
            console.group("%c📥 [BACKEND DATA] Données reçues du serveur", "color: #4CAF50; font-weight: bold;");
            console.log("Nombre d'items bruts :", data.length);
            console.log("Détail des données :", data);
            console.groupEnd();

            const sorted = data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            setAllPlannings(sorted);
        } catch (error) {
            console.error("%c❌ [BACKEND ERROR] Erreur lors de la récupération :", "color: #F44336; font-weight: bold;", error);
            toast.error("Erreur de chargement des plannings.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPlannings();
    }, [loadPlannings]);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'location') setLocation(value);
        if (name === 'destination') setDestination(value);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        console.log(`%c🔧 [FRONTEND FILTER] Changement du filtre sidebar : ${name} =`, "color: #FF9800;", value);
    };

    // Filtrage combiné (recherche principale + filtres sidebar)
    const filteredPlannings = useMemo(() => {
        console.group("%c🖥️ [FRONTEND UI] Calcul du filtrage affiché", "color: #9C27B0; font-weight: bold;");
        let filtered = hasSearched ? searchResults : allPlannings;
        console.log("Liste de base avant filtres sidebar :", filtered.length, "items");
        console.log("Filtres sidebar actifs :", filters);

        // Filtres de la sidebar
        if (filters.startDate) {
            filtered = filtered.filter(p => new Date(p.startDate) >= filters.startDate);
        }
        if (filters.paymentType) {
            filtered = filtered.filter(p => p.paymentMethod === filters.paymentType);
        }
        if (filters.experience) {
            filtered = filtered.filter(p => p.driverExperience >= Number(filters.experience));
        }
        if (filters.preferredLanguage) {
            filtered = filtered.filter(p => p.languages?.includes(filters.preferredLanguage));
        }
        if (filters.priceCategory) {
            filtered = filtered.filter(p => p.priceCategory === filters.priceCategory);
        }
        
        console.log("%c✅ [UI DISPLAY] Données finales envoyées aux cartes :", "color: #4CAF50;", filtered);
        console.groupEnd();
        return filtered;
    }, [searchResults, allPlannings, filters, hasSearched]);

    const handleSearch = (e) => {
        e.preventDefault();
        console.group("%c🔍 [FRONTEND SEARCH] Lancement de la recherche principale", "color: #000; background: #FFEB3B; font-weight: bold;");
        console.log("Paramètres de recherche (Top Form) :", formData);

        let filtered = allPlannings;

        if (formData.location || location) {
            const query = (formData.location || location).toLowerCase();
            filtered = filtered.filter(p => 
                p.pickupLocation?.toLowerCase().includes(query) || 
                p.fullLocation?.toLowerCase().includes(query)
            );
        }
        if (formData.destination || destination) {
            const query = (formData.destination || destination).toLowerCase();
            filtered = filtered.filter(p => 
                p.dropoffLocation?.toLowerCase().includes(query)
            );
        }
        if (formData.startDate) {
            filtered = filtered.filter(p => new Date(p.startDate) >= formData.startDate);
        }
        if (formData.driverType) {
            filtered = filtered.filter(p => p.driverType === formData.driverType);
        }
        if (formData.tripIntention) {
            filtered = filtered.filter(p => p.tripIntention === formData.tripIntention);
        }
        if (formData.tripType) {
            filtered = filtered.filter(p => p.tripType === formData.tripType);
        }
        if (formData.preferredLanguage) {
            filtered = filtered.filter(p => p.languages?.includes(formData.preferredLanguage));
        }
        if (formData.experience) {
            filtered = filtered.filter(p => p.driverExperience >= Number(formData.experience));
        }
        if (formData.averageRating) {
            filtered = filtered.filter(p => p.rating >= Number(formData.averageRating));
        }

        console.log("Résultats après recherche :", filtered.length, "items correspondants");
        console.groupEnd();

        setSearchResults(filtered);
        setHasSearched(true);
        toast.success(`${filtered.length} résultat(s) trouvé(s)`);
    };

    const resetFilters = () => {
        console.log("%c🧹 [FRONTEND] Réinitialisation de tous les filtres", "color: #795548;");
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

    const isToday = (date) => {
        return date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear();
    };

    const getMinTime = (selectedDate) => {
        if (selectedDate && isToday(selectedDate)) {
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

    return (
        <div className="text p-2 md:pb-4 flex-col sm:flex-row gap-3 sm:gap-5 text-lg bg-gray-200">
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
                                        onChange={(e) => {
                                            setLocation(e.target.value);
                                            handleInputChange('location', e.target.value);
                                        }}
                                        placeholder="Select your location"
                                        className="pl-10 border rounded w-full"
                                    />
                                    {iconsLoaded && (
                                        <FontAwesomeIcon
                                            icon={faLocationCrosshairs}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            style={{ width: '15px', height: '15px' }}
                                        />
                                    )}
                                </div>

                                <div className="relative auto-search-wrapper w-full lg:w-3/4">
                                    <input
                                        type="text"
                                        id="destination"
                                        ref={destinationRef}
                                        value={destination}
                                        onChange={(e) => {
                                            setDestination(e.target.value);
                                            handleInputChange('destination', e.target.value);
                                        }}
                                        placeholder="Select your destination"
                                        className="pl-10 border rounded w-full"
                                    />
                                    {iconsLoaded && (
                                        <FontAwesomeIcon
                                            icon={faLocationCrosshairs}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            style={{ width: '15px', height: '15px' }}
                                        />
                                    )}
                                </div>

                                <Select
                                    options={driverType}
                                    placeholder="Driver type"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    isClearable
                                    onChange={(selectedOption) => handleInputChange('driverType', selectedOption?.value)}
                                />

                                <Select
                                    options={paymentMethod}
                                    placeholder="Payment Method"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    isClearable
                                    onChange={(selectedOption) => handleInputChange('paymentMethod', selectedOption?.value)}
                                />

                                <Select
                                    options={tripType}
                                    placeholder="Trip type"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    isClearable
                                    onChange={(selectedOption) => handleInputChange('tripType', selectedOption?.value)}
                                />

                                <Select
                                    options={meetingPointOptions}
                                    placeholder="Select meetup point"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    isClearable
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
                                            placeholderText="Select date"
                                            isClearable
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
                                            placeholderText="Select time"
                                            isClearable
                                            minTime={formData.startDate ? getMinTime(formData.startDate) : undefined}
                                            maxTime={formData.startDate ? new Date(formData.startDate.getFullYear(), formData.startDate.getMonth(), formData.startDate.getDate(), 23, 45) : undefined}
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
                                            placeholderText="Select date"
                                            isClearable
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
                                            placeholderText="Select time"
                                            isClearable
                                            minTime={formData.endDate && formData.startDate && formData.endDate > formData.startDate ?
                                                new Date(formData.endDate.getFullYear(), formData.endDate.getMonth(), formData.endDate.getDate(), 0, 0) :
                                                formData.startTime || undefined}
                                            maxTime={formData.endDate ? new Date(formData.endDate.getFullYear(), formData.endDate.getMonth(), formData.endDate.getDate(), 23, 45) : undefined}
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
                                    maxMenuHeight={180}
                                    isClearable
                                    onChange={(selectedOption) => handleInputChange('preferredLanguage', selectedOption?.value)}
                                />
                                <Select
                                    options={tripIntention}
                                    placeholder="Trip intention"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    maxMenuHeight={180}
                                    isClearable
                                    onChange={(selectedOption) => handleInputChange('tripIntention', selectedOption?.value)}
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
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
                                        value={formData.experience}
                                        onChange={(e) => handleInputChange('experience', e.target.value)}
                                    />
                                    <Select
                                        options={[1, 2, 3, 4, 5].map(n => ({ value: n, label: '⭐'.repeat(n) }))}
                                        placeholder="Average rating"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        maxMenuHeight={180}
                                        isClearable
                                        onChange={(selectedOption) => handleInputChange('averageRating', selectedOption?.value)}
                                    />
                                    <Select
                                        options={pricingMethod}
                                        placeholder="Pricing method"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        maxMenuHeight={180}
                                        isClearable
                                        onChange={(selectedOption) => handleInputChange('pricingMethod', selectedOption?.value)}
                                    />
                                </div>
                            )}

                            <div className="w-full flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-2 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-gray-800 flex items-center justify-center text w-full sm:w-auto"
                                >
                                    Find a driver
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                
                {isLoading ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 mt-4">Loading available drivers...</p>
                    </div>
                ) : hasSearched || filteredPlannings.length > 0 ? (
                    <div className="w-full text max-w-[1400px] mx-auto">
                        <div className="flex flex-col lg:flex-row gap-8">
                            
                            <div className="w-full lg:w-1/4">
                                <div className="bg-white rounded-2xl p-6">
                                    <h4 className="font-bold mb-2 border-b">Filter</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block font-medium text-gray-700">Start Date</label>
                                            <DatePicker
                                                selected={filters.startDate}
                                                onChange={(date) => handleFilterChange('startDate', date)}
                                                className="w-full px-6 border rounded-md"
                                                dateFormat="dd/MM/yyyy"
                                                minDate={currentDate}
                                                isClearable
                                            />
                                        </div>
                                        <div>
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
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700">End Date</label>
                                            <DatePicker
                                                selected={filters.endDate}
                                                onChange={(date) => handleFilterChange('endDate', date)}
                                                className="w-full px-6 border rounded-md"
                                                dateFormat="dd/MM/yyyy"
                                                minDate={filters.startDate || currentDate}
                                                isClearable
                                            />
                                        </div>
                                        <div>
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
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700">Priced Method</label>
                                            <Select
                                                options={paymentOptions}
                                                maxMenuHeight={150}
                                                value={paymentOptions.find(option => option.value === filters.paymentType)}
                                                onChange={(selectedOption) => handleFilterChange('paymentType', selectedOption?.value)}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-1">Experience</label>
                                            <Select
                                                options={experienceOptions}
                                                maxMenuHeight={80}
                                                value={experienceOptions.find(option => option.value === filters.experience)}
                                                onChange={(selectedOption) => handleFilterChange('experience', selectedOption?.value)}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-1">Sort By</label>
                                            <Select
                                                options={sortOptions}
                                                value={sortOptions.find(option => option.value === filters.sortBy)}
                                                onChange={(selectedOption) => handleFilterChange('sortBy', selectedOption?.value)}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-1">Amenities</label>
                                            <Select
                                                options={amenitiesOptions}
                                                isMulti
                                                maxMenuHeight={100}
                                                value={amenitiesOptions.filter(option => filters.amenities.includes(option.value))}
                                                onChange={(selectedOptions) => handleFilterChange('amenities', selectedOptions.map(option => option.value))}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-1">Refering By</label>
                                            <Select
                                                options={referringOptions}
                                                maxMenuHeight={150}
                                                value={referringOptions.find(option => option.value === filters.referringBy)}
                                                onChange={(selectedOption) => handleFilterChange('referringBy', selectedOption?.value)}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-700 mb-1">Price Category</label>
                                            <Select
                                                options={priceCategoryOptions}
                                                maxMenuHeight={150}
                                                value={priceCategoryOptions.find(option => option.value === filters.priceCategory)}
                                                onChange={(selectedOption) => handleFilterChange('priceCategory', selectedOption?.value)}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <Select
                                                options={languageOptions}
                                                value={languageOptions.find(option => option.value === filters.preferredLanguage)}
                                                placeholder="Preferred language"
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                maxMenuHeight={180}
                                                onChange={(selectedOption) => handleFilterChange('preferredLanguage', selectedOption?.value)}
                                                isClearable
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
                                        <p className="font-bold">{filteredPlannings.length}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {filteredPlannings.map((planning) => (
                                        <div key={planning.id} className="bg-white rounded-lg">
                                            
                                            <SearchCardFreelance 
                                                driverData={{
                                                    driver_id: planning.id || planning.authorId,
                                                    driver_profile_image: planning.authorImageUrl || '/img/default-avatar.jpeg',
                                                    driver_last_name: planning.authorName?.split(' ').slice(1).join(' ') || '',
                                                    driver_first_name: planning.authorName?.split(' ')[0] || 'Chauffeur',
                                                    driverLocation: planning.pickupLocation || '',
                                                    driver_experiences: planning.driverExperiences || ['Transport professionnel'],
                                                    driver_languages: planning.languages || ['Français'],
                                                    driver_specialities: planning.specialities || ['Conduite sécurisée'],
                                                    driver_keywords: planning.keywords || ['Ponctuel', 'Professionnel'],
                                                    driver_availability_table: planning.availabilities || [],
                                                    driver_portfolio: planning.portfolio || [],
                                                    driver_reviews: planning.reviews || planning.comments || [], // Changé de comments à driver_reviews
                                                    Description: planning.description || '',
                                                    has_vehicle: true, // ou planning.hasVehicle
                                                    driver_email: planning.authorEmail || '',
                                                    driver_phone_number: planning.authorPhone || '',
                                                    driver_statistics: {
                                                        average_rating: planning.rating || 4.5,
                                                        review_total_number: planning.reviewCount || 0
                                                    }
                                                }}
                                                vehicleData={{
                                                    total_seat_number: planning.seats || 4,
                                                    luggage_max_capacity: planning.luggageCapacity || 50,
                                                    mileage_at_mileage_since_commissioning: planning.mileage || 0,
                                                    fuel_type_name: planning.fuelType || 'Essence',
                                                    transmission_type_name: planning.transmission || 'Manuelle',
                                                    images: planning.vehicleImages || planning.images || [
                                                        { url: '/home/clement/Documents/5GI ProjetOBAMAClement/ProjetDe synthese/NewFront/freelance_web_front/public/9.jpg', alt: 'Vehicle' }
                                                    ],
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="lg:mb-[15rem]"></div>

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

                .react-datepicker-wrapper, 
                .react-datepicker__input-container, 
                .react-datepicker__input-container input {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default FreelanceSearchPage; */