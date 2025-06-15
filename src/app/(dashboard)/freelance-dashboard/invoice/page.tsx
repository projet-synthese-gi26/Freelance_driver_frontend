"use client";
import React, { useState } from "react";

const invoices = [
  { id: 1, type: "nonPaid", amount: "$50", date: "2024-06-01", description: "Monthly Subscription" },
  { id: 2, type: "paid", amount: "$50", date: "2024-05-01", description: "Monthly Subscription" },
  { id: 3, type: "ongoing", amount: "$50", date: "2024-07-01", description: "Monthly Subscription" },
  { id: 4, type: "nonPaid", amount: "$75", date: "2024-06-15", description: "Quarterly Subscription" },
  { id: 5, type: "paid", amount: "$75", date: "2024-03-15", description: "Quarterly Subscription" },
  { id: 6, type: "ongoing", amount: "$75", date: "2024-09-15", description: "Quarterly Subscription" },
  { id: 7, type: "nonPaid", amount: "$100", date: "2024-01-01", description: "Annual Subscription" },
  { id: 8, type: "paid", amount: "$100", date: "2023-01-01", description: "Annual Subscription" },
  { id: 9, type: "ongoing", amount: "$100", date: "2025-01-01", description: "Annual Subscription" },
  { id: 10, type: "nonPaid", amount: "$25", date: "2024-06-05", description: "Weekly Subscription" },
  { id: 11, type: "paid", amount: "$25", date: "2024-05-29", description: "Weekly Subscription" },
  { id: 12, type: "ongoing", amount: "$25", date: "2024-07-05", description: "Weekly Subscription" },
  { id: 13, type: "nonPaid", amount: "$150", date: "2024-06-10", description: "Semi-Annual Subscription" },
  { id: 14, type: "paid", amount: "$150", date: "2023-12-10", description: "Semi-Annual Subscription" },
  { id: 15, type: "ongoing", amount: "$150", date: "2024-12-10", description: "Semi-Annual Subscription" },
  { id: 16, type: "nonPaid", amount: "$50", date: "2024-08-01", description: "Monthly Subscription" },
  { id: 17, type: "paid", amount: "$50", date: "2024-04-01", description: "Monthly Subscription" },
  { id: 18, type: "ongoing", amount: "$50", date: "2024-09-01", description: "Monthly Subscription" },
];

const Page = () => {
  const [selectedTab, setSelectedTab] = useState<"nonPaid" | "paid" | "ongoing">("nonPaid");

  const renderInvoices = (type: "nonPaid" | "paid" | "ongoing") => {
    return invoices.filter(invoice => invoice.type === type).map(invoice => (
      <div key={invoice.id} className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">{invoice.description}</h2>
            <p className="text-gray-600">{invoice.date}</p>
          </div>
          <div>
            <p className="text-gray-800">{invoice.amount}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-[var(--bg-1)] px-3 lg:px-6 relative before:bg-[#FFFFFF] before:w-full before:h-[70px] before:absolute before:top-0 before:left-0 pb-6">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-semibold">Invoices</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex space-x-4 mb-4">
          <button onClick={() => setSelectedTab("nonPaid")} className={`px-4 py-2 rounded ${selectedTab === "nonPaid" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}>Non Paid</button>
          <button onClick={() => setSelectedTab("paid")} className={`px-4 py-2 rounded ${selectedTab === "paid" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}>Paid</button>
          <button onClick={() => setSelectedTab("ongoing")} className={`px-4 py-2 rounded ${selectedTab === "ongoing" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}>Ongoing</button>
        </div>
        {selectedTab === "nonPaid" && renderInvoices("nonPaid")}
        {selectedTab === "paid" && renderInvoices("paid")}
        {selectedTab === "ongoing" && renderInvoices("ongoing")}
      </div>
    </div>
  );
};

export default Page;
