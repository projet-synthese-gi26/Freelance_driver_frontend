"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Imports de VOS nouveaux services et types
import { sessionService } from '@/service/sessionService';
import { authService } from '@/service/authService';
import { LoginPayload } from '@/type/auth';
import { UserSessionContext } from '@/type/profile';

interface AuthContextType {
    user: UserSessionContext | null; // L'utilisateur connecté
    isLoading: boolean;
    login: (creds: LoginPayload) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>; // La fonction qui manquait !
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserSessionContext | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fonction pour vérifier si l'utilisateur est connecté (lit cookies/localStorage)
    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const token = sessionService.getAuthToken();
            const storedUser = sessionService.getUserSessionContext();
            
            if (token && storedUser) {
                setUser(storedUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Erreur checkAuth", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Vérification initiale au chargement de l'app
    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (creds: LoginPayload) => {
        setIsLoading(true);
        try {
            // authService.login sauvegarde déjà la session dans les cookies/storage
            const response = await authService.login(creds);
            
            // On met à jour l'état React
            await checkAuth();
            
            toast.success("Connexion réussie !");
            
            // Redirection
            if (response.profile?.roles?.includes('DRIVER')) {
                router.push('/freelance-dashboard');
            } else {
                router.push('/customer-dashboard');
            }
        } catch (error: any) {
            console.error(error);
            throw error; // Laisse le formulaire gérer l'affichage de l'erreur
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout(); // Nettoie cookies/storage
        setUser(null);
        router.push('/login');
        toast.success("Déconnecté");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};