import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingModal = () => {
    const [step, setStep] = useState(0);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
                className="bg-white rounded-lg p-8 max-w-md w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
            >
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

const VehicleTypeStep = ({ formData, handleInputChange, nextStep }) => (
    <motion.div
        key="vehicleTypeStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="text-2xl font-bold mb-4">Vehicle Type</h2>
        <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
        >
            <option value="">Select a type</option>
            <option value="with">With vehicle</option>
            <option value="without">Without vehicle</option>
            <option value="any">Any</option>
        </select>
        <button onClick={nextStep} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Next
        </button>
    </motion.div>
);

const CountryStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="countryStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="text-2xl font-bold mb-4">Country</h2>
        <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
        >
            <option value="">Select a country</option>
            {/* Add country options here */}
        </select>
        <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
            <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
        </div>
    </motion.div>
);

const TripIntentionStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="tripIntentionStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="text-2xl font-bold mb-4">Trip Intention</h2>
        <select
            name="tripIntention"
            value={formData.tripIntention}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
        >
            <option value="">Select intention</option>
            <option value="longDistance">Long distance</option>
            <option value="shortDistance">Short distance</option>
            <option value="travel">Travel</option>
            <option value="tourism">Tourism</option>
            <option value="errand">Errand</option>
            <option value="other">Other</option>
            <option value="any">Any</option>
        </select>
        <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
            <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
        </div>
    </motion.div>
);

const DurationStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="durationStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="text-2xl font-bold mb-4">Trip Duration</h2>
        <div className="mb-4">
            <label className="block mb-2">
                <input
                    type="checkbox"
                    name="multipleDays"
                    checked={formData.multipleDays}
                    onChange={handleInputChange}
                    className="mr-2"
                />
                Your request extends over several days
            </label>
        </div>
        {formData.multipleDays && (
            <select
                name="timeType"
                value={formData.timeType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
            >
                <option value="">Select time type</option>
                <option value="fullTime">Full time</option>
                <option value="partTime">Part time</option>
            </select>
        )}
        <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
            <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
        </div>
    </motion.div>
);

const DateTimeStep = ({ formData, handleInputChange, nextStep, prevStep }) => {
    const today = new Date().toISOString().split('T')[0];

    return (
        <motion.div
            key="dateTimeStep"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <h2 className="text-2xl font-bold mb-4">Date and Time</h2>
            <div className="mb-4">
                <label className="block mb-2">Start Date</label>
                <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={today}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Start Time</label>
                <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            {formData.multipleDays && (
                <div className="mb-4">
                    <label className="block mb-2">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate || today}
                        className="w-full p-2 border rounded"
                    />
                </div>
            )}
            <div className="mb-4">
                <label className="block mb-2">End Time</label>
                <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
                <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
            </div>
        </motion.div>
    );
};

const VehicleDetailsStep = ({ formData, handleInputChange, handleArrayInputChange, nextStep, prevStep }) => (
    <motion.div
        key="vehicleDetailsStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
        <div className="mb-4">
            <label className="block mb-2">Vehicle Category</label>
            <select
                name="vehicleCategory"
                value={formData.vehicleCategory}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
            >
                <option value="">Select category</option>
                <option value="luxury">Luxury</option>
                <option value="sport">Sport</option>
                <option value="car">Car</option>
                <option value="sedan">Sedan</option>
                <option value="van">Van</option>
                <option value="bus">Bus</option>
                <option value="any">Any</option>
            </select>
        </div>
        <div className="mb-4">
            <label className="block mb-2">Amenities</label>
            {['airConditioned', 'soft', 'television', 'wifi', 'any'].map(amenity => (
                <label key={amenity} className="block">
                    <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleArrayInputChange('amenities', amenity)}
                        className="mr-2"
                    />
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                </label>
            ))}
        </div>
        <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
            <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
        </div>
    </motion.div>
);

const OwnVehicleDetailsStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="ownVehicleDetailsStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="text-2xl font-bold mb-4">Your Vehicle Details</h2>
        <div className="mb-4">
            <label className="block mb-2">Vehicle Category</label>
            <input
                type="text"
                name="ownVehicleDetails.category"
                value={formData.ownVehicleDetails.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block mb-2">Transmission Type</label>
            <select
                name="ownVehicleDetails.transmission"
                value={formData.ownVehicleDetails.transmission}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
            >
                <option value="">Select transmission</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
            </select>
        </div>
        <div className="mb-4">
            <label className="block mb-2">Brand</label>
            <input
                type="text"
                name="ownVehicleDetails.brand"
                value={formData.ownVehicleDetails.brand}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block mb-2">Model</label>
            <input
                type="text"
                name="ownVehicleDetails.model"
                value={formData.ownVehicleDetails.model}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block mb-2">Vehicle Photo</label>
            <input
                type="file"
                name="ownVehicleDetails.photo"
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                accept="image/*"
            />
        </div>
        <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
            <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
        </div>
    </motion.div>
);

const LocationStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="locationStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="text-2xl font-bold mb-4">Pick-up and Drop-off Locations</h2>
        <div className="mb-4">
            <label className="block mb-2">Pick-up Location</label>
            <select
                name="pickUp"
                value={formData.pickUp}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
            >
                <option value="">Select pick-up location</option>
                {/* Add predefined pick-up locations here */}
            </select>
        </div>
        <div className="mb-4">
            <label className="block mb-2">Drop-off Location (Optional)</label>
            <select
                name="dropOff"
                value={formData.dropOff}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
            >
                <option value="">Select drop-off location</option>
                {/* Add predefined drop-off locations here */}
            </select>
        </div>
        <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
            <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
        </div>
    </motion.div>
);

const BillingStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="billingStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="text-2xl font-bold mb-4">Billing Information</h2>
        <div className="mb-4">
            <label className="block mb-2">Billing Method</label>
            <select
                name="billingMethod"
                value={formData.billingMethod}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
            >
                <option value="">Select billing method</option>
                <option value="perHour">Per Hour</option>
                <option value="perKm">Per Km</option>
                <option value="perDay">Per Day</option>
                <option value="flatRate">Flat Rate</option>
            </select>
        </div>
        <div className="mb-4">
            <label className="block mb-2">Price Unit</label>
            <input
                type="number"
                name="priceUnit"
                value={formData.priceUnit}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
            />
        </div>
        <div className="mb-4">
            <label className="block mb-2">Currency</label>
            <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
            >
                <option value="">Select currency</option>
                {/* Add currency options here */}
            </select>
        </div>
        <div className="mb-4">
            <label className="block mb-2">Payment Method</label>
            <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
            >
                <option value="">Select payment method</option>
                <option value="mobile">Mobile</option>
                <option value="card">Card</option>
            </select>
        </div>
        <div className="mb-4">
            <label className="block">
                <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleInputChange}
                    className="mr-2"
                />
                Negotiable
            </label>
        </div>
        <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
            <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
        </div>
    </motion.div>
);

const FinalStep = ({ formData, handleInputChange, calculateCost, prevStep }) => {
    const cost = calculateCost();

    return (
        <motion.div
            key="finalStep"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <h2 className="text-2xl font-bold mb-4">Review and Submit</h2>
            {/* Display a summary of the form data here */}
            <div className="mb-4">
                <strong>Estimated Cost:</strong> {cost} {formData.currency}
            </div>
            <div className="flex justify-between mt-4">
                <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
                <button onClick={() => alert('Form submitted!')} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
            </div>
        </motion.div>
    );
};

export default OnboardingModal;