import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // 1. Récupérer le token depuis les cookies
    const token = request.cookies.get('authToken')?.value;
    const { pathname } = request.nextUrl;

    // 2. Définir les routes qui nécessitent une connexion
    const protectedPrefixes = [
        '/customer-dashboard', 
        '/freelance-dashboard', 
        '/admin-dashboard'
    ];

    // Vérifie si l'URL actuelle commence par l'un des préfixes protégés
    const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

    // 3. Logique de protection : Pas de token sur une route protégée ? -> Dehors !
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        // (Optionnel) Ajouter l'URL de retour pour rediriger l'utilisateur après connexion
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Note sur les Rôles :
    // Le Middleware Next.js ne peut pas décoder facilement le token ou appeler la BDD 
    // pour vérifier si c'est un 'driver' ou 'customer' sans ralentir l'app.
    // Cette vérification spécifique se fait maintenant dans votre 'AuthContext' 
    // ou via les appels API qui échoueront (403) si le rôle n'est pas bon.

    return NextResponse.next();
}

// Configurer sur quelles routes ce middleware s'applique
export const config = {
    matcher: [
        /*
         * Applique le middleware à :
         * 1. /customer-dashboard et ses sous-chemins
         * 2. /freelance-dashboard et ses sous-chemins
         * 3. /admin-dashboard et ses sous-chemins
         */
        '/customer-dashboard/:path*',
        '/freelance-dashboard/:path*',
        '/admin-dashboard/:path*',
    ],
};