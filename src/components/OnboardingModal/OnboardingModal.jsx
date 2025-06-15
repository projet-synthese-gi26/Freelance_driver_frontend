import {useEffect, useRef, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const OnboardingModal = ({  onClose }) => {
    const [step, setStep] = useState(0);
    const modalRef = useRef(null);
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
        ownVehicleDetails: {
            category: '',
            transmission: '',
            brand: '',
            model: '',
            photo: null,
        },
        pickUp: '',
        dropOff: '',
        billingMethod: '',
        priceUnit: 0,
        currency: '',
        paymentMethod: '',
        negotiable: false,
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }

        };
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayInputChange = (name, value) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: prevData[name].includes(value)
                ? prevData[name].filter(item => item !== value)
                : [...prevData[name], value]
        }));
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const calculateCost = () => {
        const { billingMethod, priceUnit, startDate, endDate, startTime, endTime } = formData;
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        const diff = end - start;

        switch(billingMethod) {
            case 'perHour':
                return (diff / (1000 * 60 * 60)) * priceUnit;
            case 'perDay':
                return (diff / (1000 * 60 * 60 * 24)) * priceUnit;
            case 'perKm':
                // Assuming a fixed distance for simplicity
                return 100 * priceUnit;
            case 'flatRate':
                return priceUnit;
            default:
                return 0;
        }
    };

    const renderStep = () => {
        switch(step) {
            case 0:
                return <VehicleTypeStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} />;
            case 1:
                return <CountryStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 2:
                return <TripIntentionStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 3:
                return <DurationStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 4:
                return <DateTimeStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 5:
                return formData.vehicleType === 'with'
                    ? <VehicleDetailsStep formData={formData} handleInputChange={handleInputChange} handleArrayInputChange={handleArrayInputChange} nextStep={nextStep} prevStep={prevStep} />
                    : <OwnVehicleDetailsStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 6:
                return <LocationStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 7:
                return <BillingStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} prevStep={prevStep} />;
            case 8:
                return <FinalStep formData={formData} handleInputChange={handleInputChange} calculateCost={calculateCost} prevStep={prevStep} />;
            default:
                return null;
        }
    };



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                ref={modalRef}
                className="bg-white rounded-lg p-8 max-w-md w-full"
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 50}}
            >


                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default OnboardingModal;