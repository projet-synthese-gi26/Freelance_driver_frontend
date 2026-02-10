"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { PencilSquareIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"; // Using outline for consistency with existing design

// SERVICES & TYPES
import { profileService } from "@/service/profileService";
import { sessionService } from "@/service/sessionService";
import { useAuthContext } from "@/components/context/authContext";
import { DriverProfile } from "@/type/profile";

// Data for select options
// Assuming you have languageOptions available, similar to the client component
// If not, you might need to define them or fetch them.
// For now, I'll use a placeholder structure.
const languageOptions = [
    { value: "ENGLISH", label: "English" },
    { value: "FRENCH", label: "Français" },
    { value: "SPANISH", label: "Español" },
    // Add more languages as needed
];

// Interface pour les données du formulaire, similaire au DTO
interface DriverProfileFormData {
    firstName: string;
    lastName: string;
    nickname: string;
    birthDate: string;
    phoneNumber: string;
    nationality: string;
    gender: string;
    language: string;
    biography: string;
    vehicleDetails: string; // Specific to driver profile
    profileImageUrl?: string; // Added for internal form consistency, but handled separately
}

// Initial state pour le formulaire
const initialDriverProfileFormData: DriverProfileFormData = {
    firstName: '',
    lastName: '',
    nickname: '',
    birthDate: '',
    phoneNumber: '',
    nationality: '',
    gender: '',
    language: '',
    biography: '',
    vehicleDetails: '',
    profileImageUrl: '',
};

// Configuration des champs pour le rendu dynamique
interface FieldConfig {
    field: keyof DriverProfileFormData;
    title: string;
    type: 'text' | 'date' | 'email' | 'select' | 'textarea' | 'tel';
    optional?: boolean;
    options?: { value: string; label: string }[]; // Pour les champs de type 'select'
    className?: string; // Pour gérer la largeur des champs comme biography
}

export default function PersonalInfoPage() {
    const { user, checkAuth } = useAuthContext();
    const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);

    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(true); // Set to true initially for loading data
    const [formData, setFormData] = useState<DriverProfileFormData>(initialDriverProfileFormData);

    // Champs à afficher avec la nouvelle structure
    const fields: FieldConfig[] = [
        { field: 'firstName', title: 'Prénom', type: 'text' },
        { field: 'lastName', title: 'Nom', type: 'text' },
        { field: 'nickname', title: 'Surnom', type: 'text', optional: true },
        { field: 'birthDate', title: 'Date de Naissance', type: 'date' },
        { field: 'phoneNumber', title: 'Téléphone', type: 'tel' }, // Use 'tel' type
        { field: 'nationality', title: 'Nationalité', type: 'text' },
        {
            field: 'gender', title: 'Genre', type: 'select', options: [
                { value: "Male", label: "Homme" },
                { value: "Female", label: "Femme" },
                { value: "Other", label: "Autre" }
            ]
        },
        { field: 'language', title: 'Langue', type: 'select', options: languageOptions },
        { field: 'biography', title: 'Biographie', type: 'textarea', optional: true, className: 'md:col-span-2' },
        { field: 'vehicleDetails', title: 'Détails du véhicule (Résumé)', type: 'textarea', optional: true, className: 'md:col-span-2' },
    ];

    // Chargement initial des données utilisateur
    useEffect(() => {
        const loadProfile = async () => {
            const driverProfileFromContext = (user as any)?.driverProfile as DriverProfile | undefined;

            if (driverProfileFromContext) {
                setDriverProfile(driverProfileFromContext);
                setFormData({
                    firstName: driverProfileFromContext.firstName || '',
                    lastName: driverProfileFromContext.lastName || '',
                    nickname: driverProfileFromContext.nickname || '',
                    birthDate: driverProfileFromContext.birthDate || '',
                    phoneNumber: driverProfileFromContext.phoneNumber || '',
                    nationality: driverProfileFromContext.nationality || '',
                    gender: driverProfileFromContext.gender || '',
                    language: driverProfileFromContext.language || '',
                    biography: driverProfileFromContext.biography || '',
                    vehicleDetails: driverProfileFromContext.vehicleDetails || '',
                    profileImageUrl: driverProfileFromContext.profileImageUrl || '',
                });
                setLoading(false);
                return;
            }

            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const context = await profileService.getDriverProfile();
                const actor = context.actor as any;
                const profileFromApi: DriverProfile = {
                    id: actor?.id || '',
                    firstName: context.user?.firstName || '',
                    lastName: context.user?.lastName || '',
                    nickname: actor?.displayName || '',
                    birthDate: '',
                    phoneNumber: actor?.phoneNumber || context.user?.phone || '',
                    nationality: '',
                    gender: '',
                    language: actor?.languages?.[0] || '',
                    biography: '',
                    vehicleDetails: '',
                    profileImageUrl: context.user?.photoUri || actor?.avatarUrl || '',
                } as DriverProfile;

                setDriverProfile(profileFromApi);
                setFormData({
                    firstName: profileFromApi.firstName || '',
                    lastName: profileFromApi.lastName || '',
                    nickname: profileFromApi.nickname || '',
                    birthDate: profileFromApi.birthDate || '',
                    phoneNumber: profileFromApi.phoneNumber || '',
                    nationality: profileFromApi.nationality || '',
                    gender: profileFromApi.gender || '',
                    language: profileFromApi.language || '',
                    biography: profileFromApi.biography || '',
                    vehicleDetails: profileFromApi.vehicleDetails || '',
                    profileImageUrl: profileFromApi.profileImageUrl || '',
                });
            } catch (error) {
                console.error("❌ Erreur récupération profil chauffeur:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user]);

    const handleInputChange = (field: keyof DriverProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        const loadingToast = toast.loading("Sauvegarde des modifications...");
        try {
            // Le payload doit correspondre à ce que votre service `updateDriverProfile` attend
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                nickname: formData.nickname,
                birthDate: formData.birthDate,
                phoneNumber: formData.phoneNumber,
                nationality: formData.nationality,
                gender: formData.gender,
                language: formData.language,
                biography: formData.biography,
                vehicleDetails: formData.vehicleDetails,
                // profileImageUrl n'est pas envoyé ici car géré séparément
            };

            const updatedContext = await profileService.updateDriverProfile(payload);

            sessionService.saveSessionContext(updatedContext);
            await checkAuth(); // Rafraîchir le contexte global pour l'UI

            toast.success("Profil mis à jour avec succès !", { id: loadingToast });
            setEditable(false);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour.", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const loadingToast = toast.loading("Téléversement de la photo...");

            try {
                const updatedContext = await profileService.updateProfilePicture(file);

                sessionService.saveSessionContext(updatedContext);
                await checkAuth();

                // Mettre à jour localement l'URL de l'image de profil dans formData
                const newAvatarUrl = updatedContext.user?.photoUri || updatedContext.actor?.avatarUrl || '';
                setFormData(prev => ({ ...prev, profileImageUrl: newAvatarUrl }));

                toast.success("Photo de profil mise à jour !", { id: loadingToast });
            } catch (error) {
                console.error(error);
                toast.error("Échec du changement de photo.", { id: loadingToast });
            }
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-blue-600">Chargement du profil...</div>;
    if (!user) return <div className="p-10 text-center">Veuillez vous connecter.</div>;
    if (!driverProfile) return <div className="p-10 text-center text-red-500">Profil chauffeur introuvable.</div>;


    return (
        <div className="p-4 max-w-6xl mx-auto mb-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Informations Personnelles</h1>
                {!editable && (
                    <button
                        onClick={() => setEditable(true)}
                        className="flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600/20 transition" // Client-like button style
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                        <span className="font-medium">Modifier le profil</span>
                    </button>
                )}
            </div>

            {/* Photo de Profil */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative w-32 h-32">
                    <Image
                        src={formData.profileImageUrl || "/white-silhouette-avatar.png"}
                        alt="Profile"
                        fill
                        sizes="128px"
                        unoptimized
                        className="rounded-full object-cover border-4 border-white shadow-md"
                    />
                    {editable && (
                        <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
                            <PencilSquareIcon className="w-4 h-4 text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    )}
                </div>
                <p className="mt-2 text-gray-500 font-medium">
                    {formData.firstName} {formData.lastName}
                </p>
            </div>

            {/* Formulaire */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        {fields.map((item) => (
                            <div key={item.field} className={item.className || ''}> {/* Appliquer la classe pour la largeur */}
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {item.title} {item.optional && <span className="text-gray-400 font-normal italic">(Optionnel)</span>}
                                </label>

                                {editable ? (
                                    <>
                                        {item.type === 'select' ? (
                                            <select
                                                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 bg-white" // Couleur primaire ajustée
                                                value={formData[item.field] || ''}
                                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            >
                                                <option value="">Sélectionner {item.title}</option>
                                                {item.options?.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        ) : item.type === 'textarea' ? (
                                            <textarea
                                                rows={item.field === 'biography' ? 4 : 3} // Rows specific to biography vs vehicleDetails
                                                placeholder={item.field === 'vehicleDetails' ? "Marque, Modèle, Année..." : ""}
                                                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" // Couleur primaire ajustée
                                                value={formData[item.field] || ''}
                                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            />
                                        ) : (
                                            <input
                                                type={item.type}
                                                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" // Couleur primaire ajustée
                                                value={formData[item.field] || ''}
                                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="py-2.5 px-3 border-b border-gray-100 text-gray-700 min-h-[45px] bg-gray-50/40 rounded-t-md">
                                        {formData[item.field] || <span className="text-gray-400 italic text-sm">Non renseigné</span>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {editable && (
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition" // Couleur primaire ajustée
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="animate-pulse">Sauvegarde...</span>
                                ) : (
                                    <>
                                        <CheckIcon className="w-5 h-5 inline-block mr-2" />
                                        Sauvegarder les modifications
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    // Réinitialiser les données du formulaire à l'état initial
                                    if (driverProfile) { // Assurez-vous que driverProfile existe pour réinitialiser
                                        setFormData({
                                            firstName: driverProfile.firstName || '',
                                            lastName: driverProfile.lastName || '',
                                            nickname: driverProfile.nickname || '',
                                            birthDate: driverProfile.birthDate || '',
                                            phoneNumber: driverProfile.phoneNumber || '',
                                            nationality: driverProfile.nationality || '',
                                            gender: driverProfile.gender || '',
                                            language: driverProfile.language || '',
                                            biography: driverProfile.biography || '',
                                            vehicleDetails: driverProfile.vehicleDetails || '',
                                            profileImageUrl: driverProfile.profileImageUrl || '',
                                        });
                                    }
                                    setEditable(false);
                                }}
                                className="px-8 py-2.5 rounded-lg text-gray-500 border hover:bg-gray-50 transition"
                                disabled={loading}
                            >
                                <XMarkIcon className="w-5 h-5 inline-block mr-2" />
                                Annuler
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}



