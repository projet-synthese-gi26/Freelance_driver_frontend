"use client";
import React, { useState } from 'react';
import FormDialog from "./FormDialog";
import {useRouter} from "next/navigation";
import { ProtectedButton } from '@/components/general/ProtectedButton';
import {v4 as uuidv4} from "uuid";

const CURRENCY = "FCFA";

export default function Mytable({ data }) {
    const [showTable, setShowTable] = useState(true);
    const router = useRouter();
    const storeBookingData = (bookingId, bookingData) => {
        localStorage.setItem(bookingId, JSON.stringify(bookingData));
    };
    const handleButtonClick = (row) => {
        //
        // const dataToSend = {
        //     vehicleData: JSON.stringify(data.vehicleData),
        //     driverData: JSON.stringify(data.driverData),
        //     driver_availability_id:JSON.stringify(row.driver_availability_id),
        //     currency_name:JSON.stringify(CURRENCY)
        // };
        //
        // const queryString = new URLSearchParams(dataToSend).toString();
        //
        // router.push(`/freelance-booking?${queryString}`);

        const bookingId = uuidv4(); // Generate a unique ID-

        const bookingData = {
            vehicleData:data.vehicleData,
            driverData:data.driverData,
            driver_availability_id:row.driver_availability_id,
            currency_name: CURRENCY
        };

        storeBookingData(bookingId, bookingData);

        // Navigate with just the booking ID
        router.push(`/freelance-booking?id=${bookingId}`);
    };


    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US');
    }

    function formatTime(timeString) {
        return timeString.slice(0, 5);
    }

    function formatPrice(price, billingMethod) {
        const formattedPrice = price.toFixed(2);
        switch (billingMethod) {
            case 'hourly':
                return `${formattedPrice} ${CURRENCY}/hour`;
            case 'daily':
                return `${formattedPrice} ${CURRENCY}/day`;
            case 'flat_rate':
                return `${formattedPrice} ${CURRENCY} (flat rate)`;
            case 'pr_km':
                return `${formattedPrice} ${CURRENCY}/km`;
            default:
                return `${formattedPrice} ${CURRENCY}`;
        }
    }

    const availableData = data.driverData.driver_availability_table.filter(row => row.is_available);

    return (
        <div>
            <div className="flex justify-center mb-2">
                <FormDialog driver_id={data.driverData.driver_id}/>
            </div>
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
                                        Book
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}