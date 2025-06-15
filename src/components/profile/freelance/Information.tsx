"use client";
import React, { useState } from 'react'
import Image from "next/image";
import Emojis from "@/components/review/emojis";
import ShareModal from "@/components/modal/shareProfileModal";
import {StarIcon} from "@heroicons/react/24/solid";
import YoutubeShareIcon from "@/components/icon/youtubeShareIcon";
interface DriverReview {
    review_id: string;
    rated_entity_id: string;
    rated_entity_type: string;
    comment: string;
    created_at: string;
    updated_at: string;
    note: number;
    likes_count: number;
    dislikes_count: number;
    reviewer_name: string;
}

interface DriverAvailability {
    driver_availability_id:string;
    is_available:boolean,
    start_date : string;
    end_date:string;
    start_time: string;
    end_time: string;
    price: number;
    driver_billing_method_name:string;//hourly', 'daily', 'flat_rate', ‘pr_km
}

interface DriverExperience {
    driver_experience_id: string; // UUID
    driver_id: string;
    start_date: string;
    end_date: string | null;
    description: string;
    vehicle_models: string[];
    transmission_types: string[];
    driving_skills: string [];
    experience_illustrations: string[];
    experience_references: string[];


}


interface DriverStatistics {
    average_rating: number;
    review_total_number: number;
}

interface InformationProps{
    driverData: {
        driver_id:string,
        driver_profile_image : string,
        driver_first_name:string,
        driver_last_name:string,
        driver_phone_number : string,
        driverLocation: string,
        driver_email : string,
        driver_keywords :string,
        driver_license_number:string,
        driver_experiences:DriverExperience[],
        driver_portfolio:string [],
        Description:string,
        has_vehicle:boolean,
        driver_statistics:DriverStatistics,
        driver_reviews:DriverReview[],
        driver_availability_table:DriverAvailability[],
        transmission_types:string [],
        preferred_language:string [],
        driver_certifications:string [],
    };

}
const Information = ({ driverData}: InformationProps) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const openShareModal = () => {
        setIsShareModalOpen(true);
    };

    const closeShareModal = () => {
        setIsShareModalOpen(false);
    };

    return (
        <div className='text relative  px-12'>

            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <Emojis driver_id={driverData.driver_id} vertical={true}/>
            </div>

            <div
                className="w-32 h-32 text border overflow-hidden border-[var(--primary)] rounded-full bg-white p-4 grid place-content-center relative mx-auto mb-2">
                <Image width={130} height={130} src={driverData.driver_profile_image} alt="image"
                       className="rounded-full w-full h-full"/>
            </div>
            <h4 className="text-center title font-semibold mb-1">
                Mr {driverData.driver_last_name} {driverData.driver_first_name}
            </h4>

            <div className="flex items-center justify-center flex-wrap mb-2">
                <p className="mb-0 flex flex-col w-full text-center relative group">
                    Contact:
                    <span
                        className="text-primary truncate overflow-hidden text-ellipsis inline-block max-w-full cursor-pointer"
                        title={`${driverData.driver_phone_number} | ${driverData.driverLocation} | ${driverData.driver_email}`}
                    >
                        {driverData.driver_phone_number}
                    </span>
                    <span
                        className="text-primary truncate overflow-hidden text-ellipsis inline-block max-w-full cursor-pointer"
                        title={`${driverData.driver_phone_number} | ${driverData.driverLocation} | ${driverData.driver_email}`}
                    >
                        {driverData.driverLocation}
                    </span>
                    <span
                        className="text-primary truncate overflow-hidden text-ellipsis inline-block max-w-full cursor-pointer"
                        title={`${driverData.driver_phone_number} | ${driverData.driverLocation} | ${driverData.driver_email}`}
                    >
                        {driverData.driver_email}
                    </span>
                </p>
            </div>
            <div className="flex items-center justify-center flex-wrap mb-2">
                <div className="flex min-w-full justify-center items-center my-1 px-4 mx-8 space-x-4">
                    <div className="flex items-center">
                        <span className="mr-1">
                        {driverData.driver_statistics.average_rating.toFixed(1)}
                        </span>{" "}
                        <StarIcon className="w-4 h-4 text-[var(--tertiary)]"/>
                        <span
                            className="ml-2 text-gray-500"> {driverData.driver_statistics.review_total_number} avis</span>{" "}
                    </div>
                    <button
                        onClick={openShareModal}
                        className="flex text items-center px-2 py-1 rounded-full border-white-900 border-2 hover:bg-gray-400 transition-colors"
                    >
                        <YoutubeShareIcon/>
                        <span className='text'>Share</span>
                    </button>
                </div>
            </div>
            <div className="flex justify-center">
                {driverData.driver_availability_table.length > 0 && driverData.driver_availability_table.some(entry => entry.is_available) ? (
                    <div
                        className="inline-flex items-center gap-1 p-2 rounded-full bg-[#2AC144] text-white hover:bg-[#25A83C] transition-colors font-medium">
                        <span className="inline-block">I'm actually available</span>
                    </div>
                ) : (
                    <div
                        className="inline-flex items-center gap-1 p-2 rounded-full bg-[#F84800] text-white hover:bg-[#E04100] transition-colors font-medium">
                        <span className="inline-block">I'm not available</span>
                    </div>
                )}
            </div>

            {isShareModalOpen && (
                <ShareModal isOpen={isShareModalOpen} onClose={closeShareModal}
                            profileName={driverData.driver_last_name + driverData.driver_first_name} // Replace with actual driver name
                            profileDescription={driverData.driver_keywords} // Replace with actual driver description
                            profileImage={driverData.driver_profile_image} // Replace with actual driver image path
                            driverId={driverData.driver_id}

                />
            )}
        </div>
    )
}
export default Information