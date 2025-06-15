"use client"
import React, { useState } from 'react'
import SupportCard from '@/components/freelance/support/SupportCard'
import help from '@public/img/help-center.png'
import faq from '@public/img/faq.png'
import img from "@public/img/app-img.jpg"
import FAQPage from '@/components/freelance/support/Faq'
import HelpCenter from '@/components/freelance/support/HelpCenter'

const Page = () => {
  const [selected,setSelected]=useState(false)
  const [section,setSection]=useState("")

  const handleSelect=(section:string)=>{
    setSelected(!selected)
    setSection(section)
  }
  return (
    <div className='p-10 flex flex-col items-center justify-center space-y-5'>
      {!selected &&(
        <h1 className='bigtitle font-bold lg:mb-10 md:mb-7 mb-3 '>
          Platform Support
        </h1>
      )}
      {!selected?(
        <div className='flex flex-col md:flex-row lg:space-x-20 md: space-x-10'>
          <SupportCard title='Frequently Asked Questions (FAQs)' 
          description="Have questions? Our FAQ section is here to help! Explore clear and concise answers to the most common inquiries about our products, services, and policies. Whether you're a new user or a loyal customer, you'll find useful information to enhance your experience. Feel free to browse this section to learn more!" 
          icon={faq}
          setSelected={handleSelect}/>
          <SupportCard title='Help Center' 
          description='Welcome to our Help Center! Here, you’ll find a wealth of resources to assist you with any questions or issues you may have. From troubleshooting guides to FAQs, our goal is to provide you with the support you need to enhance your experience. If you can’t find what you’re looking for, don’t hesitate to reach out to our customer service team!'
           icon={help}
          setSelected={handleSelect}/>
        </div>
      ):(
        <div className='w-full'>
          {section=="Frequently Asked Questions (FAQs)"?(
            <div>
              <h1 className='bigtitle font-bold lg:mb-10 md:mb-7 mb-3 '>
                <p className='text text-primary cursor-pointer' onClick={()=>{setSelected(false)}}>{'<<'} support</p>
                {section}
              </h1>
              <FAQPage/>
            </div>
            
          ):(
            <div>
              <h1 className='bigtitle font-bold lg:mb-10 md:mb-7 mb-3 '>
                <p className='text text-primary cursor-pointer' onClick={()=>{setSelected(false)}}>{'<<'} support</p>
                {section}
              </h1>
              <HelpCenter/>
            </div>
          )}
            
        </div>
      )}
    </div>
  )
}

export default Page