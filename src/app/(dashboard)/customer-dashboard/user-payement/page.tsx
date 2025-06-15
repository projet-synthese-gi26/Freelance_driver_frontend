import React from "react";
import PaymentMethodChanger from "@/components/customer/payment/PaymentMethodChanger";
import PlanDisplay from "@/components/customer/payment/PlanDisplay";
import PaymentHistory from "@/components/customer/payment/PaymentHistory";

const Page=() => {
  return (
    <div className="max-w-7xl mx-auto text space-y-8 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Payment</h1>
        <p className="text-sm md:text-base mb-4">Update your payment information according to your needs</p>
        <hr className="border-t my-4 md:my-6" />
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2">
            <PlanDisplay />
          </div>
          <div className="w-full lg:w-1/2">
            <PaymentMethodChanger />
          </div>
        </div>
      </div>
      <div>
        <PaymentHistory />
      </div>
    </div>
  );
};

export default Page;