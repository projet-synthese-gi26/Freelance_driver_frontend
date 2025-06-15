import { motion } from 'framer-motion';

const VehicleDetailsStep = ({ formData, handleInputChange, handleArrayInputChange, nextStep, prevStep }) => (
    <motion.div
        key="vehicleDetailsStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="title font-bold mb-6">Vehicle Details</h2>
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

export default VehicleDetailsStep;