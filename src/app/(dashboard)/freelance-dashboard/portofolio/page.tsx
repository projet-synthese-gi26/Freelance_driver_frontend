"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Camera, FileText, Calendar, Phone, Mail, MapPin, Star, X, User, Car } from 'lucide-react';
import Image from "next/image";
import ProfilePreview from '@/components/freelance/portofolio/ProfilePreview';
import {InputField} from '@/components/freelance/portofolio/InputField'
import ProfessionalExperience from '@/components/freelance/portofolio/Experience';

interface FormData {
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

interface VehicleFormData {
  brand: string;
  model: string;
  numberOfSeats: string;
  cost: string;
  description: string;
  immatriculation: string;
  title: string;
  fuelType: string;
  boxType: string;
  imageUrl: string;
}

const Page = () => {
  const [formData, setFormData] = useState<FormData>({
    name: 'John Smith',
    age: '24',
    height: '180',
    weight: '90',
    phoneNumber: '650344138',
    password: '180',
    birthday: '1990-01-01',
    bloodType: 'A',
    sexe: 'Masculin',
    region: 'Centre',
    address: 'Mimboman-Yaounde',
    email: 'nom@gmail.com',
    interests: 'I love to play basketball and tennis. I also play video games and watch movies. I love going to the gym and work-out. I love meeting new people.',
    expectations: 'I expect to meet my future wife here by meeting new people.',
    images: [],
  });
  
  const [vehicleFormData, setVehicleFormData] = useState<VehicleFormData>({
    brand: '',
    model: '',
    numberOfSeats: '',
    cost: '',
    description: '',
    immatriculation: '',
    title: '',
    fuelType: '',
    boxType: '',
    imageUrl: '',
  });

  const [showVehicleForm, setShowVehicleForm] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleVehicleForm = () => {
    setShowVehicleForm(!showVehicleForm);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const imagePromises = filesArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
  
      Promise.all(imagePromises).then((images) => {
        setFormData({ ...formData, images: [...formData.images, ...images] });
      });
    }
  };

  const handlePdfUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, pdf: reader.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ ...formData, vehicle: vehicleFormData });
  };

  return (
    <div className="min-h-screen">
      <section className="grid z-[1] grid-cols-12">
        <div className="col-span-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="py-3 bg-white"
          >
            <div className="flex text flex-wrap md:flex-nowrap items-start gap-6 xl:gap-8 mx-3">
              <div className="w-full md:w-7/12">
                <div className="p-4">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-12 gap-4">
                      <InputField edit={true} name="name" label="Name" icon={User} placeholder="Enter Your Name" />
                      <InputField edit={true} name="age" label="Age" icon={User} placeholder="Enter Your Age" />
                      <InputField edit={true} name="height" label="Height (cm)" icon={User} placeholder="Enter Your Height" />
                      <InputField edit={true} name="weight" label="Weight (kg)" icon={User} placeholder="Enter Your Weight" />
                      <InputField edit={true} name="phoneNumber" label="Phone Number" icon={Phone} placeholder="Enter Your Phone Number" />
                      <InputField edit={true} name="birthday" label="Birthday" icon={Calendar} type="date" />
                      <InputField edit={true} name="email" label="Email" icon={Mail} type="email" placeholder="Enter Your Email" />
                      
                      <motion.div 
                        className="col-span-12 sm:col-span-6"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <label htmlFor="sexe" className="font-semibold block">Gender:</label>
                        <div className="relative">
                          <select
                            name="sexe"
                            id="sexe"
                            value={formData.sexe}
                            onChange={handleInputChange}
                            className="w-full bg-white border rounded-md  p-1"
                          >
                            <option value="Masculin">Male</option>
                            <option value="Feminin">Female</option>
                          </select>
                        </div>
                      </motion.div>

                      <InputField edit={true} name="region" label="Region" icon={MapPin} placeholder="Enter Your Region" />
                      <InputField edit={true} name="address" label="Address" icon={MapPin} placeholder="Enter Your Address" />

                      <ProfessionalExperience/>

                      <motion.div 
                        className="col-span-12"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <label htmlFor="interests" className="font-semibold block">Interests:</label>
                        <textarea
                          id="interests"
                          name="interests"
                          rows={3}
                          value={formData.interests}
                          onChange={handleInputChange}
                          className="w-full bg-white border rounded-md p-2"
                        ></textarea>
                      </motion.div>

                      <motion.div 
                        className="col-span-12"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <label htmlFor="expectations" className=" font-semibold block">Expectations:</label>
                        <textarea
                          id="expectations"
                          name="expectations"
                          rows={3}
                          value={formData.expectations}
                          onChange={handleInputChange}
                          className="w-full bg-white border rounded-md p-2"
                        ></textarea>
                      </motion.div>

                      <motion.div 
                        className="col-span-12"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <label htmlFor="images" className=" font-semibold block ">Profile Images:</label>
                        <div className="relative">
                          <input
                            type="file"
                            name="images"
                            id="image-upload"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label htmlFor="image-upload" className="flex items-center justify-center w-full bg-white border p-2 rounded-md cursor-pointer">
                            <Camera className="mr-2" size={20} />
                            <span>Upload Images</span>
                          </label>
                        </div>
                        {formData.images.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {formData.images.map((image, index) => (
                              <div key={index} className="relative">
                                <Image src={image} alt={`Uploaded ${index + 1}`} width={50} height={50} className="w-full h-32 object-cover rounded-lg" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500  rounded-full p-1"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>

                      <motion.div 
                        className="col-span-12"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <label htmlFor="cv-upload" className=" font-semibold block">CV Upload:</label>
                        <div className="relative">
                          <input
                            type="file"
                            name="cv-upload"
                            id="cv-upload"
                            accept="application/pdf"
                            onChange={handlePdfUpload}
                            className="hidden"
                          />
                          <label htmlFor="cv-upload" className="flex items-center justify-center w-full bg-white border rounded-md p-2 cursor-pointer">
                            <FileText className="mr-2" size={20} />
                            <span>Upload CV</span>
                          </label>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="col-span-12"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <button
                          type="submit"
                          className="w-full border p-2 rounded-md"
                        >
                          Save Profile
                        </button>
                      </motion.div>
                    </div>
                  </form>
                </div>
              </div>
              <ProfilePreview formData={formData}/>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Page;