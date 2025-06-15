// import { motion } from 'framer-motion';
//
// const OwnVehicleDetailsStep = ({ formData, handleInputChange, nextStep, prevStep }) => (
//     <motion.div
//         key="ownVehicleDetailsStep"
//         initial={{ opacity: 0, x: 50 }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: -50 }}
//     >
//         <h2 className="text-2xl font-bold mb-4">Your Vehicle Details</h2>
//         <div className="mb-4">
//             <label className="block mb-2">Vehicle Category</label>
//             <input
//                 type="text"
//                 name="ownVehicleDetails.category"
//                 value={formData.ownVehicleDetails.category}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//             />
//         </div>
//         <div className="mb-4">
//             <label className="block mb-2">Transmission Type</label>
//             <select
//                 name="ownVehicleDetails.transmission"
//                 value={formData.ownVehicleDetails.transmission}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//             >
//                 <option value="">Select transmission</option>
//                 <option value="manual">Manual</option>
//                 <option value="automatic">Automatic</option>
//             </select>
//         </div>
//         <div className="mb-4">
//             <label className="block mb-2">Brand</label>
//             <input
//                 type="text"
//                 name="ownVehicleDetails.brand"
//                 value={formData.ownVehicleDetails.brand}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//             />
//         </div>
//         <div className="mb-4">
//             <label className="block mb-2">Model</label>
//             <input
//                 type="text"
//                 name="ownVehicleDetails.model"
//                 value={formData.ownVehicleDetails.model}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//             />
//         </div>
//         <div className="mb-4">
//             <label className="block mb-2">Vehicle Photo</label>
//             <input
//                 type="file"
//                 name="ownVehicleDetails.photo"
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 accept="image/*"
//             />
//         </div>
//         <div className="flex justify-between mt-4">
//             <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Previous</button>
//             <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
//         </div>
//     </motion.div>
// );
//
// export default OwnVehicleDetailsStep;

import { motion } from 'framer-motion';
import Select from '@/components/general/CustomSelect';

const OwnVehicleDetailsStep = ({ formData, handleInputChange, nextStep, prevStep }) => {
    const transmissionOptions = [
        { value: 'manual', label: 'Manual' },
        { value: 'automatic', label: 'Automatic' },
    ];

    const handleSelectChange = (selectedOption, actionMeta) => {
        handleInputChange({
            target: {
                name: actionMeta.name,
                value: selectedOption.value,
            },
        });
    };

    return (
        <motion.div
            key="ownVehicleDetailsStep"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <h2 className="title font-bold mb-6">Your Vehicle Details</h2>
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
                <Select
                    name="ownVehicleDetails.transmission"
                    value={transmissionOptions.find(option => option.value === formData.ownVehicleDetails.transmission)}
                    onChange={handleSelectChange}
                    options={transmissionOptions}
                    className="w-full"
                    classNamePrefix="react-select"
                    placeholder="Select transmission"
                    required
                />
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
};

export default OwnVehicleDetailsStep;