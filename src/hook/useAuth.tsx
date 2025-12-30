import { useAuthContext } from "@/components/context/authContext";

// Ce hook sert de pont pour ne pas casser les composants existants
export default function useAuth() {
    const { user, isLoading, login, logout, register } = useAuthContext();

    return {
        // Mapping pour garder la compatibilité avec l'ancien code
        authUser: user ? {
            user_id: user.userId,
            user_email: user.clientProfile?.contactEmail || user.driverProfile?.contactEmail || '',
            emailVerified: true, // Par défaut true car le backend gère ça
            // On injecte le profil complet pour que les composants puissent y accéder
            userData: user, 
            driverProfile: user.driverProfile,
            clientProfile: user.clientProfile
        } : null,
        
        authUserIsLoading: isLoading,
        login,
        logout,
        register
    };
}