"use client";
import SecondSection from "@/components/customer/statistic/SecondSection";
import MostVisited from "@/components/customer/statistic/MostVisited";
import ThirdSection from "@/components/customer/statistic/ThirdSection";

const Page = () => {
  const firstDonutData = {
      labels: ["Bangangte", "Yaounde", "Douala", "Garoua", "Bamenda"],
    values: [5000, 4000, 3000, 2000, 1000], // Exemple de données de fréquentation
  };
 
  // Données pour le deuxième diagramme circulaire
  const secondDonutData = {
      labels: ["Voiture", "monospace", "moto", "Bus"],
    values: [5000, 3000, 2000, 1000], // Exemple de données sur le type de véhicule
  };

  return (
    <div className="flex flex-col">
      
      <MostVisited firstDonutData={firstDonutData} secondDonutData={secondDonutData} Kilometer={224} Travel={80}/>
      <SecondSection fidelity={100} vehiculeBorrow={200} destination={5000} depense={364}/>
      <ThirdSection/>
    </div>
  );
};

export default Page;
