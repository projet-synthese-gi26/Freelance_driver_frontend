"use client";
import _features from "@/components/datas/features";
import { ChangeEvent, useEffect, useState } from "react";
import PlanRecap from "@/components/PlanRecap";
import BillingAddress from "@/components/BillingAddress";
import PaymentMethod from "@/components/PaymentMethod";
import PromoComponent from "@/components/PromoComponent";
import Summary from "@/components/Summary";

const Page = () => {
  function handleFailure() {
    alert("sectionfail")
  }

  function handleSuccess() {
    const customMsg = "payment succeeded"
    alert(customMsg)
    //validate()
  }

  const handleVerify = () => {

  }


  useEffect(() => { }, [])

  const handlePay = async () => {
  }

  const verifyPay = async () => {
  }


  return (
    <div className="py-[30px] text lg:py-[60px] bg-[var(--bg-2)] px-3 font-Inter">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-12 lg:col-span-6">
            <div className="pb-lg-0">
              <PlanRecap />
              <BillingAddress />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <PaymentMethod />
            <PromoComponent />
            <Summary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;