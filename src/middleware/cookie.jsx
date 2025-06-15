// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    const consent = request.cookies.get('cookie_consent');

    if (!consent) {
        // Rediriger vers la page de consentement si nécessaire
        return NextResponse.redirect(new URL('/cookie-consent', request.url));
    }

    // Les préférences seront gérées côté client avec le localStorage
    // Ici, nous pouvons simplement vérifier si le consentement a été donné

    let response = NextResponse.next();

    // Ajouter un en-tête pour indiquer que le consentement a été vérifié
    response.headers.set('X-Cookie-Consent-Verified', 'true');

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};