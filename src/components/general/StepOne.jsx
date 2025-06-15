// components/steps/StepOne.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    vehicleType: Yup.string().required('Le type de véhicule est requis'),
    country: Yup.string().required('Le pays est requis'),
    tripIntention: Yup.string().required("L'intention du voyage est requise"),
});

const StepOne = ({ formData, onNext }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: formData,
    });

    const onSubmit = (data) => {
        onNext(data);
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
                    <option value="with">Avec véhicule</option>
                    <option value="without">Sans véhicule</option>
                    <option value="any">N'importe lequel</option>
                </select>
                {errors.vehicleType && <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>}
            </div>

            {/* Ajoutez d'autres champs ici */}

            <div className="mt-4">
                <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                    Suivant
                </button>
            </div>
        </form>
    );
};

export default StepOne;