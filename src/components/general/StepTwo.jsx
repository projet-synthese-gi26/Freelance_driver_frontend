// components/steps/StepTwo.js
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, isBefore, isAfter, startOfDay } from 'date-fns';

const schema = Yup.object().shape({
    multipleDays: Yup.boolean().required(),
    timeType: Yup.string().when('multipleDays', {
        is: true,
        then: Yup.string().required('Veuillez sélectionner le type de temps'),
    }),
    startDate: Yup.date().required('La date de début est requise')
        .min(startOfDay(new Date()), 'La date de début ne peut pas être dans le passé'),
    startTime: Yup.string().required("L'heure de début est requise"),
    endDate: Yup.date().when('multipleDays', {
        is: true,
        then: Yup.date().required('La date de fin est requise')
            .min(Yup.ref('startDate'), 'La date de fin doit être après la date de début'),
    }),
    endTime: Yup.string().required("L'heure de fin est requise"),
});

const StepTwo = ({ formData, onNext, onPrevious }) => {
    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            multipleDays: formData.multipleDays || false,
            timeType: formData.timeType || '',
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            startTime: formData.startTime || '',
            endDate: formData.endDate ? new Date(formData.endDate) : null,
            endTime: formData.endTime || '',
        },
    });

    const multipleDays = watch('multipleDays');
    const startDate = watch('startDate');

    const onSubmit = (data) => {
        onNext(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        {...register('multipleDays')}
                        className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2 text-gray-700">La demande s'étend sur plusieurs jours</span>
                </label>
            </div>

            {multipleDays && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type de temps</label>
                    <select
                        {...register('timeType')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Sélectionnez le type de temps</option>
                        <option value="fullTime">Temps plein</option>
                        <option value="partTime">Temps partiel</option>
                    </select>
                    {errors.timeType && <p className="mt-1 text-sm text-red-600">{errors.timeType.message}</p>}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Date de début</label>
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            minDate={new Date()}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    )}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Heure de début</label>
                <input
                    type="time"
                    {...register('startTime')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>}
            </div>

            {multipleDays && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                {...field}
                                selected={field.value}
                                onChange={(date) => field.onChange(date)}
                                minDate={startDate || new Date()}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        )}
                    />
                    {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Heure de fin</label>
                <input
                    type="time"
                    {...register('endTime')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>}
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

export default StepTwo;