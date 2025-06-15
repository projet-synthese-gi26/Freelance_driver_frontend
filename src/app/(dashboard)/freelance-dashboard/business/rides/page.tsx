"use client";
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Ride } from "@/app/type/Faq";
import { rides } from '@/data/Structure';

const Page = () => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(rides.length / itemsPerPage);
  
  const getPaymentDetails = (ride: Ride) => {
    switch (ride.paymentOption) {
      case 'daily':
        return `${ride.paymentDetails} day(s)`;
      case 'hourly':
        return `${ride.paymentDetails} hour(s)`;
      case 'per km':
        return `${ride.paymentDetails} km`;
      default:
        return 'Flat rate';
    }
  };

  const getStatusColor = (status: Ride['status']) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-200 text-red-800';
      case 'ongoing':
        return 'bg-yellow-200 text-yellow-800';
      case 'completed':
        return 'bg-green-200 text-green-800';
      default:
        return '';
    }
  };

  const indexOfLastRide = currentPage * itemsPerPage;
  const indexOfFirstRide = indexOfLastRide - itemsPerPage;
  const currentRides = rides.slice(indexOfFirstRide, indexOfLastRide);

  return (
    <div className="container px-4 py-8 text">
      <div className="bg-white shadow-md rounded-lg overflow-hidden overflow-x-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">My Rides</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="overflow-x-auto w-full whitespace-nowrap">
            <thead>
              <tr className="text text-left bg-[var(--bg-1)] border-b border-dashed">
                <th className="py-3 pl-3 text-center">ID</th>
                <th className="py-3 text-center">Type</th>
                <th className="py-3 text-center">Start at</th>
                <th className="py-3 text-center">End at</th>
                <th className="py-3 text-center">Payment op.</th>
                <th className="py-3 text-center">Customer</th>
                <th className="py-3 text-center">Payment meth.</th>
                <th className="py-3 text-center">Status</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRides.map((ride) => (
                <tr key={ride.id} className="border-b text border-dashed hover:bg-[var(--bg-1)] duration-300">
                  <td className="pl-3 py-3 sm:text-left text-center">{ride.id}</td>
                  <td className="pl-3 py-3 sm:text-left text-center">{ride.type}</td>
                  <td className="pl-3 py-3 sm:text-left text-center">
                    {format(ride.startDateTime, 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="pl-3 py-3 sm:text-left text-center">{format(ride.endDateTime, 'dd/MM/yyyy HH:mm')}</td>
                  <td className="pl-3 py-3 sm:text-left text-center">
                    {ride.paymentOption} ({getPaymentDetails(ride)})

                  </td>
                  <td className="pl-3 py-3 sm:text-left text-center">{ride.clientName}</td>
                  <td className="pl-10 py-3 sm:text-left text-center">{ride.paymentMethod}</td>
                  <td className="pl-5 py-3 sm:text-left text-center">
                    <span className={`inline-flex text leading-5 font-semibold rounded-full ${getStatusColor(ride.status)}`}>
                      {ride.status}
                    </span>
                  </td>
                  <td className="pl-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="text-indigo-600">Avis (3.5 <span className='text-yellow-400'>★</span>)</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between px-6 py-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;