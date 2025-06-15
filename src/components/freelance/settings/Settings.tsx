// pages/dashboard/driver/settings.tsx
"use client"
import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { DriverSettings,NotificationSettings,Preferences,RidePreferences
,PrivacySettings,CommunicationPreferences
} from '@/components/freelance/settings/Interfaces';

import {
languageOptions,
timezoneOptions,
currencyOptions,
paymentMethod,
vehiculeType

} from "@/data/Structure";
import Preference2 from "@/components/customer/preference/Preference2";


  type NotificationSettingsKey = keyof Omit<NotificationSettings, 'mode'>;

interface SettingsPageProps {
  initialSettings: DriverSettings;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ initialSettings }) => {
  const [settings, setSettings] = useState<DriverSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const notificationItems: NotificationSettingsKey[] = ['newRides', 'ratings', 'practicalTips', 'promotions', 'policyUpdates', 'peakHourRecommendations'];


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
  
    setSettings(prev => {
      const newSettings = { ...prev };
      const [section, key] = name.split('.') as [keyof DriverSettings, string];
  
      switch (section) {
        case 'notificationSettings':
          newSettings.notificationSettings = {
            ...newSettings.notificationSettings,
            [key as NotificationSettingsKey]: type === 'checkbox' ? checked : value
          };
          break;
        case 'preferences':
          newSettings.preferences = {
            ...newSettings.preferences,
            [key as keyof Preferences]: value
          };
          break;
        case 'ridePreferences':
          newSettings.ridePreferences = {
            ...newSettings.ridePreferences,
            [key as keyof RidePreferences]: type === 'checkbox' ? checked : value
          };
          break;
        case 'privacySettings':
          newSettings.privacySettings = {
            ...newSettings.privacySettings,
            [key as keyof PrivacySettings]: checked
          };
          break;
        case 'communicationPreferences':
          newSettings.communicationPreferences = {
            ...newSettings.communicationPreferences,
            [key as keyof CommunicationPreferences]: checked
          };
          break;
      }
  
      return newSettings;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.put('/api/driver/settings', settings);
      setSettings(response.data);
      setSuccessMessage('Updated successfully.');
    } catch (error) {
      setErrorMessage('An Error encoured while updating Settings');
      console.error('Erreur lors de la mise à jour des paramètres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container text mx-auto px-4 py-8">
        <h1 className="title font-bold">Settings</h1>

        {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{errorMessage}</div>}
        {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text font-bold mb-2">Notification settings</h2>
          <div className="p-2">
            <label htmlFor="notificationSettings.mode" className="block font-medium text-gray-700">Reception Mode</label>
            <select
              id="notificationSettings.mode"
              name="notificationSettings.mode"
              value={settings.notificationSettings.mode}
              onChange={handleInputChange}
              className="mt-1 block md:w-1/6 border p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push</option>
              <option value="all">All</option>
            </select>
          </div>

          {notificationItems.map((item) => (
            <div key={item} className="mb-2">
                <label className="inline-flex items-center">
                <input
                    type="checkbox"
                    name={`notificationSettings.${item}`}
                    checked={settings.notificationSettings[item]}
                    onChange={handleInputChange}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2">{item.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                </label>
            </div>
            ))}

          <h2 className="font-bold mt-8">Preferences</h2>
        <div className='grid md:grid-cols-2'>
            <Preference2 label="Language" type="select" defaultSelectOption="Select Language" mapSelectOption={languageOptions}/>
          <Preference2 label="Time Zone" type="select" defaultSelectOption="Select Time Zone" mapSelectOption={timezoneOptions}/>
          <Preference2 label="Currency" type="select" defaultSelectOption="Select Currency" mapSelectOption={currencyOptions}/>
          <Preference2 label="Payment Method" type="select" defaultSelectOption="Select Payment Method" mapSelectOption={paymentMethod}/>
            <div  className="mb-4">
              <label  className="block text-sm font-medium text-gray-700">Date Format</label>
              <input
                type="text"
                id="Date Format"
                name="Date Format"
                value={settings.preferences.dateFormat}
                onChange={handleInputChange}
                className="mt-1 block w-[20rem] h-[3rem] border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
        </div>

          <h2 className="font-bold mt-8">Ride Preferences</h2>
          <div className="p-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="ridePreferences.shortRides"
                checked={settings.ridePreferences.shortRides}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2">Short Ride</span>
            </label>
          </div>
          <div className="p-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="ridePreferences.longRides"
                checked={settings.ridePreferences.longRides}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2">Long Ride</span>
            </label>
          </div>

          <h2 className="font-bold mt-8">Privacy settings</h2>
          <div className="p-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="privacySettings.sharePersonalInfo"
                checked={settings.privacySettings.sharePersonalInfo}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2">Sharing personal information with passengers</span>
            </label>
          </div>

          <h2 className="font-bold mt-8">Communication Preferences</h2>
          <div className="p-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="communicationPreferences.calls"
                checked={settings.communicationPreferences.calls}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2">Calls</span>
            </label>
          </div>
          <div className="p-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="communicationPreferences.messages"
                checked={settings.communicationPreferences.messages}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2">Messages</span>
            </label>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Updating...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // Ici, vous devriez récupérer les vraies données depuis votre API
//   const dummySettings: DriverSettings = {
//     id: '1',
//     notificationSettings: {
//       mode: 'email',
//       newRides: true,
//       ratings: true,
//       practicalTips: false,
//       promotions: true,
//       policyUpdates: true,
//       peakHourRecommendations: false,
//     },
//     preferences: {
//       language: 'Français',
//       currency: 'EUR',
//       paymentMethod: 'Carte bancaire',
//       dateFormat: 'DD/MM/YYYY',
//       timeZone: 'Europe/Paris',
//     },
//     ridePreferences: {
//       shortRides: true,
//       longRides: true,
//       passengerTypes: ['Tous'],
//     },
//     privacySettings: {
//       sharePersonalInfo: false,
//     },
//     communicationPreferences: {
//       calls: true,
//       messages: true,
//     },
//   };

//   return {
//     props: {
//       initialSettings: dummySettings,
//     },
//   };
// };

export default SettingsPage;