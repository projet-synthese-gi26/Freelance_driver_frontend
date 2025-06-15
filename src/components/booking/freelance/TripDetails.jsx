import React, { useState, useEffect } from "react";

const TripDetails = ({ availability, currency_name, availability_table }) => {
    const [showTable, setShowTable] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState(availability);

    useEffect(() => {
        setSelectedAvailability(availability);
    }, [availability]);

    const startDate = selectedAvailability.start_date;
    const endDate = selectedAvailability.end_date;
    const startTime = selectedAvailability.start_time;
    const endTime = selectedAvailability.end_time;
    const price = selectedAvailability.price;
    const paymentMethod = selectedAvailability.driver_billing_method_name;

    const availableData = availability_table.filter(row => row.is_available);

    function formatTime(timeString) {
        return timeString.slice(0, 5);
    }

    function formatPrice(price, billingMethod) {
        const formattedPrice = price.toFixed(2);
        switch (billingMethod) {
            case 'hourly':
                return `${formattedPrice} ${currency_name}/hour`;
            case 'daily':
                return `${formattedPrice} ${currency_name}/day`;
            case 'flat_rate':
                return `${formattedPrice} ${currency_name} (flat rate)`;
            case 'pr_km':
                return `${formattedPrice} ${currency_name}/km`;
            default:
                return `${formattedPrice} ${currency_name}`;
        }
    }

    function formatDateX(dateString) {
        return new Date(dateString).toLocaleDateString('FR-fr');
    }

    const handleButtonClick = (row) => {
        setSelectedAvailability(row);
        setShowTable(false);
    };

    const isSameDay = startDate === endDate;

    if (!selectedAvailability || Object.keys(selectedAvailability).length === 0) {
        return <div>No availability data</div>;
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="col-span-12 text lg:col-span-4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-5">
                <h4 className="title font-semibold mb-4">Availability purchase </h4>
                <div className="space-y-4">
                    <div className="border-b pb-4">
                        <h5 className="text font-medium mb-2">Schedule</h5>
                        {isSameDay ? (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-medium">{formatDateX(startDate)}</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-gray-600">Time:</span>
                                    <span className="font-medium">{startTime} - {endTime}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">From:</span>
                                    <span className="font-medium">{formatDateX(startDate)} at {startTime}</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-gray-600">To:</span>
                                    <span className="font-medium">{formatDateX(endDate)} at {endTime}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <div>
                        <h5 className="text font-medium mb-2">Payment</h5>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-medium">{price.toFixed(2)} {currency_name}</span>
                        </div>
                        <div className="flex justify-between mt-2 mb-2">
                            <span className="text-gray-600">Method:</span>
                            <span className="font-medium">{paymentMethod}</span>
                        </div>

                        <div className="items-center gap-1 overflow-x-auto">
                            <div className="block text-1xl font-semibold clr-neutral-600 mb-4 flex flex-col gap-4">
                                <button onClick={() => setShowTable(!showTable)} className="flex items-center justify-between flex-wrap">
                                    {showTable ? 'Hide driver availability' : 'Show driver availability'}
                                    <span className={`inline-block transition-transform ${showTable ? 'rotate-180' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                             stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                            {showTable && availableData.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-400 px-4 py-2">Date</th>
                                            <th className="border border-gray-400 px-4 py-2">Start Time</th>
                                            <th className="border border-gray-400 px-4 py-2">End Time</th>
                                            <th className="border border-gray-400 px-4 py-2">Price</th>
                                            <th className="border border-gray-400 px-4 py-2">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {availableData.map((row) => (
                                            <tr key={row.driver_availability_id}>
                                                <td className="border border-gray-400 px-4 py-2">{formatDate(row.start_date)}</td>
                                                <td className="border border-gray-400 px-4 py-2">{formatTime(row.start_time)}</td>
                                                <td className="border border-gray-400 px-4 py-2">{formatTime(row.end_time)}</td>
                                                <td className="border border-gray-400 px-4 py-2">
                                                    {formatPrice(row.price, row.driver_billing_method_name)}
                                                </td>
                                                <td className="border border-gray-400 px-4 py-2">
                                                    <button
                                                        className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleButtonClick(row)}
                                                    >
                                                        Change
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetails;