import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { planningService } from '@/service/planningService';
import { Planning, PlanningPayload, PaymentOption, PricingMethod, TripIntention, TripType } from '@/type/planning';
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
    const [formData, setFormData] = useState<PlanningPayload>({
        title: '',
        departureLocation: '',
        dropoffLocation: '',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endDate: new Date().toISOString().split('T')[0],
        endTime: '18:00',
        tripType: 'ONE_WAY',
        meetupPoint: '',
        tripIntention: 'PASSENGERS',
        pricingMethod: 'FIXED',
        negotiable: true,
        paymentOption: 'CASH',
        regularAmount: '0',
        discountPercentage: '0',
        discountedAmount: '0',
        status: 'Draft',
    });


    useEffect(() => {
        if (planningToEdit) {
            const { id, orgId, clientId, clientName, clientPhoneNumber, profileImageUrl, reservedById, paymentMethod, createdAt, updatedAt, metadata, reviewableType, reactableType, reviewableId, reactableId, averageRating, reactionCounts, assetId, ownerId, ...payload } = planningToEdit;
            const toDateInput = (value?: string) => (value ? value.split('T')[0] : '');
            const toTimeInput = (value?: string) => (value ? value.slice(0, 5) : '');
            setFormData({
                ...payload,
                startDate: toDateInput(payload.startDate),
                endDate: toDateInput(payload.endDate),
                startTime: toTimeInput(payload.startTime),
                endTime: toTimeInput(payload.endTime),
            });
        }
    }, [planningToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formatTime = (value: string) => (value && value.length === 5 ? `${value}:00` : value);
        const toOffsetDateTime = (dateValue: string, timeValue: string) => {
            if (!dateValue || !timeValue) return '';
            const iso = new Date(`${dateValue}T${formatTime(timeValue)}`).toISOString();
            return iso;
        };

        const now = new Date();
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        // Backend: CreatePlanningRequest.startDate est annoté @Future => doit être strictement dans le futur.
        const startDateTime = new Date(`${formData.startDate}T${formatTime(formData.startTime)}`);
        if (Number.isNaN(startDateTime.getTime())) {
            toast.error("Invalid start date/time.");
            setLoading(false);
            return;
        }
        if (startDateTime <= now) {
            toast.error("Start date/time must be in the future.");
            setLoading(false);
            return;
        }
        if (endDate < startDate) {
            toast.error("End date cannot be before start date.");
            setLoading(false);
            return;
        }

        // Calcul montant réduit
        const regular = parseFloat(formData.regularAmount || '0');
        const discount = parseFloat(formData.discountPercentage || '0');
        const discounted = (regular * (1 - discount / 100)).toFixed(2);

        const payload: PlanningPayload = {
            ...formData,
            startDate: toOffsetDateTime(formData.startDate, formData.startTime),
            endDate: toOffsetDateTime(formData.endDate, formData.endTime),
            startTime: formatTime(formData.startTime),
            endTime: formatTime(formData.endTime),
            discountedAmount: discounted,
            status: planningToEdit ? formData.status : 'Draft',
        };
        console.log("▶️ [PlanningFormModal] Payload create/update:", payload);

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
        } catch (error: any) {
            const status = error?.response?.status;
            const data = error?.response?.data;
            console.error("❌ [PlanningFormModal] Save failed (raw)", error);
            console.error("❌ [PlanningFormModal] Save failed (details)", {
                message: error?.message,
                name: error?.name,
                code: error?.code,
                status,
                data,
                url: error?.config?.url,
                method: error?.config?.method,
            });
            toast.error(status ? `Erreur lors de la sauvegarde (${status}).` : "Erreur lors de la sauvegarde.");
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
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                            <input
                                name="departureLocation"
                                value={formData.departureLocation}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: Melen / Yaoundé"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Arrival</label>
                            <input
                                name="dropoffLocation"
                                value={formData.dropoffLocation}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: Mvan / Yaoundé"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de tarification</label>
                                <select name="pricingMethod" value={formData.pricingMethod} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
                                    <option value="FIXED">Prix fixe</option>
                                    <option value="PER_KM">Par Km</option>
                                    <option value="PER_HOUR">Par Heure</option>
                                    <option value="PER_DAY">Par Jour</option>
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

                    <div className="border-t pt-4 mt-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Détails du trajet</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type de trajet</label>
                                <select name="tripType" value={formData.tripType} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
                                    <option value="ONE_WAY">Aller simple</option>
                                    <option value="ROUND_TRIP">Aller-retour</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Point de rendez-vous</label>
                                <input name="meetupPoint" value={formData.meetupPoint} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Ex: Total Bonamoussadi" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Intention</label>
                                <select name="tripIntention" value={formData.tripIntention} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
                                    <option value="PASSENGERS">Passagers</option>
                                    <option value="PACKAGES">Colis</option>
                                    <option value="BOTH">Passagers & colis</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Paiement</label>
                                <select name="paymentOption" value={formData.paymentOption} onChange={handleChange} className="w-full p-2 border rounded-lg">
                                    <option value="CASH">Cash</option>
                                    <option value="MOBILE_MONEY">Mobile Money</option>
                                    <option value="CARD">Carte</option>
                                    <option value="TRANSFER">Virement</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                                <input type="checkbox" checked={formData.negotiable} onChange={(e) => setFormData(prev => ({ ...prev, negotiable: e.target.checked }))} />
                                Prix négociable
                            </label>
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