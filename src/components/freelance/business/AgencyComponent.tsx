// pages/dashboard/driver/agency.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Image from 'next/image';
import { Agency } from '@/app/type/Agency';
interface AgencyComponentProps {
  initialAgency: Agency;
}

const AgencyComponent: React.FC<AgencyComponentProps> = ({ initialAgency }) => {
  const [agency, setAgency] = useState<Agency>(initialAgency);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialAgency);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const services = e.target.value.split(',').map(s => s.trim());
    setFormData(prev => ({ ...prev, services }));
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put('/api/driver/agency', formData);
//       setAgency(response.data);
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de l\'agence:', error);
//     }
//   };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="title font-bold mb-2">My Agency</h1>
        
        {!isEditing ? (
          <div className="bg-white shadow-md text rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Image src={agency.logo} alt="Logo de l'agence" width={100} height={100} className="rounded-full mr-4" />
              <div>
                <h2 className="title font-semibold">{agency.name}</h2>
                <p className="text-gray-600">Founded on {agency.foundedDate}</p>
              </div>
            </div>
            <p className="mb-4">{agency.description}</p>
            <div className="mb-4">
              <h3 className="font-semibold">Services offered:</h3>
              <ul className="list-disc list-inside">
                {agency.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between">
              <div>
                <p><strong>Average rating:</strong> {agency.rating.toFixed(1)} / 5</p>
                <p><strong>Total number of rides:</strong> {agency.totalRides}</p>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <form  className="bg-white shadow-md text rounded-lg p-6 mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Agency Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="services">
                Services (separed by comma (,))
              </label>
              <input
                type="text"
                id="services"
                name="services"
                value={formData.services.join(', ')}
                onChange={handleServicesChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // Ici, vous devriez récupérer les données de l'agence du chauffeur
//   // basé sur l'authentification ou l'ID du chauffeur stocké dans la session
//   const dummyAgency: Agency = {
//     id: '1',
//     name: 'Service de Transport Jean Dupont',
//     description: 'Chauffeur indépendant offrant des services de transport personnalisés et professionnels.',
//     foundedDate: '2022-03-15',
//     logo: '/images/default-logo.png',
//     services: ['Transport urbain', 'Longue distance', 'Aéroport'],
//     rating: 4.8,
//     totalRides: 256
//   };

//   return {
//     props: {
//       initialAgency: dummyAgency,
//     },
//   };
// };

export default AgencyComponent;