"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '@/components/context/authContext';
import { onboardingService } from '@/service/onboardingService';
import { sessionService } from '@/service/sessionService';

export default function BecomeDriverPage() {
    const router = useRouter();
    const { user, checkAuth } = useAuthContext();
    const [formData, setFormData] = useState({
        companyName: '',
        companyDescription: '',
        licenseNumber: '',
        vehicleDetails: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.licenseNumber || !formData.companyName) {
            toast.error("Veuillez remplir les champs obligatoires");
            return;
        }

        setLoading(true);
        try {
            // Préparer les données (fusionner avec les infos existantes de l'utilisateur)
            // Sur mobile, on prend les infos du profil client si elles existent
            const clientProfile = (user as any)?.clientProfile as any;
            const baseUser = user?.user;
            const payload = {
                firstName: clientProfile?.firstName || baseUser?.firstName || 'Chauffeur',
                lastName: clientProfile?.lastName || baseUser?.lastName || '',
                phoneNumber: clientProfile?.phoneNumber || baseUser?.phone || '',
                email: clientProfile?.contactEmail || baseUser?.email || '',
                ...formData
            };

            const updatedContext = await onboardingService.becomeDriver(payload);
            
            // Mise à jour de la session
            sessionService.saveSessionContext(updatedContext);
            await checkAuth();

            toast.success("Félicitations ! Vous êtes maintenant chauffeur.");
            router.push('/freelance-dashboard');
        } catch (error: any) {
            const msg = error.response?.data?.message || "Erreur lors de l'activation du profil.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-2 text-gray-900">Devenir Chauffeur</h1>
                <p className="text-gray-500 mb-6">Complétez votre profil pour commencer à conduire.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        className="w-full p-3 border rounded-lg"
                        placeholder="Nom de votre entreprise/activité"
                        value={formData.companyName}
                        onChange={e => setFormData({...formData, companyName: e.target.value})}
                    />
                     <textarea 
                        className="w-full p-3 border rounded-lg"
                        placeholder="Description de l'activité"
                        value={formData.companyDescription}
                        onChange={e => setFormData({...formData, companyDescription: e.target.value})}
                    />
                    <input 
                        className="w-full p-3 border rounded-lg"
                        placeholder="Numéro de permis"
                        value={formData.licenseNumber}
                        onChange={e => setFormData({...formData, licenseNumber: e.target.value})}
                    />
                    <input 
                        className="w-full p-3 border rounded-lg"
                        placeholder="Détails du véhicule (marque, modèle...)"
                        value={formData.vehicleDetails}
                        onChange={e => setFormData({...formData, vehicleDetails: e.target.value})}
                    />
                    
                    <button 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Traitement...' : 'Valider'}
                    </button>
                </form>
            </div>
        </div>
    );
}