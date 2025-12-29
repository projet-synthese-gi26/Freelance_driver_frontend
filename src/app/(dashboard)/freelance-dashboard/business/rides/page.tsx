"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// SERVICES
import { announcementService, PublicOfferView } from '@/service/announcementService';

// COMPOSANTS
import { AnnouncementCard } from '@/components/freelance/business/AnnouncementCard';
import { ClientFilterModal } from '@/components/ClientFilterModal'; 
import EmptyJumbotron from '@/components/EmptyJumbotron';

// TYPES
interface FilterState {
    pickupLocation?: string;
    dropoffLocation?: string;
    startDate?: string;
    maxCost?: number;
    isNegotiable?: boolean;
    paymentMethod?: string;
}

const RidesPage = () => {
  const [rides, setRides] = useState<PublicOfferView[]>([]);
  const [filteredRides, setFilteredRides] = useState<PublicOfferView[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Specific state to track which card is being cancelled
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Filter states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({});

  // 1. Load accepted rides
  const loadRides = useCallback(async () => {
    setLoading(true);
    try {
      const data = await announcementService.getMyAcceptedRides();
      // Sort by date (newest first)
      const sorted = data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setRides(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Error loading your rides.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRides();
  }, [loadRides]);

  // 2. Handle cancellation
  const handleCancelRide = async (announcementId: string) => {
      if(!confirm("Are you sure you want to cancel this ride? This will affect your reliability rating.")) return;
      
      setCancellingId(announcementId); 
      setIsCancelling(true);

      try {
          await announcementService.cancelPostulation(announcementId);
          toast.success("Ride cancelled successfully.");
          await loadRides(); // Reload list
      } catch (error: any) {
          console.error(error);
          const msg = error.response?.data?.message || "Error cancelling the ride.";
          toast.error(msg);
      } finally {
          setIsCancelling(false);
          setCancellingId(null);
      }
  };

  // 3. Filtering logic
  useEffect(() => {
    let result = rides; 

    // A. Text Search
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(item => 
            (item.fullLocation || "").toLowerCase().includes(lowerQuery) ||
            (item.title || "").toLowerCase().includes(lowerQuery) ||
            (item.authorName || "").toLowerCase().includes(lowerQuery)
        );
    }

    // B. Advanced Filters
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

    setFilteredRides(result);
  }, [searchQuery, rides, activeFilters]);

  // Filter Handlers
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
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Rides (Accepted)</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Manage the rides you have accepted or applied for.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <input 
                type="text" 
                placeholder="Search by destination, client..." 
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors">
                    <XMarkIcon className="w-5 h-5" />
                </button>
            )}
        </div>
        
        <div className="w-full md:w-auto">
            <ClientFilterModal
                isVisible={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                initialFilters={activeFilters}
                hasActiveFilters={Object.keys(activeFilters).length > 0}
                onToggleModal={() => setIsFilterModalOpen(true)}
                filteredCount={filteredRides.length}
            />
        </div>
      </div>

      {/* Results List */}
      {loading ? (
         <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             <span className="ml-3 text-gray-500">Loading your rides...</span>
         </div>
      ) : filteredRides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRides.map(ride => (
                <AnnouncementCard 
                    key={ride.id}
                    item={ride}
                    onActionCompleted={loadRides}
                    onCancelRide={handleCancelRide}
                    // Check if the current ID is the one being cancelled
                    isCancelling={cancellingId === ride.id} 
                    mode="offers" // Sets the card to 'My Offers' mode (cancellation enabled)
                />
            ))}
        </div>
      ) : (
        <EmptyJumbotron 
            title="No ongoing rides" 
            message="You haven't accepted any rides or applied for any yet." 
            icon="/img/car-placeholder.png"
        />
      )}
    </div>
  );
}

export default RidesPage;