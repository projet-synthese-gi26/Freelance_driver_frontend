import Link from 'next/link'
import React, { useState } from 'react'
import Accordion from '../Accordion'
import { ChevronDownIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/solid'

const Accordion4 = () => {
  const [opened,setOpened]=useState(true)  

  
  const handleOpen=()=>{
    if (opened==true) {
      setOpened(false)
    }
    if (opened==false) {
      setOpened(true)
    }
  }
  return (
    <div className={`bg-white p-4 mb-5 rounded-2xl shadow-lg text ${opened==true? (""):("mb-[38%]")}`}>
        <Accordion
          buttonContent={(open) => (
            <div className="rounded-2xl flex justify-between items-center">
              <h3 className="text font-bold">Device history </h3>
              <ChevronDownIcon
                className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                  open ? "rotate-180" : ""
                }`} onClick={handleOpen}
              />
            </div>
          )}
          initialOpen={true}>
          <div className="pt-4 lg:pt-6">
            <ul className="flex flex-col gap-6">
              <li>
                <div className="flex flex-wrap items-center justify-between gap-4 text-">
                  <div className="flex gap-6 items-center">
                    <div className="shrink-0">
                      <ComputerDesktopIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-medium mb-1"> Dell XPS 20 </h5>
                      <ul className="flex flex-wrap items-center list-divider-half-xs">
                        <li>
                          <span className="inline-block text-sm">
                            IP : 213.230.93.79
                          </span>
                        </li>
                        <li>
                          <span className="inline-block text-sm ml-3 font-medium text-green-500">
                            {" "}active : Now
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Link
                      href="#"
                      className="px-6 py-3 border-primary-500 border rounded-md text-primary font-semibold">
                      Log out
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-6 items-center">
                    <div className="shrink-0">
                      <ComputerDesktopIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-medium mb-1"> Microsoft Studio </h5>
                      <ul className="flex flex-wrap items-center list-divider-half-xs">
                        <li>
                          <span className="inline-block text-sm">
                            IP : 213.230.93.79
                          </span>
                        </li>
                        <li>
                          <span className="inline-block text-sm ml-3">
                          active : 3 days ago
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Link
                      href="#"
                      className="px-6 py-3 border-primary-500 border rounded-md text-primary font-semibold">
                      Log out
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-6 items-center">
                    <div className="shrink-0">
                      <DevicePhoneMobileIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-medium mb-1"> Samsung Note 10 </h5>
                      <ul className="flex flex-wrap items-center list-divider-half-xs">
                        <li>
                          <span className="inline-block text-sm">
                            IP : 213.230.93.79
                          </span>
                        </li>
                        <li>
                          <span className="inline-block text-sm ml-3">
                          active : 22 min ago
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Link
                      href="#"
                      className="px-6 py-3 border-primary-500 border rounded-md text-primary font-semibold">
                      Log out
                    </Link>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Accordion>
      </div>
  )
}

export default Accordion4