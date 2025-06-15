"use client";
import React from "react";
import Notif1 from "@/components/customer/notification/Notif1";
import Notif2 from "@/components/customer/notification/Notif2";
import Notif3 from "@/components/customer/notification/Notif3";

const Page = () => {

  return (
    <ul className="flex flex-col gap-6 pb-[30px] lg:pb-[60px] text">
      <li>
        <Notif1/>
      </li>
      <li>
        <Notif2/>
      </li>
      <li>
        <Notif3/>
      </li>
    </ul>
  );
};

export default Page;
