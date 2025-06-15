"use client"
import React, { useState } from 'react'
import CustomSwitch from "@/components/customer/Switch";

interface Preference2Props{
    label:string;
    defaultSelectOption?:string;
    mapSelectOption: {
        value: string;
        label: string;
    }[];
    type?:string;

}

const Preference2 = ({label,defaultSelectOption,mapSelectOption,type}:Preference2Props) => {
    const [en1,setEn1]=useState(false)
  return (
    <div className='p-2'>
        {type==="select" &&(
            <form action="#" className="flex gap-4">
                <div className="flex flex-col w-full sm:w-auto">
                        <label className="mb-2 font-medium">
                        {label} :
                        </label>
                        <div className="border rounded-lg px-3 bg-transparent w-[20rem] h-[3rem]">
                            <select
                                className="w-full bg-transparent px-5 py-3 focus:outline-none"
                                aria-label="Default select example">
                                <option>{defaultSelectOption}</option>
                                {mapSelectOption.map((option,key) =>(
                                <option key={key} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
            </form>
        )}
        {type==="switch" &&(
            <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-6 md:col-span-10 flex justify-between items-center border rounded-lg p-3 gap-2 w-[20rem] h-[3rem] bg-transparent">
                <label className="block font-medium clr-neutral-500">
                    {label} :
                </label>
                <div>
                    <CustomSwitch enabled={en1} setEnabled={function (): void {
                        if (en1==true) {
                        setEn1(false);
                        }
                        if (en1==false) {
                        setEn1(true);
                        }
                    } } title="" description="" newable={false} />
                </div>
            </div>
        </div>
        )}
    </div>
  )
}

export default Preference2