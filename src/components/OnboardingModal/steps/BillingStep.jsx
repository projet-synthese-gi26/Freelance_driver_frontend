import { motion } from 'framer-motion';

const BillingStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
    <motion.div
        key="billingStep"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
    >
        <h2 className="title font-bold mb-6">Billing Information</h2>
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

export default BillingStep;