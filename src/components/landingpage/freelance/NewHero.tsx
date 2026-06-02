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
import Location from '@/components/localisation/Location';
import { useTranslations } from 'next-intl';
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  MapIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import Sponsor from '@/components/general/Sponsor';

import SearchComponent from "@/components/search/searchbar";
import {useAuthModal } from '@/hook/AuthModalContext';
import {useAuthContext} from "@/components/context/authContext";
import Testimonial from '@/components/general/Testimonial';
import { testimonials } from '@/data/Structure';
import { partners } from '@/data/Structure';
import Hero from '../Hero';
import DriverSection from '../DriverSection';
import InstitutionSection from '../InstitutionSection';
import WhyChooseLetsgo from '../WhyChooseLetsgo';
import Newsletter from '../Newsletter';
import AgencySection from '../AgencySection';
import DownloadAppSection from '../DownloadAppSection';



const NewHero = () => {
  const { openLoginModal,openRegisterModal } = useAuthModal();

  const {authUser} = useAuthContext()
  const t = useTranslations("Freelance.hero");
  const benefits = [
    { icon: BanknotesIcon, title: t('P2section1title'), description: t('P2section1desc') },
    { icon: ClockIcon, title: t('P2section2title'), description: t('P2section2desc') },
    { icon: UserGroupIcon, title: t('P2section3title'), description: t('P2section3desc') }
  ];

  const options = [
    { img: taximan, title: t('P3section1title'), description: t('P3section1desc'), link: t('P3section1link'), action:null },
    { img: transaction, title: t('P3section2title'), description: t('P3section2desc'), link: t('P3section2link'), action:openRegisterModal}
  ];


  const authenticationSystem= (
      <div
          className="w-full max-w-[37.5rem] my-4 flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div
            onClick={openRegisterModal}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#2D3A96] text-center text-white text cursor-pointer hover:bg-blue-500 transition-colors duration-500"
        >
          {t('P1join_button')}
        </div>

        <p className="text-center sm:text-left">
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
    <main className="bg-white">

      {/* ── Hero principal ── */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-8 pt-10 pb-4">
        <div className="w-full lg:w-[600px] flex flex-col gap-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center px-3 py-1.5 bg-tertiary-500 text-white text-sm font-semibold rounded-xl">
              {t('etiquette')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-gray-200 text-gray-700 text-sm font-medium rounded-xl">
              <MapPinIcon className="w-4 h-4 text-primary-500" />
              <Location />
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {t('P1title')}
            <br />
            <span className="text-primary-500">{t('P1title2')}</span>
          </h1>

          {/* Description */}
          <p className="text-base lg:text-lg text-gray-500 max-w-[420px]">
            {t('P1description')}
          </p>

          {/* Search */}
          <div className="w-full">
            <SearchComponent />
          </div>

          {/* CTA auth */}
          {!authUser && authenticationSystem}
        </div>

        <div className="flex justify-center lg:justify-end w-full lg:w-auto">
          <Image
            src={DriverAffiche}
            alt="freelancer"
            className="w-full max-w-sm lg:max-w-md h-auto object-contain rounded-2xl"
          />
        </div>
      </div>

      {/* ── Bénéfices ── */}
      <div className="bg-gray-50 py-16 mt-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-10">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 text-center">
            {t('P2title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {benefits.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                {item.icon && (
                  <div className="p-4 bg-primary-50 rounded-full">
                    <item.icon className="h-10 w-10 text-primary-500" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Options ── */}
      <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-10">
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 text-center">
          {t('P3title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
          {options.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-4">
              <Image src={item.img} alt={item.title} className="w-64 h-auto object-contain rounded-xl" />
              <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              <button
                onClick={item.action ?? undefined}
                className="text-tertiary-500 hover:text-primary-500 text-sm font-medium underline underline-offset-2 transition-colors"
              >
                {item.link}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Testimonial testimonials={testimonials} />
      <Sponsor partners={partners} />

      {/* ── Download App ── */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-primary-500 rounded-3xl flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 py-10 md:py-12 gap-8">
          <div className="flex flex-col gap-4 text-white max-w-lg">
            <h2 className="text-2xl lg:text-4xl font-bold">{t('P4title')}</h2>
            <p className="text-lg font-semibold opacity-90">{t('P4subtitle')}</p>
            <p className="text-sm opacity-75">{t('P4desc')}</p>
            <div className="flex flex-row gap-4 mt-3">
              <Link href="#">
                <Image src={appstore} alt="App Store" className="w-32 rounded-xl hover:opacity-90 transition-opacity" />
              </Link>
              <Link href="#">
                <Image src={playstore} alt="Google Play" className="w-32 rounded-xl hover:opacity-90 transition-opacity" />
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Image src={frame} alt="App preview" className="w-48 md:w-64 drop-shadow-xl" />
          </div>
        </div>
      </div>

    </main>
  );
};

export default NewHero;