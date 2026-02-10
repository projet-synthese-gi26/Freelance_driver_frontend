import { useAuthContext } from "@/components/context/authContext";

// Ce hook sert de pont pour ne pas casser les composants existants
export default function useAuth() {
    const { user, isLoading, login, logout, register } = useAuthContext();

    const driverProfile = (user as any)?.driverProfile;
    const clientProfile = (user as any)?.clientProfile;

    return {
        // Mapping pour garder la compatibilité avec l'ancien code
        authUser: user ? {
            user_id: user.user?.id,
            user_email: clientProfile?.contactEmail || driverProfile?.contactEmail || user.user?.email || '',
            emailVerified: true, // Par défaut true car le backend gère ça
            // On injecte le profil complet pour que les composants puissent y accéder
            userData: user, 
            driverProfile: driverProfile,
            clientProfile: clientProfile
        } : null,
        
        authUserIsLoading: isLoading,
        login,
        logout,
        register
    };
}