import { motion } from 'framer-motion';

const FinalStep = ({ formData, handleInputChange, calculateCost, prevStep }) => {
    const cost = calculateCost();

    return (
        <motion.div
            key="finalStep"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <h2 className="title font-bold mb-4">Review and Submit</h2>
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

export default FinalStep;