// components/steps/StepFour.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    startLocation: Yup.string().required('Le point de départ est requis'),
    endLocation: Yup.string().required("Le point d'arrivée est requis"),
    passengerCapacity: Yup.number()
        .required('Le nombre de passagers est requis')
        .min(1, 'Le nombre de passagers doit être au moins 1')
        .max(10, 'Le nombre de passagers ne peut pas dépasser 10'),
    musicPreference: Yup.string().required('La préférence musicale est requise'),
    petsAllowed: Yup.boolean().required('Veuillez indiquer si les animaux sont autorisés'),
    additionalInfo: Yup.string().max(500, 'Les informations supplémentaires ne doivent pas dépasser 500 caractères'),
});

const StepFour = ({ formData, onNext, onPrevious }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            startLocation: formData.startLocation || '',
            endLocation: formData.endLocation || '',
            passengerCapacity: formData.passengerCapacity || 1,
            musicPreference: formData.musicPreference || '',
            petsAllowed: formData.petsAllowed || false,
            additionalInfo: formData.additionalInfo || '',
        },
    });

    const onSubmit = (data) => {
        onNext(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Point de départ</label>
                <input
                    type="text"
                    {...register('startLocation')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.startLocation && <p className="mt-1 text-sm text-red-600">{errors.startLocation.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Point d'arrivée</label>
                <input
                    type="text"
                    {...register('endLocation')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.endLocation && <p className="mt-1 text-sm text-red-600">{errors.endLocation.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de passagers</label>
                <input
                    type="number"
                    {...register('passengerCapacity')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.passengerCapacity && <p className="mt-1 text-sm text-red-600">{errors.passengerCapacity.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Préférence musicale</label>
                <select
                    {...register('musicPreference')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="">Sélectionnez une préférence</option>
                    <option value="pop">Pop</option>
                    <option value="rock">Rock</option>
                    <option value="jazz">Jazz</option>
                    <option value="classical">Classique</option>
                    <option value="noMusic">Pas de musique</option>
                </select>
                {errors.musicPreference && <p className="mt-1 text-sm text-red-600">{errors.musicPreference.message}</p>}
            </div>

            <div>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        {...register('petsAllowed')}
                        className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2 text-gray-700">Animaux de compagnie autorisés</span>
                </label>
                {errors.petsAllowed && <p className="mt-1 text-sm text-red-600">{errors.petsAllowed.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Informations supplémentaires</label>
                <textarea
                    {...register('additionalInfo')}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></textarea>
                {errors.additionalInfo && <p className="mt-1 text-sm text-red-600">{errors.additionalInfo.message}</p>}
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

export default StepFour;