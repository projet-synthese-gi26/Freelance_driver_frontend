'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/modal/modal';
import { Order } from '@/app/type/Order';
import OrderCard from '@/components/freelance/business/OrderCard';
import { Filter } from 'lucide-react';
import Link from 'next/link';

interface OrderModalProps {
  orders: Order[];
}

const OrderModal: React.FC<OrderModalProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'Pending', // Par défaut, on filtre sur "Pending"
    minPrice: '',
    maxPrice: '',
  });
  const ordersPerPage = 10;

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const dateInRange =
        (!filters.startDate || order.start_date >= filters.startDate) &&
        (!filters.endDate || order.end_date <= filters.endDate);
      const statusMatch = !filters.status || order.status === filters.status;
      const priceInRange =
        (!filters.minPrice || order.price >= Number(filters.minPrice)) &&
        (!filters.maxPrice || order.price <= Number(filters.maxPrice));

      return dateInRange && statusMatch && priceInRange;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [filters, orders]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
        <div className="mb-2 text flex space-x-7" id="filter">
            <span className="flex items-center font-bold"><Filter className="w-3 h-3" /> Filter</span>
            <select
            name="status"
            value={filters.status}
            defaultValue="Pending"
            onChange={handleFilterChange}
            className="mr-2 p-1 border rounded"
            >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            </select>
            <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="mr-2 p-1 border rounded"
            placeholder="Min Price"
            />
            <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="mr-2 p-1 border rounded"
            placeholder="Max Price"
            />
        </div>
      {currentOrders.map((order) =>  (
        <OrderCard key={order.id} order={order} onClick={handleOrderClick} />
      ))}
      <Modal isOpen={!!selectedOrder} onClose={handleCloseModal}>
        {selectedOrder && (
          <div className='text'>
            <h2 className="font-bold text-xl mb-4">Order Details</h2>
            <p><strong>Order id:</strong> {selectedOrder.id}</p>
            <p><strong>Client:</strong> {selectedOrder.clientName}</p>
            <p><strong>Availability type:</strong> {selectedOrder.availability}</p>
            <p><strong>Pickup location:</strong> {selectedOrder.pick_location}</p>
            <p><strong>Start date:</strong> {selectedOrder.start_date}</p>
            <p><strong>Start time:</strong> {selectedOrder.start_time}</p>
            <p><strong>Drop off location:</strong> {selectedOrder.drop_location}</p>
            <p><strong>End date:</strong> {selectedOrder.end_date}</p>
            <p><strong>End time:</strong> {selectedOrder.end_time}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Price:</strong> {selectedOrder.price} XAF</p>
            <p><strong>Payment type:</strong> {selectedOrder.payment_type} </p>
            <p><strong>Passengers:</strong> {selectedOrder.passenger} </p>
            <p><strong>Lugguage:</strong> {selectedOrder.Lugguage} </p>
            <p><strong>Negociable:</strong> {selectedOrder.Negociable==true? ('Yes'):('No')} </p>
            <div className='grid grid-cols-3 gap-5 mt-5'>
                <button 
                  className='bg-green-600 text-white items-center justify-center font-medium p-1 flex rounded-md'
                >
                  Accept
                </button>
                <button 
                  className='bg-red-600 text-white items-center justify-center font-medium p-1 flex rounded-md' 
                >
                  Decline
                </button>
                 <Link href="/freelance-dashboard/chat"> <button className={`${selectedOrder.Negociable==true? '':'hidden'} bg-primary text-white items-center justify-center font-medium p-1 flex rounded-md`}>Start Negociation</button></Link>
              </div>
            
          </div>
        )}
      </Modal>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`mx-1 px-3 py-1 border rounded ${
              number === currentPage ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </>
  );
};

export default OrderModal;