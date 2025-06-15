import React from 'react'
import Fifth from '@/components/legal/Fifth'
import Ten from '@/components/legal/Ten'
import Eighteen from '@/components/legal/Eighteen'

const page = () => {
  return (
    <div className='text container mx-auto px-4 py-6'>
        <div className='flex gap-4 items-center '>
            <span className='font-medium'>Select Juricdition:</span>
            <select name="" id="" className='border focus:border-primary-500 mr-[6%] px-3 py-2'>
                <option value="">Cameroon</option>
            </select>
            <span className='font-medium'>Language: </span>
            <span>English</span>
        </div>
        <div className='flex flex-col mt-5'>
            <span className='bigtitle my-3'>Yowyob Legal: <span className='font-semibold'>General Terms of Use and Conditions</span> for Letsgo Freelance Driver</span>
            <div className='flex flex-col'>
                <span><b>Effective Date:</b> August 17, 2024</span>
                <span><b>Company Name:</b> Yowyob Inc. Ltd.</span>
                <span><b>Company website url:</b> <a href="https://yowyob.com"><u>https://yowyob.com</u></a></span> 
                <span><b>Platform Address:</b> <a href="https://driver.yowyob.com "><u>https://driver.yowyob.com </u></a></span>
            </div>
        </div>
        <div className='my-5'>
            <Fifth />
            <Ten />
            <Eighteen />
        </div>
    </div>
  )
}

export default page