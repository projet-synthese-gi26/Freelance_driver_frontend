import { motion } from 'framer-motion';

const LocationStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="locationStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="title font-bold mb-6">Pick-up and Drop-off Locations</h2>
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
            <button onClick={prevStep} className="bg-gray-300 text px-4 py-2 rounded">Previous</button>
            <button onClick={nextStep} className="bg-blue-500 text text-white px-4 py-2 rounded">Next</button>
        </div>
    </motion.div>
);

export default LocationStep;