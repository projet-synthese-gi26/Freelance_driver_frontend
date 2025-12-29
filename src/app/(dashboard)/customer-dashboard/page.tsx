"use client"
import React, { useState, useEffect } from 'react'
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { toast } from 'react-hot-toast';
import { languageOptions } from "@/data/Structure";
// On garde le DTO pour la structure du formulaire, mais on va le remplir avec les données Client
import { DriverDTO, driverDTO } from '@/app/(dashboard)/freelance-dashboard/FreelanceDTO';

import { profileService } from '@/service/profileService';
import { sessionService } from '@/service/sessionService';

interface FieldConfig {
    field: keyof DriverDTO;
    title: string;
    type: 'text' | 'date' | 'email' | 'select' | 'textarea';
    optional?: boolean;
}

const Page = () => {
    const [editable, setEditable] = useState<boolean>(false)
    const [formData, setFormData] = useState<DriverDTO>(driverDTO)
    const [loading, setLoading] = useState<boolean>(true);

    const fields: FieldConfig[] = [
        { field: 'first_name', title: 'First Name', type: 'text' },
        { field: 'last_name', title: 'Last Name', type: 'text' },
        { field: 'friendly_name', title: 'Nickname', type: 'text', optional: true },
        { field: 'date_of_birth', title: 'Date of Birth', type: 'date' },
        { field: 'driver_email', title: 'Email', type: 'email' },
        { field: 'driver_phone_number', title: 'Phone Number', type: 'text' },
        { field: 'driver_gender', title: 'Gender', type: 'select' },
        { field: 'driver_language', title: 'Language', type: 'select' },
        { field: 'driver_bio', title: 'Bio', type: 'textarea', optional: true }
    ];

    useEffect(() => {
        const loadInitialData = () => {
            const context = sessionService.getUserSessionContext() as any;
            
            if (context) {
                console.log("📦 [1/3] Contexte brut:", context);

                // LOGIQUE DE MAPPING CLIENT (Basée sur vos logs)
                // Dans vos logs, les données sont dans context.clientProfile
                const cp = context.clientProfile;
                
                if (cp) {
                    console.log("🎯 [2/3] Données Client trouvées:", cp);

                    const mappedData: DriverDTO = {
                        ...driverDTO,
                        first_name: cp.firstName || '',
                        last_name: cp.lastName || '',
                        driver_email: cp.contactEmail || context.email || '',
                        driver_phone_number: cp.phoneNumber || '',
                        driver_gender: cp.gender || '',
                        driver_language: cp.language || '',
                        driver_bio: cp.bio || '',
                        date_of_birth: cp.birthDate || '',
                        friendly_name: cp.nickname || '',
                        user_id: context.userId || ''
                    };

                    console.log("📝 [3/3] Mapping Final pour l'écran:", mappedData);
                    setFormData(mappedData);
                } else {
                    console.error("❌ Erreur: clientProfile est introuvable dans le contexte.");
                }
            }
            setLoading(false);
        };
        loadInitialData();
    }, []);

    const handleSave = async () => {
        try {
            const loadingToast = toast.loading("Saving changes...");
            
            // On prépare le payload pour updateClientProfile
            const payload = {
                firstName: formData.first_name,
                lastName: formData.last_name,
                contactEmail: formData.driver_email,
                phoneNumber: formData.driver_phone_number,
                gender: formData.driver_gender,
                language: formData.driver_language,
                bio: formData.driver_bio,
                birthDate: formData.date_of_birth,
                nickname: formData.friendly_name
            };

            const updatedContext = await profileService.updateClientProfile(payload);
            sessionService.saveSessionContext(updatedContext);
            
            toast.dismiss(loadingToast);
            toast.success('Profile updated successfully');
            setEditable(false);
        } catch (error) {
            toast.error("Failed to save changes.");
            console.error(error);
        }
    };

    const handleInputChange = (field: keyof DriverDTO, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) return <div className="p-10 text-center font-bold text-primary">Loading profile...</div>;

    return (
        <div className="p-4 max-w-6xl mx-auto mb-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Personal Information</h1>
                {!editable && (
                    <button onClick={() => setEditable(true)} className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
                        <PencilSquareIcon className="w-5 h-5" />
                        <span className="font-medium">Edit Profile</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        {fields.map((item) => (
                            <div key={item.field} className={item.type === 'textarea' ? 'lg:col-span-3' : ''}>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {item.title} {item.optional && <span className="text-gray-400 font-normal italic">(Optional)</span>}
                                </label>
                                
                                {editable ? (
                                    <>
                                        {item.type === 'select' ? (
                                            <select 
                                                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                                value={formData[item.field] || ''}
                                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            >
                                                <option value="">Select {item.title}</option>
                                                {item.field === 'driver_gender' ? (
                                                    <>
                                                        <option value="MALE">Male</option>
                                                        <option value="FEMALE">Female</option>
                                                    </>
                                                ) : (
                                                    languageOptions.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)
                                                )}
                                            </select>
                                        ) : item.type === 'textarea' ? (
                                            <textarea
                                                rows={4}
                                                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                                                value={formData[item.field] || ''}
                                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            />
                                        ) : (
                                            <input
                                                type={item.type}
                                                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                                                value={formData[item.field] || ''}
                                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="py-2.5 px-3 border-b border-gray-100 text-gray-700 min-h-[45px] bg-gray-50/40 rounded-t-md">
                                        {formData[item.field] || <span className="text-gray-300 italic text-sm">Not provided</span>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {editable && (
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                            <button type="button" onClick={handleSave} className="bg-primary text-white px-8 py-2.5 rounded-lg font-bold shadow-md">
                                Save Changes
                            </button>
                            <button type="button" onClick={() => setEditable(false)} className="px-8 py-2.5 rounded-lg text-gray-500 border">
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Page;