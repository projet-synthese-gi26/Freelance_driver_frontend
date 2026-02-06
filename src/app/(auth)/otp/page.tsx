// src/app/(auth)/otp/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authService } from '@/service/authService'; // Assurez-vous de l'import correct
import { RegistrationRequest, AuthResponse } from '@/type/auth'; // Assurez-vous de l'import correct
import { useAuthContext } from '@/components/context/authContext';
import { useTranslations } from 'next-intl';

export default function OTPPage() {
    const router = useRouter();
    const { checkAuth } = useAuthContext();
    const t = useTranslations('Auth.otp');
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [regData, setRegData] = useState<RegistrationRequest | null>(null);

    useEffect(() => {
        // Récupération des données depuis le stockage temporaire
        const stored = sessionStorage.getItem('temp_registration_data');
        if (!stored) {
            toast.error(t('errors.sessionExpired'));
            router.push('/register');
            return;
        }
        setRegData(JSON.parse(stored));
    }, [router, t]);

    const handleVerify = async () => {
        if (!regData || otp.length !== 6) {
            toast.error(t('errors.invalidCode'));
            return;
        }

        setLoading(true);
        try {
            // 1. Verify OTP
            await authService.verifyOtp(regData, otp);

            // 2.  If OTP is valid, redirect and maybe update context
            if(checkAuth) {
                await checkAuth();
            }

            // Redirection selon le rôle choisi
            if (regData.role === 'driver') {
                router.push('/freelance-dashboard');
            } else {
                router.push('/customer-dashboard');
            }

        } catch (error: any) {
            const msg = error.response?.data?.message || "Verification failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!regData) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
                <p className="text-gray-600 mb-6">
                    {t('subtitle', {email: regData.email})}
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
                    {loading ? t('verifying') : t('verify')}
                </button>

                <button
                    onClick={() => router.back()}
                    className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
                >
                    {t('back')}
                </button>
            </div>
        </div>
    );
}