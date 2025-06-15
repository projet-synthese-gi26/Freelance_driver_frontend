import React from 'react'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const BookingChart = () => {
    const bookingsData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Successful bookings',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Cancelled bookings',
            data: [10, 5, 16, 8, 25, 5, 6],
            fill: false,
            borderColor: 'rgb(200, 10, 75)',
            tension: 0.1
          }
        ]
      };
    
      const bookingOptions = {
        responsive: true,
      };
  return (
    <div className="w-1/2 max-w-2xl mx-auto rounded-lg shadow-lg border p-4">
        <h2 className="title font-semibold mb-4">Bookings Over Time</h2>
        <Line data={bookingsData} options={bookingOptions}/>
    </div>
  )
}

export default BookingChart