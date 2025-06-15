"use client"
import React, { useMemo } from 'react';
import { NextPage } from 'next';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

import EarningsCard from '@/components/freelance/earnings/EarningsCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Page = () => {
  const earningsData = {
    daily: 120,
    weekly: 840,
    monthly: 3600,
    yearly: 43200,
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const weeklyChartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Daily earnings (XAF)',
        data: [100, 120, 115, 130, 140, 160, 90],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const weeklyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly earnings',
      },
    },
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const peakHoursData = {
    labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    datasets: [
      {
        label: 'Average earnings per hour (XAF)',
        data: [10, 5, 3, 15, 35, 25, 20, 18, 22, 40, 30, 20],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const peakHoursOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Average earnings per hour',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Earnings (XAF)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Hour',
        },
      },
    },
  };

  const tips = useMemo(() => {
    const hourlyData = peakHoursData.datasets[0].data;
    const weeklyData = weeklyChartData.datasets[0].data;

    const maxHourlyEarning = Math.max(...hourlyData);
    const maxHourlyEarningIndex = hourlyData.indexOf(maxHourlyEarning);
    const peakHour = peakHoursData.labels[maxHourlyEarningIndex];

    const sortedWeeklyData = [...weeklyData].sort((a, b) => b - a);
    const topDays = weeklyChartData.labels
      .filter((_, index) => weeklyData[index] >= sortedWeeklyData[1])
      .join(' et ');

    return [
      `The most profitable hours are usually around ${peakHour}.`,
      `${topDays} are often the most lucrative days of the week.`,
      "Focus on high-demand areas like city centers, train stations, and airports.",
      "Be aware of special events in your city that may generate high demand."
    ];
  }, [peakHoursData, weeklyChartData]);

  return (
    <div className="min-h-screen bg-gray-100 text bg-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="title font-bold mb-8">My Earnings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <EarningsCard title="Today" amount={earningsData.daily} />
          <EarningsCard title="This week" amount={earningsData.weekly} />
          <EarningsCard title="This month" amount={earningsData.monthly} />
          <EarningsCard title="This year" amount={earningsData.yearly} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Bar data={weeklyChartData} options={weeklyChartOptions} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Line data={peakHoursData} options={peakHoursOptions} />
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="title font-bold mb-4">Tips for maximizing your earnings</h2>
          <ul className="list-disc pl-6">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};


export default Page;