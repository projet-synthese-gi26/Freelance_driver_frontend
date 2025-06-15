"use client"
import React, { useState } from 'react';
import SectionTitle from './SectionTitle'
import {AdsMap} from '@/app/type/Ads'
import { MapPinIcon, CalendarIcon, ClockIcon, CheckIcon, BanknotesIcon,
  QuestionMarkCircleIcon, CreditCardIcon, BuildingLibraryIcon, PencilIcon,
  TrashIcon, PaperAirplaneIcon, NoSymbolIcon, InboxArrowDownIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast';
import {BillAddress} from "@/data/Structure";
import { BillingType } from '@/app/type/Billing'
import ActionConfirmed from './ActionConfirmed';

interface RubriqueProps {
  backgroundColor: string;
  ad: AdsMap[];
  title: string;
  setAdsMap:React.Dispatch<React.SetStateAction<AdsMap[]>>
}

const Rubrique: React.FC<RubriqueProps> = ({setAdsMap, ad, title}) => {
  const [editableItems, setEditableItems] = useState<{[key: number]: boolean}>({});
  const [Bill ,setBill]=useState<BillingType[]>(BillAddress)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rubriqueToDelete, setRubriqueToDelete] = useState(0);

  const openDeleteModal = (id:number) => {
    setRubriqueToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (rubriqueToDelete!=0) {
      ad.splice(rubriqueToDelete, 1)
      // Ici, vous pouvez également ajouter un appel API si nécessaire
    }
    closeModal();
  };

  const handleInputChange = (index: number, field: keyof AdsMap, value: string | number | boolean) => {
    const newAdsMap = [...ad];
    const newBilling=[...Bill]
    let processedValue: string | number | boolean = value;
    
    if (field === 'mobility_cost') {
      processedValue = Number(value);
    } else if (field === 'is_mobility_cost_negociable' || field === 'is_luggage') {
      if (typeof value === 'string') {
        processedValue = value.toLowerCase() === 'true';
      } else {
        processedValue = Boolean(value);
      }
    }
    newBilling[index]={...newBilling[index],
      select:true
    }
    setBill(newBilling)
    let GoodDate;
    if(field==='travel_date'){
      GoodDate=formatDate(value as string);
    }

    const current=new Date().toLocaleDateString()
    newAdsMap[index] = { ...newAdsMap[index], 
      [field]: processedValue,
      updated_at:current,
      travel_date: GoodDate ?? newAdsMap[index].travel_date
    }
    setAdsMap(newAdsMap);
  };

  const handleEdit = (index: number) => {
    setEditableItems(prev => ({...prev, [index]: !prev[index]}));
  };

  const handleSave = (index: number) => {
    setEditableItems(prev => ({...prev, [index]: false}));
    toast.success('Changes Saved Successfully');
  };

  const formatDate = (date:string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

const handlePublish = (index: number) => {
    const Status='Published';
    const date= ad[index].travel_date.split('/')
    console.log(new Date(ad[index].travel_date), ad[index].travel_date);
    
    if (new Date(Number(date[2]), Number(date[1]) - 1, Number(date[0])) < new Date()) {
      toast.error('Travel Date Expired')
    }else{
      const updatedAdsMap = [...ad]
      updatedAdsMap[index] = {
        ...updatedAdsMap[index],
        offer_status:Status
      }
      setAdsMap(updatedAdsMap);
      toast.success('Published Successfully')
    }
  }

const handleCancel = (index: number) => {
    const Status='Cancelled';
    const updatedAdsMap = [...ad]
    updatedAdsMap[index] = {
      ...updatedAdsMap[index],
      offer_status:Status
    }
    setAdsMap(updatedAdsMap);
    toast.success('Cancelled Successfully')
}

  return (
    <div className="w-full">
      <div className="pt-1">
        {ad.map((item, index) => (
          <div key={item.id}>
            {item.offer_status === title && (
              <div className="relative mx-auto">
                <div className="flex flex-col rounded-2xl md:pr-[7%] pb-[5rem] md:pb-0  p-2 sm:p-4 border-b hover:shadow-lg pt-3 sm:pt-5 text-xs sm:text-sm md:text-base">
                  <div className='flex flex-wrap justify-between mb-4 '>
                    {item.offer_status === 'Drafts' && (
                      <div className={`flex md:flex-col  md:h-[80%] pr-[20%] ${editableItems[index]? ('mt-[80%]'):('mt-[55%]')} md:pr-0 flex-wrap md:border-l items-center  md:mt-0 justify-end md:justify-center gap-1 sm:gap-2 w-full md:w-auto absolute md:right-2 md:top-2`}>
                      <span className='flex gap-1 items-center justify-center cursor-pointer rounded-xl p-1 font-bold w-[4.5rem] bg-[#98b3ff] text-[0.6rem] sm:text-xs' onClick={() => handleEdit(index)}><PencilIcon className='w-3 h-3 sm:w-4 sm:h-4' />Edit</span>
                      <span className='flex gap-1 items-center justify-center cursor-pointer rounded-xl p-1 font-bold w-[4.5rem] bg-[#98ffba] text-[0.6rem] sm:text-xs' onClick={() => { handlePublish(index) }}><PaperAirplaneIcon className='w-3 h-3 sm:w-4 sm:h-4' />Publish</span>
                      <span className='flex gap-1 items-center justify-center cursor-pointer rounded-xl p-1 font-bold w-[4.5rem] bg-[#ff9898] text-[0.6rem] sm:text-xs' onClick={() => { openDeleteModal(index) }}><TrashIcon className='w-3 h-3 sm:w-4 sm:h-4'/>Delete</span>
                      {(item.offer_status === 'Drafts' && editableItems[index]) && (
                        <span className='flex gap-1 items-center justify-center cursor-pointer rounded-xl p-1 font-bold w-[4.5rem] bg-[#efeffd] text-[0.6rem] sm:text-xs' onClick={() => handleSave(index)}><InboxArrowDownIcon className='w-3 h-3 sm:w-4 sm:h-4' />Save</span>
                      )}
                    </div>
                  )}
                    {item.offer_status === 'Published' && (
                      <div className={`flex md:flex-col  md:h-[80%] pr-[5%] mt-[45%] md:pr-0 flex-wrap md:border-l items-center  md:mt-0 justify-end md:justify-center gap-1 sm:gap-2 w-full md:w-auto absolute md:right-2 md:top-2`}>
                        <span className='flex gap-1 items-center justify-center cursor-pointer rounded-xl p-1 font-bold w-[4.5rem] bg-[#ff9898] text-[0.6rem] sm:text-xs' onClick={() => { handleCancel(index) }}><NoSymbolIcon className='w-3 h-3 sm:w-4 sm:h-4' />Cancel</span>
                      </div>
                    )}
                  </div>
                  <div className='flex flex-row gap-2 sm:gap-3 flex-wrap'>
                    <SectionTitle title='Pick Up' Icon={MapPinIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'pickup_location', e.target.value)} value={item.pickup_location} />
                    <SectionTitle title='Drop Off' Icon={MapPinIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'dropoff_location', e.target.value)} value={item.dropoff_location} />
                    <SectionTitle title='Travel Date' Icon={CalendarIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'travel_date', e.target.value)} value={item.travel_date} />
                    <SectionTitle title='Travel Time' Icon={ClockIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'travel_time', e.target.value)} value={item.travel_time} />
                  </div>
                  <div className='flex flex-row gap-2 sm:gap-3 flex-wrap'>
                    <SectionTitle title='Status' Icon={CheckIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'offer_status', e.target.value)} value={item.offer_status} />
                    <SectionTitle title='Cost' Icon={BanknotesIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'mobility_cost', e.target.value)} value={item.mobility_cost} />
                    <SectionTitle title='Negociable' Icon={QuestionMarkCircleIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'is_mobility_cost_negociable', e.target.value)} value={item.is_mobility_cost_negociable} />
                    <SectionTitle title='Payment Method' Icon={CreditCardIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'prefered_payment_mode_id', e.target.value)} value={item.prefered_payment_mode_id} />
                  </div>
                  <div className='flex flex-row gap-2 sm:gap-3 flex-wrap'>
                    <SectionTitle title='Billing Address' Icon={BuildingLibraryIcon} ad={item} bill={Bill[index]} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'prefered_billing_id', e.target.value)} value={item.prefered_billing_id} />
                    <SectionTitle title='Created At' Icon={CalendarIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'created_at', e.target.value)} value={item.created_at} />
                    <SectionTitle title='Updated At' Icon={CalendarIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'updated_at', e.target.value)} value={item.updated_at} />
                    <SectionTitle title='Is Luggage' Icon={QuestionMarkCircleIcon} ad={item} editable={editableItems[index]} onInputChange={(e) => handleInputChange(index, 'is_luggage', e.target.value)} value={item.is_luggage} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <ActionConfirmed
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        message="Are you sure you want to remove this announce ?"
      />
    </div>
  );
};

export default Rubrique;