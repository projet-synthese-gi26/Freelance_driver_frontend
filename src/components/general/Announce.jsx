import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CreateAnnouncement=()=>{
    const router = useRouter();
    const [formData, setFormData] = useState({
        availability: '',
        pickupLocation: '',
        startDate: '',
        startTime: '',
        dropoffLocation: '',
        endDate: '',
        endTime: '',
        moreOptions: false,
        driverType: 'any',
        intention: 'any',
        otherIntention: '',
        spokenLanguage: '',
        vehicleDetails: {
            category: '',
            amenities: [],
            model: '',
            brand: '',
            transmissionType: '',
            size: '',
            photo: null
        },
        billingMethod: 'per hour',
        priceUnit: '',
        currency: '',
        paymentMethod: '',
        negotiable: true,
        totalCost: 0
    });

    useEffect(() => {
        // Load saved form data from localStorage on component mount
        const savedFormData = localStorage.getItem('announcementFormData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, []);

    useEffect(() => {
        // Save form data to localStorage whenever it changes
        localStorage.setItem('announcementFormData', JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to submit this announcement?')) {
            // TODO: Submit the form data to your backend
            console.log('Form submitted:', formData);
            router.push('/announcement-submitted');
        }
    };

    const handleSave = () => {
        // TODO: Save the form data to your backend
        console.log('Form saved:', formData);
        alert('Your announcement has been saved.');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Announcement</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <p className="mb-2">Availability Type:</p>
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            name="availability"
                            value="full time"
                            checked={formData.availability === 'full time'}
                            onChange={handleInputChange}
                            className="form-radio"
                            required
                        />
                        <span className="ml-2">Full Time</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="availability"
                            value="part time"
                            checked={formData.availability === 'part time'}
                            onChange={handleInputChange}
                            className="form-radio"
                        />
                        <span className="ml-2">Part Time</span>
                    </label>
                </div>

                {formData.availability && (
                    <>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block mb-2">Pick-up Location</label>
                                <input
                                    type="text"
                                    name="pickupLocation"
                                    value={formData.pickupLocation}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block mb-2">Drop-off Location</label>
                                <input
                                    type="text"
                                    name="dropoffLocation"
                                    value={formData.dropoffLocation}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    disabled={formData.availability === 'part time'}
                                    required={formData.availability === 'full time'}
                                />
                            </div>
                            <div>
                                <label className="block mb-2">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                    min={formData.startDate}
                                />
                            </div>
                            <div>
                                <label className="block mb-2">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="mb-4">
                    <button
                        type="button"
                        onClick={() => setFormData(prevState => ({ ...prevState, moreOptions: !prevState.moreOptions }))}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {formData.moreOptions ? 'Hide More Options' : 'Show More Options'}
                    </button>
                </div>

                {formData.moreOptions && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-2">Driver Type</label>
                            <select
                                name="driverType"
                                value={formData.driverType}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="any">Any</option>
                                <option value="without vehicle">Without Vehicle</option>
                                <option value="with vehicle">With Vehicle</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Intention</label>
                            <select
                                name="intention"
                                value={formData.intention}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="any">Any</option>
                                <option value="errand">Errand</option>
                                <option value="tourism">Tourism</option>
                                <option value="short distance">Short Distance</option>
                                <option value="long distance">Long Distance</option>
                                <option value="travel">Travel</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {formData.intention === 'other' && (
                            <div className="mb-4">
                                <label className="block mb-2">Specify Other Intention</label>
                                <input
                                    type="text"
                                    name="otherIntention"
                                    value={formData.otherIntention}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block mb-2">Spoken Language</label>
                            <input
                                type="text"
                                name="spokenLanguage"
                                value={formData.spokenLanguage}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* Vehicle Details Section */}
                        {/* ... (add more fields for vehicle details based on driver type) */}

                        {/* Billing Information Section */}
                        <div className="mb-4">
                            <label className="block mb-2">Billing Method</label>
                            <select
                                name="billingMethod"
                                value={formData.billingMethod}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="per km">Per km</option>
                                <option value="per hour">Per hour</option>
                                <option value="per day">Per day</option>
                                <option value="flat rate">Flat rate</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Price Unit</label>
                            <input
                                type="number"
                                name="priceUnit"
                                value={formData.priceUnit}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Currency</label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                {/* Add more currency options */}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="mobile">Mobile</option>
                                <option value="card">Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="google pay">Google Pay</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="negotiable"
                                    checked={formData.negotiable}
                                    onChange={handleInputChange}
                                    className="form-checkbox"
                                />
                                <span className="ml-2">Negotiable</span>
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Total Cost</label>
                            <input
                                type="number"
                                name="totalCost"
                                value={formData.totalCost}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-100"
                            />
                        </div>
                    </>
                )}

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default  CreateAnnouncement;

