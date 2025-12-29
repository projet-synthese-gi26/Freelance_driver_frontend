"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { PencilSquareIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

// SERVICES & TYPES
import { profileService } from "@/service/profileService";
import { sessionService } from "@/service/sessionService";
import { useAuthContext } from "@/components/context/authContext";
import { DriverProfile } from "@/type/profile";

// CHAMPS À AFFICHER (Comme sur mobile)
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
    vehicleDetails: string;
    // L'image est gérée séparément
}

export default function PersonalInfoPage() {
    const { user, checkAuth } = useAuthContext();
    const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
    
    // États du formulaire
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<DriverProfileFormData>({
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
    });

    // Chargement initial
    useEffect(() => {
        if (user && user.driverProfile) {
            setDriverProfile(user.driverProfile);
            setFormData({
                firstName: user.driverProfile.firstName || '',
                lastName: user.driverProfile.lastName || '',
                nickname: user.driverProfile.nickname || '',
                birthDate: user.driverProfile.birthDate || '',
                phoneNumber: user.driverProfile.phoneNumber || '',
                nationality: user.driverProfile.nationality || '',
                gender: user.driverProfile.gender || '',
                language: user.driverProfile.language || '',
                biography: user.driverProfile.biography || '',
                vehicleDetails: user.driverProfile.vehicleDetails || '',
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Appel au service
            const updatedContext = await profileService.updateDriverProfile(formData);
            
            // Mise à jour de la session locale
            sessionService.saveSessionContext(updatedContext);
            
            // Rafraîchir le contexte global pour l'UI
            await checkAuth();

            toast.success("Profil mis à jour avec succès !");
            setEditable(false);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const loadingToast = toast.loading("Téléversement de la photo...");
            
            try {
                // 1. Upload du fichier
                const newAvatarUrl = await profileService.uploadAvatar(file);
                
                // 2. Mise à jour du profil avec l'URL
                const updatedContext = await profileService.updateDriverAvatarUrl(newAvatarUrl);
                
                // 3. Sync locale
                sessionService.saveSessionContext(updatedContext);
                await checkAuth();
                
                toast.success("Photo de profil mise à jour !", { id: loadingToast });
            } catch (error) {
                console.error(error);
                toast.error("Échec du changement de photo.", { id: loadingToast });
            }
        }
    };

    if (!user) return <div className="p-10 text-center">Chargement...</div>;

    // Si l'utilisateur n'est pas un chauffeur (cas rare si on est sur cette page)
    if (!driverProfile) return <div className="p-10 text-center text-red-500">Profil chauffeur introuvable.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Informations Personnelles</h1>
                {!editable && (
                    <button 
                        onClick={() => setEditable(true)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                        Modifier
                    </button>
                )}
            </div>

            {/* Photo de Profil */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative w-32 h-32">
                    <Image 
                        src={user.driverProfile?.profileImageUrl || "/img/default-avatar.jpeg"} 
                        alt="Profile" 
                        fill
                        className="rounded-full object-cover border-4 border-white shadow-lg"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Prénom */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Prénom</label>
                        {editable ? (
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ) : (
                            <p className="text-gray-800 py-2">{formData.firstName || 'N/A'}</p>
                        )}
                    </div>

                    {/* Nom */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Nom</label>
                        {editable ? (
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ) : (
                            <p className="text-gray-800 py-2">{formData.lastName || 'N/A'}</p>
                        )}
                    </div>

                    {/* Surnom */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Surnom</label>
                        {editable ? (
                            <input
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ) : (
                            <p className="text-gray-800 py-2">{formData.nickname || 'N/A'}</p>
                        )}
                    </div>

                    {/* Date de naissance */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Date de Naissance</label>
                        {editable ? (
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ) : (
                            <p className="text-gray-800 py-2">{formData.birthDate || 'N/A'}</p>
                        )}
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Téléphone</label>
                        {editable ? (
                            <input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ) : (
                            <p className="text-gray-800 py-2">{formData.phoneNumber || 'N/A'}</p>
                        )}
                    </div>

                    {/* Nationalité */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Nationalité</label>
                        {editable ? (
                            <input
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ) : (
                            <p className="text-gray-800 py-2">{formData.nationality || 'N/A'}</p>
                        )}
                    </div>

                    {/* Genre */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Genre</label>
                        {editable ? (
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Sélectionner</option>
                                <option value="Male">Homme</option>
                                <option value="Female">Femme</option>
                                <option value="Other">Autre</option>
                            </select>
                        ) : (
                            <p className="text-gray-800 py-2">{formData.gender || 'N/A'}</p>
                        )}
                    </div>

                    {/* Langue */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Langue</label>
                        {editable ? (
                            <input
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ) : (
                            <p className="text-gray-800 py-2">{formData.language || 'N/A'}</p>
                        )}
                    </div>

                    {/* Biographie (Full Width) */}
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Biographie</label>
                        {editable ? (
                            <textarea
                                name="biography"
                                value={formData.biography}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ) : (
                            <p className="text-gray-800 py-2 whitespace-pre-line">{formData.biography || 'Aucune biographie.'}</p>
                        )}
                    </div>

                     {/* Détails du Véhicule (Full Width) - Spécifique Chauffeur */}
                     <div className="md:col-span-2 space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Détails du véhicule (Résumé)</label>
                        {editable ? (
                            <textarea
                                name="vehicleDetails"
                                value={formData.vehicleDetails}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Marque, Modèle, Année..."
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        ) : (
                            <p className="text-gray-800 py-2 whitespace-pre-line">{formData.vehicleDetails || 'Aucun détail.'}</p>
                        )}
                    </div>

                </div>

                {/* Boutons d'action */}
                {editable && (
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => {
                                // Reset form data to initial state
                                if (user?.driverProfile) {
                                    setFormData({
                                        firstName: user.driverProfile.firstName || '',
                                        lastName: user.driverProfile.lastName || '',
                                        nickname: user.driverProfile.nickname || '',
                                        birthDate: user.driverProfile.birthDate || '',
                                        phoneNumber: user.driverProfile.phoneNumber || '',
                                        nationality: user.driverProfile.nationality || '',
                                        gender: user.driverProfile.gender || '',
                                        language: user.driverProfile.language || '',
                                        biography: user.driverProfile.biography || '',
                                        vehicleDetails: user.driverProfile.vehicleDetails || '',
                                    });
                                }
                                setEditable(false);
                            }}
                            className="flex items-center gap-2 px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            disabled={loading}
                        >
                            <XMarkIcon className="w-5 h-5" />
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition shadow-sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="animate-pulse">Sauvegarde...</span>
                            ) : (
                                <>
                                    <CheckIcon className="w-5 h-5" />
                                    Sauvegarder
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}