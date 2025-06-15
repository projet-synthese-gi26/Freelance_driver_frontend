"use client"
import { BillingType } from "@/app/type/Billing";
import BillingAddress from "@/components/customer/address/BillingAddress";
import BillingForm from "@/components/customer/address/BillingForm";
import Link from "next/link";
import { useEffect, useState } from "react";
import {BillAddress} from "@/data/Structure";

const Page = () => {
    const [BillingAdress,setBillingAdress]=useState <BillingType[]>(BillAddress)
    const [location, setLocation] = useState(BillingAdress[0].country)

    return (
      <div className="p-3 text rounded-2xl bg-white shadow-3 mb-[20%]">
        <h3 className="mb-0 title font-bold flex-grow"> My Address </h3>
        <div className="border border-t my-3"></div>
        <p className="text-sm clr-neutral-500 mb-3">
          Cards will be charged either at the end of the month or whenever your
          balance exceeds the usage threshold All major credit/debit cards
          accepted.
        </p>
        <ul className="flex flex-col  gap-6">
          <li>
            <BillingAddress Billings={BillingAdress} setLocation={setLocation} setBilling={setBillingAdress}/>
          </li>
          <li className="items-center justify-center flex w-full">
            <BillingForm Billings={BillingAdress} status="add" setBilling={setBillingAdress}/>
          </li>
        </ul>
        <div className="mt-6">
          <div className="flex gap-2">
            <p className="text-sm clr-neutral-500"> Tax location </p>
            <Link
              href="#"
              className="link inline-block text-primary hover:text-primary font-medium">
              More Info
            </Link>
          </div>
          <h5 className="clr-neutral-500 font-semibold">
            {" "}
            {location} - 20.00% SST{" "}
          </h5>
        </div>
        <div className="">
          <p className="text-sm clr-neutral-500">
            Your text location determines the taxes that are applied to your bill.
          </p>
          <Link
            href="#"
            className="link inline-block text-primary hover:text-primary font-medium">
            How do I correct my tax location?
          </Link>
        </div>
      </div>
    );
  };
  
  export default Page;