import React, { useState } from 'react'
import FAQPage from "@/components/freelance/support/Faq"
import HelpCenter from '@/components/freelance/support/HelpCenter'
import Claim from '@/components/freelance/support/Claim'

const RubriqueContainer = () => {
    const[selected,setSelected]=useState('FAQs')
    const Rubriques=["FAQs","Help Center","Claim"]
  return (
    <div>
        <div className='flex flex-row items-center text justify-between gap-4'>
            {Rubriques.map((rubrique)=>(
            <span key={rubrique} className={`cursor-pointer border-b border-primary-500 hover:bg-primary
                shadow-lg w-full  hover:text-white transtion-colors duration-1000 font-bold px-3 
            ${selected===rubrique?('bg-primary text-white border-white'):("")}`} onClick={()=>{setSelected(rubrique)}}>{rubrique}</span>
            ))}
        </div>
        <div>
          {selected==="FAQs" && (<FAQPage/>)}
          {selected==="Help Center" && (<HelpCenter/>)}
          {selected==="Claim" && (<Claim/>)}
        </div>
    </div>
  )
}

export default RubriqueContainer