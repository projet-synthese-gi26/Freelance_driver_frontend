import { motion } from 'framer-motion';

const DurationStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="durationStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="title font-bold mb-6">Trip Duration</h2>
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

export default DurationStep;