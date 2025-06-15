import React from 'react'
import drive from '@public/images/driver1.jpg'
import manager from '@public/images/Managemententreprise3.jpeg'
import Image from 'next/image'
import { useTranslations } from 'next-intl';

const Aboutsection3 = () => {
    const t = useTranslations("About.section3");
    const objectives=t.raw('ourObjectives.objectives')
    const tools=t.raw('toolsForDrivers.tools')
    const features=t.raw('loyaltyTool.features')
    const Padvantages=t.raw('partnerAdvantages.advantages')
    const fadvanatage=t.raw('platformAdvantages.advantages')
    return (
        <div className='bg-white text-black text'>
            <div id="our-objectives" className='flex flex-col font-inter py-8 sm:py-14 px-4 mx-auto container'>
                <div>
                    <h3 className='title font-bold text-[#2D3A96] pb-4'>{t('ourObjectives.title')}</h3>
                    <p className='text-black'>{t('ourObjectives.introduction')}</p>
                    <ul className='list-disc pl-6 text-black '>
                        <li><span>{objectives[0]}</span></li>
                        <li><span>{objectives[1]}</span></li>
                        <li><span>{objectives[2]}</span></li>
                        <li><span>{objectives[3]}</span></li>
                        <li><span>{objectives[4]}</span></li>
                        <li><span>{objectives[5]}</span></li>
                    </ul>
                </div>
                <div id="our-vision" className='flex flex-col lg:flex-row pt-6 sm:pt-8'>
                    <div className='w-full lg:w-1/2 px-0 mb-6 lg:mb-0'>
                        <h3 className='title font-bold text-[#2D3A96] pb-4 text-center lg:text-left'>{t('ourVision.title')}</h3>
                        <p className='text-black text-center lg:text-left'>{t('ourVision.introduction')}</p>
                    </div>
                    <Image src={drive} alt='woman driving' className='shadow-lg w-full sm:w-[80%] lg:w-[30%] border rounded-3xl'/>
                </div>
                <div className='flex flex-col pt-8 sm:pt-12 lg:pt-[5rem]'>
                    <h3 className='title font-bold text-[#2D3A96] pb-4'>{t('toolsForDrivers.title')}</h3>
                    <p className='text-black'>{t('toolsForDrivers.introduction')}</p>
                    <ul className='list-disc  pl-6 text-black'>
                        <li><span>{tools[0]}</span></li>
                        <li><span>{tools[1]}</span></li>
                        <li><span>{tools[2]}</span></li>
                        <li><span>{tools[3]}</span></li>
                        <li><span>{tools[4]}</span></li>
                    </ul>
                </div>
                <div className='flex flex-col pt-8 sm:pt-12 lg:pt-[3rem]'>
                    <h3 className='title font-bold text-[#2D3A96] pb-4'>{t('loyaltyTool.title')}</h3>
                    <p className='text-black'>{t('loyaltyTool.introduction')}</p>
                    <ul className='list-disc pl-6  text-black text-justify'>
                        <li><span>{features[0]}</span></li>
                        <li><span>{features[1]}</span></li>
                        <li><span>{features[2]}</span></li>
                    </ul>
                </div>
                <div className='flex flex-col pt-8 sm:pt-12 lg:pt-[3rem]'>
                    <h3 className='title font-bold text-[#2D3A96] pb-4'>{t('partnerAdvantages.title')}</h3>
                    <p className='text-black'>{t('partnerAdvantages.introduction')}</p>
                    <ul className='list-disc pl-6 text-black text-justify'>
                        <li><span>{Padvantages[0]}</span></li>
                        <li><span>{Padvantages[1]}</span></li>
                        <li><span>{Padvantages[2]}</span></li>
                        <li><span>{Padvantages[3]}</span></li>
                    </ul>
                </div>
                <div className='flex flex-col pt-4 sm:pt-12 lg:pt-[3rem]'>
                    <h3 className='title font-bold text-[#2D3A96] pb-4 '>{t('platformAdvantages.title')}</h3>
                    <p className='text-black '>{t('platformAdvantages.introduction')}</p>
                    <ul className='list-disc pl-6 text-black'>
                        <li><span>{fadvanatage[0]}</span></li>
                        <li><span>{fadvanatage[1]}</span></li>
                        <li><span>{fadvanatage[2]}</span></li>
                    </ul>
                </div>
                <div className='flex flex-col w-full  pt-8 sm:pt-12 lg:pt-[4rem]'>
                    <h3 className='title font-bold text-[#2D3A96] pb-4'>{t('ourUniqueness.title')}</h3>
                    <div className='flex flex-col lg:flex-row items-center lg:items-start'>
                        <Image src={manager} alt='manager' className='shadow-lg w-full sm:w-[80%] lg:w-[30%] border rounded-3xl mr-6'/>
                        <div className='text-black text-justify'>
                            <p>{t('ourUniqueness.content.0')}
                                <br /><b>{t('ourUniqueness.content.1.text')}</b> {t('ourUniqueness.content.2')}
                                <br />{t('ourUniqueness.content.3')}
                                <br />{t('ourUniqueness.content.4')} <b>{t('ourUniqueness.content.5.text')}</b> {t('ourUniqueness.content.6')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Aboutsection3