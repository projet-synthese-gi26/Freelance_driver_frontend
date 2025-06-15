// components/registration/ResidenceInfo.js
import { useState, useEffect } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list'; // You might need to install this package
import { City } from 'country-state-city';
import { validate } from 'postal-codes-js';

export default function ResidenceInfo({ formData, handleChange, nextStep, prevStep }) {
    const [errors, setErrors] = useState({});
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (formData.country) {
            const citiesData = City.getCitiesOfCountry(formData.country);
            setCities(citiesData.map(city => ({ value: city.name, label: city.name })));
        }
    }, [formData.country]);
    useEffect(() => {
        // Initialize the list of countries
        setCountries(countryList().getData());
    }, []);


    const handlePostalCodeChange = (e) => {
        const postalCode = e.target.value;
        handleChange('postalCode', postalCode);

        if (formData.country && postalCode) {
            const isValid = validate(formData.country, postalCode);
            if (!isValid) {
                setErrors(prev => ({...prev, postalCode: "Code postal invalide pour le pays sélectionné"}));
            } else {
                setErrors(prev => ({...prev, postalCode: null}));
            }
        }
    };
    const validateForm = () => {
        let isValid = true;
        let errors = {};

        if (!formData.postalCode) {
            isValid = false;
            errors.postalCode = "Le code postal est requis";
        } else if (!validate(formData.country, formData.postalCode)) {
            isValid = false;
            errors.postalCode = "Code postal invalide pour le pays sélectionné";
        }

        if (!formData.address) {
            isValid = false;
            errors.address = "Address is required";
        }

        if (!formData.city) {
            isValid = false;
            errors.city = "City is required";
        }

        if (!formData.country) {
            isValid = false;
            errors.country = "Country is required";
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">


            <div>
                <label htmlFor="country" className="block mb-2">Current Country</label>
                <Select
                    options={countries}
                    value={countries.find(country => country.value === formData.country)}
                    onChange={(selectedOption) => handleChange('country', selectedOption.value)}
                    className="w-full"
                />
                {errors.country && <p className="text-red-500">{errors.country}</p>}
            </div>

            <div>
                <label htmlFor="postalCode" className="block mb-2">Code postal</label>
                <input
                    type="text"
                    id="postalCode"
                    value={formData.postalCode || ''}
                    onChange={handlePostalCodeChange}
                    className="w-full p-2 border rounded"
                />
                {errors.postalCode && <p className="text-red-500">{errors.postalCode}</p>}
            </div>

            <div>
                <label htmlFor="address" className="block mb-2">Address</label>
                <input
                    type="text"
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full p-2 border rounded"
                />
                {errors.address && <p className="text-red-500">{errors.address}</p>}
            </div>


            <div>
                <label htmlFor="city" className="block mb-2">City</label>
                <Select
                    options={cities}
                    value={cities.find(city => city.value === formData.city)}
                    onChange={(selectedOption) => handleChange('city', selectedOption.value)}
                    className="w-full"
                />
                {errors.city && <p className="text-red-500">{errors.city}</p>}
            </div>


            {/*<div className="flex justify-between">*/}
            {/*    <button type="button" onClick={prevStep} className="bg-blue-500 text-white p-2 rounded">Previous*/}
            {/*    </button>*/}
            {/*    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Next</button>*/}
            {/*</div>*/}
        </form>
    );
}