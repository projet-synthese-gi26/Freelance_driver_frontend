"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authService } from "@/service/authService";
import { sessionService } from "@/service/sessionService";
import { EyePassword, NoEyePassword } from "@/components/icon/passwordIcon";
import { useAuthContext } from "@/components/context/authContext";

interface LoginFormProps {
    onForgottenPasswordClick: (callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;
}

export default function LoginFormEmail({ onForgottenPasswordClick, onSignUpClick }: LoginFormProps) {
    const router = useRouter();
    const { checkAuth } = useAuthContext(); 
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
            const response = await authService.login({ username: email.trim(), password });
            
            console.log("✅ Réponse backend reçue:", response);

            const { token, profile } = response;

            if (!token || !profile) {
                throw new Error("Réponse du serveur incomplète (token ou profil manquant).");
            }

            // 2. Sauvegarde Session
            sessionService.saveSession(token, profile);
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

            // 4. Redirection
            const roles = profile.roles || [];
            console.log(`🔀 Redirection selon les rôles: ${JSON.stringify(roles)}`);

            toast.success("Welcome back!");

            if (roles.length > 1) {
                router.push('/choose-profile');
            } else if (roles.includes('DRIVER')) {
                router.push('/freelance-dashboard');
            } else if (roles.includes('CLIENT')) {
                router.push('/customer-dashboard');
            } else {
                console.warn("⚠️ Aucun rôle connu détecté, redirection par défaut.");
                router.push('/freelance-dashboard');
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
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="relative">
                <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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
                    Forgot Password?
                </button>
            </div>

            <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <button type="button" onClick={() => onSignUpClick(() => {})} className="text-indigo-600 font-bold hover:underline">
                    Sign Up
                </button>
            </p>
        </form>
    );
}