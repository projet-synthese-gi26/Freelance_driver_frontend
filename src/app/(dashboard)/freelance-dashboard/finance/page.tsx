'use client';
import React, { useState, useEffect } from 'react';
import { DownloadIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
//import Invoice from '@/components/freelance/finance/Invoice';
import { pdf } from '@react-pdf/renderer';
import { useContextProvider } from "@/components/context/context";
import { paymentMethod } from '@/data/Structure';
import Image from 'next/image';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  plan: string;
  duration: number;
  invoice_issued_date: string;
}

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { clientDTO, setClientDTO } = useContextProvider();
  const [openPaymentMethods, setOpenPaymentMethods] = useState<string | null>(null);
  const togglePaymentMethods = (invoiceId: string) => {
    setOpenPaymentMethods(openPaymentMethods === invoiceId ? null : invoiceId);
  };
  const handlePayment = (method: string, invoiceId: string) => {
    console.log(`Processing payment for invoice ${invoiceId} using ${method}`);
    
  };
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      { id: '001', date: '2023-08-01', amount: 1000, status: 'Paid', plan: 'Premium', duration:12, invoice_issued_date:"01/09/2024" },
      { id: '002', date: '2023-08-05', amount: 750, status: 'Pending', plan: 'Basic', duration:6, invoice_issued_date:"01/09/2024" },
      { id: '003', date: '2023-07-28', amount: 1250, status: 'Overdue', plan: 'Standard', duration:1, invoice_issued_date:"01/08/2024" },
      // Add more mock invoices as needed
    ];
    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
  }, []);

  useEffect(() => {
    const filtered = invoices.filter(invoice => 
      (statusFilter === 'All' || invoice.status === statusFilter) &&
      (invoice.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
       invoice.id.includes(searchTerm))
    );
    setFilteredInvoices(filtered);
  }, [statusFilter, searchTerm, invoices]);

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePrint= async (index: number) => {
    const invoice = filteredInvoices[index];
    // const blob = await pdf(
    //   <Invoice
    //     id={invoice.id}
    //     driverName={clientDTO.name}
    //     driverId={clientDTO.driverId}
    //     subscriptionAmount={invoice.amount}
    //     subscriptionDate={invoice.date}
    //     subscriptionPlan={invoice.plan}
    //     subscriptionStatus={invoice.status}
    //     subscriptionDuration={invoice.duration}
    //     subscriptionPaymentMethod={invoice.date}
    //   />
    // ).toBlob();
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = `LetsgoInvoice_${invoice.id}.pdf`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);
  }

  return (
    <div className=" mx-auto text p-6 bg-white">
      <h1 className="title font-bold mb-6">Invoices</h1>
      
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search by plan name or invoice ID"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded-md w-64"
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="p-2 border rounded-md"
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <table className="w-full">
      <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Invoice ID</th>
            <th className="p-2 text-left">Sub.Date</th>
            <th className="p-2 text-left">Plan</th>
            <th className="p-2 text-left">Duration</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Issu. Date</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice, index) => (
            <React.Fragment key={invoice.id}>
              <tr className="border-b">
                <td className="p-2">{invoice.id}</td>
                <td className="p-2">{invoice.date}</td>
                <td className="p-2">{invoice.plan}</td>
                <td className="p-2">{invoice.duration} month(s)</td>
                <td className="p-2">XAF {invoice.amount.toFixed(2)}</td>
                <td className="p-2">{invoice.invoice_issued_date}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-md text-sm ${
                    invoice.status === 'Paid' ? 'bg-green-200 text-green-800' :
                    invoice.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex items-center space-x-2">
                    <DownloadIcon className="cursor-pointer" onClick={() => handlePrint(index)}/>
                    {(invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm flex items-center"
                        onClick={() => togglePaymentMethods(invoice.id)}
                      >
                        Pay now
                        {openPaymentMethods === invoice.id ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {openPaymentMethods === invoice.id && (
                <tr>
                  <td colSpan={8}>
                    <div className="p-4 bg-gray-100">
                      <h4 className="font-semibold mb-2">Select Payment Method:</h4>
                      <div className="space-x-5 flex ">
                        {paymentMethod.map((method,index) => (
                          <button
                            key={index}
                            className={` ${(method.label==="any" || method.label==="Cash") && "hidden"}
                                bg-white border border-gray-300 px-3 py-1 flex items-center justify-center gap-3 rounded text-sm hover:bg-gray-50 w-full text-left`}
                            onClick={() => handlePayment(method.value, invoice.id)}
                          >
                            <Image src={method.icon} alt={method.label} width={50} height={50}/>
                            {method.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {filteredInvoices.length === 0 && (
        <p className="text-center mt-4">No invoices found matching your criteria.</p>
      )}
    </div>
  );
};

export default InvoicesPage;