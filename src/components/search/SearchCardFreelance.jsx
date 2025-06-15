import React, { useState } from 'react';
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RightModal from "@/components/modal/RightModal";
import { v4 as uuidv4 } from 'uuid';

const CURRENCY = "XAF";

const SearchCardFreelance = ({
                          driverData,
                          vehicleData,
                             }) => {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const data={
        vehicleData,
        driverData
    }

    const storeBookingData = (bookingId, bookingData) => {
        localStorage.setItem(bookingId, JSON.stringify(bookingData));
    };

    const handleBook = () => {
        const bookingId = uuidv4(); // Generate a unique ID-
        // const  driver_availability_id="1";
        // const data = {
        //
        //     vehicleData: JSON.stringify(vehicleData),
        //     driverData: JSON.stringify(driverData),
        //     driver_availability_id:JSON.stringify(driver_availability_id),
        //     currency_name:JSON.stringify(CURRENCY)
        // };
        // const queryString = new URLSearchParams(data).toString();
        // router.push(`freelance-booking?${queryString}`);

        const driver_availability_id = "1";
        const bookingData = {
            vehicleData:vehicleData,
            driverData:driverData,
            driver_availability_id:driver_availability_id,
            currency_name: CURRENCY
        };

        storeBookingData(bookingId, bookingData);

        // Navigate with just the booking ID
        router.push(`/freelance-booking?id=${bookingId}`);

    };

    return (
        <div key={driverData.driver_id} className="col-span-12 text mb-6">
            <div className="flex flex-col text md:flex-row rounded-2xl p-6 bg-white">

                <div className="bg-[#F5F6FF] rounded-xl shrink-0 w-full md:w-48 h-48 md:h-auto mr-0 md:mr-6 mb-4 md:mb-0 overflow-hidden">
                    <Image
                        width={192}
                        height={192}
                        src={driverData.driver_profile_image}
                        alt={"title"}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                </div>
                <div className="flex-grow overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                            <h2 className="title font-bold text-gray-800">{driverData.driver_last_name+" "+driverData.driver_first_name}</h2>
                            <div className="flex items-center">
                                <StarIcon className="w-5 h-5 text-yellow-400 mr-1"/>
                            </div>
                            <p className="text-gray-600">
                                <i className="las la-map-marker text-primary"></i> {driverData.driverLocation}
                            </p>
                            <p className="text-gray-600">
                                <i className="las la-briefcase text-primary"></i>
                                Experiences: {driverData.driver_experiences.join(", ")}
                            </p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <div className="flex flex-col md:flex-row gap-2 mt-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                              //  className="btn-primary bg-primary text-white hover:bg-blue-600 rounded-full font-medium px-3 py-1 transition-colors duration-300"
                                className="btn-primary bg-primary  text-white  sm:px-3  sm:py-1 rounded-md hover:bg-blue-600 font-medium px-3 py-1 flex items-center justify-center text w-full sm:w-auto transition-colors duration-300"
                            >
                                See more
                            </button>

                            <button
                                onClick={handleBook}
                                className="btn-secondary bg-green-600  text-white  sm:px-3  sm:py-1 rounded-md hover:bg-green-500 font-medium px-3 py-1 flex items-center justify-center text w-full sm:w-auto transition-colors duration-300"
                            >
                                Book
                            </button>
                            </div>
                        </div>
                    </div>

                    <ul className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {[
                            {icon: "la-user-friends", text: `${vehicleData.total_seat_number} seats`},
                            {icon: "la-shopping-bag", text: `${vehicleData.luggage_max_capacity} kg of bags`},
                            {icon: "la-tachometer-alt", text: `${vehicleData.mileage_at_mileage_since_commissioning} km` },
                            { icon: "la-gas-pump", text:` ${vehicleData.fuel_type_name}` },
                            { icon: "la-cog", text: `${vehicleData.transmission_type_name}` },
                        ].map((item, index) => (
                            <li key={index} className="bg-[#F5FCF8] rounded-lg p-2 text-center">
                                <i className={`las ${item.icon} text-[#279155] text-xl`}></i>
                                <span className="block text-gray-600">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="">
                        <p className="font-semibold">Languages: {driverData.driver_languages.join(", ")}</p>
                        <p className="font-semibold">Specialties: {driverData.driver_specialities.join(", ")}</p>
                        <p className="font-semibold">Keywords: {driverData.driver_keywords.join(" | ")}</p>
                    </div>
                </div>
            </div>
            <RightModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pageContent={true} data={data}>
                {/* Modal content remains the same */}
            </RightModal>
        </div>
    );
};

export default SearchCardFreelance;