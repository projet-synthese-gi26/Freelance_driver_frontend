// components/registration/DescriptionInfo.js
import { useState } from 'react';
import Image from 'next/image';

export default function DescriptionInfo({ formData, handleChange, nextStep, prevStep }) {
    const [errors, setErrors] = useState({});
    const [tagInput, setTagInput] = useState('');

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        if (!formData.description || formData.description.trim().length < 50) {
            isValid = false;
            errors.description = "Description must contain at least 50 characters";
        }

        if (!formData.tags || formData.tags.length < 3) {
            isValid = false;
            errors.tags = "Please add at least 3 interests";
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            nextStep();
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && (!formData.tags || !formData.tags.includes(tagInput.trim()))) {
            handleChange('tags', [...(formData.tags || []), tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Here, you should implement the logic to upload the image
            // and get the URL of the uploaded image
            // For this example, we'll simply simulate a URL
            handleChange('profilePicture', URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="description" className="block mb-2">Personal Description</label>
                <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full p-2 border rounded h-32"
                    placeholder="Tell us a bit about yourself..."
                />
                {errors.description && <p className="text-red-500">{errors.description}</p>}
            </div>

            <div>
                <label className="block mb-2">Interests</label>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="flex-grow p-2 border rounded-l"
                        placeholder="Add an interest"
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="bg-blue-500 text-white p-2 rounded-r"
                    >
                        Add
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags && formData.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center">
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 text-red-500 font-bold"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                {errors.tags && <p className="text-red-500">{errors.tags}</p>}
            </div>

            <div>
                <label htmlFor="profilePicture" className="block mb-2">Profile Picture</label>
                <input
                    type="file"
                    id="profilePicture"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full p-2 border rounded"
                />
                {formData.profilePicture && (
                    <Image src={formData.profilePicture} alt="Profile" width={32} height={32} className="mt-2 w-32 h-32 object-cover rounded" />
                )}
            </div>

            {/*<div className="flex justify-between">*/}
            {/*    <button type="button" onClick={prevStep} className="bg-blue-500 text-white p-2 rounded">Previous</button>*/}
            {/*    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Next</button>*/}
            {/*</div>*/}
        </form>
    );
}