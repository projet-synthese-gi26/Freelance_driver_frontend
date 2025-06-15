// components/registration/PersonalIdentityInfo.js
import { useState } from 'react';

export default function PersonalIdentityInfo({ formData, handleChange, nextStep }) {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        if (!formData.firstName) {
            isValid = false;
            errors.firstName = "First name is required";
        }

        if (!formData.lastName) {
            isValid = false;
            errors.lastName = "Last name is required";
        }

        if (!formData.dateOfBirth) {
            isValid = false;
            errors.dateOfBirth = "Date of birth is required";
        } else {
            const age = calculateAge(formData.dateOfBirth);
            if (age < 0) {
                isValid = false;
                errors.dateOfBirth = "You must be at least 18 years old";
            }
        }

        if (!formData.gender) {
            isValid = false;
            errors.gender = "Gender is required";
        }

        setErrors(errors);
        return isValid;
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            nextStep();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="firstName" className="block mb-2">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full p-2 border rounded"
                />
                {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
            </div>

            <div>
                <label htmlFor="lastName" className="block mb-2">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full p-2 border rounded"
                />
                {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
            </div>

            <div>
                <label htmlFor="dateOfBirth" className="block mb-2">Date of Birth</label>
                <input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="w-full p-2 border rounded"
                />
                {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth}</p>}
            </div>

            <div>
                <label htmlFor="gender" className="block mb-2">Gender</label>
                <select
                    id="gender"
                    value={formData.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500">{errors.gender}</p>}
            </div>

            {/*<div className="flex justify-end">*/}
            {/*    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Next</button>*/}
            {/*</div>*/}
        </form>
    );
}