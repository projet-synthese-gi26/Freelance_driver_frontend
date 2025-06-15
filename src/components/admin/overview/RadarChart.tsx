// components/RegionsRadarChart.tsx

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RegionsRadarChart: React.FC = () => {
  const data = {
    labels: ['North', 'Far North', 'North West', 'South West', 'East', 'South', 'West', 'Littoral', 'Center', 'Adamaoua'],
    datasets: [{
      label: 'Bookings By Region',
      data: [65, 59, 90, 81, 56, 55, 40, 70, 85, 95],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    elements: {
      line: {
        borderWidth: 3
      }
    }
  };

  return (
    <div className="w-1/3 max-w-2xl mx-auto rounded-lg shadow-lg border p-4">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RegionsRadarChart;