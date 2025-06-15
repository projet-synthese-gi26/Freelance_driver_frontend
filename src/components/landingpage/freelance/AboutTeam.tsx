import React from 'react'
import TeamMember from './TeamMember'
import profile from '@public/img/user-1.png'
import { useTranslations } from 'next-intl';

const AboutTeam = () => {
    const t = useTranslations("About.team");
    return (
        <>
            <div id="our-team" className='flex text flex-col justify-between font-inter text-black py-8 container mx-auto px-4 sm:py-10'>
                <h3 className='title font-bold text-[#2D3A96] pb-4'>{t('ourTeam')}</h3>
                <div className=''>
                    <p className='text-justify'>
                        {t('teamDescription')} <a href="https://wiconet.yowyob.com." className='text-primary underline'>https://wiconet.yowyob.com</a>
                    </p>
                </div>
                <div className='flex flex-col items-center justify-center py-10 sm:py-10'>
                    <p className='font-medium title mb-6'>{t('teamMembers')}</p>
                    <div className='w-full'>
                        <div className='flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-4 md:space-x-10 mb-6'>
                            <TeamMember photo={profile} name='Thomas Djotio Ndié' title={t('members.thomas.title')} role={t('members.thomas.role')} linkedin='#' facebook='#' twitter='#'/>
                            <TeamMember photo={profile} name='Bernabé Batchkui' title={t('members.bernabe.title')} role={t('members.bernabe.role')} linkedin='#' facebook='#' twitter='#'/>
                        </div>
                        <div className='flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 sm:gap-4 md:gap-8'>
                            <TeamMember photo={profile} name='Jean Yves Etougue' title={t('members.jean.title')} role={t('members.jean.role')} linkedin='#' facebook='#' twitter='#'/>
                            <TeamMember photo={profile} name='Zacharie Tene' title={t('members.zacharie.title')} role={t('members.zacharie.role')} linkedin='#' facebook='#' twitter='#'/>
                            <TeamMember photo={profile} name='Yann Bekale' title={t('members.yann.title')} role={t('members.yann.role')} linkedin='#' facebook='#' twitter='#'/>
                            <TeamMember photo={profile} name='Jason Steven Djotio Souffo' title='' role={t('members.jason.role')} linkedin='#' facebook='#' twitter='#'/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutTeam