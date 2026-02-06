// src/components/auth/LoginFormEmail.tsx
"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { authService } from "@/service/authService";
import { sessionService } from "@/service/sessionService";
import { EyePassword, NoEyePassword } from "@/components/icon/passwordIcon";
import { useAuthContext } from "@/components/context/authContext";
import { useTranslations } from "next-intl";
import { UserSessionContext } from "@/type/profile";

interface LoginFormProps {
    onForgottenPasswordClick: (callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;
    onSuccess?: () => void;
}

export default function LoginFormEmail({ onForgottenPasswordClick, onSignUpClick, onSuccess }: LoginFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { checkAuth } = useAuthContext();
    const t = useTranslations("Auth.login.email");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Appel API
            console.log("▶️ Tentative de connexion...");
            const response = await authService.login({ identifier: email.trim(), password }); // Modified
            
            console.log("✅ Réponse backend reçue:", response);

            const { accessToken, user, actor, organisation, refreshToken } = response; // Modified

            if (!accessToken || !user) { // Modified
                throw new Error("Réponse du serveur incomplète (token ou profil manquant).");
            }

            // 2. Sauvegarde Session
            sessionService.saveSession(accessToken, {  // Modified
                accessToken,
                refreshToken,
                user,
                actor,
                organisation,
                roles: user.roles.map(role => role.roleType) || [],
            } as UserSessionContext);
            console.log("✅ Session sauvegardée.");

            // 3. Mise à jour Contexte (Protégée pour ne pas bloquer le login)
            try {
                if (checkAuth) {
                    await checkAuth();
                    console.log("✅ Contexte mis à jour.");
                }
            } catch (ctxError) {
                console.warn("⚠️ checkAuth a échoué (non bloquant):", ctxError);
            }

            // 4. Redirection - Rester sur la page actuelle si ce n'est pas une page d'auth
            const roles = user.roles?.map(role => role.roleType).filter(Boolean) as string[] | undefined;
            const actorRole = actor?.roleType ? [actor.roleType] : [];
            const resolvedRoles = (roles && roles.length > 0 ? roles : actorRole);
            console.log(`🔀 Redirection selon les rôles: ${JSON.stringify(roles)}`);

            toast.success("Welcome back!");

            if (onSuccess) {
                onSuccess();
            }

            // Vérifier si on est sur une page d'authentification ou la page d'accueil
            const authPages = ['/login', '/register', '/signup', '/signin', '/otp', '/choose-profile'];
            const isAuthPage = authPages.some(page => pathname?.includes(page));
            const isHomePage = pathname === '/' || pathname === '/freelance' || pathname === '/driver' || pathname === '/passenger';

            // Si on est sur une page d'auth ou la page d'accueil, rediriger vers la page de RECHERCHE appropriée
            // Chauffeur → /announcement-search (voir les annonces des clients)
            // Client → /freelance-search (voir les chauffeurs disponibles)
            if (isAuthPage || isHomePage) {
                if (resolvedRoles?.includes('DRIVER')) {
                    router.push('/announcement-search');
                } else if (resolvedRoles?.includes('CLIENT')) {
                    router.push('/freelance-search');
                } else {
                    // Par défaut, un nouvel utilisateur est considéré comme client
                    console.warn("⚠️ Aucun rôle connu détecté, redirection vers recherche chauffeur.");
                    router.push('/freelance-search');
                }
            } else {
                // Rester sur la page actuelle - le contexte sera mis à jour via checkAuth
                router.refresh();
            }

        } catch (error: any) {
            console.error("❌ ERREUR JS DANS HANDLELOGIN:", error); // <-- Regarde ça dans la console F12
            
            // Afficher le vrai message d'erreur si c'est une erreur JS, sinon le message du backend
            const msg = error.response?.data?.message || error.message || "Login failed.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    type="text"
                    placeholder={t("placeholders.email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="relative">
                <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("placeholders.password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyePassword /> : <NoEyePassword />}
                </button>
            </div>

            <div className="flex justify-end">
                <button type="button" onClick={() => onForgottenPasswordClick(() => {})} className="text-sm text-indigo-600 hover:underline">
                    {t("forgotPassword")}
                </button>
            </div>

            <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
                {loading ? t("signingIn") : t("signIn")}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
                {t("noAccount")} {" "}
                <button type="button" onClick={() => onSignUpClick(() => {})} className="text-indigo-600 font-bold hover:underline">
                    {t("signUp")}
                </button>
            </p>
        </form>
    );
}