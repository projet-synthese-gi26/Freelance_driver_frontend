import React from 'react'
import DriverReferral from '@/components/freelance/business/DriverReferral'
import { Referral } from '@/app/type/Referral';
import { referrals } from '@/data/Structure';

const Page = () => {
  return (
    <div>
      <DriverReferral Referrals={referrals}/>
    </div>
  )
}

export default Page