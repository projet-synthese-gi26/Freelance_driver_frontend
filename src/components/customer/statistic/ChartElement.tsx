import React from 'react'
import {Chart as ChartJS,ArcElement,Tooltip,Legend} from 'chart.js' 
import {Doughnut} from 'react-chartjs-2'


ChartJS.register(ArcElement,Tooltip,Legend)
interface DonutChartProps{
    data:{
        labels: string[];
        values: number[]
    }
}
// colors: [
//     "#2D3A96",
//     "#3B22A2",
//     "#E0D9FD",
//     "#FE9261",
//     "#12ECFA",
// ],

const ChartElement:React.FC<DonutChartProps> = ({data}) => {
    const chartData={
        labels:data.labels,
        datasets:[
            {
                data:data.values,
                backgroundColor:[
                    'rgba(255,99,132,0.6)',
                    'rgba(153,102,255,0.6)',
                    'rgba(75,192,192,0.6)',
                    "#E0D9FD",
                    "#12ECFA",
                    "#FE9261",
                    'rgba(54,162,235,0.6)',
                    "#2D3A96",
                    'rgba(255,206,86,0.6)',
                    
                ],
                borderWidth:1,
            },
        ],
    }
    const options={
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend:{
                position:'right' as const,
            },
        },
        layout: {
            padding: {
              top: 10,
              right: 20,
              bottom: 5,
              left: 23,
            },
          }
    }
  return  (
    <div >
        <Doughnut data={chartData} options={options}/>
    </div>
  )
}

export default ChartElement