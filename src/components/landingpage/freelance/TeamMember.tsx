import React from 'react'
import Image, { StaticImageData } from 'next/image'
import face from '@public/facebookDark.png'
import link from '@public/logo-linkedin.png'
import twit from '@public/twitter.png'
import Link from 'next/link'
import { Url } from 'url'

interface Profile{
    photo:StaticImageData;
    name:String;
    title:String;
    role:String;
    twitter:Url | string;
    facebook:Url | string;
    linkedin:Url | string;
}

const TeamMember = ({photo,name,title,role,twitter,facebook,linkedin}:Profile) => {
  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col items-center pt-10 pb-4'>
        <Image src={photo} alt='profile' width={100}/>
        <div className='flex flex-col items-center'>
          <p className='font-bold pt-4'>{name}</p>
          <p className='font-medium'>{title}</p>
          <p className='font-medium'>{role}</p>
        </div>
      </div>
      <div className='flex flex-row space-x-4'>
        <Link href={twitter}><Image src={twit} alt='profile' width={20}/></Link>
        <Link href={linkedin}><Image src={link} alt='profile' width={20}/></Link>
        <Link href={facebook}><Image src={face} alt='profile' width={20}/></Link>
      </div>
    </div>
  )
}

export default TeamMember
