'use client';

import React, { useState } from 'react';
import OrderModal from '@/components/freelance/business/OrderModal';
import { Order } from '@/app/type/Order';
import {orders} from '@/data/Structure'


const Page = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className='mb-2 flex'>
        <h1 className="title font-bold">Orders</h1>
        <p className='opacity-[70%] text-[11px] mt-3'>(click on order for more details)</p>
      </div>
      <OrderModal orders={orders} />
    </div>
  );
}

export default Page