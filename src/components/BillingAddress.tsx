import React from 'react'
import _features from "@/components/datas/features";
import { BillAddress } from '@/data/Structure';
import { ChangeEvent, useEffect, useState } from "react";
import { useCurrency } from '../app/(pricing)/context/CurrencyContext';
import AddressSelector from './AddressSelector';
import { useSearchParams } from 'next/navigation';

const BillingAddress = () => {
    const searchParams = useSearchParams();
    const data = searchParams.get("data");
    const plan = data ? JSON.parse(data) : null;

    const {
        currency,
        convertedAmount,
    } = useCurrency();

    const date = new Date(Date.now());
    const expiryDate = new Date();

    expiryDate.setMonth(date.getMonth() + plan.duration);
    const [addressValidated, validateAddress] = useState(false);
    const [name, setName] = useState("")
    const [AdressEmail, setAdressEmail] = useState("")

    const handleName = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const handleAddressEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setAdressEmail(e.target.value)
    }


    return (
        <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 mb-6">
            <h4 className="mb-3 text font-semibold">
                {" "}
                Billing address{" "}
            </h4>
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <p className="mb-0">

                    <span className="text-primary"></span>
                </p>
                <p className="mb-0">
                    Total Payable Amount:
                    <span className="text-primary">{' '}
                        {convertedAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })} {currency}
                    </span>
                </p>
            </div>
            <div className="border border-dashed my-3"></div>
            <div className="grid grid-cols-12 gap-4 lg:gap-3 text">
                <div className="col-span-12 md:col-span-6">
                    <input
                        type="text"
                        className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                        placeholder="Enter Name"
                        value={name}
                        onChange={handleName}
                    />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <input
                        type="email"
                        className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                        placeholder="Enter Email"
                        value={AdressEmail}
                        onChange={handleAddressEmail}
                    />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <input
                        type="text"
                        className="w-full bg-[var(--bg-1)] focus:outline-none border border-neutral-40 rounded-lg py-1 px-5"
                        placeholder="Enter Phone Number"
                    />
                </div>
                <div className="col-span-12 md:col-span-6 mb-5">
                    <div className="rounded-lgborder bg-[var(--bg-1)] pr-4">
                        <AddressSelector />
                    </div>
                </div>

            </div>

            <a
                className={`link inline-flex items-center gap-2 py-3 px-6 rounded-lg  text-white :bg-primary-400 hover:text-white font-medium w-full justify-center ${addressValidated ? 'bg-neutral-700' : "bg-primary"}`}

                onClick={() => {
                    validateAddress(!addressValidated);
                }} >
                <span className="inline-block">  {addressValidated ? "Address Validated" : 'Validate Address'} </span>
            </a>
        </div>
    )
}

export default BillingAddress