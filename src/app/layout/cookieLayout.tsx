"use client";
import React from 'react';
import { useCookieConsent } from '@/hook/useCookie';
import CookieBanner from '@/components/cookies/CookieConsent';

interface CookieManagerProps {
    children: React.ReactNode;
}

const CookieManager: React.FC<CookieManagerProps> = ({ children }) => {
    const { hasVisited, cookieConsent, updateCookieConsent } = useCookieConsent();

    const handleAccept = () => {
        updateCookieConsent(true);
    };

    const handleRefuse = () => {
        updateCookieConsent(false);
    };

    return (
        <>
            {children}
            {(!hasVisited || cookieConsent === null) && (
                <CookieBanner
                    onAccept={handleAccept}
                    onRefuse={handleRefuse}
                />
            )}
        </>
    );
};

export default CookieManager;

