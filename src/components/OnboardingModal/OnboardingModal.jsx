"use client";
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Imports des étapes (inchangés)
import VehicleTypeStep from './steps/VehicleTypeStep';
import CountryStep from './steps/CountryStep';
import TripIntentionStep from './steps/TripIntentionStep';
import DurationStep from './steps/DurationStep';
import DateTimeStep from './steps/DateTimeStep';
import VehicleDetailsStep from './steps/VehicleDetailsStep';
import OwnVehicleDetailsStep from './steps/OwnVehicleDetailsStep';
import LocationStep from './steps/LocationStep';
import BillingStep from './steps/BillingStep';
import FinalStep from './steps/FinalStep';

// IMPORTS API
import { orderService } from '@/service/orderService'; // Ou announcementService
import { sessionService } from '@/service/sessionService';

const OnboardingModal = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const modalRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Votre state initial (inchangé)
    const [formData, setFormData] = useState({
        vehicleType: '',
        country: '',
        tripIntention: '',
        multipleDays: false,
        timeType: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        vehicleCategory: '',
        amenities: [],
        ownVehicleDetails: { category: '', transmission: '', brand: '', model: '', photo: null },
        pickUp: '',
        dropOff: '',
        billingMethod: '',
        priceUnit: 0,
        currency: '',
        paymentMethod: '',
        negotiable: false,
    });

    // Gestion fermeture (inchangée)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Helpers (inchangés)
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleArrayInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: prev[name].includes(value) ? prev[name].filter(i => i !== value) : [...prev[name], value]
        }));
    };
    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const calculateCost = () => {
        // Logique simplifiée pour l'exemple
        return formData.priceUnit || 0; 
    };

    // --- LOGIQUE D'ENVOI AU BACKEND ---
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Vérifier la connexion
            if (!sessionService.isLoggedIn()) {
                toast.error("Vous devez être connecté pour publier.");
                setIsSubmitting(false);
                return;
            }

            // 2. Récupérer infos utilisateur
            // Note: sessionService.getUserContext() est async dans votre version mobile adaptée
            const userContext = await sessionService.getUserContext(); 
            
            // 3. Mapper les données pour le backend (Order/Resource)
            const orderPayload = {
                name: `${formData.tripIntention} - ${formData.vehicleType}`,
                availableSeats: 4, // Valeur par défaut ou champ à ajouter
                price: parseFloat(formData.priceUnit),
                location: formData.pickUp, // Le backend stocke ça dans 'storage_condition'
                hasCar: formData.vehicleType === 'with',
                date: formData.startDate,
                time: formData.startTime,
                paymentMethod: formData.paymentMethod,
                email: userContext?.email || "user@example.com",
                phone: "N/A", // À récupérer du profil si disponible
                clientName: userContext?.name || "Client",
                // Métadonnées supplémentaires si besoin
            };

            console.log("Envoi au backend:", orderPayload);

            await orderService.createOrder(orderPayload);
            
            toast.success("Annonce publiée avec succès !");
            onClose();

        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la publication.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Rendu des étapes
    const renderStep = () => {
        switch(step) {
            case 0: return <VehicleTypeStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} />;
            case 1: return <CountryStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 2: return <TripIntentionStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 3: return <DurationStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 4: return <DateTimeStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 5: return formData.vehicleType === 'with' 
                    ? <VehicleDetailsStep formData={formData} handleInputChange={handleInputChange} handleArrayInputChange={handleArrayInputChange} nextStep={nextStep} prevStep={prevStep} /> 
                    : <OwnVehicleDetailsStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 6: return <LocationStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 7: return <BillingStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 8: return (
                // On passe handleSubmit ici
                <FinalStep 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    calculateCost={calculateCost} 
                    prevStep={prevStep} 
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div ref={modalRef} className="bg-white rounded-lg p-8 max-w-md w-full" initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 50}}>
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default OnboardingModal;