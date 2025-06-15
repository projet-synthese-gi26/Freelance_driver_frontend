"use client"
import {
  PlusCircleIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link";
import { useEffect, useState } from "react";
import Published from "@/components/customer/announce/Published";
import { adsMap } from '@/data/Structure'
import { AdsMap } from "@/app/type/Ads";



export default function Page() {
  const [haveCar, setHaveCar] = useState(false);
  const [link, setLink] = useState("https://letsgo-pproject-git-master-diroil-james-projects.vercel.app/AnnonceClientSansVehicule");
  const handleHaveCar = () => {
    setHaveCar(!haveCar);    
  };

  useEffect(()=> {
    setLink(
      haveCar
        ? "https://letsgo-pproject-git-master-diroil-james-projects.vercel.app/AnnonceClientAvecVehicule"
        : "https://letsgo-pproject-git-master-diroil-james-projects.vercel.app/AnnonceClientSansVehicule"
    );
  },[haveCar])
  const [Map, setAdsMap] = useState<AdsMap[]>(adsMap);

  return (
    <div className="text p-4 md:p-6 lg:p-8 mb-[18.5%]">
      <section>
        <div className="flex flex-row items-center gap-4">
          <Link
            className="flex items-center mb-3 md:mb-0 cursor-pointer text-primary font-semibold w-full md:w-[15%] hover:text-white hover:bg-primary p-2 md:p-1 justify-center gap-2 border border-primary-500 rounded-xl"
            href={link}
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Create Announce</span>
          </Link>
          <div className="flex items-center mb-3 md:mb-0 text-primary font-semibold w-full md:w-[12%] p-2 md:p-1 justify-center gap-2">
            <input
              type="checkbox"
              name="haveCar"
              id="haveCar"
              checked={haveCar}
              onChange={handleHaveCar}
            />
            <label htmlFor="haveCar">I have a car</label>
          </div>
        </div>
        <div>
          <h3 className="text font-bold mt-5">My Announces</h3>
          <Published ad={Map} setAdsMap={setAdsMap} />
        </div>
      </section>
    </div>
  );
}