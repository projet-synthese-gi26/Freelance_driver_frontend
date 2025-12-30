"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Imports de VOS nouveaux services et types
import { sessionService } from '@/service/sessionService';
import { authService } from '@/service/authService';
import { LoginPayload,  RegistrationRequest } from '@/type/auth';
import { UserSessionContext } from '@/type/profile';

interface AuthContextType {
    user: UserSessionContext | null;
    isLoading: boolean;
    login: (creds: LoginPayload) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    authUser: UserSessionContext | null;
    register: (registrationData: RegistrationRequest) => Promise<void>; // Changez RegisterPayload en RegistrationRequest ici
     authUserIsLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserSessionContext | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [authUser, setAuthUser] = useState<UserSessionContext | null>(null); 
    const [authUserIsLoading, setAuthUserIsLoading] = useState<boolean>(false)
   
    //Fonction local pour set une registration
     const handleRegister = useCallback(async (registrationData: RegistrationRequest) => {
        setIsLoading(true);
        try {
            // authService.login sauvegarde déjà la session dans les cookies/storage
            const response = await authService.registerInit(registrationData);
            
            // On met à jour l'état React
            await checkAuth();
            
            toast.success("L'utilisateur a été crée avec succes !");
        } catch (error: any) {
            console.error(error);
            throw error; // Laisse le formulaire gérer l'affichage de l'erreur
        } finally {
            setIsLoading(false);
        }
    }, [router]);

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
        sessionService.clearUserData();
        setUser(null);
        router.push('/login');
        toast.success("Déconnecté");
    };
   

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, authUser, register: handleRegister, checkAuth, authUserIsLoading: isLoading }}>
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