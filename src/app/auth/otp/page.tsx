"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authService } from '@/service/authService';
import { RegistrationRequest } from '@/type/auth';
import { useAuthContext } from '@/components/context/authContext';

export default function OTPPage() {
    const router = useRouter();
    const { checkAuth } = useAuthContext();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [regData, setRegData] = useState<RegistrationRequest | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('temp_registration_data');
        if (!stored) {
            toast.error("Session expirée, veuillez vous réinscrire.");
            router.push('/auth/register'); // Vérifie bien que c'est le bon chemin (/register ou /auth/register)
            return;
        }
        setRegData(JSON.parse(stored));
    }, [router]);

    const handleVerify = async () => {
        if (!regData || otp.length !== 6) {
            toast.error("Veuillez entrer un code valide à 6 chiffres");
            return;
        }

        setLoading(true);
        try {
            console.log("▶️ Envoi OTP pour validation...");
            
            // 1. Appel Backend (Qui fonctionne déjà selon tes logs)
            const response = await authService.finalizeOnboarding(regData, otp);
            console.log("✅ Backend a répondu succès:", response);
            
            // 2. Nettoyage
            sessionStorage.removeItem('temp_registration_data');
            
            // 3. Mise à jour du contexte (Sécurisée pour ne pas bloquer la redirection)
            try {
                console.log("🔄 Tentative de mise à jour du contexte Auth...");
                await checkAuth();
                console.log("✅ Contexte mis à jour.");
            } catch (authError) {
                console.warn("⚠️ checkAuth a échoué (non critique car le token est là) :", authError);
                // On ne throw pas ici, on continue la redirection
            }

            toast.success("Compte vérifié avec succès !");
            
            // 4. Redirection
            console.log(`🔀 Redirection pour le rôle: ${regData.role}`);
            if (regData.role === 'driver') {
                router.push('/freelance-dashboard');
            } else {
                router.push('/customer-dashboard');
            }

        } catch (error: any) {
            console.error("❌ ERREUR CRITIQUE FRONTEND :", error);
            
            // Affichage de l'erreur réelle
            const msg = error.response?.data?.message || error.message || "Échec de la vérification";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!regData) return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Chargement...</p>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-2">Vérification OTP</h2>
                <p className="text-gray-600 mb-6">
                    Nous avons envoyé un code à <span className="font-bold">{regData.email}</span>
                </p>

                <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center text-3xl tracking-widest py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none mb-6"
                    placeholder="000000"
                />

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "Vérification..." : "Vérifier & Terminer"}
                </button>
                
                <button 
                    onClick={() => router.back()}
                    className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
                >
                    Retour
                </button>
            </div>
        </div>
    );
}