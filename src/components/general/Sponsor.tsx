import React from 'react'
import Link from 'next/link'
import Image from 'next/image';

interface Partner {
    id: string;
    name: string;
    logo: string;
    website: string;
  }
interface PartnersListProps {
partners: Partner[];
}

const Sponsor:React.FC<PartnersListProps> = ({ partners }) => {
  return (
    <div className="w-full text max-w-6xl mx-auto px-4 py-5">
    <h2 className="font-medium title text-center pb-5">OUR PARTNERS</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {partners.map((partner) => (
        <Link
          key={partner.id}
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative w-full h-24">
            <Image
              src={partner.logo}
              alt={`Logo de ${partner.name}`}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </Link>
      ))}
    </div>
  </div>
  )
}

export default Sponsor