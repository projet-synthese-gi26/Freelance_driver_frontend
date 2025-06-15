import { AdsMap } from '@/app/type/Ads';
import React from 'react'
import {BillAddress,paymentMethod} from "@/data/Structure";
import { BillingType } from '@/app/type/Billing'

interface TitleProps {
  title: string;
  Icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;
  ad: AdsMap; 
  editable: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  value:string | boolean |number;
  bill?:BillingType
}

const SectionTitle = ({title, Icon, ad, editable, onInputChange,value,bill}: TitleProps) => {
  return (
    <div className='flex-1 text-[0.5rem] sm:text-[0.7rem] md:text'>
      <h1 className="font-bold flex items-center gap-1 my-1">
        <Icon className='w-5 h-5 sm:w-6 sm:h-6'/>
        <span className=''>{title}</span>
      </h1>
      <div className='flex items-center px-6'>
        {title === 'Pick Up' && (
          <div>
            {editable?(
            <input
            value={value.toString()}
            onChange={onInputChange}
            placeholder={ad.pickup_location}
          />
          ):(
            <p className=''>{ad.pickup_location}</p>
          )}
          </div>
        )}
        {title === 'Drop Off' && (
          <div>
            {editable?(
              <input
              value={value.toString()}
              onChange={onInputChange}
              placeholder={ad.dropoff_location}
            />
          ):(
            <p className=''>{ad.dropoff_location}</p>
          )}
          </div>
          
        )}
        {title === 'Travel Date' && (
          <div>
            {editable?(
              <input
              type="date"
              value={value.toString()}
              onChange={ onInputChange}
              placeholder={ad.travel_date}
              min={new Date().toISOString().split('T')[0]}
            />
          ):(
            <p className=''>{ad.travel_date}</p>
          )}
          </div>
          
        )}
        {title === 'Travel Time' && (
          <div>
            {editable?(
            <input
            type="time"
            value={value.toString()}
            onChange={ onInputChange}
          />
          ):(
            <p className=''>{ad.travel_time}</p>
          )}
          </div>
          
        )}
        {title === 'Status' && (
            <p className=''>{ad.offer_status}</p>
        )}
        {title === 'Cost' && (
          <div>
            {editable?(
              <input
              type="number"
              value={value.toString()}
              onChange={ onInputChange}
              placeholder={ad.mobility_cost.toString()}
            />
          ):(
            <p className=''>{ad.mobility_cost}</p>
          )}
          </div>
          
        )}
        {title === 'Negociable' && (
          <div>
            {editable?(
              <select
              value={value.toString()}
              onChange={ onInputChange}
            >
              <option value="true">Negotiable</option>
              <option value="false">Non-negotiable</option>
            </select>
          ):(
            <p className=''>{ad.is_mobility_cost_negociable==true ?('Negotiable'):('Non-negotiable')}</p>
          )}
          </div>  
        )}
        {title === 'Payment Method' && (
          <div>
            {editable?(
            <select
            value={value.toString()}
            onChange={ onInputChange}
          >
            {paymentMethod.map((pay,index)=>(
              <option value={pay.value} key={index}>{pay.label}</option>
            ))}
          </select>
          ):(
            <p className=''>{ad.prefered_payment_mode_id}</p>
          )}
          </div>
          
        )}
        {title === 'Billing Address' && (
          <div>
            {editable?(
            <select
            value={value.toString()}
            onChange={onInputChange}
          >
            {BillAddress.map((bill)=>(
              <option key={bill.id} value={bill.country+', '+bill.city+', '+bill.street} >{bill.country}, {bill.city}, {bill.street}</option>
            ))}
          </select>
          ):(
            <div>
                <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
                    {bill && bill.select && (
                      <p>{bill.country}, {bill.city}, {bill.street}</p>
                    )}
                </div>
            </div>
            
          )}
          </div>
          
        )}
        {title === 'Created At' && (
            <p className=''>{ad.created_at}</p>
        )}
        {title === 'Updated At' && (
          <div>
            {editable?(
            <input type='text'/>
          ):(
            <p className=''>{ad.updated_at}</p>
          )}
          </div>
          
        )}
        {title === 'Is Luggage' && (
          <div>
            {editable?(
              <select
              value={value.toString()}
              onChange={onInputChange}
            >
              <option value="true">With Luggage</option>
              <option value="false">Without Luggage</option>
            </select>
          ):(
            <p className=''>{ad.is_luggage==true ?('With Luggage'):('Without Luggage')}</p>
          )}
          </div>
          
        )}
      </div>
    </div>
  )
}
export default SectionTitle