import React from 'react';
import CounterElement from '@/components/customer/CounterElement';

interface ComponentData {
  statistic: number;
  title: string;
  subtitle: string;
  borderColor: string;
}

const StatisticElement = ({ statistic, title, subtitle, borderColor }: ComponentData) => {
  return (
    <div className="border w-full max-w-[200px] h-[200px] flex flex-col justify-center items-center p-4 rounded-2xl bg-white">
      <div
        className="w-[80px] h-[80px] flex justify-center items-center rounded-full border-[5px]"
        style={{ borderColor: borderColor }}
      >
        <h2 className="title font-bold" style={{ color: borderColor }}>
          <CounterElement end={statistic} />
        </h2>
      </div>
      <span className="title  font-semibold mt-4" style={{ color: borderColor }}>{title}</span>
      <span className="text">{subtitle}</span>
    </div>
  );
};

export default StatisticElement;