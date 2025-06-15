import { motion } from 'framer-motion';

const TripIntentionStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="tripIntentionStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="title font-bold mb-6">Trip Intention</h2>
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

export default TripIntentionStep;