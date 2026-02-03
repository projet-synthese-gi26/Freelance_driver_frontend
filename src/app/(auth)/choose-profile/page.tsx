// src/app/auth/choose-profile/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sessionService } from '@/service/sessionService';
import { UserSessionContext } from '@/type/profile';
import logo from '@public/img/MainLogo1.png'; // Assurez-vous que le chemin est bon
import { useTranslations } from 'next-intl';

export default function ChooseProfilePage() {
    const router = useRouter();
    const t = useTranslations('Auth.chooseProfile');
    const [userContext, setUserContext] = useState<UserSessionContext | null>(null);

    useEffect(() => {
        const ctx = sessionService.getUserSessionContext();
        if (!ctx) {
            router.push('/login');
        } else {
            setUserContext(ctx);
        }
    }, [router]);

    const handleChooseRole = (role: 'DRIVER' | 'CLIENT') => {
        // Ici, on pourrait stocker le "rôle actif" dans le localStorage si nécessaire
        // localStorage.setItem('activeRole', role);
        
        if (role === 'DRIVER') {
            router.push('/freelance-dashboard');
        } else {
            router.push('/customer-dashboard');
        }
    };

    if (!userContext) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <Image src={logo} alt="Logo" width={100} height={80} />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
                <p className="text-gray-600 mb-8">{t('subtitle')}</p>

                <div className="space-y-4">
                    {userContext.user.roles.some((r) => r.roleType === 'DRIVER') && (
                        <button
                            onClick={() => handleChooseRole('DRIVER')}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                            {t('continueDriver')}
                        </button>
                    )}

                    {userContext.user.roles.some((r) => r.roleType === 'CLIENT') && (
                        <button
                            onClick={() => handleChooseRole('CLIENT')}
                            className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                            {t('continuePassenger')}
                        </button>
                    )}
                </div>

            
            </div>
        </div>
    );
}