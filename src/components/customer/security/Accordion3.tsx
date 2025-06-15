import Link from 'next/link'
import React, { useState } from 'react'
import Accordion from '../Accordion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import CustomSwitch from '../Switch'
import Image from "next/image";
import iconGoogle from "@public/img/icon-google.png";
import iconDropbox from "@public/img/icon-dropbox.png";
import iconSlack from "@public/img/icon-slack.png";
import iconMailChimp from "@public/img/icon-mailchimp.png";
import iconJira from "@public/img/icon-jira.png";

const Accordion3 = () => {
  
  const [en1,setEn1]=useState(false)
  const [en2,setEn2]=useState(false)
  const [en3,setEn3]=useState(false)
  const [en4,setEn4]=useState(false)
  const [en5,setEn5]=useState(false)
  return (
    <div className="bg-white p-4 mb-5 rounded-2xl shadow-lg text">
        <Accordion
          buttonContent={(open) => (
            <div className="rounded-2xl flex justify-between items-center">
              <h3 className="text font-bold">Connected accounts </h3>
              <ChevronDownIcon
                className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
          )}
          initialOpen={true}>
          <div className="pt-4 lg:pt-6">
            <p className="mb-4">
              Integrated features from these accounts make it easier to
              collaborate with people you know on Let's Go
            </p>
            <ul className="flex flex-col gap-6">
              <li>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="grid place-content-center w-10 h-10 rounded-full shadow-lg bg-white shrink-0 overflow-hidden">
                      <Image
                        src={iconGoogle}
                        alt="image"
                        className="w-full focus:outline-none h-full object-fit-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold mb-1"> Google </h5>
                      <p className="mb-0 clr-neutral-500"> Calendar </p>
                    </div>
                  </div>
                  <div className="shrink-0">
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
              </li>
              <li>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="grid place-content-center w-10 h-10 rounded-full shadow-lg bg-white shrink-0 overflow-hidden p-3">
                      <Image
                        src={iconDropbox}
                        alt="image"
                        className="w-full focus:outline-none h-full object-fit-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold mb-1"> Dropbox </h5>
                      <p className="mb-0 clr-neutral-500"> File hosting </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                  <CustomSwitch enabled={en2} setEnabled={function (): void {
                    if (en2==true) {
                      setEn2(false);
                    }
                    if (en2==false) {
                      setEn2(true);
                    }
                  } } title="" description="" newable={false} />
                  </div>
                </div>
              </li>
              <li>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="grid place-content-center w-10 h-10 rounded-full shadow-lg bg-white shrink-0 overflow-hidden p-3">
                      <Image
                        src={iconSlack}
                        alt="image"
                        className="w-full focus:outline-none h-full object-fit-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold mb-1"> Slack </h5>
                      <p className="mb-0 clr-neutral-500"> Communication </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                  <CustomSwitch enabled={en3} setEnabled={function (): void {
                    if (en3==true) {
                      setEn3(false);
                    }
                    if (en3==false) {
                      setEn3(true);
                    }
                  } } title="" description="" newable={false} />
                  </div>
                </div>
              </li>
              <li>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="grid place-content-center w-10 h-10 rounded-full shadow-lg bg-white shrink-0 overflow-hidden p-3">
                      <Image
                        src={iconMailChimp}
                        alt="image"
                        className="w-full focus:outline-none h-full object-fit-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold mb-1"> Mailchimp </h5>
                      <p className="mb-0 clr-neutral-500"> Email marketing </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                  <CustomSwitch enabled={en4} setEnabled={function (): void {
                    if (en4==true) {
                      setEn4(false);
                    }
                    if (en4==false) {
                      setEn4(true);
                    }
                  } } title="" description="" newable={false} />
                  </div>
                </div>
              </li>
              <li>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="grid place-content-center w-10 h-10 rounded-full shadow-lg bg-white shrink-0 overflow-hidden p-3">
                      <Image
                        src={iconJira}
                        alt="image"
                        className="w-full focus:outline-none h-full object-fit-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold mb-1"> Jira </h5>
                      <p className="mb-0 clr-neutral-500"> Issue tracking </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                  <CustomSwitch enabled={en5} setEnabled={function (): void {
                    if (en5==true) {
                      setEn5(false);
                    }
                    if (en5==false) {
                      setEn5(true);
                    }
                  } } title="" description="" newable={false} />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Accordion>
      </div>
  )
}

export default Accordion3