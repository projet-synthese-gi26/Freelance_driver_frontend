"use client";
import Link from 'next/link';
import React, {useState} from 'react';
import Image from "next/image";
import DriverAffiche from "@public/Rectangle13.jpg";
import taximan from "@public/image19.png";
import transaction from "@public/Highanglehandsholdingcarkey.png";
import frame from "@public/Frame70.png";
import appstore from "@public/cta_download_Appstore.png";
import playstore from "@public/cta_download_playstore.png";
import { useTranslations } from 'next-intl';
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";


import SearchComponent from "@/components/search/searchbar";
import {useAuthModal } from '@/hook/AuthModalContext';
import {useAuthContext} from "@/components/context/authContext";



const NewHero = () => {
  const { openLoginModal,openRegisterModal } = useAuthModal();

  const {authUser,authUserIsLoading} = useAuthContext()
  const t = useTranslations("Freelance.hero");
  const benefits = [
    { icon: BanknotesIcon, title: t('P2section1title'), description: t('P2section1desc') },
    { icon: ClockIcon, title: t('P2section2title'), description: t('P2section2desc') },
    { icon: UserGroupIcon, title: t('P2section3title'), description: t('P2section3desc') }
  ];

  const options = [
    { img: taximan, title: t('P3section1title'), description: t('P3section1desc'), link: t('P3section1link') },
    { img: transaction, title: t('P3section2title'), description: t('P3section2desc'), link: t('P3section2link') }
  ];


  const authenticationSystem= (
      <div
          className="w-full max-w-[37.5rem] my-4 flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div
            onClick={openRegisterModal}
            className="w-full sm:w-auto px-4 py-3 rounded-md bg-[#2D3A96] text-center text-white text-base sm:text-[17px] cursor-pointer hover:bg-blue-500 transition-colors duration-300"

        >
          {t('P1join_button')}
        </div>

        <p className="text-black text-center sm:text-left">
          {t('P1join_alternative')}
          <button
              onClick={openLoginModal}
              className="text-primary ml-1 hover:underline focus:outline-none"
          >
            {t('P1join_link')}
          </button>
        </p>
      </div>


  )


  return (
      <>
        <div className="flex flex-col items-center ">

          <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between gap-5 pt-10">
            <div className="w-full lg:w-[37.688rem] py-[2rem] lg:py-[3.5rem] relative">
              <div className="w-auto inline-block px-3 py-3 bg-[#FE9261] rounded-2xl absolute top-[-0.25rem] left-0">
                <h2 className="text-white font-bold text-center text-[15px] sm:text-[17px]">{t('etiquette')}</h2>
              </div>

              <h2 className="text-black font-medium text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] mt-8 lg:mt-4 py-4 lg:py-3">
                {t('P1title')}
                <br/> {t('P1title2')}
              </h2>

              <p className="text-[#646464] text-base sm:text-[15px] lg:text-[18px] xl:text-[20px] w-full lg:w-[26.25rem] mb-2">
              {t('P1description')}
              </p>

              <div className="w-full lg:w-[calc(100%+1rem)] -ml-2 sm:ml-0 mt-2">
                <SearchComponent/>
              </div>
              {!authUser ? authenticationSystem :
                  <div className=" hidden lg:flex">

                  </div>}


            </div>

            <div className="flex justify-center lg:justify-end w-full lg:w-auto mt-8 lg:mt-0">
              <Image
                  src={DriverAffiche}
                  alt="freelancer"
                  className="w-full max-w-[500px] h-auto object-contain lg:w-[300px] xl:w-[500px]"
              />
            </div>
          </div>

          <div className="w-full bg-white flex flex-col items-center py-10 lg:pb-[50px] lg:pt-[50px]">

            <div className="flex flex-col items-center">
              <h3 className="font-medium text-2xl md:text-3xl text-black mb-[2rem]">{t('P2title')}</h3>
              <div className="flex flex-wrap items-center justify-center">
                {benefits.map((item, index) => (
                    <div key={index} className="flex items-center flex-col justify-center m-[2rem] w-[22rem]">
                      {item.icon && <item.icon className="h-20 w-20 mr-2 text-[#2D3A96]"/>}
                      <h3 className="text-xl md:text-2xl text-black text-justify  my-[2rem]">{item.title}</h3>
                      <p className="text-base md:text-xl text-black text-justify  ">{item.description}</p>
                    </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center mt-[1rem]">
              <h3 className="font-medium text-2xl md:text-3xl text-black mb-[2rem]">DRIVER OPTIONS</h3>
              <div className="flex flex-wrap items-center justify-center">
                {options.map((item, index) => (
                    <div key={index}
                         className="flex items-center flex-col justify-center m-[2rem] w-[20rem] md:w-[30rem]">
                      <Image src={item.img} alt={item.title}/>
                      <h3 className="text-xl md:text-2xl text-black text-justify font-bold my-[2rem]">{item.title}</h3>
                      <p className="text-base md:text-xl text-black text-justify">{item.description}</p>
                      <Link href="#"
                            className="text-[#FE9261] hover:text-primary text-base md:text-xl mt-[2rem] underline">{item.link}</Link>
                    </div>
                ))}
              </div>
            </div>

          </div>

          <div
              className="container mx-auto bg-white m-[1rem] rounded-2xl shadow-xl flex flex-col md:flex-row justify-center items-center p-10">
            <div className="flex flex-col justify-center w-full md:w-[50rem] gap-7">
              <h3 className="text-2xl md:text-4xl text-[#2D3A96] font-bold">{t('P4title')}</h3>
              <p className="text-lg md:text-xl font-bold">{t('P4subtitle')}</p>
              <p>{t('P4desc')}</p>
              <div className="flex flex-row justify-between mt-10">
                <Link href="#">
                  <Image src={appstore} alt="appstore"/>
                </Link>
                <Link href="#">
                  <Image src={playstore} alt="playstore"/>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <Image src={frame} alt="frame" className="w-full md:w-auto"/>
            </div>
          </div>
          

        </div>

      </>
  );
};

export default NewHero;
