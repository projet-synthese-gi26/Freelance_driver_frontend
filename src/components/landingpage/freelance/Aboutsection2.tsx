import React from 'react'
import vehicle from '@public/images/custom_relax.jpg'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl';

const Aboutsection2 = () => {
    const t = useTranslations("About.section2");
    return (
        <div className="font-inter text">
            <div className='py-8 container mx-auto px-4'>
                <h3 className='title font-bold text-[#2D3A96] pb-4'>{t('section1.title')}</h3>
                <p className='text-black text-justify'>
                    {t('section1.content.0')}
                    <b> {t('section1.content.1.text')}</b>
                    {t('section1.content.2')} <b>{t('section1.content.3.text')}</b> {t('section1.content.4')} <b>{t('section1.content.5.text')}</b>
                    {t('section1.content.6')}
                    <b>{t('section1.content.7.text')}.</b>
                </p>
            </div>
            <div className='relative'>
                <div className='w-full bg-[#2D3A96] h-[300px] sm:h-[400px] lg:h-[600px] overflow-hidden'>
                    <Image src={vehicle} alt='vehicle' className='h-full object-cover w-full lg:w-3/4'/>
                </div>
                <div id="our-mission"
                     className='bg-white w-full sm:w-[80%] lg:w-[30rem] flex flex-col px-4 sm:px-8 lg:px-[3.5rem] py-5 absolute right-0 left-0 lg:left-auto lg:right-24 mx-auto lg:mx-0 top-1/2 lg:top-[6rem] transform -translate-y-1/2 lg:translate-y-0'>
                    <h3 className='title font-bold text-[#2D3A96] pb-4 pt-4'>{t('section2.title')}</h3>
                    <p className='text-black text-justify'>{t('section2.content.0')}
                        <b> {t('section2.content.1.text')}</b>,
                        {t('section2.content.2')}</p>
                    <Link href="#">
                        <p className='pt-8 font-bold text-center'>{t('section2.learnMoreText')}</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Aboutsection2