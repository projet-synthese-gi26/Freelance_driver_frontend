// components/registration/RoleInfo.js
import { useState } from 'react';

export default function RoleInfo({ formData, handleChange, nextStep, prevStep }) {
    const [errors, setErrors] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [vehicleImage, setVehicleImage] = useState(null);

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        if (!formData.role) {
            isValid = false;
            errors.role = "Role is required";
        }

        if (!profileImage) {
            isValid = false;
            errors.profileImage = "Profile picture is required";
        }

        if (formData.hasVehicle === 'yes' && !vehicleImage) {
            isValid = false;
            errors.vehicleImage = "Vehicle picture is required";
        }

        if (formData.hasVehicle === 'yes' && !formData.vehicleDescription) {
            isValid = false;
            errors.vehicleDescription = "Vehicle description is required";
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Here, you should handle the image uploads before moving to the next step
            // For this example, we'll simply move to the next step
            nextStep();
        }
    };

    const handleImageChange = (e, setImage, field) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            handleChange(field, file);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="role" className="block mb-2">What role would you like to have on the platform?</label>
                <select
                    id="role"
                    value={formData.role || ''}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select a role</option>
                    <option value="freelance">Freelance</option>
                    <option value="rentalAgency">Rental Agency</option>
                    <option value="travelAgency">Travel Agency</option>
                </select>
                {errors.role && <p className="text-red-500">{errors.role}</p>}
            </div>

            <div>
                <label htmlFor="profileImage" className="block mb-2">Upload a profile picture</label>
                <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setProfileImage, 'profileImage')}
                    className="w-full p-2 border rounded"
                />
                {errors.profileImage && <p className="text-red-500">{errors.profileImage}</p>}
            </div>

            <div>
                <label htmlFor="hasVehicle" className="block mb-2">Do you have a vehicle?</label>
                <select
                    id="hasVehicle"
                    value={formData.hasVehicle || ''}
                    onChange={(e) => handleChange('hasVehicle', e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            {formData.hasVehicle === 'yes' && (
                <>
                    <div>
                        <label htmlFor="vehicleImage" className="block mb-2">Upload a picture of your vehicle</label>
                        <input
                            type="file"
                            id="vehicleImage"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setVehicleImage, 'vehicleImage')}
                            className="w-full p-2 border rounded"
                        />
                        {errors.vehicleImage && <p className="text-red-500">{errors.vehicleImage}</p>}
                    </div>

                    <div>
                        <label htmlFor="vehicleDescription" className="block mb-2">Description of your vehicle</label>
                        <textarea
                            id="vehicleDescription"
                            value={formData.vehicleDescription || ''}
                            onChange={(e) => handleChange('vehicleDescription', e.target.value)}
                            className="w-full p-2 border rounded"
                            rows="4"
                        ></textarea>
                        {errors.vehicleDescription && <p className="text-red-500">{errors.vehicleDescription}</p>}
                    </div>
                </>
            )}

            {/*<div className="flex justify-between">*/}
            {/*    <button type="button" onClick={prevStep} className="bg-blue-500 text-white p-2 rounded">Previous</button>*/}
            {/*    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Next</button>*/}
            {/*</div>*/}
        </form>
    );
}