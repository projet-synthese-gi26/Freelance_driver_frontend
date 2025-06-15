import React, { ChangeEvent, useState } from 'react'
import { amenitiesOptions,fuelType,vehicleSize,vehiculeType } from '@/data/Structure'
import { Camera, X } from 'lucide-react';
import Image from 'next/image';

interface AddProps{
    isEditing: boolean;
    setIsEditing:React.Dispatch<React.SetStateAction<boolean>>
}

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

const AddVehicleForm = ({isEditing,setIsEditing}:AddProps) => {
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
    const saveChanges = () => {
        setIsEditing(false);
      };
    
      const handleSave = () => {
        setIsEditing(false);
      };
    
      const handleEdit = () => {
        setIsEditing(true);
      };
    
      const handleCancel = () => {
        setIsEditing(false);
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

    const removeImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
      };
    
  return (
    <div>
        <form action="" className="text p-2 gap-4 grid grid-cols-3">
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Model:</label>
            <input type="text" placeholder='eg. Camry, Yaris' className="p-1 border rounded focus:border-primary-500" />
        </div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Brand:</label>
            <input type="text" className="p-1 border rounded focus:border-primary-500" /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Transmisson:</label>
                <select name="" id="" className="p-1 border rounded focus:border-primary-500">
                    <option value="Manual 2WD">Manual 2WD</option>
                    <option value="Manual 4WD">Manual 4WD</option>
                    <option value="Automatic 2WD">Automatic 2WD</option>
                    <option value="Automatic 4WD">Automatic 4WD</option>
                </select>
            </div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Size:</label>
            <select name="" id="" className="p-1 border rounded focus:border-primary-500">
                {vehicleSize.map((size,index) =>(
                    <option value={size.value} key={index}>{size.label}</option>
                ))}
            </select>
        </div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Fuel Type:</label>
            <select name="" id="" className="p-1 border rounded focus:border-primary-500">
                {fuelType.map((fuel,index)=>(
                    <option value={fuel.value} key={index}>{fuel.label}</option>
                ))}
            </select>
        </div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Type</label>
            <select name="" id="" className="p-1 border rounded focus:border-primary-500">
                {vehiculeType.map((veh,index)=>(
                    <option value={veh.value} key={index}>{veh.label}</option>
                ))}
            </select>
        </div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Manufacturer</label>
            <input type="text" placeholder='eg. Toyota, Mercedes, Renault' className="p-1 border rounded focus:border-primary-500" /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Amenities</label>
            {amenitiesOptions.map((amenity,index) =>(
                <div key={index}>
                    {amenity.value=='any'? (
                        <div className='flex gap-3'>
                            <input type="checkbox" className="p-1 border rounded focus:border-primary-500" />
                            <label htmlFor="">All</label>
                        </div>
                    ):(
                    <div className='flex gap-3'>
                        <input type="checkbox" className="p-1 border rounded focus:border-primary-500" />
                        <label htmlFor="">{amenity.label}</label>
                    </div>
                    )}
                    
                </div>
            ))}
        </div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Keywords (separed with comma (,))</label>
            <input type="text" className="p-1 border rounded focus:border-primary-500"
            placeholder='eg. Enthusiast,Expert,Night Driving,Long distance '
            /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Registration Number</label>
            <input type="text" className="p-1 border rounded focus:border-primary-500"
            placeholder='eg. AB-123-CD'
            /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Registration Expiry Date</label>
            <input type="date" className="p-1 border rounded focus:border-primary-500" max={new Date().toISOString().split('T')[0]}/></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Serial Number</label>
            <input type="text" className="p-1 border rounded focus:border-primary-500"
            placeholder='eg. JTDKB3FU1M3226789'
            /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Tank Capacity (in liters)</label>
            <input type="number" defaultValue={0} className="p-1 border rounded focus:border-primary-500" /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Lugguage Capacity (in kilogram)</label>
            <input type="number" defaultValue={0} className="p-1 border rounded focus:border-primary-500" /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Total Seats</label>
            <input type="number" defaultValue={0} className="p-1 border rounded focus:border-primary-500" /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Can Transport</label>
            <input type="text" className="p-1 border rounded focus:border-primary-500"
            placeholder='eg. animals, Goods, Pets, fragile package'
            /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Mileage at Start (in kilometers)</label>
            <input type="number" defaultValue={0} className="p-1 border rounded focus:border-primary-500" /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Fuel Consumption (in liters/100km)</label>
            <input type="number" defaultValue={0} className="p-1 border rounded focus:border-primary-500" /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Vehicle Age (in years)</label>
            <input type="number" defaultValue={0} className="p-1 border rounded focus:border-primary-500" /></div>
        <div className="flex flex-col">
            <label htmlFor="" className="mb-2">Vehicle Images</label>
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
            </div>

        </div>
    </form>
    <div className='mt-6 flex gap-4 px-4 w-full flex items-center justify-end'>
        <button className="mb-2 bg-primary text-white px-4 py-1 rounded" onClick={handleSave}>
            Save
        </button>
        <button className="mb-2 bg-gray-300 text-gray-700 px-4 py-1 rounded" onClick={handleCancel}>
        Cancel
        </button>
    </div>
    </div>
  )
}

export default AddVehicleForm