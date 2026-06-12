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

const PLACEHOLDER_LOGOS = ['/img/featured-img-2.jpg', '/img/featured-img-3.jpg', '/img/featured-img-4.jpg', '/img/featured-img-5.jpg'];

const Sponsor:React.FC<PartnersListProps> = ({ partners }) => {
  const realPartners = partners.filter(p => !PLACEHOLDER_LOGOS.includes(p.logo));
  const displayPartners = realPartners.length > 0 ? realPartners : partners;
  const useLogoFallback = realPartners.length === 0;

  return (
    <div className="w-full text max-w-6xl mx-auto px-4 py-5">
      <h2 className="font-medium title text-center pb-5">OUR PARTNERS</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayPartners.map((partner) => (
          <Link
            key={partner.id}
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[80px]"
          >
            {useLogoFallback ? (
              <span className="text-sm font-bold text-gray-500 text-center leading-tight">{partner.name}</span>
            ) : (
              <div className="relative w-full h-12">
                <Image
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Sponsor