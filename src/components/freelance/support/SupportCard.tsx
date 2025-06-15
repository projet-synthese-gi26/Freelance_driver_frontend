import React from 'react'
import Image, { StaticImageData } from 'next/image'

interface Props{
    title:string;
    description:string;
    icon:StaticImageData | string;
    setSelected:(section: string) => void
}

const SupportCard = ({title,description,icon,setSelected}:Props) => {
  return (
    <div className='flex flex-col rounded-md w-[20rem] h-[20rem] 
    hover:w-[23rem] hover:h-[23rem] duration-500
    bg-transparent items-center justify-between cursor-pointer' onClick={()=>{setSelected(title)}}>
        <div className='w-full h-[60%] rounded-lg overflow-hidden'>
            <Image src={icon} alt='icon' width={400} height={400} className='object-cover'/>
        </div>
        <div className='p-2 py-3 flex flex-col items-center w-full h-full'>
            <h2 className='title font-bold text-center mb-3'>{title}</h2>
            <p className='text text-justify'>{description}</p>
        </div>
    </div>
  )
}

export default SupportCard