"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// SERVICES
import { announcementService, PublicOfferView, mapProductToPublicView } from '@/service/announcementService';
import { socketService } from '@/service/socketService';

// COMPOSANTS
import { AnnouncementCard } from '@/components/freelance/business/AnnouncementCard';
import { ClientFilterModal } from '@/components/ClientFilterModal'; // On réutilise le filtre client car la logique est la même
import EmptyJumbotron from '@/components/EmptyJumbotron';

// TYPES LOCAUX POUR LE FILTRE
interface FilterState {
    pickupLocation?: string;
    dropoffLocation?: string;
    startDate?: string;
    maxCost?: number;
    isNegotiable?: boolean;
    paymentMethod?: string;
}

const OrdersPage = () => {
  const [announcements, setAnnouncements] = useState<PublicOfferView[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<PublicOfferView[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // États pour les filtres
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({});

  // 1. Chargement initial
  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const data = await announcementService.getPublishedAnnouncements();
      // Tri par date de création (plus récent en premier)
      const sorted = data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setAnnouncements(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Error loading offers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();

    // 2. Configuration WebSockets (Exactement comme sur mobile)
    const handleNewAnnouncement = (product: any) => {
        if (product.status === 'Published') {
            const newView = mapProductToPublicView(product);
            setAnnouncements(prev => {
                if (!prev.some(p => p.id === newView.id)) {
                    return [newView, ...prev];
                }
                return prev;
            });
            toast.success("New offer available!");
        }
    };

    const handleUpdateAnnouncement = (product: any) => {
        const updatedView = mapProductToPublicView(product);
        setAnnouncements(prev => {
            // Si plus publié, on retire
            if (product.status !== 'Published') {
                return prev.filter(p => p.id !== updatedView.id);
            }
            // Sinon on met à jour
            return prev.map(p => p.id === updatedView.id ? updatedView : p);
        });
    };

    const handleDeleteAnnouncement = (data: { id: string }) => {
        setAnnouncements(prev => prev.filter(p => p.id !== data.id));
    };

    // Abonnement
    socketService.onNewAnnouncement(handleNewAnnouncement);
    socketService.onUpdateAnnouncement(handleUpdateAnnouncement);
    socketService.onDeleteAnnouncement(handleDeleteAnnouncement);

    // Désabonnement
    return () => {
        // En théorie, socketService devrait avoir des méthodes 'off', 
        // ou on peut garder la connexion ouverte.
    };
  }, [loadAnnouncements]);

  // 3. Logique de Filtrage (Search + Filters)
  useEffect(() => {
    let result = announcements;

    // A. Recherche textuelle
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(item => 
            (item.fullLocation || "").toLowerCase().includes(lowerQuery) ||
            (item.title || "").toLowerCase().includes(lowerQuery) ||
            (item.authorName || "").toLowerCase().includes(lowerQuery)
        );
    }

    // B. Filtres avancés
    if (Object.keys(activeFilters).length > 0) {
        result = result.filter(item => {
            const f = activeFilters;
            const matchesPickup = !f.pickupLocation || (item.pickupLocation || "").toLowerCase().includes(f.pickupLocation.toLowerCase());
            const matchesDropoff = !f.dropoffLocation || (item.dropoffLocation || "").toLowerCase().includes(f.dropoffLocation.toLowerCase());
            const matchesDate = !f.startDate || (item.startDate && new Date(item.startDate) >= new Date(f.startDate));
            const matchesPrice = !f.maxCost || (item.cost <= f.maxCost);
            const matchesNeg = f.isNegotiable === undefined || item.isNegotiable === f.isNegotiable;
            
            return matchesPickup && matchesDropoff && matchesDate && matchesPrice && matchesNeg;
        });
    }

    setFilteredAnnouncements(result);
  }, [searchQuery, announcements, activeFilters]);


  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setIsFilterModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Transport Offers (Orders)</h1>
            <p className='text-gray-500 text-sm mt-1'>Browse client requests and offer your services.</p>
        </div>
      </div>

      {/* Barre de Recherche et Filtre */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <input 
                type="text" 
                placeholder="Search for a city, a client..." 
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-5 h-5" />
                </button>
            )}
        </div>
        
        {/* On réutilise le composant ClientFilterModal en mode "bouton seul" pour déclencher l'ouverture */}
        <div className="w-full md:w-auto">
            <ClientFilterModal
                isVisible={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                initialFilters={activeFilters}
                hasActiveFilters={Object.keys(activeFilters).length > 0}
                onToggleModal={() => setIsFilterModalOpen(true)}
                filteredCount={filteredAnnouncements.length}
            />
        </div>
      </div>

      {/* Liste des Résultats */}
      {loading ? (
         <div className="text-center py-20 text-gray-500">Loading offers...</div>
      ) : filteredAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map(order => (
                <AnnouncementCard 
                    key={order.id}
                    item={order}
                    onActionCompleted={loadAnnouncements}
                />
            ))}
        </div>
      ) : (
        <EmptyJumbotron 
            title="No offers" 
            message="There are no client offers matching your criteria at the moment." 
        />
      )}
    </div>
  );
}

export default OrdersPage;