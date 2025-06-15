import { motion } from 'framer-motion';

const VehicleTypeStep = ({ formData, handleInputChange, nextStep }) => (
    <motion.div
        key="vehicleTypeStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <span className="title font-bold mb-6">What type of driver do you need?</span>
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

export default VehicleTypeStep;