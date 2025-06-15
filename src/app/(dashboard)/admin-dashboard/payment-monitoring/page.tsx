"use client"

import React, { useState } from 'react';

type Payment = {
  id: number;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  user: string;
};

const PaymentMonitoring: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, date: '2023-05-01', amount: 50.00, status: 'completed', user: 'John Doe' },
    { id: 2, date: '2023-05-02', amount: 35.50, status: 'pending', user: 'Jane Smith' },
    { id: 3, date: '2023-05-03', amount: 75.25, status: 'failed', user: 'Bob Johnson' },
  ]);

  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const filteredPayments = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Payment Monitoring</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="mb-4">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Filter by status</label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">{payment.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">${payment.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentMonitoring;