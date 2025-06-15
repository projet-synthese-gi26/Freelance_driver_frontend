import React, { useState } from 'react'
import {AdsMap} from '@/app/type/Ads'
import Rubrique from '@/components/customer/announce/Rubrique'
    
interface Props{
    ad:AdsMap[];
    setAdsMap:React.Dispatch<React.SetStateAction<AdsMap[]>>
}

const Published = ({ad,setAdsMap}: Props) => {
  const[selected,setSelected]=useState('Drafts')
  const Rubriques=["Drafts","Published","Confirmed","Cancelled","Expired"]
  
    return (
      <div className='mt-5'>
        <div className='flex flex-row items-center justify-between gap-4'>
          {Rubriques.map((rubrique)=>(
            <span key={rubrique} className={`cursor-pointer border-b  ${rubrique=='Expired'?( "border-red-500 hover:bg-red-500 text-red-500"):('border-primary-500 hover:bg-primary')}
             shadow-lg w-full  hover:text-white transtion-colors duration-1000 font-bold px-3 
            ${selected===rubrique?(`${rubrique=='Expired'? 'bg-red-500':'bg-primary'}
                text-white border-white`):("")}`} onClick={()=>{setSelected(rubrique)}}>{rubrique}</span>
          ))}
        </div>
        <div>
          {selected==="Drafts" && (<Rubrique backgroundColor='' ad={ad} setAdsMap={setAdsMap} title='Drafts'/>)}
          {selected==="Published" && (<Rubrique backgroundColor='' ad={ad} setAdsMap={setAdsMap} title='Published'/>)}
          {selected==="Confirmed" && (<Rubrique backgroundColor='' ad={ad} setAdsMap={setAdsMap} title='Confirmed'/>)}
          {selected==="Cancelled" && (<Rubrique backgroundColor='' ad={ad} setAdsMap={setAdsMap} title='Cancelled'/>)}
          {selected==="Expired" && (<Rubrique backgroundColor='' ad={ad} setAdsMap={setAdsMap} title='Expired'/>)}
        </div>
      </div>
    )
  }

export default Published