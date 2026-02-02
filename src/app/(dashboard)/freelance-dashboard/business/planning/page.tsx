"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// SERVICES & TYPES
import { planningService } from '@/service/planningService';
import { Planning } from '@/type/planning';
import { useAuthContext } from '@/components/context/authContext';

// COMPOSANTS
import PlanningCard from '@/components/freelance/planning/PlanningCard';
import PlanningFormModal from '@/components/freelance/planning/PlanningFormModal'; // On va le créer juste après
import EmptyJumbotron from '@/components/EmptyJumbotron';

// ONGLETS DE STATUT
const STATUS_TABS = [
    { id: 'All', label: 'Tous', color: 'bg-blue-600' },
    { id: 'Draft', label: 'Draft', color: 'bg-gray-500' },
    { id: 'Published', label: 'Published', color: 'bg-green-600' },
    { id: 'PendingConfirmation', label: 'Pending', color: 'bg-yellow-500' },
    { id: 'PendingDriverConfirmation', label: 'Driver Pending', color: 'bg-yellow-500' },
    { id: 'Confirmed', label: 'Confirmed', color: 'bg-blue-500' },
    { id: 'Ongoing', label: 'Ongoing', color: 'bg-orange-500' },
    { id: 'Terminated', label: 'Terminated', color: 'bg-gray-600' },
    { id: 'Expired', label: 'Expired', color: 'bg-gray-400' }
];

const Page = () => {
    const { user } = useAuthContext();
    const [plannings, setPlannings] = useState<Planning[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // États pour la modale
    const [showModal, setShowModal] = useState(false);
    const [selectedPlanning, setSelectedPlanning] = useState<Planning | null>(null);

    // Chargement des données
    const loadPlannings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await planningService.getMyPlannings();
            setPlannings(data);
        } catch (error) {
            console.error("Erreur chargement plannings", error);
            toast.error("Impossible de charger vos plannings.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPlannings();
    }, [loadPlannings]);

    // Filtrage local
    const filteredPlannings = plannings.filter(p => {
        const matchesTab = activeTab === 'All' || p.status === activeTab;
        const matchesSearch = searchQuery === '' || 
          (p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.departureLocation?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    // Actions
    const handleAddNew = () => {
        setSelectedPlanning(null);
        setShowModal(true);
    };

    const handleModify = (data: Planning) => {
        setSelectedPlanning(data);
        setShowModal(true);
    };

    const handlePublish = async (data: Planning, action: 'publish' | 'unpublish') => {
        const newStatus = action === 'publish' ? 'Published' : 'Draft';
        // Optimistic update
        setPlannings(prev => prev.map(p => p.id === data.id ? { ...p, status: newStatus } : p));
        
        try {
            const {
                id,
                orgId,
                clientId,
                clientName,
                clientPhoneNumber,
                profileImageUrl,
                reservedById,
                paymentMethod,
                createdAt,
                updatedAt,
                metadata,
                reviewableType,
                reactableType,
                reviewableId,
                reactableId,
                averageRating,
                reactionCounts,
                assetId,
                ownerId,
                ...payload
            } = data;
            await planningService.updatePlanning(data.id, { ...payload, status: newStatus });
            toast.success(action === 'publish' ? 'Planning publié !' : 'Planning retiré.');
        } catch (error) {
            toast.error("Erreur lors de la mise à jour.");
            loadPlannings(); // Revert on error
        }
    };

    const handleDelete = async (data: Planning) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce planning ?")) return;
        
        try {
            await planningService.deletePlanning(data.id);
            setPlannings(prev => prev.filter(p => p.id !== data.id));
            toast.success("Planning supprimé.");
        } catch (error) {
            toast.error("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Planning Management</h1>
                <button 
                    onClick={handleAddNew}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                    <PlusIcon className="w-5 h-5 mr-2" /> New Planning
                </button>
            </div>

            {/* Barre de recherche et Filtres */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search a planning..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                                ${activeTab === tab.id 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Liste */}
            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : filteredPlannings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlannings.map(planning => (
                        <PlanningCard 
                            key={planning.id} 
                            data={planning}
                            onModify={handleModify}
                            onPublish={handlePublish}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <EmptyJumbotron 
                    title="No planning" 
                    message="You have no plannings matching your criteria." 
                />
            )}

            {/* Modale Formulaire */}
            {showModal && (
                <PlanningFormModal 
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    planningToEdit={selectedPlanning}
                    onSuccess={loadPlannings}
                    user={user}
                />
            )}
        </div>
    );
}

export default Page;