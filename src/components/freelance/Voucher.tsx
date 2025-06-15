"use client"
import { Promo } from '@/app/type/Promo';
import React, { useEffect, useState } from 'react';
import {generateOTP} from "@/app/(pricing)/components/tests/optgenerator"
import { toast } from 'react-hot-toast';

const Voucher = () => {
  const [promo, setPromo] = useState<Promo[]>([]);
  const [promoBd, setPromoBd] = useState<Promo[]>([]);
  const[number,setNumber]=useState(0)
  const [validate,setValid]=useState(0)
  const [discount,setDiscount]=useState(0)
  const [date,setDate]=useState<string>(new Date().toLocaleDateString())
  
  const handleGenerate = async(num:number,valid:number) => {
      if (num>0 && valid>0) {
        toast.success('Voucher code generated successfully')
        let promoList = [];
        let FormatedDate=date.split('-');
        for (let i = 0; i < num; i++) {
          const otp = generateOTP();
          promoList.push({
            code: otp,
            validity: valid,
            discount: discount,
            status: 'active',
            startDate:FormatedDate[2]+"/"+FormatedDate[1]+"/"+FormatedDate[0]
          });
        }
        setPromo([...promo, ...promoList])
      }else{
        toast.error("Incorrect number of voucher or validity")
      }
  }
    const handlenumber=(e:any)=>{
      setNumber(e.target.value)
    }

    const handleValid=(e:any)=>{
      setValid(e.target.value)
    }

    const handleDate=(e:any)=>{
      setDate(e.target.value)
    }

    const handleDiscount=(e:any)=>{
      setDiscount(e.target.value)
    }

  return (
    <div className="justify-center items-center p-6">
        <div className="overflow-x-auto">
            <div className="flex items-center justify-between flex-row">
              <div className='grid grid-cols-4 space-x-5'>
                <div className="flex flex-col">
                  <label htmlFor="number">Number of voucher code</label>
                  <input type="number" id='number' value={number} onChange={handlenumber} className='border px-2'/>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="validity">Validity of each voucher <span className='text-[10px] opacity-60%'>(in days)</span> </label>
                  <input type="number" id='validity' value={validate} onChange={handleValid} className='border px-2'/>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="discount">% Discount </label>
                  <input type="number" id='discount' value={discount} onChange={handleDiscount} className='border px-2'/>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="date">Start at </label>
                  <input type="date" id='date' value={date} onChange={handleDate} className='border px-2'/>
                </div>
              </div>
              <button
                    className="flex items-center justify-center p-2 m-3 bg-primary text-white rounded-md focus:outline-none  min-h-65"
                    onClick={()=>{handleGenerate(number,validate)}}
                  >
                    <span>generate</span>
              </button>
            </div>
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left bg-[var(--bg-1)] border-b border-dashed flex justify-center items-center">
                <th className="py-3 lg:py-4 px-2 xl:px-4 mx-[2rem]">Code</th>
                <th className="py-3 lg:py-4 px-2 mx-[2rem]">Validity</th>
                <th className="py-3 lg:py-4 px-2 mx-[2rem]">Discount</th>
                <th className="py-3 lg:py-4 px-2 mx-[2rem]">Status</th>
                <th className="py-3 lg:py-4 px-2 mx-[2rem]">StartDate</th>
              </tr>
            </thead>
            <tbody>
              {promo.map(promo =>(
                <tr
                key={promo.code}
                className="text-left bg-[var(--bg-1)] border-b border-dashed flex justify-center items-center">
                <div className='flex justify-center items-center flex-row  '>
                  <td className="py-3 lg:py-4 px-2 text-primary mx-[2.5rem]">{promo.code}</td>
                  <td className="py-3 lg:py-4 px-2 mx-[2.5rem]">
                    {promo.validity} days
                  </td>
                  <td className="py-3 lg:py-4 px-2 mx-[2.5rem]">{promo.discount} %</td>
                  <td className="py-3 lg:py-4 px-2 mx-[2.5rem]">{promo.status}</td>
                  <td className="py-3 lg:py-4 px-2 mx-[2.5rem]">{promo.startDate}</td>
                </div>
              </tr>
                ))
              }
              {promoBd.map(promo =>(
                <tr
                key={promo.code}
                className="text-left bg-[var(--bg-1)] border-b border-dashed flex justify-center items-center">
                <div className='flex justify-center items-center flex-row  '>
                  <td className="py-3 lg:py-4 px-2 text-primary mx-[2.5rem]">{promo.code}</td>
                  <td className="py-3 lg:py-4 px-2 mx-[2.5rem]">
                    {promo.validity} days
                  </td>
                  <td className="py-3 lg:py-4 px-2 mx-[2.5rem]">{promo.discount} %</td>
                  <td className="py-3 lg:py-4 px-2 mx-[2.5rem]">{promo.status}</td>
                  <td className="py-3 lg:py-4 px-2 mx-[2.5rem]">{promo.startDate}</td>
                </div>
              </tr>
                ))
              }
            </tbody>
          </table>
          
        </div>
    </div>
  )
}

export default Voucher