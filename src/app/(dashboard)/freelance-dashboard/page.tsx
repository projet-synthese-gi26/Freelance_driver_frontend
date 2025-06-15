"use client"
import React, {useState } from 'react'
import { PencilIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { toast } from 'react-hot-toast';
import {languageOptions} from "@/data/Structure";
import { driverDTO } from '@/app/(dashboard)/freelance-dashboard/FreelanceDTO';

const Page = () => {
    const [editable,setEditable] = useState(false)
    const handleSave = () => {
      toast.success('Changes Saved Successfully');
    };

  return (
    <div className="p-4">
        <h1 className="title font-bold">Personal Information</h1>
        <div>
        <form action="#" className="text mb-5 space-y-5 p-4 rounded-md ">
                <PencilSquareIcon className={`ml-[80%] w-5 h-5 hover:cursor-pointer ${editable && 'hidden'}`} onClick={()=>{setEditable(true)
                }}/>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                  <div>
                    <label  className="font-medium">
                      First name :
                    </label>
                    {editable? (
                      <input
                      type="text"
                      id="first name"
                      name="first name"
                      className="border p-2 rounded-md"
                      placeholder={driverDTO.first_name}
                    />
                    ):(
                      <p className='opacity-[80%]'>{driverDTO.first_name}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-medium">
                      Last name :
                    </label>
                    {editable? (
                      <input
                      type="text"
                      id="last name"
                      name="last name"
                      className="border p-2 rounded-md"
                      placeholder={driverDTO.last_name}
                    />
                    ):(
                      <p className='opacity-[80%]'>{driverDTO.last_name}</p>
                    )} 
                  </div>                    
                  <div>
                    <label className="font-medium">
                      Nickname (optional) :
                    </label>
                    {editable? (
                      <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      className="border p-2 rounded-md"
                      placeholder={driverDTO.friendly_name}
                    />
                    ):(
                      <p className='opacity-[80%]'>{driverDTO.friendly_name}</p>
                    )}
                  </div>
                  <div>
                    <label  className="font-medium">
                      Date of Brith :
                    </label>
                    {editable? (
                      <input
                      type="date"
                      id="date_birth"
                      name="date_birth"
                      className="border p-2 rounded-md"
                    />
                    ):(
                      <p className='opacity-[80%]'>{driverDTO.date_of_birth}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="font-medium">
                      Email :
                    </label>
                    {editable? (
                      <input
                      type="email"
                      id="email"
                      name="email"
                      className="border p-2 rounded-md"
                      placeholder={driverDTO.driver_email}
                    />
                    ):(
                      <p className='opacity-[80%]'>{driverDTO.driver_email}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-medium">
                      Phone:
                    </label>
                    {editable? (
                      <input
                      type="number"
                      id="Phone number"
                      name="Phone number"
                      className="border p-2 rounded-md"
                      placeholder="654062523"
                    />
                    ):(
                      <p className='opacity-[80%]'>{driverDTO.driver_phone_number}</p>
                    )}
                  </div>
                  <div>
                    <label  className="font-medium">
                      Nationality : 
                    </label><br />
                    <span className="opacity-[80%]">{driverDTO.driver_nationality}</span>
                  </div>
                  <div>
                    <label  className="font-medium">
                      Registration Date : 
                    </label><br />
                    <span className="opacity-[80%]">{driverDTO.driver_registered_at}</span>
                  </div>
                  <div>
                    <label className="font-medium">
                      Gender :
                    </label>
                    {editable? (
                      <ul className="flex flex-wrap items-center gap-6">
                      <li>
                        <div className="flex items-center gap-2">
                          <input
                            className="accent-[var(--primary)] scale-125"
                            type="radio"
                            name="sex"
                            id="male"
                            value="male"
                          />
                          <label
                            className="inline-block cursor-pointer clr-neutral-500"
                            htmlFor="male">
                            Male
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center gap-2">
                          <input
                            className="accent-[var(--primary)] scale-125"
                            type="radio"
                            name="sex"
                            id="female"
                            value="female"
                          />
                          <label
                            className="inline-block cursor-pointer clr-neutral-500"
                            htmlFor="female">
                            Female
                          </label>
                        </div>
                      </li>
                      </ul>
                    ):(
                      <p className='opacity-[80%]'>{driverDTO.driver_gender}</p>
                    )} 
                  </div>
                  <div className="flex flex-col w-full sm:w-auto">
                        <label className="mb-2 font-medium">
                        Language :
                        </label>
                        <div className="">
                            {editable? (
                              <select
                              className="w-[10rem] rounded-md flex items-center bg-transparent px-3 py-2 focus:border-primary-500 border"
                              aria-label="Default select example">
                              <option>Select Language</option>
                              {languageOptions.map((option,key) =>(
                              <option key={key} value={option.value}>{option.label}</option>
                              ))}
                          </select>
                            ):(
                              <p className='opacity-[80%]'>{driverDTO.driver_language}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                  <label className="font-medium">
                    Bio :
                  </label>
                  {editable? (
                    <textarea
                    id="profile"
                    name="profile"
                    rows={4}
                    placeholder="Write your bio"
                    className="border w-full focus:outline-none py-3 px-6 rounded-2xl"
                    >
                  </textarea>
                  ):(
                    <p className='opacity-[80%]'>{driverDTO.driver_bio}</p>
                  )}
                </div>
              </form>
              <div className="flex items-center gap-6 flex-wrap">
                {editable &&(
                  <div className="flex gap-3">
                      <a
                      className="link cursor-pointer font-medium bg-primary p-2 text-white rounded-md"
                      // onClick={handleSave}
                      >
                      Save Changes
                    </a>
                    <button
                      className="border border-primary-500 p-2 rounded-md text-primary hover:text-primary  font-medium" onClick={()=>{setEditable(false)}}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
        </div>
    </div>
  )
}

export default Page