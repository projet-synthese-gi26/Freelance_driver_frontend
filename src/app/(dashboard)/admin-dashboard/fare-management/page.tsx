"use client"

import React, { useState } from 'react';

type FareType = 'base' | 'per_km' | 'per_minute';

type Fare = {
  id: number;
  type: FareType;
  amount: number;
};

const FareManagement: React.FC = () => {
  const [fares, setFares] = useState<Fare[]>([
    { id: 1, type: 'base', amount: 5 },
    { id: 2, type: 'per_km', amount: 1.5 },
    { id: 3, type: 'per_minute', amount: 0.25 },
  ]);

  const [newFare, setNewFare] = useState<Omit<Fare, 'id'>>({ type: 'base', amount: 0 });

  const handleFareChange = (id: number, amount: number) => {
    setFares(fares.map(fare => fare.id === id ? { ...fare, amount } : fare));
  };

  const handleAddFare = () => {
    setFares([...fares, { ...newFare, id: Date.now() }]);
    setNewFare({ type: 'base', amount: 0 });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Fare Management</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-4">Current Fares</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fares.map((fare) => (
              <tr key={fare.id}>
                <td className="px-6 py-4 whitespace-nowrap">{fare.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">${fare.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={fare.amount}
                    onChange={(e) => handleFareChange(fare.id, parseFloat(e.target.value))}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-semibold mt-8 mb-4">Add New Fare</h2>
        <div className="flex space-x-4">
          <select
            value={newFare.type}
            onChange={(e) => setNewFare({ ...newFare, type: e.target.value as FareType })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="base">Base</option>
            <option value="per_km">Per KM</option>
            <option value="per_minute">Per Minute</option>
          </select>
          <input
            type="number"
            value={newFare.amount}
            onChange={(e) => setNewFare({ ...newFare, amount: parseFloat(e.target.value) })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Amount"
          />
          <button
            onClick={handleAddFare}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Fare
          </button>
        </div>
      </div>
    </div>
  );
};

export default FareManagement;