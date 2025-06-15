"use client"
import React, { useState } from 'react'
import { paymentHistoryData } from '@/data/Structure';

const PaymentHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortField, setSortField] = useState<'createdAt' | 'payAt'>('createdAt');

    const sortedData = paymentHistoryData.sort((a, b) => {
        const aValue = sortField === 'createdAt' ? new Date(a.createdAt) : new Date(a.payAt);
        const bValue = sortField === 'createdAt' ? new Date(b.createdAt) : new Date(b.payAt);
        
        if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
        return aValue < bValue ? 1 : -1;
    });

    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(paymentHistoryData.length / itemsPerPage);

    // const handleDownloadInvoice = (invoice: string) => {
    //     const doc = new jsPDF();
    //     doc.text(`Invoice: ${invoice}`, 10, 10);
    //     doc.save(`${invoice}.pdf`);
    // };
    
    const formatDate = (date:string) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      };
  return (
    <div className='flex gap-5 flex-col'>
        <div>
            <div className='title font-bold'>Payment History</div>
            <span className='opacity-[80%]'>See history of your payment trip invoice</span>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full -collapse  -gray-200">
                <thead>
                    <tr className="text text-left bg-[var(--bg-1)] border-b border-dashed">
                        <th className="py-3 pl-3">Payment Invoice</th>
                        <th className="py-3">Driver Name</th>
                        <th className="py-3">Amount</th>
                        <th className="py-3">Payment Method</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Created At</th>
                        <th className="py-3">Pay At</th>
                    </tr>
                </thead>
                <tbody>
                    {paymentHistoryData.map((payment, index) => (
                        <tr key={index} className="border-b text border-dashed hover:bg-[var(--bg-1)] hover:shadow-lg duration-300">
                            <td className="py-3 sm:text-left text-center font-medium">{payment.paymentInvoice}</td>
                            <td className="py-3 sm:text-left text-center">{payment.driverName}</td>
                            <td className="py-3 sm:text-left text-center">xaf {payment.amount.toFixed(2)}</td>
                            <td className="py-3 sm:text-left text-center">{payment.paymentMethod}</td>
                            <td className="py-3 sm:text-left text-center flex items-center gap-1"><div className={`rounded-full
                                 w-2 h-2 ${payment.status==='Failed' &&'bg-[#f00404]'} 
                                 ${payment.status==='Completed' &&'bg-[#29f381]'} 
                                 ${payment.status==='Pending' && 'bg-yellow-500'}`}></div>{payment.status}</td>
                            <td className="py-3 sm:text-left text-center">{new Date(payment.createdAt).toLocaleString()}</td>
                            <td className="py-3 sm:text-left text-center">{payment.payAt ? formatDate(new Date(payment.payAt).toISOString().split('T')[0]) : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default PaymentHistory