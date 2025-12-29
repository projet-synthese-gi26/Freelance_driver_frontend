// src/components/auth/RegisterForm.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authService } from "@/service/authService";
import { EyePassword, NoEyePassword } from "@/components/icon/passwordIcon";
import { RegistrationRequest } from "@/type/auth";

// Liste simplifiée des codes pays
const countryCodes = [
  { label: 'CM (+237)', value: '+237' },
  { label: 'FR (+33)', value: '+33' },
  { label: 'US (+1)', value: '+1' },
];

export default function RegisterForm({ onSignInClick }: { onSignInClick: () => void }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // États du formulaire de base
    const [role, setRole] = useState<'driver' | 'client'>('driver');
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [countryCode, setCountryCode] = useState(countryCodes[0].value);
    const [localPhone, setLocalPhone] = useState("");

    // États supplémentaires (Pour éviter le crash Java NullPointerException)
    const [companyName, setCompanyName] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [vehicleDetails, setVehicleDetails] = useState("");
    
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
        
        // Validation des champs de base
        if (!firstName || !lastName || !email || !password || !localPhone) {
            toast.error("Please fill all basic fields");
            return;
        }

        // Validation spécifique au Chauffeur
        if (role === 'driver') {
            if (!licenseNumber || !vehicleDetails) {
                toast.error("License number and vehicle details are required for drivers");
                return;
            }
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

        // CORRECTION MAJEURE ICI :
        // On s'assure d'envoyer des chaînes vides ("") et non null/undefined
        // pour éviter le crash backend (NullPointerException sur .trim())
        const requestData: RegistrationRequest = {
            username: email.trim(),
            email: email.trim(),
            password: password,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phoneNumber: fullPhone,
            role: role,
            // Champs optionnels ou spécifiques envoyés comme "" s'ils sont vides
            companyName: companyName.trim() || "",
            companyDescription: companyDescription.trim() || "",
            licenseNumber: licenseNumber.trim() || "",
            vehicleDetails: vehicleDetails.trim() || ""
        };

        try {
            await authService.registerInit(requestData);
            
            // Stockage temporaire sécurisé pour la page OTP
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('temp_registration_data', JSON.stringify(requestData));
            }
            
            toast.success("Verification code sent to your email!");
            router.push('/auth/otp');

        } catch (error: any) {
            console.error("Registration Error:", error);
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
                {/* --- Informations Personnelles --- */}
                <div className="grid grid-cols-2 gap-4">
                    <input className="input-field" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    <input className="input-field" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                
                <input className="input-field w-full" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                
                <div className="flex gap-2">
                    <select className="input-field w-1/3" value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                        {countryCodes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <input className="input-field w-2/3" type="tel" placeholder="Phone Number" value={localPhone} onChange={e => setLocalPhone(e.target.value)} />
                </div>

                {/* --- Informations Spécifiques Chauffeur --- */}
                {role === 'driver' && (
                    <div className="p-4 bg-blue-50 rounded-lg space-y-3 border border-blue-100">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">Driver Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                className="input-field" 
                                placeholder="License Number" 
                                value={licenseNumber} 
                                onChange={e => setLicenseNumber(e.target.value)} 
                            />
                             <input 
                                className="input-field" 
                                placeholder="Vehicle (e.g. Toyota Corolla)" 
                                value={vehicleDetails} 
                                onChange={e => setVehicleDetails(e.target.value)} 
                            />
                        </div>
                        <input 
                            className="input-field w-full" 
                            placeholder="Company Name (Optional)" 
                            value={companyName} 
                            onChange={e => setCompanyName(e.target.value)} 
                        />
                         <textarea 
                            className="input-field w-full h-20 resize-none" 
                            placeholder="Company Description (Optional)" 
                            value={companyDescription} 
                            onChange={e => setCompanyDescription(e.target.value)} 
                        />
                    </div>
                )}

                 {/* --- Informations Spécifiques Client (Optionnel) --- */}
                 {role === 'client' && (
                    <div className="p-4 bg-green-50 rounded-lg space-y-3 border border-green-100">
                         <h3 className="text-sm font-semibold text-green-800 mb-2">Company Details (Optional)</h3>
                         <input 
                            className="input-field w-full" 
                            placeholder="Company Name" 
                            value={companyName} 
                            onChange={e => setCompanyName(e.target.value)} 
                        />
                         <textarea 
                            className="input-field w-full h-20 resize-none" 
                            placeholder="Company Description" 
                            value={companyDescription} 
                            onChange={e => setCompanyDescription(e.target.value)} 
                        />
                    </div>
                )}

                {/* --- Mot de passe --- */}
                <div className="relative pt-2">
                    <input className="input-field w-full" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" className="absolute right-3 top-5" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyePassword/> : <NoEyePassword/>}
                    </button>
                </div>

                <div className="relative">
                    <input className="input-field w-full" type={showConfirm ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    <button type="button" className="absolute right-3 top-3" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <EyePassword/> : <NoEyePassword/>}
                    </button>
                </div>

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