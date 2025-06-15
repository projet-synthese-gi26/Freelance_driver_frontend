import React from 'react'
import benefit from '@public/img2.jpg'
import Image from 'next/image'
import { useTranslations } from 'next-intl';

const Aboutsection1 = () => {
  const t = useTranslations("About.section1");
  const benefits = t.raw('benefits');
  return (
      <div className="font-inter text bg-white">
        <div className='flex flex-col container mx-auto px-4 py-8 lg:py-14 '>
          <p className='bigtitle font-bold text-black mb-6 lg:mb-1'>{t('pageTitle')}</p>
          <div className='mb-1 flex title flex-row space-x-2'>
            <h3 className='font-bold text-black'>{t('sectionTitle.part1')}</h3>
            <h3 className='font-bold text-[#2D3A96]'>{t('sectionTitle.part2')}</h3>
          </div>
          <div className='text-justify text-black'>
            <p className="">{t('description.paragraph1.text1')} <b>{t('description.paragraph1.text2')}</b>{t('description.paragraph1.text3')}</p>
            <p className="">
              {t('description.paragraph2')}
            </p>
            <ul className='list-disc space-y-0 pl-6'>
              <li><span>{t('contributions.t1')}</span></li>
              <li><span>{t('contributions.t2')}</span></li>
              <li><span>{t('contributions.t3')}</span></li>
              <li><span>{t('contributions.t4')}</span></li>
              <li><span>{t('contributions.t5')}</span></li>
            </ul>
          </div>
        </div>

        <div id='our-value' className='container mx-auto px-4 py-8 lg:py-4'>
          <h3 className='title font-bold text-[#2D3A96] mb-3 lg:mb-10'>{t('ourValues.title')}</h3>
          <div className='flex flex-col items-center'>
            <div className='flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8'>
              <div className='w-full lg:w-1/2 max-w-md'>
                <Image src={benefit} alt='img' className='shadow-lg w-full h-auto border rounded-3xl'/>
              </div>
              <div className='flex flex-col text-justify text-black w-full lg:w-1/2'>
                <p>
                  <b>
                    {t('ourValues.mainText')}
                  </b>
                </p>
                <p>
                  {t('ourValues.secondaryText')}
                </p>
                <ul className='list-disc pl-6 py-4 text-black '>
                  {benefits.map((benefit:any, index:any) => (
                      <li key={index}>
                      <span>
                        <b>{benefit.title}</b>
                        <p>{benefit.description}</p>
                      </span>
                      </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
  )
}

export default Aboutsection1