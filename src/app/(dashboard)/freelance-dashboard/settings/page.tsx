import React from 'react'
import SettingsPage from '@/components/freelance/settings/Settings'
import { DriverSettings } from '@/components/freelance/settings/Interfaces';

const page = () => {
  const dummySettings: DriverSettings = {
    id: '1',
    notificationSettings: {
      mode: 'email',
      newRides: true,
      ratings: true,
      practicalTips: false,
      promotions: true,
      policyUpdates: true,
      peakHourRecommendations: false,
    },
    preferences: {
      language: 'Français',
      currency: 'EUR',
      paymentMethod: 'Carte bancaire',
      dateFormat: 'DD/MM/YYYY',
      timeZone: 'Europe/Paris',
    },
    ridePreferences: {
      shortRides: true,
      longRides: true,
      passengerTypes: ['Tous'],
    },
    privacySettings: {
      sharePersonalInfo: false,
    },
    communicationPreferences: {
      calls: true,
      messages: true,
    },
  };
  return (
    <div>
      <SettingsPage initialSettings={dummySettings}/>
    </div>
  )
}

export default page