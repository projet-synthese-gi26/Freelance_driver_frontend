import { motion } from 'framer-motion';

const CountryStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="countryStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="title font-bold mb-6">Country</h2>
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

export default CountryStep;