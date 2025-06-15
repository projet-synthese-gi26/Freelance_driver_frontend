import React, { useState } from 'react';
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RightModal from "@/components/modal/RightModal";

const SearchCardFreelance = ({
                                 id,
                                 img,
                                 price,
                                 title,
                                 driverPicture,
                                 driverName,
                                 driverNumber,
                                 driverLocation,
                                 driverMail,
                                 pass,
                                 bag,
                                 maxDistance,
                                 fuelType,
                                 boxType,
                                 star,
                                 departureCity,
                                 arrivalCity,
                                 departureDay,
                                 arrivalDay,
                                 departureHour,
                                 arrivalHour,
                                 travelClass,
                                 keywords = ["ddd", "eee", "zzz", "aaaa"],
                                 description = "sssssssssssssssssssssssss",
                                 syndicat = "agence",
                                 experience = "5 years",
                                 languages = ["English", "French"],
                                 specialties = ["Long distance", "Night driving"],
                             }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleSeeMore = () => {
        const data = { id, img, price, title, driverPicture, driverName, driverLocation, driverNumber, driverMail, pass, bag, maxDistance, fuelType, boxType, star, departureCity, arrivalCity, departureDay, arrivalDay, departureHour, arrivalHour, travelClass };
        const queryString = new URLSearchParams(Object.entries(data).map(([key, value]) => [key, String(value)])).toString();
        router.push(`detailpage?${queryString}`);
    };

    return (
        <div key={id} className="col-span-12 mb-6">
            <div className="flex flex-col md:flex-row rounded-2xl p-6 bg-white">

                <div className="bg-[#F5F6FF] rounded-xl shrink-0 w-full md:w-48 h-48 md:h-auto mr-0 md:mr-6 mb-4 md:mb-0 overflow-hidden">
                    <Image
                        width={192}
                        height={192}
                        src={img}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                </div>
                <div className="flex-grow overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{driverName}</h2>
                            <div className="flex items-center text-sm mb-2">
                                <StarIcon className="w-5 h-5 text-yellow-400 mr-1"/>
                                <span className="text-gray-700 font-semibold">{star}</span>
                                <span className="text-gray-600 ml-2">({travelClass})</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                                <i className="las la-map-marker text-primary"></i> {driverLocation}
                            </p>
                            <p className="text-sm text-gray-600">
                                <i className="las la-briefcase text-primary"></i> Experience: {experience}
                            </p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <span className="block text-primary font-bold text-3xl mb-2">
                                {price} FCFA
                            </span>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary bg-primary text-white hover:bg-blue-600 rounded-full font-semibold text-sm px-6 py-2 transition-colors duration-300"
                            >
                                See more
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between text-sm mb-4 bg-gray-50 p-4 rounded-lg">
                        <div className="mb-2 md:mb-0">
                            <p className="font-semibold mb-1">From: <span className="text-primary">{departureCity}</span></p>
                            <p className="text-xs text-gray-500">{departureDay} {departureHour}</p>
                        </div>
                        <div className="text-center mb-2 md:mb-0">
                            <i className="las la-long-arrow-alt-right text-2xl text-primary"></i>
                        </div>
                        <div>
                            <p className="font-semibold mb-1">To: <span className="text-primary">{arrivalCity}</span></p>
                            <p className="text-xs text-gray-500">{arrivalDay} {arrivalHour}</p>
                        </div>
                    </div>
                    <ul className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                        {[
                            { icon: "la-user-friends", text: `${pass} pass` },
                            { icon: "la-shopping-bag", text: `${bag} bags` },
                            { icon: "la-tachometer-alt", text: `${maxDistance} km` },
                            { icon: "la-gas-pump", text: fuelType },
                            { icon: "la-cog", text: boxType },
                        ].map((item, index) => (
                            <li key={index} className="bg-[#F5FCF8] rounded-lg p-2 text-center">
                                <i className={`las ${item.icon} text-[#279155] text-xl mb-1`}></i>
                                <span className="block text-xs text-gray-600">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="text-sm">
                        <p className="font-semibold mb-2">Languages: {languages.join(", ")}</p>
                        <p className="font-semibold mb-2">Specialties: {specialties.join(", ")}</p>
                        <p className="text-gray-600 line-clamp-2">{description}</p>
                    </div>
                </div>
            </div>
            <RightModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pageContent={true}>
                {/* Modal content remains the same */}
            </RightModal>
        </div>
    );
};

export default SearchCardFreelance;