"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authService } from '@/service/authService';
import { RegistrationRequest } from '@/type/auth';
import { useAuthContext } from '@/components/context/authContext';

export default function OTPPage() {
    const router = useRouter();
    // Maintenant checkAuth existe bien grâce au nouveau contexte
    const { checkAuth } = useAuthContext(); 
    
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [regData, setRegData] = useState<RegistrationRequest | null>(null);

    useEffect(() => {
        // Récupération sécurisée des données
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem('temp_registration_data');
            if (!stored) {
                toast.error("Session expirée, veuillez vous réinscrire.");
                router.push('/auth/register');
                return;
            }
            try {
                setRegData(JSON.parse(stored));
            } catch (e) {
                router.push('/auth/register');
            }
        }
    }, [router]);

    const handleVerify = async () => {
        if (!regData || otp.length !== 6) {
            toast.error("Veuillez entrer un code valide à 6 chiffres");
            return;
        }

        setLoading(true);
        try {
            console.log("▶️ Envoi OTP...");
            
            // 1. Validation OTP via le service (sauvegarde le token en interne)
            await authService.finalizeOnboarding(regData, otp);
            
            // 2. Nettoyage
            sessionStorage.removeItem('temp_registration_data');
            
            // 3. Mise à jour du contexte
            await checkAuth();

            toast.success("Compte vérifié avec succès !");
            
            // 4. Redirection FORCEE (plus sûr après une inscription pour recharger tous les états)
            // On utilise window.location pour garantir que le middleware et le contexte se rechargent proprement
            if (regData.role === 'driver') {
                window.location.href = '/freelance-dashboard';
            } else {
                window.location.href = '/customer-dashboard';
            }

        } catch (error: any) {
            console.error("❌ Erreur OTP :", error);
            const msg = error.response?.data?.message || "Code invalide ou expiré.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!regData) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-2">Vérification</h2>
                <p className="text-gray-600 mb-6">
                    Entrez le code envoyé à <span className="font-bold text-blue-600">{regData.email}</span>
                </p>

                <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center text-3xl tracking-[0.5em] py-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none mb-6 transition-all"
                    placeholder="000000"
                    autoFocus
                />

                <button
                    onClick={handleVerify}
                    disabled={loading || otp.length < 6}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
                    {loading ? "Vérification..." : "Valider"}
                </button>
                
                <button 
                    onClick={() => router.back()}
                    className="mt-6 text-gray-400 hover:text-gray-600 text-sm font-medium"
                    disabled={loading}
                >
                    Retour
                </button>
            </div>
        </div>
    );
}