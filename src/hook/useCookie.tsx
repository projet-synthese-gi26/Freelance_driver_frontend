import { useState, useEffect } from 'react';

export const useCookieConsent = () => {
    const [hasVisited, setHasVisited] = useState<boolean>(false);
    const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);

    useEffect(() => {
        const storedHasVisited = localStorage.getItem('hasVisited');
        const storedConsent = localStorage.getItem('cookieConsent');

        if (!storedHasVisited) {
            localStorage.setItem('hasVisited', 'true');
            setHasVisited(false);
        } else {
            setHasVisited(true);
        }

        if (storedConsent) {
            setCookieConsent(storedConsent === 'true');
        }
    }, []);

    const updateCookieConsent = (consent: boolean) => {
        localStorage.setItem('cookieConsent', consent.toString());
        setCookieConsent(consent);
    };

    return { hasVisited, cookieConsent, updateCookieConsent };
};