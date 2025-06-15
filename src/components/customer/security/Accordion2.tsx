import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Accordion from '../Accordion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast';
import { driverDTO } from '@/app/(dashboard)/freelance-dashboard/FreelanceDTO';

const Accordion2 = () => {
  const [CurrentPassword, setCurrentPassword] =useState(driverDTO.driver_password)
  const [NewPassword, setNewPassword] =useState('')
  const [ConfirmPassword, setConfirmPassword] =useState('')
  const [isValid,setIsValid]=useState(false)
  const [similar,setSimilar]=useState(true)
  const hasUpperCase=/[A-Z]/
  const haslowerCase=/[a-z]/
  const hasNumber=/[0-9]/
  const hasSpecialcharacter=/[!@#$%^&*(),.?":{}|<>]/


  useEffect(()=>{
    if(NewPassword===ConfirmPassword && NewPassword!==''){
      setIsValid(true)
    }
    else{
      setIsValid(false)
    }
  },[NewPassword,ConfirmPassword])

  const SamePasse=()=>{
    if (isValid) {
      toast.success('Password Updated Successfull')
      setSimilar(true)
    }else{
      toast.error('Enter a new password')
      setSimilar(false)
    }
  }
    

  const handleCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value);
  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);
  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 mb-6 rounded-2xl shadow-lg">
        <Accordion
          buttonContent={(open) => (
            <div className="rounded-2xl flex justify-between items-center">
              <h3 className="text  font-bold">Change Password </h3>
              <ChevronDownIcon
                className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
          )}
          initialOpen={true}>
          <div className="pt-4 lg:pt-6 text">
            <form action="#" className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <label
                  htmlFor="current-password-setup"
                  className="block mb-2 font-medium clr-neutral-500">
                  Current password :
                </label>
                <input
                  type="password"
                  id="current-password-setup"
                  className="w-full focus:outline-none border py-3 px-6 rounded-lg"
                  placeholder="Enter current password"
                  value={CurrentPassword}
                  onChange={handleCurrentPassword}
                />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <label
                  htmlFor="new-password"
                  className="block mb-2 font-medium clr-neutral-500">
                  New password :
                </label>
                <input
                  type="password"
                  id="new-password"
                  className={`w-full ${similar?(""):("border-red-500")} focus:outline-none border py-3 px-6 rounded-lg`}
                  placeholder="Enter new password"
                  value={NewPassword}
                  onChange={handleNewPassword}
                />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 font-medium clr-neutral-500">
                  Confirm password :
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className={`w-full ${similar?(""):("border-red-500")} focus:outline-none border py-3 px-6 rounded-lg`}
                  placeholder="Confirm your new password"
                  value={ConfirmPassword}
                  onChange={handleConfirmPassword}
                />
              </div>
              <div className="col-span-12">
                <h5 className="font-medium mb-4"> Password requirements : </h5>
                <ul className=" list-disc pl-4 gap-3">
                  <li className={`${NewPassword.length<8?("text-red-500"):("text-green-500")}`}> Minimum 8 characters long - the more, the better </li>
                  <li className={`${haslowerCase.test(NewPassword)?("text-green-500"):("text-red-500")}`}> At least one lowercase character </li>
                  <li className={`${hasUpperCase.test(NewPassword)?("text-green-500"):("text-red-500")}`}> At least one uppercase character </li>
                  <li className={`${(hasNumber.test(NewPassword) && hasSpecialcharacter.test(NewPassword))?("text-green-500"):("text-red-500")}`}>At least one number, symbol, or whitespace character</li>
                </ul>
              </div>
              <div className="col-span-12">
                <div className="flex items-center gap-6 flex-wrap">
                    <a  onClick={SamePasse} className="cursor-pointer link inline-block py-3 px-6 rounded-md bg-primary text-white :bg-primary-400 hover:text-white font-semibold">
                    Update Password
                    </a>
                  <Link
                    href="#"
                    className="px-6 py-3 border-primary-500 border rounded-md text-primary font-semibold">
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </Accordion>
      </div>
  )
}

export default Accordion2