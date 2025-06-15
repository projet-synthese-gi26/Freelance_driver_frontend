"use client"

import React, { useState, useEffect, ChangeEvent } from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { Referral } from '@/app/type/Referral';

interface DriverReferralProps {
  Referrals: Referral[];
}

const DriverReferral: React.FC<DriverReferralProps> = ({ Referrals }) => {
  const [referral, setReferral] = useState<Referral | null>(Referrals[0]);
  // const [availableReferrals, setAvailableReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChangeReferral=(e:ChangeEvent<HTMLSelectElement>)=>{
    const item=e.target.value.split(',')
    console.log(item);
    
    const selected:Referral={
      id:item[0],
      name:item[1],
      type: item[2],
      verificationDate:new Date().toLocaleDateString()
    }
    setReferral(selected)
  }

  useEffect(()=>{},[referral])

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="title font-bold mb-2">Referral Management</h1>
        
        {referral ? (
          <div className="bg-white shadow-md rounded-lg text p-6 mb-6">
            <h2 className="text font-semibold mb-4">Your current referent</h2>
            <p><strong>Name:</strong> {referral.name}</p>
            <p><strong>Type:</strong> {referral.type}</p>
            <p><strong>Verification Date:</strong> {new Date(referral.verificationDate).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="mb-6">Vous n'avez pas encore de référent assigné.</p>
        )}

        <div className="bg-white text shadow-md rounded-lg p-6">
          <h2 className="font-semibold mb-4">Changer de Référent</h2>
          <select 
            className="w-full p-2 border rounded"
            onChange={(e) => handleChangeReferral(e)}
            disabled={loading}
          >
            <option value="">Sélectionnez un nouveau référent</option>
            {Referrals.map((ref) => (
              <option key={ref.id} value={[ref.id,ref.name,ref.type]}>
                {ref.name} ({ref.type})
              </option>
            ))}
          </select>
          {loading && <p className="mt-2 text-gray-600">loading...</p>}
        </div>
      </div>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // Ici, vous devriez récupérer les données du référent actuel du chauffeur
//   // basé sur l'authentification ou l'ID du chauffeur stocké dans la session
//   const dummyReferral: Referral = {
//     id: '1',
//     name: 'Syndicat des Chauffeurs Professionnels',
//     type: 'syndicate',
//     verificationDate: '2024-01-15'
//   };

//   return {
//     props: {
//       initialReferral: dummyReferral,
//     },
//   };
// };

export default DriverReferral;