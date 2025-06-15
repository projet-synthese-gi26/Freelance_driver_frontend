import React, { useEffect, useState } from 'react'
import {vehicles} from "@/data/Structure"
import Accordion from '@/components/customer/Accordion'
import Modal from '@/components/modal/modal';
import { ChevronDownIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import {
    faUsers, faSuitcase, faCogs, faFan, faChevronLeft, faChevronRight,
    faCar, faGasPump, faIndustry, faIdCard, faBarcode, faGauge, faCalendarAlt,
    faTruck,faInfoCircle,faComments, faPaw, faWifi, faParking, faBell, faTachometerAlt
} from '@fortawesome/free-solid-svg-icons';
import DetailItem from '@/components/profile/freelance/DetailItem';
import Image from 'next/image';
import Car1 from "@public/img/car-list-1.jpg"
import Car2 from "@public/img/car-list-2.jpg"
import Car3 from "@public/img/car-list-3.jpg"
import Car4 from "@public/img/car-list-4.jpg"
import Car5 from "@public/img/car-list-6.jpg"


interface AddProps {
    isAdding: boolean;
    setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}

const VehicleList = ({ isAdding, setIsAdding}: AddProps) => {
    const [editStates, setEditStates] = useState<boolean[]>(Array(vehicles.length).fill(false));
    const [change, setChange]=useState<boolean>(false)
    const [vehicle,setVehicle]=useState(vehicles)

    const toggleEdit = (index: number) => {
        setEditStates((prev) => {
            const newStates = [...prev];
            newStates[index] = !newStates[index];
            return newStates;
        });
    };

    const handleCloseModal = () => {
        setChange(false);
      };

    const handleChange=(index:number)=>{
        const Updated=vehicle.map(vehicle => {
            return {...vehicle,active:false}
        })
        Updated[index].active=true
        setVehicle(Updated)
         
    }

    useEffect (()=>{
        console.log(vehicle);
        setChange(false)
    },[vehicle])

    return (
        <div className='text p-4'>
            <div className='mb-6 flex items-center justify-between'>
                <span className='font-bold'>Vehicle List</span>
                <div className='flex  space-x-5'>
                    <button className='border p-1 rounded-md font-bold text-white bg-primary hover:bg-white hover:text-primary'
                    onClick={()=>{setChange(!change)}}
                    >
                        Change active vehicle
                    </button>
                    <button className='border p-1 border-[var(--dark)] rounded-md font-bold hover:text-white hover:bg-primary'
                        onClick={() => { setIsAdding(!isAdding) }}
                    >
                        Add New Vehicle
                    </button>
                </div>
            </div>
            {vehicle.map((veh, index) => (
                <Accordion
                    key={index}
                    buttonContent={(open) => (
                        <div className="rounded-md border p-2 flex justify-between items-center my-2">
                            <div className="flex space-x-10">
                                <h3 className="text font-medium">{veh.brand + " " + veh.model}</h3>
                                <span>Average ratings: 4.5 <span className="text-yellow-400">★</span></span>
                                <span>Total number of rides: 30</span>
                            </div>
                            <div className="flex flex-row items-center space-x-10">
                                {veh.active &&(<div>Active</div>)}
                                <ChevronDownIcon
                                    className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""}`}
                                />
                            </div>
                        </div>
                    )}
                    initialOpen={false}>
                    <div className='flex flex-col items-center justify-center border-b rounded-lg shadow-lg space-y-4'>
                        <div className="w-full items-center justify-end flex px-3">
                            {editStates[index] ? (
                                <div className="space-x-5">
                                    <span className="cursor-pointer" onClick={() => toggleEdit(index)}>Save</span>
                                    <span className="cursor-pointer" onClick={() => toggleEdit(index)}>Cancel</span>
                                </div>
                            ) : (
                                <span className="cursor-pointer" onClick={() => toggleEdit(index)}>Edit</span>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-2 w-full p-2">
                            <DetailItem edit={editStates[index]} icon={faUsers} label="Seats" value={veh.availableSeats} />
                            <DetailItem edit={editStates[index]} icon={faSuitcase} label="Luggage Capacity" value={`${veh.luggageCapacity} Kg`} />
                            <DetailItem edit={editStates[index]} icon={faCogs} label="Transmission" value={veh.transmission} />
                            <DetailItem edit={editStates[index]} icon={faFan} label="Amenities" value={veh.amenities.join(', ')} />
                            <DetailItem edit={editStates[index]} icon={faCar} label="Size" value={veh.size} />
                            <DetailItem edit={editStates[index]} icon={faGasPump} label="Fuel Type" value={veh.fuelType} />
                            <DetailItem edit={editStates[index]} icon={faIndustry} label="Manufacturer" value={veh.manufacturer} />
                            <DetailItem edit={editStates[index]} icon={faIdCard} label="Registration" value={veh.registration} />
                            <DetailItem edit={editStates[index]} icon={faIdCard} label="Registration Expiry Date" value={veh.registrationExpiryDate} />
                            <DetailItem edit={editStates[index]} icon={faBarcode} label="Serial Number" value={veh.serialnumber} />
                            <DetailItem edit={editStates[index]} icon={faGauge} label="Tank Capacity (liters)" value={`${veh.tankCapacity}`} />
                            <DetailItem edit={editStates[index]} icon={faCalendarAlt} label="Vehicle Age (years)" value={`${veh.age}`} />
                            <DetailItem edit={editStates[index]} icon={faTruck} label="Can Transport" value={veh.canTransport.join(', ')} />
                            <DetailItem edit={editStates[index]} icon={faCar} label="Type" value={veh.type} />
                            <DetailItem edit={editStates[index]} icon={faTachometerAlt} label="Avg. Fuel Consumption (L/km)" value={`${veh.fuelconsumption}`} />
                            <DetailItem edit={editStates[index]} icon={faTachometerAlt} label="Mileage since commissioning (km)" value={`${veh.mileage}`} />
                        </div>
                        {/* Accordéon pour les images */}
                        <Accordion
                            buttonContent={(open) => (
                                <div className="flex items-center justify-center mb-5">
                                    <h3 className="text">View images</h3>
                                    <ChevronDownIcon
                                        className={`w-5 h-5 sm:w-6 sm:h-6 duration-300 ${open ? "rotate-180" : ""}`}
                                    />
                                </div>
                            )}
                            initialOpen={false}>
                            <div className="flex flex-row space-x-10">
                                <Image src={Car1} alt='' width={100} height={100} className="rounded-md w-[100px] h-[100px] hover:w-[250px] hover:h-[250px] cursor-pointer duration-500" />
                                <Image src={Car2} alt='' width={100} height={100} className="rounded-md w-[100px] h-[100px] hover:w-[250px] hover:h-[250px] cursor-pointer duration-500" />
                                <Image src={Car3} alt='' width={100} height={100} className="rounded-md w-[100px] h-[100px] hover:w-[250px] hover:h-[250px] cursor-pointer duration-500" />
                                <Image src={Car4} alt='' width={100} height={100} className="rounded-md w-[100px] h-[100px] hover:w-[250px] hover:h-[250px] cursor-pointer duration-500" />
                                <Image src={Car5} alt='' width={100} height={100} className="rounded-md w-[100px] h-[100px] hover:w-[250px] hover:h-[250px] cursor-pointer duration-500" />
                            </div>
                        </Accordion>
                    </div>
                </Accordion>
            ))}
            <Modal isOpen={change} onClose={handleCloseModal}>
                <ul className='space-y-5 flex flex-col'>
                {vehicle.map((veh, index) => (
                    <li key={index} className='border p-1 rounded-md border-primary-500 hover:bg-primary hover:text-white font-medium cursor-pointer'
                    onClick={()=>{handleChange(index)}}
                    >
                        {veh.model +" "+veh.brand}
                    </li>
                ))}
                </ul>
            </Modal>
        </div>
    );
};

export default VehicleList;