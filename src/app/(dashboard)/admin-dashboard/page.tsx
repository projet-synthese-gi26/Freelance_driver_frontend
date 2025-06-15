"use client"
import React from 'react';
import StatCard from '@/components/admin/overview/Statcard';
import RegionsRadarChart from '@/components/admin/overview/RadarChart';
import BookingChart from '@/components/admin/overview/BookingChart';
import ChartElement from '@/components/customer/statistic/ChartElement';
import StatisticElement from '@/components/customer/statistic/StatisticElement';
const Overview: React.FC = () => {
  const plans={
    premium: 20,
    standard: 70,
    basic: 150,
  }
  const driversPlanData = {
    labels: ["Premium("+plans.premium+")", "Standard("+plans.standard+")", "Basic("+plans.basic+")"],
    values: [plans.premium, plans.standard, plans.basic],
  };

  return (
    <div className='p-4 text'>
      <h1 className="title font-semibold text-gray-800 mb-6 font-bold">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Subscriptions" value={1234} unit='' comparison={10} allure='down' />
        <StatCard title="Total Bookings" value={567} unit='' comparison={0.67} allure='up' />
        <StatCard title="Conversion Rate" value={5} unit='%' comparison={10} allure='up' />
        <StatCard title="Revenues" value={12345} unit='XAF' comparison={15} allure='up' />
      </div>
      <div className="bg-white">
        <div className=' mb-4'>
          <div className="max-w-2xl space-x-5 h-full mx-auto rounded-lg shadow-lg border p-4 flex flex-col lg:flex-row items-center justify-between">
            <div>
              <h2 className="title font-semibold mb-4">Drivers by Plan</h2>
              <ChartElement data={driversPlanData}/>
            </div>
            <StatisticElement
                  statistic={2005}
                  title="Total Users"
                  subtitle=""
                  borderColor="#0a1342"/>
            <StatisticElement
                  statistic={240}
                  title="Total Drivers"
                  subtitle=""
                  borderColor="rgba(75,192,192,0.6)"/>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row items-center justify-between'>
          <BookingChart />
          <RegionsRadarChart />
        </div>
      </div>
    </div>
  );
};


export default Overview;