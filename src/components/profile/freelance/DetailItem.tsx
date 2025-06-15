import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React,{ useState } from 'react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface DetailProps{
    label:string;
    icon:IconDefinition;
    value:string | number | [];
    edit:boolean;
}

const DetailItem = ({ icon, label, value,edit }:DetailProps) => {
    let updated;

    return (
       
        <>
            {!edit? (
                <div className="border p-3 flex items-center rounded-md w-auto h-[3rem] justify-between">
                    <FontAwesomeIcon icon={icon} />
                    <div className='flex flex-col items-end justify-end'>
                        <label htmlFor="" className='font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]'>{label}</label>
                        <p className='text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]'>{value}</p>
                    </div>
                </div>
            
            ):(
                <div className="border p-3 flex items-center rounded-md w-auto h-[3rem] justify-between">
                    <FontAwesomeIcon icon={icon} />
                    <div className='flex flex-col items-end justify-end'>
                        <label htmlFor="" className='font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]'>{label}</label>
                        {typeof(value)==="string"?(
                            <input type="text" value={updated} className="border border-black px-1" placeholder={`enter the ${label}`}/>
                        ):(
                            <input type="number" value={updated} className="border border-black px-1" placeholder={`enter the ${label}`}/>
                        )}
                    </div>
                </div>
            )}
        </>

    );
};

export default DetailItem