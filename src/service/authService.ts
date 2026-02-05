// src/service/authService.ts
import apiClient from './apiClient';
import { LoginPayload, RegistrationRequest, AuthResponse, RegisterInitResponse, RefreshTokenRequest, RefreshTokenResponse } from '@/type/auth';
import { sessionService } from './sessionService';
import { UserSessionContext } from '@/type/profile';

export const authService = {
    /**
     * Étape 1 Inscription : Envoi des données initiales et envoi OTP
     */
    registerInit: async (data: RegistrationRequest): Promise<RegisterInitResponse> => { // NEW
        console.log("▶️ [authService] registerInit via /api/v1/auth/register-init");
        const response = await apiClient.post<RegisterInitResponse>('/api/v1/auth/register-init', data);
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        console.log("▶️ [authService] refreshToken via /api/v1/auth/refresh");
        const payload: RefreshTokenRequest = { refreshToken };
        const response = await apiClient.post<RefreshTokenResponse>('/api/v1/auth/refresh', payload);
        sessionService.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data;
    },

    /**
     * Étape 2: Vérification OTP et creation de l'utilisateur si le code est correct
     */
    verifyOtp: async (data: RegistrationRequest, otp: string): Promise<AuthResponse> => {  // NEW
        console.log("▶️ [authService] verifyOtp via /api/v1/auth/verify-otp");
        const payload = { ...data, otp }; // Assurez-vous que le backend attend ces données
        const response = await apiClient.post<AuthResponse>('/api/v1/auth/verify-otp', payload);

         // Sauvegarde la session immédiatement
        if (response.data.accessToken && response.data.user) {
            sessionService.saveSession(response.data.accessToken, { // Modified
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                user: response.data.user,
                actor: response.data.actor,
                organisation: response.data.organisation,
                roles: response.data.user.roles.map(role => role.roleType) || [],
            } as UserSessionContext);
        }
        return response.data;
    },

    /**
     * Connexion classique.
     */
    login: async (credentials: LoginPayload): Promise<AuthResponse> => {
        console.log("▶️ [authService] Login via /api/auth/login");
        const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
        // Sauvegarde la session immédiatement
        if (response.data.accessToken && response.data.user) {
            sessionService.saveSession(response.data.accessToken, { // Modified
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                user: response.data.user,
                actor: response.data.actor,
                organisation: response.data.organisation,
                roles: response.data.user.roles.map(role => role.roleType) || [],
            } as UserSessionContext);
        }

        return response.data;
    },

    logout: () => {
        sessionService.clearUserData();
        window.location.href = '/login';
    },
};