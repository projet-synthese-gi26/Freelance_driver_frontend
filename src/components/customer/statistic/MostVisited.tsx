import React from 'react'
import CounterElement from "@/components/customer/CounterElement";
import ChartElement from './ChartElement';

interface DonutData{
    firstDonutData:{
      labels: string[];
      values: number[];
    };
    secondDonutData:{
      labels: string[];
      values: number[];
    };
    Kilometer: number;
    Travel:number;
}

const MostVisited = ({firstDonutData,secondDonutData,Kilometer,Travel}:DonutData) => {
  return (
    <div>
        <section className="flex flex-col md:flex-row p-4 text gap-2">
        <div className="w-full md:w-1/2">
          <div className=" rounded-2xl bg-white border p-4">
            <h3 className="font-bold">Les plus visités</h3>
            <div className="grid lg:grid-cols-2">
                <ChartElement data={firstDonutData}
                />
              <ChartElement data={secondDonutData}
                />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 rounded-2xl space-y-2 bg-white border p-4">
          <div className="bg-white flex items-center justify-between">
            <h3 className="font-bold">Statistiques</h3>
            <div className="flex items-center flex-wrap gap-1">
              <span>Triez par:</span>
              <div className="p-3 border rounded-full ml-2">
                <select className="focus:outline-none">
                  <option value="1">7 derniers mois</option>
                  <option value="2">7 dernières semaines</option>
                  <option value="3">7 derniers jours</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row items-center space-x-4  justify-center">
            <div className="bg-[#EBFBF2] items-center flex gap-4 p-4 rounded-2xl w-full md:w-auto">
              <i className="las self-center la-chart-area rounded-full bg-[var(--secondary-500)] text-white text-xl p-4"></i>
              <div>
                <h2 className="font-bold">
                  <CounterElement end={Kilometer} />
                  Km
                </h2>
                <p>Kilomètres parcourus</p>
              </div>
            </div>
            <div className="rounded-2xl items-center flex gap-4 bg-[#FFF9ED] p-4 w-full md:w-auto">
              <i className="las self-center la-chart-bar rounded-full bg-[#9C742B] text-white text-xl p-4"></i>
              <div>
                <h2 className="font-bold">
                  <CounterElement end={Travel} decimals={0} />
                </h2>
                <p>Nombres de voyages</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MostVisited