"use client"
import React, { useState } from 'react'
import {vehicles} from "@/data/Structure"
import {PlusCircleIcon} from "@heroicons/react/24/outline";
import AddVehicleForm from '@/components/freelance/business/AddVehicleForm';
import VehicleList from '@/components/freelance/business/VehicleList';

const Page = () => {
  const [isAdding,setIsAdding]=useState(false)
  const [Editing,setEditing]=useState(false )

  return (
    <div className='text p-4'>
      <h1 className="title font-bold mb-4">Vehicles Management</h1>
      <div className="rounded-md bg-white">
        {vehicles.length<=0 ? (
        <div className='flex items-center justify-center flex-col space-y-[10%]'>
          <span className='opacity-[80%]'>No Registered vehicle yet</span>
          <div className='border border-dashed p-3 rounded items-center flex flex-col justify-center hover:bg-[var(--btn-bg)] cursor-pointer'
            onClick={()=>{setIsAdding(true)}}
          >
            <PlusCircleIcon className='w-7 h-7'/>
            <span className='font-medium'>Add a new vehicle</span> 
          </div>
        </div>
        ):(
          <div>
            {isAdding? (
              <div>
                <span className='font-medium'>Adding a new vehicle</span>
                <AddVehicleForm setIsEditing={setIsAdding} isEditing={isAdding}/>
              </div>
            ):(
              <>
                <VehicleList setIsAdding={setIsAdding} isAdding={isAdding}/>
              </>
            )}
            
          </div>
        )}
      </div>
    </div>
  )
}

export default Page