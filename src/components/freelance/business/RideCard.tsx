import React from 'react';
import { Ride } from '@/app/type/Ride';

interface RideCardProps {
  ride: Ride;
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  return (
    <div className="bg-white shadow-md rounded-lg text p-4 mb-4">
      <h2 className="font-semibold">{ride.from} → {ride.to}</h2>
      <div className="text-gray-500 grid grid-cols-3">
        <p>Start at: {ride.start_date+", "+ride.start_time}</p>
        <p>End at: {ride.end_date+", "+ride.end_time}</p>
        <p>Price: {ride.price}</p>
        <p>Billing Method: {ride.billing}</p>
        <p>Status: {ride.status}</p>
      </div>
    </div>
  );
};

export default RideCard;