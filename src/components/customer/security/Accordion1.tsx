import Link from 'next/link'
import React from 'react'
import Accordion from '../Accordion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const Accordion1 = () => {
  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 mb-6 text rounded-2xl shadow-lg">
        <Accordion
          buttonContent={(open) => (
            <div className="rounded-2xl flex justify-between items-center">
              <h3 className="text font-bold">Two-step verification</h3>
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
              Start by entering your password so that we know it&apos;s you.
              Then we&apos;ll walk you through two more simple steps.
            </p>
            <form action="#" className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <label
                  htmlFor="account-password"
                  className="block mb-2 font-medium clr-neutral-500">
                  Account password :
                </label>
                <input
                  type="password"
                  id="account-password"
                  className="py-3 px-6 border w-full focus:outline-none rounded-lg"
                  placeholder="Enter current password"
                />
              </div>
              <div className="col-span-12">
                <Link
                  href="#"
                  className="link inline-block py-3 px-6 rounded-md bg-primary text-white :bg-primary-400 hover:text-white font-medium">
                  Set Up
                </Link>
              </div>
            </form>
          </div>
        </Accordion>
      </div>
  )
}

export default Accordion1