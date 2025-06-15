"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Camera, FileText,Star, User, Car } from 'lucide-react';
import Image from "next/image";
import {InputField} from '@/components/freelance/portofolio/InputField'
import { vehicles } from '@/data/Structure';
interface VehicleFormData {
    brand: string;
    model: string;
    numberOfSeats: string;
    size: string;
    description: string;
    immatriculation: string;
    serial: string;
    fuelType: string;
    boxType: string;
    imageUrl: string;
  }

  const Page = () => {
    const [vehicleFormData, setVehicleFormData] = useState<VehicleFormData>({
        brand: '',
        model: '',
        numberOfSeats: '',
        size: '',
        description: 'Good car',
        immatriculation: '',
        serial: '',
        fuelType: '',
        boxType: '',
        imageUrl: '',
      });
      const Vehicle=vehicles.find(veh=> veh.active==true)

      const handleVehicleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVehicleFormData({ ...vehicleFormData, [name]: value });
      };
    return(
        <>
        <motion.div 
            className="col-span-12 rounded-md p-4 mt-4 text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
        <h2 className="text-xl font-semibold mb-4 ">Vehicle Information</h2>
            <div className="grid grid-cols-12 gap-4">
            <InputField name={Vehicle?.brand} label="Brand" icon={Car} placeholder="Enter Vehicle Brand" value={vehicleFormData.brand} onChange={handleVehicleInputChange} edit={false} />
            <InputField name={Vehicle?.model} label="Model" icon={Car} placeholder="Enter Vehicle Model" value={vehicleFormData.model} onChange={handleVehicleInputChange} edit={false} />
            <InputField name={Vehicle?.availableSeats} label="Number of Seats" icon={User} placeholder="Enter Number of Seats" value={vehicleFormData.numberOfSeats} onChange={handleVehicleInputChange} edit={false} />
            <InputField name={Vehicle?.size} label="Size" icon={Star} placeholder="Enter Vehicle Cost" value={vehicleFormData.size} onChange={handleVehicleInputChange} edit={false} />
            <InputField name={Vehicle?.registration} label="Immatriculation" icon={FileText} placeholder="Enter Immatriculation" value={vehicleFormData.immatriculation} onChange={handleVehicleInputChange} edit={false} />
            <InputField name={Vehicle?.serialnumber} label="Serial number" icon={FileText} placeholder="Enter Vehicle Title" value={vehicleFormData.serial} onChange={handleVehicleInputChange} edit={false} />
            <InputField name={Vehicle?.fuelType} label="Fuel Type" icon={Car} placeholder="Enter Fuel Type" value={vehicleFormData.fuelType} onChange={handleVehicleInputChange} edit={false} />
            <InputField name={Vehicle?.transmission} label="Transmission" icon={Car} placeholder="Enter Transmission" value={vehicleFormData.boxType} onChange={handleVehicleInputChange} edit={false} />
            
            <motion.div className="col-span-12">
                <label htmlFor="description" className=" font-semibold block mb-2 ">Description:</label>
                <textarea
                id="description"
                name="description"
                rows={3}
                value={vehicleFormData.description}
                onChange={handleVehicleInputChange}
                className="w-full bg-white border rounded-md py-3 px-5"
                placeholder="Enter Vehicle Description"
                ></textarea>
            </motion.div>

            <motion.div className="col-span-12">
                <label htmlFor="vehicle-image-upload" className=" font-semibold block mb-2 ">Principal Vehicle Image:</label>
                <div className="relative">
                <input
                    type="file"
                    name="imageUrl"
                    id="vehicle-image-upload"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                        setVehicleFormData({ ...vehicleFormData, imageUrl: event.target?.result as string });
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    }
                    }}
                    className="hidden"
                />
                <label htmlFor="vehicle-image-upload" className="flex items-center justify-center lg:w-1/5 w-1/3 md:w-1/4 bg-white border rounded-md cursor-pointer">
                    <Camera className="mr-2" size={20} />
                    <span>Upload Vehicle Image</span>
                </label>
                </div>
                {vehicleFormData.imageUrl && (
                <div className="mt-4">
                    <Image src={vehicleFormData.imageUrl} width={50} height={50} alt="Vehicle" className="w-[300px] h-48 object-cover rounded-lg" />
                </div>
                )}
            </motion.div>
            </div>
        </motion.div>
        </>
    )
}

export default Page;

