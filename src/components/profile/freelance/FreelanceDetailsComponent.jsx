import Comment from "./Comment";
import React, {  useState } from "react";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";
import MyTable from "./MyTable";
import CarDetails from "./CarDetails";
import Information from "./Information";
import DriverExperiences from './DriverExperienceCard';
import {useRouter} from "next/navigation";
import {v4 as uuidv4} from "uuid";


export default function  FreelanceDetailsComponent ({ data,isModal = false })   {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    let vehicleData;
    let  driverData;

    vehicleData=data.vehicleData;
    driverData=data.driverData;

    const storeProfileData = (profileId, profileData) => {
        localStorage.setItem(profileId, JSON.stringify(profileData));
    };


    const OpenFreelanceProfilePage = () => {
        const profileId = uuidv4();

        const profileData = {
            vehicleData:vehicleData,
            driverData:driverData,
        };

        storeProfileData(profileId, profileData);
        // const data = {
        //     vehicleData: JSON.stringify(vehicleData),
        //     driverData: JSON.stringify(driverData)
        // };
        //
        // const queryString = new URLSearchParams(data).toString();
        // const url = `/freelance-profile?${queryString}`;

        const url = `/freelance-profile?id=${profileId}`;


        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (

        <>
            {isModal && (
                <div className="text-center mt-2">
                    <button
                        onClick={OpenFreelanceProfilePage}
                        className="inline-flex items-center text-blue-500 hover:text-blue-700"
                    >
                        <span className="mr-2">Open profile in a new window</span>
                        <ArrowTopRightOnSquareIcon className="w-5 h-5"/>
                    </button>
                </div>
            )}
            {/*<div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">*/}
            <div className={`py-[30px] lg:py-[60px] text bg-[var(--bg-2)] px-3 ${isModal ? 'modal-specific-class' : ''}`}>


                {/*<div className="container max-w-[1600px]">*/}
                <div className={`container ${isModal ? 'max-w-full' : 'max-w-[1600px]'}`}>

                    {/*<div className="grid grid-cols-12 gap-4 lg:gap-6">*/}
                    <div className={`grid ${isModal ? 'grid-cols-1' : 'grid-cols-12'} gap-4 lg:gap-6`}>


                        {/*<div className="col-span-12 xl:col-span-4">*/}
                        <div className={isModal ? 'col-span-1' : 'col-span-12 xl:col-span-5'}>


                            <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-6 lg:px-6 mb-2">
                                <Information driverData={driverData}/>
                                <div className="border border-dashed my-2"></div>
                                <div>
                                    {driverData.driver_availability_table.length > 0 && driverData.driver_availability_table.some(entry => entry.is_available) && (
                                        <div className="items-center gap-1 overflow-x-auto">
                                            <MyTable
                                                className="min-w-[500px]"
                                                data={data}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="border border-dashed my-1"></div>
                                <DriverExperiences driverExperiences={driverData.driver_experiences}/>


                                <div className="border border-dashed my-1"></div>
                                <div className="items-center">
                                    {/* <CalendarDaysIcon className="w-5 h-5 text-primary" /> */}
                                    <div className="block text font-semibold clr-neutral-600 mb-1">
                                        Formation
                                    </div>
                                    <div className="">{driverData.driver_portfolio.map((item) => (
                                        <div key={null} className="">
                                            {item}
                                        </div>
                                    ))}</div>
                                </div>

                                <div className="border border-dashed my-1"></div>
                                <div>
                                    <span className="block font-semibold clr-neutral-600 mb-1">
                                        Keywords
                                    </span>
                                    <p>{driverData.driver_keywords.join(" | ")}</p>
                                </div>
                                <div className="border border-dashed my-1"></div>
                                <span className="block  font-semibold clr-neutral-600 mb-1">
                                    Details
                                </span>
                                <div className="mb-0 text">{driverData.Description}</div>
                            </div>
                        </div>
                        {/*<div className="col-span-12 xl:col-span-8">*/}
                        <div className={isModal ? 'col-span-1' : 'col-span-12 xl:col-span-7'}>
                            {driverData.has_vehicle && (
                                <div className="p-3 bg-white rounded-2xl mb-8">
                                    <CarDetails vehicleData={vehicleData} isModal={isModal}/>
                                </div>
                            )}
                            {

                            }
                            <Comment comments={driverData.driver_reviews} isModal={isModal} rated_entity_type={"Driver"} rated_entity_id={driverData.driver_id} commentsPerPage={3}/>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}