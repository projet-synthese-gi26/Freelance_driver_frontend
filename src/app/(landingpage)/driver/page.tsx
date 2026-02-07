"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import DriverAffiche from "@public/Rectangle13.jpg";
import taximan from "@public/image19.png";
import transaction from "@public/Highanglehandsholdingcarkey.png";
import frame from "@public/Frame70.png";
import appstore from "@public/cta_download_Appstore.png";
import playstore from "@public/cta_download_playstore.png";
import Location from "@/components/localisation/Location";
import { useTranslations } from "next-intl";
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  MapIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Sponsor from "@/components/general/Sponsor";

import SearchComponent from "@/components/search/searchbar";
import { useAuthModal } from "@/hook/AuthModalContext";
import { useAuthContext } from "@/components/context/authContext";
import Testimonial from "@/components/general/Testimonial";
import { testimonials } from "@/data/Structure";
import { partners } from "@/data/Structure";

const NewHero = () => {
  const { openLoginModal, openRegisterModal } = useAuthModal();

  const { authUser } = useAuthContext();
  const t = useTranslations("Freelance.hero");
  const benefits = [
    {
      icon: BanknotesIcon,
      title: t("P2section1title"),
      description: t("P2section1desc"),
    },
    {
      icon: ClockIcon,
      title: t("P2section2title"),
      description: t("P2section2desc"),
    },
    {
      icon: UserGroupIcon,
      title: t("P2section3title"),
      description: t("P2section3desc"),
    },
  ];

  const options = [
    {
      img: taximan,
      title: t("P3section1title"),
      description: t("P3section1desc"),
      link: t("P3section1link"),
      action: null,
    },
    {
      img: transaction,
      title: t("P3section2title"),
      description: t("P3section2desc"),
      link: t("P3section2link"),
      action: openRegisterModal,
    },
  ];

  const authenticationSystem = (
    <div className="w-full max-w-[37.5rem] my-4 flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <div
        onClick={openRegisterModal}
        className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#2D3A96] text-center text-white text cursor-pointer hover:bg-blue-500 transition-colors duration-500"
      >
        {t("P1join_button")}
      </div>

      <p className="text-center sm:text-left">
        {t("P1join_alternative")}
        <button
          onClick={openLoginModal}
          className="text-primary ml-1 hover:underline focus:outline-none"
        >
          {t("P1join_link")}
        </button>
      </p>
    </div>
  );

  return (
    <main className="bg-white">
      <div className="flex flex-col items-center text">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between gap-5 pt-2">
          <div className="w-full lg:w-[37.688rem] py-[1.5rem] lg:py-[3rem] relative">
            <div className="flex sm:space-x-5 space-x-3">
              <div className="w-auto inline-block px-2 py-2 bg-[#FE9261] rounded-2xl absolute top-[-0.1rem] left-0">
                <h2 className="text-white font-bold text-center text">
                  {t("etiquette")}
                </h2>
              </div>
              <div className="w-auto inline-block sm:px-2 sm:flex border-2 flex-row py-2 rounded-2xl absolute top-[-0.1rem] left-[10rem]">
                <MapPinIcon className="text-[#243757] w-5 h-5" />
                <Location />
              </div>
            </div>

            <h2 className=" font-bold bigtitle py-3 lg:py-2">
              {t("P1title")}
              <br /> {t("P1title2")}
            </h2>

            <p className="text-[#646464] text font-medium w-full lg:w-[26.25rem] mb-2">
              {t("P1description")}
            </p>

            <div className="-ml-4 mt-2">
              <SearchComponent />
            </div>

            <div className="-ml-4 mt-4">
              <Link
                href="/client-search"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 px-5 py-3 text-center text font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-[1px] hover:border-emerald-300 hover:shadow-md sm:w-auto"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition group-hover:bg-emerald-700">
                  <UserGroupIcon className="h-5 w-5" />
                </span>
                <span>{t("P1find_clients_cta")}</span>
              </Link>
            </div>

            {!authUser ? (
              authenticationSystem
            ) : (
              <div className=" hidden lg:flex"></div>
            )}
          </div>

          <div className="flex justify-center lg:justify-end w-full lg:w-auto mt-8 lg:mt-0">
            <Image
              src={DriverAffiche}
              alt="freelancer"
              className="w-full max-w-[400px] h-auto object-contain lg:w-[200px] xl:w-[400px]"
            />
          </div>
        </div>

        <div className="container mx-auto bg-white flex flex-col items-center py-8 lg:pb-[30px] lg:pt-[50px]">
          <div className="flex flex-col items-center w-full">
            <h3 className="font-medium title ">{t("P2title")}</h3>
            <div className="flex flex-wrap w-full justify-between px-4">
              {benefits.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center flex-col justify-center w-[22rem]"
                >
                  {item.icon && (
                    <item.icon className="h-20 w-20 mr-2 text-[#2D3A96]" />
                  )}
                  <h3 className="title text-justify  my-[1rem]">
                    {item.title}
                  </h3>
                  <p className="text text-justify  w-full">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center mt-[1rem] w-full px-4">
            <h3 className="font-medium title mb-[2rem]">{t("P3title")}</h3>
            <div className="flex flex-wrap w-full justify-between">
              {options.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center flex-col justify-center my-3 w-[20rem] md:w-[30rem]"
                >
                  <Image src={item.img} alt={item.title} className="w-45" />
                  <h3 className="title  text-justify font-bold my-[2rem]">
                    {item.title}
                  </h3>
                  <p className="text text-justify">{item.description}</p>
                  <Link
                    href="#"
                    className="text-[#FE9261] hover:text-primary text mt-[1rem] underline"
                  >
                    {item.link}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Testimonial testimonials={testimonials} />
        <Sponsor partners={partners} />

        <div className="container mx-auto bg-white my-[1rem] rounded-2xl shadow-xl flex flex-col md:flex-row justify-center items-center  px-4 py-8">
          <div className="flex flex-col justify-center  w-full md:w-[50rem] gap-4">
            <h3 className="bigtitle text-[#2D3A96] font-bold">
              {t("P4title")}
            </h3>
            <p className="title font-bold">{t("P4subtitle")}</p>
            <p>{t("P4desc")}</p>
            <div className="flex flex-row justify-center mt-5">
              <Link href="#">
                <Image src={appstore} alt="appstore" className="w-32" />
              </Link>
              <Link href="#">
                <Image src={playstore} alt="playstore" className="w-32 ml-10" />
              </Link>
            </div>
          </div>
          <div className="flex justify-center ">
            <Image src={frame} alt="frame" className="w-2/4" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewHero;
