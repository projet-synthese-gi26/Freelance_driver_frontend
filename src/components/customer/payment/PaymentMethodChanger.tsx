"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"

import { paymentMethod } from '@/data/Structure'

interface PaymentMethod {
  value: string;
  label: string;
  icon: string;
  info: string;
}

const PaymentMethodChanger: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethod[0]);
    const [isListVisible, setIsListVisible] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);

    const handleChangeClick = () => {
        setIsListVisible(!isListVisible);
    };

    const handleSelectMethod = (method: PaymentMethod, index: number) => {
        setSelectedMethod(method);
        setIndex(index);
        setIsListVisible(false);
    };

    return (
        <div className='flex flex-col gap-1 max-w-md mx-auto p-4'>
            <span className='title font-bold text-lg md:text-xl'>Payment Method</span>
            <p className='opacity-80 text-sm md:text-base'>Change how you pay for a trip</p>
            <div className='flex flex-row border p-3 items-center rounded-xl mt-2'>
                <div className=' border-r px-3 py-2 sm:py-0 flex items-center justify-center'>
                    {selectedMethod === paymentMethod[0] ? (
                        <p>Any</p>
                    ) : (
                        <Image src={paymentMethod[index].icon} alt={paymentMethod[index].label} className='mr-2' width={30} height={30} />
                    )}
                </div>
                <div className='flex flex-row w-full p-3 items-center justify-between'>
                    <div className='text-center sm:text-left mb-2 sm:mb-0'>{selectedMethod.info}</div>
                    <div 
                        className='flex bg-[#efeffd] p-2 font-semibold rounded cursor-pointer'
                        onClick={handleChangeClick}
                    >
                        <ArrowsUpDownIcon className='w-5 h-5 mr-1'/>
                        Change
                    </div>
                </div>
            </div>
            {isListVisible && (
                <div className='mt-2 border rounded-lg p-2 z-50 bg-white'>
                    {paymentMethod.map((method, idx) => (
                        <div 
                            key={method.value} 
                            className='flex items-center p-2 cursor-pointer hover:bg-gray-100'
                            onClick={() => handleSelectMethod(method, idx)}
                        >
                            {method.label !== 'any' ? (
                                <Image src={method.icon} alt={method.label} className='mr-2' width={30} height={30} />
                            ) : (
                                <p className='mr-2'>Any</p>
                            )}
                            <span className='font-semibold'>{method.label}</span>
                        </div>
                    ))}
                </div>
            )}
            <p className='opacity-80 text-sm mt-2'>Note: Please be careful when choosing your payment method.</p>
        </div>
    )
}

export default PaymentMethodChanger;