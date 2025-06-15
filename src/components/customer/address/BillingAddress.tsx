"use client"
import React, { Dispatch, SetStateAction, useEffect, useState }  from 'react'
import BillingForm from './BillingForm'
import { BillingType } from '@/app/type/Billing'

interface BillingProps {
    Billings: BillingType[]
    setLocation: React.Dispatch<React.SetStateAction<string>>;
    setBilling:Dispatch<SetStateAction<BillingType[]>>;
}

const BillingAddress = ({Billings, setLocation,setBilling}: BillingProps) => {
    const [selectOption, setSelectOption] = useState('')

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectOption(e.target.value)
    }

    useEffect(() => {
        for (let index = 0; index < Billings.length; index++) {
            if (selectOption === 'Bill' + Billings[index].id.toString()) {
                Billings[index].select = true
                setLocation(Billings[index].country)
            } else {
                Billings[index].select = false
            }
        }
    }, [selectOption, Billings, setLocation])

    return (
        <>
            {Billings.map((billing) => (
                <div key={billing.id} className="border border-dashed rounded-2xl mb-4">
                    <form action="" className='flex flex-wrap items-center lg:justify-between p-4 '>
                        <div className="flex items-center gap-4">
                            <input
                                className="accent-[var(--primary)] scale-125"
                                type="radio"
                                name="select-address"
                                id={`billing-address-${billing.id}`}
                                value={'Bill' + billing.id.toString()}
                                checked={selectOption === 'Bill' + billing.id.toString()}
                                onChange={handleSelect}
                            />
                            <label
                                className="inline-block text-lg font-medium cursor-pointer"
                                htmlFor={`billing-address-${billing.id}`}>
                                <span className="text block font-bold">
                                    Billing address #{billing.id}
                                </span>
                                <span className="block text clr-neutral-500">
                                    {billing.country + ', ' + billing.city + ' ' + billing.street + ' ' + billing.postalCode}
                                </span>
                            </label>
                        </div>
                        <BillingForm Billings={Billings} BillId={billing.id} status='update' setBilling={setBilling}/>
                    </form>
                </div>
            ))}
        </>
    )
}

export default BillingAddress