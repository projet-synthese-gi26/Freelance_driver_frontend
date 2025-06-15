"use client";
import React, { useEffect,useRef, useState } from "react";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import safety_guidelines from "@/data/safety_guideline";
import TripDetails from "@/components/booking/freelance//TripDetails"
import SafetyGuidelines from '@/components/booking/freelance/SafetyGuidelines';
import Amenities from "@/components/booking/freelance/Aminities";
import CarDetails from "@/components/profile/freelance/CarDetails";
import Information from "@/components/profile/freelance/Information";
import ImageSlider from "@/components/profile/freelance/ImageCard";
import ChatBox from "@/components/modal/chatModal";
import { ProtectedButton } from '@/components/general/ProtectedButton';
import {v4 as uuidv4} from "uuid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getDriverAvailability(availabilityTable, id) {
  return availabilityTable.find(availability => availability.driver_availability_id === id);
}

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  //
  // const vehicleData = JSON.parse(searchParams.get('vehicleData') || '{}');
  // const driverData = JSON.parse(searchParams.get('driverData') || '{}');
  // const driver_availability_id=JSON.parse(searchParams.get('driver_availability_id')||'');
  // const currency_name=JSON.parse(searchParams.get('currency_name')||'');

  const [bookingData, setBookingData] = useState(null);
  const [count, setCount] = useState(1);
  const [isChat, setIsChat] = useState(false);
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const storedData = localStorage.getItem(id);
      if (storedData) {
        setBookingData(JSON.parse(storedData));

        // Optionally, remove the data from localStorage after retrieving it
        // localStorage.removeItem(id);
      } else {
        console.error('Booking data not found');
        // Handle the error, maybe redirect to an error page
      }
    }
  }, [searchParams]);


  if (!bookingData) {
    return <div>No booking data available</div>;
  }
  const { vehicleData, driverData, driver_availability_id, currency_name } = bookingData;

  const specificAvailability = getDriverAvailability(driverData.driver_availability_table, driver_availability_id);

  const storeProfileData = (profileId, profileData) => {
    localStorage.setItem(profileId, JSON.stringify(profileData));
  };


  const handleChatClick = () => {
    setIsChat((prevIsChat) => !prevIsChat);
  };

  const handlePayment=()=> {

      const data = {
        vehicleData,
        driverData,

      };
      const queryString = new URLSearchParams(
          Object.entries(data).map(([key, value]) => [
            key,
            String(value),
          ])
      ).toString();
      router.push( `/payement?${queryString}`);
  }


  const handleDetails = () => {
    // Transformez les objets en chaînes JSON
    // const data = {
    //   vehicleData: JSON.stringify(vehicleData),
    //   driverData: JSON.stringify(driverData)
    // };
    //
    // const queryString = new URLSearchParams(data).toString();
    // router.push(`freelance-profile?${queryString}`);

    const profileId = uuidv4();

    const profileData = {
      vehicleData:vehicleData,
      driverData:driverData,
    };

    storeProfileData(profileId, profileData);

    router.push(`freelance-profile?id=${profileId}`);
  };



  return (
      <>
        <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
          <div className="container">
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              <div className="col-span-12 lg:col-span-7">
                <div className="pb-lg-0">
                  <div className="bg-white  rounded-md p-3 sm:p-4 lg:p-6 mb-6">
                    <div className="relative flex justify-between items-center: pb-4">
                      <h3 className="h3 title">Booking resume Informations</h3>
                      <ProtectedButton
                          onProtectedClick={handleChatClick}
                          className="link flex items-center relative group transition-transform transform hover:scale-110"
                      >
                        <ChatBubbleLeftRightIcon
                            className="duration-100 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary hover:bg-blue-700 text-white "/>
                        <span
                            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-500">
                        Chat
                      </span>
                      </ProtectedButton>
                    </div>

                    <Tab.Group>
                      <Tab.List className="flex gap-3 about-tab mb-7">
                        <Tab
                            className={({selected}) =>
                                classNames(
                                    "focus:outline-none transition-transform transform hover:scale-105",
                                    selected
                                        ? "font-medium border-2 border-primary-500 rounded-md"
                                        : ""
                                )
                            }
                        >
                          <Image
                              width={100}
                              height={14}
                              src={"/img/vehicleLogo.png"}
                              alt="image"
                              className=""
                          />
                        </Tab>
                        {""}
                        <Tab
                            className={({selected}) =>
                                classNames(
                                    "focus:outline-none transition-transform transform hover:scale-105",
                                    selected
                                        ? "font-medium border-2 border-primary-500 rounded-md"
                                        : ""
                                )
                            }
                        >
                          <Image
                              width={100}
                              height={14}
                              src={"/img/driverLogo.png"}
                              alt="image"
                              className=""
                          />
                        </Tab>{" "}
                      </Tab.List>
                      <Tab.Panels className="tab-content">
                        <Tab.Panel>

                          {/*<CarDetails vehicleData={vehicleData}/>*/}
                          <ImageSlider images={vehicleData.illustration_images}/>

                          <div className="text-center pt-4">
                            <button
                                onClick={handleDetails}
                                className="btn-outline rounded-md hover:bg-primary hover:text-white transition duration-300 ease-in-out"
                            >
                              See Vehicle Details
                            </button>
                          </div>
                        </Tab.Panel>
                        <Tab.Panel>
                          <Information driverData={driverData}/>
                          <div className="text-center pt-4">
                            <button
                                onClick={handleDetails}
                                className="btn-outline rounded-md hover:bg-primary hover:text-white transition duration-300 ease-in-out"
                            >
                              See Host Profile
                            </button>
                          </div>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                  <Amenities amenities={vehicleData.vehicle_amenities}/>
                  <SafetyGuidelines
                      safetyGuidelineName="freelance"
                      safetyGuidelines={safety_guidelines}
                  />

                </div>


              </div>
              <div className="col-span-12 lg:col-span-5">
                <ChatBox
                    isChat={isChat}
                    handleChatClick={handleChatClick}
                    driverName={driverData.driver_last_name + " " + driverData.driver_first_name}
                    driverId={driverData.driver_id}
                    profilePicture={driverData.driver_profile_image}
                    className={`fixed z-[4] h-[100%] max-h-[100vh] w-[34%] bg-white rounded-md border shadow-lg ${
                        isChat ? "block top-[10px]" : "hidden"
                    }`}
                />

                <TripDetails
                    availability={specificAvailability}
                    availability_table={driverData.driver_availability_table}
                    currency_name={currency_name}
                />

                 <ProtectedButton
                  onProtectedClick={handlePayment}
                    className="link inline-flex items-center gap-2 lg:mt-8 py-3 px-6 rounded-md bg-primary text-white hover:bg-blue-700 font-semibold w-full text-xl justify-center "
                >
                  <span className="inline-block text"> Proceed Booking </span>
                </ProtectedButton>


              </div>

            </div>

          </div>
        </div>

      </>
  );
}
