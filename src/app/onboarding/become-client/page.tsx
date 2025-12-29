"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '@/components/context/authContext';
import { onboardingService } from '@/service/onboardingService';
import { sessionService } from '@/service/sessionService';

export default function BecomeClientPage() {
    const router = useRouter();
    const { user, checkAuth } = useAuthContext();
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                firstName: user?.driverProfile?.firstName || 'Client',
                lastName: user?.driverProfile?.lastName || '',
                phoneNumber: user?.driverProfile?.phoneNumber || '',
                email: user?.driverProfile?.driver_email || '',
                companyName: companyName || 'Mon Compte Personnel',
                companyDescription: 'Compte client personnel'
            };

            const updatedContext = await onboardingService.becomeClient(payload);
            
            sessionService.saveSessionContext(updatedContext);
            await checkAuth();

            toast.success("Profil client activé !");
            router.push('/customer-dashboard');
        } catch (error: any) {
            toast.error("Erreur lors de l'activation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-2 text-gray-900">Devenir Passager</h1>
                <p className="text-gray-500 mb-6">Activez votre profil passager pour réserver des courses.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Optionnel : Demander un nom d'entreprise si B2B, sinon laisser vide */}
                    <input 
                        className="w-full p-3 border rounded-lg"
                        placeholder="Nom (Optionnel)"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                    />
                    
                    <button 
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Activation...' : 'Activer mon profil'}
                    </button>
                </form>
            </div>
        </div>
    );
}