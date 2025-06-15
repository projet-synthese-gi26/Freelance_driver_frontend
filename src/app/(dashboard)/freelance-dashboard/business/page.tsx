import React from 'react'
import AgencyComponent from '@/components/freelance/business/AgencyComponent'
import { Agency } from '@/app/type/Agency';
import { driverDTO } from '@/app/(dashboard)/freelance-dashboard/FreelanceDTO'; 

const dummyAgency: Agency = {
  id: '1',
  name: driverDTO.driver_agency_name,
  description: driverDTO.driver_agency_description,
  foundedDate: driverDTO.driver_agency_date,
  logo: '/images/default-logo.png',
  services: driverDTO.driver_agency_services,
  rating: driverDTO.driver_agency_rate,
  totalRides: driverDTO.driver_agency_rides
};

const Page = () => {
  return (
    <div>
      <AgencyComponent initialAgency={dummyAgency}/>
    </div>
  )
}

export default Page