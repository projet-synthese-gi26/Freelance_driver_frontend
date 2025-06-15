import React, { useState } from 'react'
import CustomSwitch from '@/components/customer/Switch';

interface TogglePropos{
    label: string;
    description:string;
}

const Toggle = ({label,description}:TogglePropos) => {
    const [en1,setEn1]=useState(false)
  return (
    <div>
        <div className="flex flex-col  border rounded-md w-[25rem] ml-2  p-2 ">
            <div className='flex flex-row justify-between items-center'>
                <label className="font-medium">
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
            {en1 &&
            <div className='opacity-[80%] flex flex-wrap'>
            {description}
            </div>}
        </div>
    </div>
  )
}

export default Toggle