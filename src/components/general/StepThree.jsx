// components/steps/StepThree.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    vehicleType: Yup.string().required('Le type de véhicule est requis'),
    brand: Yup.string().required('La marque est requise'),
    model: Yup.string().required('Le modèle est requis'),
    year: Yup.number()
        .required("L'année est requise")
        .min(1900, "L'année doit être supérieure à 1900")
        .max(new Date().getFullYear(), "L'année ne peut pas être dans le futur"),
    // La validation de l'image se fait séparément car elle n'est pas gérée par react-hook-form
});

const StepThree = ({ formData, onNext, onPrevious }) => {
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            vehicleType: formData.vehicleType || '',
            brand: formData.brand || '',
            model: formData.model || '',
            year: formData.year || '',
        },
    });

    const onSubmit = (data) => {
        if (!imageFile) {
            setImageError('Une photo du véhicule est requise');
            return;
        }
        onNext({ ...data, vehicleImage: imageFile });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setImageError('La taille de l\'image ne doit pas dépasser 5MB');
                setImageFile(null);
            } else {
                setImageFile(file);
                setImageError('');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Type de véhicule</label>
                <select
                    {...register('vehicleType')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="">Sélectionnez le type de véhicule</option>
                    <option value="car">Voiture</option>
                    <option value="motorcycle">Moto</option>
                    <option value="van">Camionnette</option>
                    <option value="truck">Camion</option>
                </select>
                {errors.vehicleType && <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Marque</label>
                <input
                    type="text"
                    {...register('brand')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Modèle</label>
                <input
                    type="text"
                    {...register('model')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Année</label>
                <input
                    type="number"
                    {...register('year')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Photo du véhicule</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
                />
                {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
                {imageFile && <p className="mt-1 text-sm text-green-600">Image sélectionnée : {imageFile.name}</p>}
            </div>

            <div className="flex justify-between mt-4">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                    Précédent
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                    Suivant
                </button>
            </div>
        </form>
    );
};

export default StepThree;