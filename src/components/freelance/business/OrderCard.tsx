import React from 'react';
import { Order } from '@/app/type/Order';

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("accept");
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("decline");
  };

  return (
    <div>
      <div className="flex cursor-pointer text flex-col bg-white border text hover:bg-[var(--bg-1)] rounded-md mb-2 hover:shadow-md"
       title='click for more details' onClick={() => onClick(order)}>
        <div className='flex items-center justify-between px-3 font-bold py-1 w-full'>
          <span  className=' w-[115px] text-center'>Order id</span>
          <span  className=' w-[115px] text-center'>Customer Name</span>
          <span  className=' w-[115px] text-center'>Date</span>
          <span  className=' w-[115px] text-center'>Location</span>
          <span  className=' w-[115px] text-center'>Price</span>
          <span  className=' w-[115px] text-center'>Status</span>
          <span  className=' w-[115px] text-center'>Actions</span>
        </div>
        <div className='flex w-full items-center justify-between px-3'>
          <span className=' w-[115px] text-center'>{order.id}</span>
          <span className=' w-[115px] text-center'>{order.clientName}</span>
          <span className=' w-[115px] text-center'>{order.start_date}</span>
          <span className=' w-[115px] text-center'>{order.pick_location}</span>
          <span className=' w-[115px] text-center'>{order.price} XAF</span>
          <span className=' w-[115px] flex items-center justify-center gap-1'>
            <div className={`rounded-full ${order.status=='Accepted' && "bg-green-500"}
            ${order.status=='Pending' && "bg-yellow-500"}
            ${order.status=='Rejected' && "bg-red-500"} w-2 h-2`}></div>
            {order.status}
          </span>
          <span  className='flex flex-col py-1  w-[115px] text-center'>
          {order.status=='Pending' &&
            (
              <div className='space-x-[3px]'>
                <button 
                  className='border rounded-md hover:text-white font-medium hover:bg-primary p-[2px] text-[10px] text-primary bg-white' 
                  onClick={handleAccept}
                >
                  Accept
                </button>
                <button 
                  className='border rounded-md hover:text-white font-medium hover:bg-red-500 p-[2px] text-[10px] text-red-500 bg-white' 
                  onClick={handleDecline}
                >
                  Decline
                </button>
              </div>
            )
          }
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;