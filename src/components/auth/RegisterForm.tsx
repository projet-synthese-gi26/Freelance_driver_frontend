"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authService } from "@/service/authService";
import { EyePassword, NoEyePassword } from "@/components/icon/passwordIcon";
import { RegistrationRequest } from "@/type/auth";
import { useTranslations } from "next-intl";

const countryCodes = [
  { label: 'CM (+237)', value: '+237' },
  { label: 'FR (+33)', value: '+33' },
  { label: 'US (+1)', value: '+1' },
];

export default function RegisterForm({ onSignInClick, onSuccess }: { onSignInClick: () => void; onSuccess?: () => void }) {
    const router = useRouter();
    const t = useTranslations("Auth.registerForm");
    const [loading, setLoading] = useState(false);

    const [role, setRole] = useState<'driver' | 'client'>('driver');
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [countryCode, setCountryCode] = useState(countryCodes[0].value);
    const [localPhone, setLocalPhone] = useState("");
    const [organisationName, setOrganisationName] = useState("");
    const [organisationDescription, setOrganisationDescription] = useState("");
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const checkPasswordStrength = (pwd: string) => {
        if (pwd.length < 8) return t("passwordStrength.tooShort");
        if (!/[A-Z]/.test(pwd)) return t("passwordStrength.missingUppercase");
        if (!/[a-z]/.test(pwd)) return t("passwordStrength.missingLowercase");
        if (!/[0-9]/.test(pwd)) return t("passwordStrength.missingNumber");
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password || !localPhone) {
            toast.error(t("errors.fillAllFields"));
            return;
        }
        if (password !== confirmPassword) {
            toast.error(t("errors.passwordsDoNotMatch"));
            return;
        }
        const pwdError = checkPasswordStrength(password);
        if (pwdError) {
            toast.error(pwdError);
            return;
        }

        setLoading(true);
        const fullPhone = `${countryCode}${localPhone.trim()}`;

        const requestData: RegistrationRequest = {
            email: email.trim(),
            username: email.trim(),
            password: password,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: fullPhone,
            role: role,
            organisationName: organisationName.trim(),
            organisationDescription: organisationDescription.trim(),
            title: title.trim(),
            address: address.trim(),
        };

        try {
            await authService.registerInit(requestData);
            sessionStorage.setItem('temp_registration_data', JSON.stringify(requestData));
            toast.success(t("success.verificationCodeSent"));
            if (onSuccess) onSuccess();
            router.push('/otp');
        } catch (error: any) {
            const msg = error.response?.data?.message || "Registration failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Sélecteur de Rôle */}
            <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6 shadow-sm border border-gray-200">
                <button
                    type="button"
                    onClick={() => setRole('driver')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                        role === 'driver' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {t("role.driver")}
                </button>
                <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                        role === 'client' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {t("role.passenger")}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Identité */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input className="input-field" placeholder={t("fields.firstName")} value={firstName} onChange={e => setFirstName(e.target.value)} />
                    <input className="input-field" placeholder={t("fields.lastName")} value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>

                {/* 2. Email */}
                <input className="input-field w-full" type="email" placeholder={t("fields.email")} value={email} onChange={e => setEmail(e.target.value)} />
                
                {/* 3. Téléphone */}
                <div className="flex gap-2">
                    <select className="input-field w-1/3 bg-white cursor-pointer" value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                        {countryCodes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <input className="input-field w-2/3" type="tel" placeholder={t("fields.phone")} value={localPhone} onChange={e => setLocalPhone(e.target.value)} />
                </div>

                {/* 4. Mots de passe (Placés ici comme demandé) */}
                <div className="relative">
                    <input className="input-field w-full pr-12" type={showPassword ? "text" : "password"} placeholder={t("fields.password")} value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyePassword/> : <NoEyePassword/>}
                    </button>
                </div>

                <div className="relative">
                    <input className="input-field w-full pr-12" type={showConfirm ? "text" : "password"} placeholder={t("fields.confirmPassword")} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <EyePassword/> : <NoEyePassword/>}
                    </button>
                </div>

                {/* 5. Détails Organisation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <input className="input-field" placeholder={t("fields.organisationName")} value={organisationName} onChange={e => setOrganisationName(e.target.value)} />
                    <input className="input-field" placeholder={t("fields.title")} value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                
                <input className="input-field w-full" placeholder={t("fields.organisationDescription")} value={organisationDescription} onChange={e => setOrganisationDescription(e.target.value)} />
                <input className="input-field w-full" placeholder={t("fields.address")} value={address} onChange={e => setAddress(e.target.value)} />

                {/* Bouton de validation */}
                <button disabled={loading} className={`w-full text-white py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-lg ${role === 'driver' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            {t("creatingAccount")}
                        </span>
                    ) : t("signUp")}
                </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
                {t("alreadyHaveAccount")} <button onClick={onSignInClick} className="text-blue-600 font-bold hover:underline">{t("signIn")}</button>
            </p>

            <style jsx>{`
                .input-field {
                    @apply px-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-gray-50/50;
                }
            `}</style>
        </div>
    );
}