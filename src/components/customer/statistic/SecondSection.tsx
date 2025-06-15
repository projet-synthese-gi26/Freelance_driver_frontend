import React from 'react';
import StatisticElement from './StatisticElement';

interface SectionData {
  fidelity: number;
  vehiculeBorrow: number;
  destination: number;
  depense: number;
}

const SecondSection = ({ fidelity, vehiculeBorrow, destination, depense }: SectionData) => {
  return (
    <div className="p-4 flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-5 md:gap-10">
      <StatisticElement statistic={fidelity} title="Points de fidélité" subtitle="" borderColor="#259403" />
      <StatisticElement
        statistic={vehiculeBorrow}
        title="Véhicules empruntés"
        subtitle="Depuis le début"
        borderColor="#0a1342"
      />
      <StatisticElement
        statistic={destination}
        title="Destinations visitées"
        subtitle="Depuis le début"
        borderColor="#c48600"
      />
      <StatisticElement
        statistic={depense}
        title="Dépensés"
        subtitle="Depuis le début"
        borderColor="#86427b"
      />
    </div>
  );
};

export default SecondSection;