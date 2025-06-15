import React from "react";
import {
  languageOptions,
  timezoneOptions,
  currencyOptions,
  paymentMethod,
  vehiculeType
  
} from "@/data/Structure";
import Preference2 from "@/components/customer/preference/Preference2";

const Page=() => {
  
  return (
    <div className="mb-[23%]">
      <div className="p-6 p-xl-10 rounded-2xl bg-white shadow-3 text">
        <h3 className="mb-0 text font-bold flex-grow w-full"> Preferences </h3>
        <h3 className="mb-0 text font-bold flex-grow w-full"> Preferences </h3>
        <div className="hr-line my-6"></div>
        <div className="grid md:grid-cols-2 grid-cols-1 xl:grid-cols-3">
          <Preference2 label="Language" type="select" defaultSelectOption="Select Language" mapSelectOption={languageOptions}/>
          <Preference2 label="Time Zone" type="select" defaultSelectOption="Select Time Zone" mapSelectOption={timezoneOptions}/>
          <Preference2 label="Currency" type="select" defaultSelectOption="Select Currency" mapSelectOption={currencyOptions}/>
          <Preference2 label="Payment Method" type="select" defaultSelectOption="Select Payment Method" mapSelectOption={paymentMethod}/>
          <Preference2 label="Vehicule Type" type="select" defaultSelectOption="Select vehicule Type" mapSelectOption={vehiculeType}/>
          <Preference2 label="Safety Features" type="switch"  mapSelectOption={currencyOptions}/>
          <Preference2 label="Safety Features" type="switch"  mapSelectOption={currencyOptions}/>
          <Preference2 label="Promotional Notification" type="switch"  mapSelectOption={currencyOptions}/>
        </div>
        <div>
          <button type="submit" className="bg-primary text-white font-medium rounded-xl p-3 m-4">Save Preferences</button>
          <button type="reset" className="border-primary-500 border text-primary font-medium rounded-xl p-3 m-4">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Page;
