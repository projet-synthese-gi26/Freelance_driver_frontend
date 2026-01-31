// src/components/auth/RegisterForm.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authService } from "@/service/authService";
import { EyePassword, NoEyePassword } from "@/components/icon/passwordIcon";
import { RegistrationRequest } from "@/type/auth";

const countryCodes = [
  { label: 'CM (+237)', value: '+237' },
  { label: 'FR (+33)', value: '+33' },
  { label: 'US (+1)', value: '+1' },
];

export default function RegisterForm({ onSignInClick, onSuccess }: { onSignInClick: () => void; onSuccess?: () => void }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // États du formulaire (Seulement les informations de base)
    const [role, setRole] = useState<'driver' | 'client'>('driver');
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [countryCode, setCountryCode] = useState(countryCodes[0].value);
    const [localPhone, setLocalPhone] = useState("");
    const [organisationName, setOrganisationName] = useState(""); // NEW: State for organisationName
    const [organisationDescription, setOrganisationDescription] = useState(""); // NEW: State for organisationDescription
    const [title, setTitle] = useState(""); // NEW: State for title
    const [address, setAddress] = useState(""); // NEW: State for address

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Validation Mot de passe
    const checkPasswordStrength = (pwd: string) => {
        if (pwd.length < 8) return "Password too short (min 8 chars)";
        if (!/[A-Z]/.test(pwd)) return "Missing uppercase letter";
        if (!/[a-z]/.test(pwd)) return "Missing lowercase letter";
        if (!/[0-9]/.test(pwd)) return "Missing number";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation simple
        if (!firstName || !lastName || !email || !password || !localPhone) {
            toast.error("Please fill all fields");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        const pwdError = checkPasswordStrength(password);
        if (pwdError) {
            toast.error(pwdError);
            return;
        }

        setLoading(true);
        const fullPhone = `${countryCode}${localPhone.trim()}`;

        // --- Préparation des données (comme avant)---
        const requestData: RegistrationRequest = {
            email: email.trim(),
            username: email.trim(), // email as username
            password: password,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: fullPhone,
            role: role,
            organisationName: organisationName.trim(), // NEW: Include organisationName
            organisationDescription: organisationDescription.trim(), // NEW: Include organisationDescription
            title: title.trim(), // NEW: Include title
            address: address.trim(), // NEW: Include address
        };

        try {
            console.log("Sending payload to register-init:", requestData); // Debug

            await authService.registerInit(requestData); // Appeler registerInit

            // Stocker temporairement les données pour la page OTP
            sessionStorage.setItem('temp_registration_data', JSON.stringify(requestData));

            toast.success("Verification code sent to your email!");

            if (onSuccess) {
                onSuccess();
            }

            router.push('/auth/otp'); // Rediriger vers la page OTP

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Registration failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Sélecteur de Rôle */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                <button
                    type="button"
                    onClick={() => setRole('driver')}
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                        role === 'driver' ? 'bg-blue-600 text-white shadow' : 'text-gray-500'
                    }`}
                >
                    Driver
                </button>
                <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                        role === 'client' ? 'bg-green-500 text-white shadow' : 'text-gray-500'
                    }`}
                >
                    Passenger
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input className="input-field" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    <input className="input-field" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>

                <input className="input-field w-full" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />

                <div className="flex gap-2">
                    <select className="input-field w-1/3 bg-white" value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                        {countryCodes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <input className="input-field w-2/3" type="tel" placeholder="Phone Number" value={localPhone} onChange={e => setLocalPhone(e.target.value)} />
                </div>

                <div className="relative">
                    <input className="input-field w-full" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" className="absolute right-3 top-3.5 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyePassword/> : <NoEyePassword/>}
                    </button>
                </div>

                <div className="relative">
                    <input className="input-field w-full" type={showConfirm ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    <button type="button" className="absolute right-3 top-3.5 text-gray-500" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <EyePassword/> : <NoEyePassword/>}
                    </button>
                </div>

                {/* NEW: Organisation Details */}
                <input className="input-field w-full" placeholder="Organisation Name" value={organisationName} onChange={e => setOrganisationName(e.target.value)} />
                <input className="input-field w-full" placeholder="Organisation Description" value={organisationDescription} onChange={e => setOrganisationDescription(e.target.value)} />
                <input className="input-field w-full" placeholder="Title (e.g., Driver, Owner)" value={title} onChange={e => setTitle(e.target.value)} />
                <input className="input-field w-full" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />

                <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 mt-4">
                    {loading ? "Processing..." : "Sign Up"}
                </button>
            </form>

            <p className="text-center mt-4 text-sm">
                Already have an account? <button onClick={onSignInClick} className="text-blue-600 font-bold">Sign In</button>
            </p>

            <style jsx>{`
                .input-field {
                    @apply px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm;
                }
            `}</style>
        </div>
    );
}