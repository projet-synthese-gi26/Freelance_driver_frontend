import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, User } from 'lucide-react'
import React, { useState } from 'react'

interface FormData {
    formData: {
    name: string;
    age: string;
    height: string;
    weight: string;
    phoneNumber: string;
    password: string;
    birthday: string;
    bloodType: string;
    sexe: string;
    region: string;
    address: string;
    email: string;
    interests: string;
    expectations: string;
    images: string[];
    pdf?: string;
    }
  }

const ProfilePreview = ({formData}:FormData) => {
    
  return (
    <div className="w-full md:w-5/12">
        <motion.div 
            className=" border rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h3 className=" font-bold mb-4 ">Profile Preview</h3>
            <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <User className="" size={24} />
                <div>
                <p className="font-semibold ">{formData.name}</p>
                <p className="text-sm ">{formData.age} years old</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Phone className="" size={24} />
                <p className="">{formData.phoneNumber}</p>
            </div>
            <div className="flex items-center space-x-4">
                <Mail className="" size={24} />
                <p className="">{formData.email}</p>
            </div>
            <div className="flex items-center space-x-4">
                <MapPin className="" size={24} />
                <p className="">{formData.address}, {formData.region}</p>
            </div>
            <div>
                <h4 className="font-semibold  ">Interests</h4>
                <p className="p-2">{formData.interests}</p>
            </div>
            <div>
                <h4 className="font-semibold  ">Expectations</h4>
                <p className="p-2">{formData.expectations}</p>
            </div>
            </div>
        </motion.div>
        </div>
  )
}

export default ProfilePreview