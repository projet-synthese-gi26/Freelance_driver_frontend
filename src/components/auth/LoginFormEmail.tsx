// src/components/auth/LoginFormEmail.tsx
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
    const { checkAuth } = useAuthContext(); // Pour mettre à jour l'état global après login
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login({ username: email.trim(), password });
            
            const { token, profile } = response;
            const roles = profile.roles || [];

            // Sauvegarde de base
            sessionService.saveSession(token, profile);
            
            // Mise à jour du contexte React
            await checkAuth();

            // LOGIQUE DE REDIRECTION (Copie du mobile)
            if (roles.length > 1) {
                // Plusieurs rôles -> Page de choix
                console.log("Multi-roles detected -> Redirect to Choose Profile");
                router.push('/auth/choose-profile');
            } else if (roles.length === 1) {
                // Rôle unique -> Redirection directe
                const role = roles[0];
                if (role === 'DRIVER') {
                    router.push('/freelance-dashboard');
                } else if (role === 'CLIENT') {
                    router.push('/customer-dashboard');
                } else {
                    router.push('/');
                }
                toast.success("Welcome back!");
            } else {
                toast.error("No valid profile found.");
            }

        } catch (error: any) {
            const msg = error.response?.data?.message || "Login failed. Check your credentials.";
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
                    type="text" // 'text' car ça peut être username ou email
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