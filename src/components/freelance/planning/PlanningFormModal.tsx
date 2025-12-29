import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { planningService } from '@/service/planningService';
import { Planning } from '@/type/planning';
import { UserSessionContext } from '@/type/profile';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    planningToEdit: Planning | null;
    onSuccess: () => void;
    user: UserSessionContext | null;
}

export default function PlanningFormModal({ isOpen, onClose, planningToEdit, onSuccess, user }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Planning>>({
        title: '',
        pickupLocation: '',
        dropoffLocation: '',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endDate: new Date().toISOString().split('T')[0],
        endTime: '18:00',
        regularAmount: '',
        discountPercentage: '0',
        paymentOption: 'fixed',
        status: 'Draft'
    });

    useEffect(() => {
        if (planningToEdit) {
            setFormData(planningToEdit);
        }
    }, [planningToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Calcul montant réduit
        const regular = parseFloat(formData.regularAmount || '0');
        const discount = parseFloat(formData.discountPercentage || '0');
        const discounted = (regular * (1 - discount / 100)).toFixed(2);

        const payload = {
            ...formData,
            discountedAmount: discounted,
            clientId: user?.userId,
            clientName: user?.driverProfile?.firstName || 'Chauffeur',
            clientPhoneNumber: user?.driverProfile?.phoneNumber,
            // Assurer que le statut est conservé en édition, sinon Draft par défaut en création
            status: planningToEdit ? formData.status : 'Draft', 
        };

        try {
            if (planningToEdit && planningToEdit.id) {
                await planningService.updatePlanning(planningToEdit.id, payload);
                toast.success("Planning mis à jour !");
            } else {
                await planningService.createPlanning(payload);
                toast.success("Planning créé !");
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la sauvegarde.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {planningToEdit ? "Modifier le Planning" : "Nouveau Planning"}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ex: Trajet Douala - Yaoundé"
                        />
                    </div>

                    {/* Locations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                            <input
                                name="pickupLocation"
                                value={formData.pickupLocation}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée</label>
                            <input
                                name="dropoffLocation"
                                value={formData.dropoffLocation}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Dates & Heures */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Date Début</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Heure Début</label>
                            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Date Fin</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Heure Fin</label>
                            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                        </div>
                    </div>

                    {/* Prix */}
                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Tarification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type de prix</label>
                                <select name="paymentOption" value={formData.paymentOption} onChange={handleChange} className="w-full p-2 border rounded-lg">
                                    <option value="fixed">Prix Fixe</option>
                                    <option value="per_km">Par Km</option>
                                    <option value="per_hour">Par Heure</option>
                                    <option value="per_day">Par Jour</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
                                <input type="number" name="regularAmount" value={formData.regularAmount} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="0" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Réduction (%)</label>
                                <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="0" />
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Annuler
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}