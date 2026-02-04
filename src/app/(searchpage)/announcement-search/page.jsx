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
        <div className="text p-2 md:pb-4 flex-col sm:flex-row gap-3 sm:gap-5 text-lg bg-gray-200 min-h-screen">
            <div className="container mx-auto p-6 font-inter">
                <div className="mb-5 text-center">
                    <h1 className="font-bold bigtitle text-black mb-3">
                        Trouvez des Clients à Transporter
                    </h1>
                    <h2 className="title text-black font-medium leading-tight">
                        Parcourez les annonces des clients et postulez
                    </h2>
                </div>

                {/* Formulaire de recherche */}
                <form onSubmit={handleSearch} className="mb-8 bg-white p-6 rounded-xl shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Location */}
                        <div className="relative auto-search-wrapper">
                            <input
                                type="text"
                                id="location"
                                ref={locationRef}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Lieu de départ"
                                className="pl-10 border rounded w-full py-2"
                            />
                            {iconsLoaded && (
                                <FontAwesomeIcon
                                    icon={faLocationCrosshairs}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    style={{ width: '15px', height: '15px' }}
                                />
                            )}
                        </div>

                        {/* Destination */}
                        <div className="relative auto-search-wrapper">
                            <input
                                type="text"
                                id="destination"
                                ref={destinationRef}
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Destination"
                                className="pl-10 border rounded w-full py-2"
                            />
                            {iconsLoaded && (
                                <FontAwesomeIcon
                                    icon={faLocationCrosshairs}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    style={{ width: '15px', height: '15px' }}
                                />
                            )}
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2">
                            <label className="whitespace-nowrap font-medium text-sm">À partir du:</label>
                            <DatePicker
                                minDate={currentDate}
                                selected={formData.startDate}
                                onChange={(date) => handleInputChange('startDate', date)}
                                dateFormat="dd/MM/yyyy"
                                className="px-2 border rounded w-full py-2"
                            />
                        </div>

                        {/* Budget max */}
                        <div className="flex items-center gap-2">
                            <label className="whitespace-nowrap font-medium text-sm">Budget max:</label>
                            <input
                                type="number"
                                placeholder="XAF"
                                value={formData.maxCost}
                                onChange={(e) => handleInputChange('maxCost', e.target.value)}
                                className="px-2 border rounded w-full py-2"
                            />
                        </div>
                    </div>

                    {/* Boutons de recherche */}
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5" />
                                {isLoading ? 'Recherche...' : 'Rechercher'}
                            </button>
                            <button
                                type="button"
                                onClick={loadAllAnnouncements}
                                disabled={isLoading}
                                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Voir toutes les annonces
                            </button>
                        </div>

                        {/* Toggle Vue */}
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setViewMode('map')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    viewMode === 'map' 
                                        ? 'bg-orange-500 text-white' 
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <MapIcon className="w-5 h-5" />
                                Carte
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-orange-500 text-white' 
                                        : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <ListBulletIcon className="w-5 h-5" />
                                Liste
                            </button>
                        </div>
                    </div>
                </form>

                {/* Résultats */}
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {searchResults.length} annonce(s) disponible(s)
                    </h3>
                </div>

                {/* Vue Carte */}
                {viewMode === 'map' && (
                    <div className="mb-8">
                        <AnnouncementMapNavigoo
                            announcements={searchResults}
                            onAnnouncementSelect={handleAnnouncementSelect}
                            className="h-[500px]"
                        />
                    </div>
                )}

                {/* Vue Liste */}
                {viewMode === 'list' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isLoading ? (
                            <div className="col-span-full flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <p className="text-lg">Aucune annonce trouvée</p>
                                <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
                            </div>
                        ) : (
                            searchResults.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="p-4">
                                        {/* Header avec avatar */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <img
                                                src={announcement.authorImageUrl || '/dark_avatar.svg'}
                                                alt={announcement.authorName}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-800">
                                                    {announcement.authorName || 'Client'}
                                                </h4>
                                                <p className="text-xs text-gray-500">
                                                    {announcement.startDate} à {announcement.startTime}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Trajet */}
                                        <div className="mb-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                <span className="font-medium">{announcement.pickupLocation}</span>
                                            </div>
                                            <div className="ml-1 border-l-2 border-dashed border-gray-300 h-4"></div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                <span className="font-medium">{announcement.dropoffLocation}</span>
                                            </div>
                                        </div>

                                        {/* Infos supplémentaires */}
                                        {announcement.baggageInfo && (
                                            <p className="text-xs text-gray-500 mb-2">
                                                🧳 {announcement.baggageInfo}
                                            </p>
                                        )}

                                        {/* Prix et actions */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div>
                                                <span className="text-xl font-bold text-green-600">
                                                    {announcement.cost} XAF
                                                </span>
                                                {announcement.isNegotiable && (
                                                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                        Négociable
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleApply(announcement.id)}
                                                className="bg-orange-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-orange-600 transition-colors"
                                            >
                                                Postuler
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
