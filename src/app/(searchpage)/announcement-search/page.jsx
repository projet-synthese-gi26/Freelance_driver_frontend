"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Select from '@/components/general/CustomSelect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from "next/navigation";
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createAutocomplete } from "@/scripts/autocomplete"
import dynamic from 'next/dynamic';

import {
    meetingPointOptions,
    tripIntention,
    tripType,
    paymentMethod,
    pricingMethod,
} from "@/data/Structure";
import { MagnifyingGlassIcon, MapIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { announcementService, PublicOfferView } from '@/service/announcementService';
import { toast } from 'react-hot-toast';
import { socketService } from '@/service/socketService';

// Import dynamique du composant carte pour éviter les erreurs SSR
const AnnouncementMapNavigoo = dynamic(
    () => import('@/components/search/AnnouncementMapNavigoo'),
    { 
        ssr: false,
        loading: () => (
            <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
            </div>
        )
    }
);

const AnnouncementSearch = () => {
    const router = useRouter();
    const locationRef = useRef(null);
    const destinationRef = useRef(null);
    const currentDate = new Date();

    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [iconsLoaded, setIconsLoaded] = useState(false);
    const [viewMode, setViewMode] = useState('map'); // 'map' ou 'list'
    const [formData, setFormData] = useState({
        location: "",
        destination: "",
        startDate: new Date(),
        endDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        tripType: '',
        tripIntention: '',
        paymentMethod: '',
        pricingMethod: '',
        maxCost: ''
    });

    // Charger toutes les annonces au chargement de la page
    const loadAllAnnouncements = useCallback(async () => {
        setIsLoading(true);
        try {
            const allAnnouncements = await announcementService.getPublishedAnnouncements();
            setSearchResults(allAnnouncements);
        } catch (error) {
            console.error("Error loading announcements:", error);
            toast.error("Erreur lors du chargement des annonces.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Charger les annonces au démarrage
        loadAllAnnouncements();

        // Setup autocomplete
        const locationAutocomplete = createAutocomplete('location', (selectedValue) => {
            setLocation(selectedValue);
        });
        const destinationAutocomplete = createAutocomplete('destination', (selectedValue) => {
            setDestination(selectedValue);
        });

        // Icons loading
        const timer = setTimeout(() => {
            setIconsLoaded(true);
        }, 100);

        // Setup WebSocket for real-time updates
        const handleNewAnnouncement = (product) => {
            if (product.status === 'Published') {
                const newView = {
                    id: product.id,
                    title: product.name || 'Annonce',
                    pickupLocation: product.pickupLocation || '',
                    dropoffLocation: product.dropoffLocation || '',
                    fullLocation: `${product.pickupLocation} → ${product.dropoffLocation}`,
                    cost: product.defaultSellPrice || 0,
                    startDate: product.startDate || '',
                    startTime: product.startTime || '',
                    authorName: product.authorName || 'Client',
                    authorImageUrl: product.authorProfileImageUrl || undefined,
                    isNegotiable: product.isNegotiable || false,
                    status: product.status
                };
                setSearchResults(prev => {
                    if (!prev.some(p => p.id === newView.id)) {
                        return [newView, ...prev];
                    }
                    return prev;
                });
                toast.success("Nouvelle annonce disponible !");
            }
        };

        socketService.addListener('announcement:created', handleNewAnnouncement);

        return () => {
            clearTimeout(timer);
            if (locationAutocomplete && locationAutocomplete.destroy) locationAutocomplete.destroy();
            if (destinationAutocomplete && destinationAutocomplete.destroy) destinationAutocomplete.destroy();
            socketService.removeListener('announcement:created', handleNewAnnouncement);
        };
    }, [loadAllAnnouncements]);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const allAnnouncements = await announcementService.getPublishedAnnouncements();
            
            const filtered = allAnnouncements.filter(a => {
                let match = true;
                
                // Filter by location
                if (location) {
                    const loc = location.toLowerCase();
                    if (!a.pickupLocation?.toLowerCase().includes(loc)) {
                        match = false;
                    }
                }
                
                // Filter by destination
                if (destination) {
                    const dest = destination.toLowerCase();
                    if (!a.dropoffLocation?.toLowerCase().includes(dest)) {
                        match = false;
                    }
                }
                
                // Filter by Start Date
                if (formData.startDate) {
                    const announcementDate = new Date(a.startDate);
                    const searchDate = new Date(formData.startDate);
                    if (announcementDate.setHours(0,0,0,0) < searchDate.setHours(0,0,0,0)) {
                        match = false;
                    }
                }

                // Filter by max cost
                if (formData.maxCost) {
                    if (a.cost > Number(formData.maxCost)) {
                        match = false;
                    }
                }

                return match;
            });

            setSearchResults(filtered);
            toast.success(`${filtered.length} annonce(s) trouvée(s).`);
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Erreur lors de la recherche.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnnouncementSelect = (announcement) => {
        // Naviguer vers la page de détail de l'annonce ou postuler directement
        // Pour l'instant, on peut ouvrir une modal ou rediriger
        console.log("Annonce sélectionnée:", announcement);
        // Optionnel: router.push(`/announcement-details/${announcement.id}`);
    };

    const handleApply = async (announcementId) => {
        try {
            await announcementService.applyToAnnouncement(announcementId);
            toast.success("Candidature envoyée avec succès !");
        } catch (error) {
            console.error("Apply error:", error);
            toast.error("Erreur lors de la candidature.");
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <div className="container mx-auto px-4 py-8 font-inter">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                        {searchResults.length} annonces disponibles en temps réel
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        🚗 Trouvez des Clients à Transporter
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Parcourez les annonces des clients et postulez pour des courses rentables
                    </p>
                </div>

                {/* Formulaire de recherche - Design modernisé */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <span className="text-lg">📍</span> Lieu de départ
                                </label>
                                <div className="relative auto-search-wrapper">
                                    <input
                                        type="text"
                                        id="location"
                                        ref={locationRef}
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Ex: Douala, Bonanjo..."
                                        className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-gray-50 hover:bg-white"
                                    />
                                    {iconsLoaded && (
                                        <FontAwesomeIcon
                                            icon={faLocationCrosshairs}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500"
                                            style={{ width: '18px', height: '18px' }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <span className="text-lg">🎯</span> Destination
                                </label>
                                <div className="relative auto-search-wrapper">
                                    <input
                                        type="text"
                                        id="destination"
                                        ref={destinationRef}
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder="Ex: Yaoundé, Bastos..."
                                        className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-gray-50 hover:bg-white"
                                    />
                                    {iconsLoaded && (
                                        <FontAwesomeIcon
                                            icon={faLocationCrosshairs}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500"
                                            style={{ width: '18px', height: '18px' }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <span className="text-lg">📅</span> À partir du
                                </label>
                                <DatePicker
                                    minDate={currentDate}
                                    selected={formData.startDate}
                                    onChange={(date) => handleInputChange('startDate', date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-white cursor-pointer"
                                />
                            </div>

                            {/* Budget max */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <span className="text-lg">💰</span> Budget minimum (XAF)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ex: 5000"
                                    value={formData.maxCost}
                                    onChange={(e) => handleInputChange('maxCost', e.target.value)}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-gray-50 hover:bg-white"
                                />
                            </div>
                        </div>

                        {/* Boutons de recherche et toggle vue */}
                        <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-8 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                    {isLoading ? 'Recherche...' : 'Rechercher'}
                                </button>
                                <button
                                    type="button"
                                    onClick={loadAllAnnouncements}
                                    disabled={isLoading}
                                    className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border-2 border-gray-200 hover:border-gray-300"
                                >
                                    🔄 Toutes les annonces
                                </button>
                            </div>

                            {/* Toggle Vue - Design amélioré */}
                            <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('map')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                                        viewMode === 'map' 
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-white hover:text-gray-800'
                                    }`}
                                >
                                    <MapIcon className="w-5 h-5" />
                                    Carte
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                                        viewMode === 'list' 
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-white hover:text-gray-800'
                                    }`}
                                >
                                    <ListBulletIcon className="w-5 h-5" />
                                    Liste
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Résultats - Header amélioré */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-800">
                            Annonces disponibles
                        </h3>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {searchResults.length}
                        </span>
                    </div>
                </div>

                {/* Vue Carte */}
                {viewMode === 'map' && (
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                        <AnnouncementMapNavigoo
                            announcements={searchResults}
                            onAnnouncementSelect={handleAnnouncementSelect}
                            className="h-[500px]"
                        />
                    </div>
                )}

                {/* Vue Liste - Design amélioré */}
                {viewMode === 'list' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-14 w-14 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
                                <p className="text-gray-500 font-medium">Chargement des annonces...</p>
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="col-span-full text-center py-16">
                                <div className="bg-orange-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">📭</span>
                                </div>
                                <p className="text-xl font-semibold text-gray-700 mb-2">Aucune annonce trouvée</p>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Essayez de modifier vos critères de recherche ou consultez toutes les annonces disponibles
                                </p>
                            </div>
                        ) : (
                            searchResults.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1"
                                >
                                    <div className="p-5">
                                        {/* Header avec avatar */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="relative">
                                                <img
                                                    src={announcement.authorImageUrl || '/dark_avatar.svg'}
                                                    alt={announcement.authorName}
                                                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-orange-200 transition-all"
                                                />
                                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-800 text-lg">
                                                    {announcement.authorName || 'Client'}
                                                </h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <span>📅</span> {announcement.startDate} à {announcement.startTime}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Trajet - Design amélioré */}
                                        <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl p-4 mb-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex flex-col items-center">
                                                    <span className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-100"></span>
                                                    <div className="w-0.5 h-8 bg-gradient-to-b from-green-500 to-red-500 my-1"></div>
                                                    <span className="w-3 h-3 bg-red-500 rounded-full ring-4 ring-red-100"></span>
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase font-semibold">Départ</p>
                                                        <p className="font-medium text-gray-800">{announcement.pickupLocation}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase font-semibold">Arrivée</p>
                                                        <p className="font-medium text-gray-800">{announcement.dropoffLocation}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Infos supplémentaires */}
                                        {announcement.baggageInfo && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-blue-50 px-3 py-2 rounded-lg">
                                                <span>🧳</span>
                                                <span>{announcement.baggageInfo}</span>
                                            </div>
                                        )}

                                        {/* Prix et actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                    {announcement.cost?.toLocaleString()} XAF
                                                </span>
                                                {announcement.isNegotiable && (
                                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                                                        💬 Négociable
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleApply(announcement.id)}
                                                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 px-5 rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                            >
                                                Postuler ✨
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementSearch;
