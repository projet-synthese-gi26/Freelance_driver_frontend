// components/registration/AvatarInfo.js
import { useState, useEffect } from 'react';
import Image from "next/image";
export default function AvatarInfo({ formData, handleChange, nextStep, prevStep }) {
    const [errors, setErrors] = useState({});
    const [avatarUrl, setAvatarUrl] = useState('');

    const skinColors = ['light', 'pale', 'light', 'brown', 'dark'];
    const hairStyles = ['short', 'long', 'bald', 'curly', 'ponytail'];
    const clothingStyles = ['casual', 'formal', 'sporty', 'elegant', 'bohemian'];

    useEffect(() => {
        updateAvatarPreview();
    }, [formData.skinColor, formData.hairStyle, formData.clothingStyle]);

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        if (!formData.skinColor) {
            isValid = false;
            newErrors.skinColor = "Skin color is required";
        }
        if (!formData.hairStyle) {
            isValid = false;
            newErrors.hairStyle = "Hair style is required";
        }
        if (!formData.clothingStyle) {
            isValid = false;
            newErrors.clothingStyle = "Clothing style is required";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            nextStep();
        }
    };

    const updateAvatarPreview = () => {
        const skinColor = formData.skinColor || 'light';
        const hairStyle = formData.hairStyle || 'short';
        const clothingStyle = formData.clothingStyle || 'casual';

        // Updated DiceBear API endpoint
        const avatarStyle = 'avataaars';
        const seed = `${skinColor}-${hairStyle}-${clothingStyle}`;
        const url = `https://api.dicebear.com/6.x/${avatarStyle}/svg?seed=${seed}`;

        setAvatarUrl(url);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <div>
                <label className="block mb-2 font-bold">Skin Color</label>
                <div className="flex space-x-2">
                    {skinColors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            className={`w-10 h-10 rounded-full border-2 ${formData.skinColor === color ? 'border-blue-500' : 'border-gray-300'}`}
                            style={{ backgroundColor: color === 'light' ? '#FFDAB9' : color === 'pale' ? '#F0DBAC' : color === 'brown' ? '#8D5524' : color === 'dark' ? '#4A2F1B' : '#D2B48C' }}
                            onClick={() => handleChange('skinColor', color)}
                            title={color}
                        />
                    ))}
                </div>
                {errors.skinColor && <p className="text-red-500 mt-1">{errors.skinColor}</p>}
            </div>

            <div>
                <label htmlFor="hairStyle" className="block mb-2 font-bold">Hair Style</label>
                <select
                    id="hairStyle"
                    value={formData.hairStyle || ''}
                    onChange={(e) => handleChange('hairStyle', e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select a hair style</option>
                    {hairStyles.map((style) => (
                        <option key={style} value={style}>{style}</option>
                    ))}
                </select>
                {errors.hairStyle && <p className="text-red-500 mt-1">{errors.hairStyle}</p>}
            </div>

            <div>
                <label htmlFor="clothingStyle" className="block mb-2 font-bold">Clothing Style</label>
                <select
                    id="clothingStyle"
                    value={formData.clothingStyle || ''}
                    onChange={(e) => handleChange('clothingStyle', e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select a clothing style</option>
                    {clothingStyles.map((style) => (
                        <option key={style} value={style}>{style}</option>
                    ))}
                </select>
                {errors.clothingStyle && <p className="text-red-500 mt-1">{errors.clothingStyle}</p>}
            </div>

            <div>
                <label className="block mb-2 font-bold">Avatar Preview</label>
                {avatarUrl && (
                    <Image src={avatarUrl}  alt="Avatar Preview" className="w-32 h-32 object-cover rounded border-2 border-gray-300" />
                )}
            </div>

            {/*<div className="flex justify-between">*/}
            {/*    <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Previous</button>*/}
            {/*    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Next</button>*/}
            {/*</div>*/}
        </form>
    );
}