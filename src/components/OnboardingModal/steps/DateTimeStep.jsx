import { motion } from 'framer-motion';

const DateTimeStep = ({ formData, handleInputChange, nextStep, prevStep }) => {
    const today = new Date().toISOString().split('T')[0];

    return (
        <motion.div
            key="dateTimeStep"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <h2 className="title font-bold mb-6">Date and Time</h2>
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

export default DateTimeStep;