'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ClientDTO {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  role: string;
  sex: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  userPictureUrl: string;

  driverId: string;
  experiences: number;
  driverLicense: string;
  interests: string;
  state: string;
  profile: string;
  zones: string[];
  cvUrl: string;

  vehicleID: string | null;
  VehiclePictureUrl: string;
  PictureDescription: string;
  fueltype: string;
  boxtype: string;
  model: string;
  brand: string;
}

interface ContextType {
  clientDTO: ClientDTO;
  setClientDTO: React.Dispatch<React.SetStateAction<ClientDTO>>;
}

const defaultContextValue: ContextType = {
  clientDTO: {} as ClientDTO,
  setClientDTO: () => {},
};

export const context = createContext<ContextType>(defaultContextValue);

interface ContextProviderProps {
  children: ReactNode;
}

export default function ContextProvider({ children }: ContextProviderProps) {
  const [clientDTO, setClientDTO] = useState<ClientDTO>({
    userId: '00000000-0000-0000-0000-000000000000',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '1234567890',
    address: '123 Main St, Anytown USA',
    password: 'password123',
    role: 'customer',
    sex: 'male',
    birthday: '1990-01-01',
    createdAt: '2023-06-01T12:00:00Z',
    updatedAt: '2023-06-01T12:00:00Z',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    userPictureUrl: '/img/team-1.jpg',

    driverId: '00000000-0000-0000-0000-000000000001',
    experiences: 5,
    driverLicense: '123456789',
    interests: 'driving, travel, adventure',
    state: 'active',
    profile: 'Experienced driver with a passion for safe and efficient transportation.',
    zones: ['zone A', 'zone B', 'zone C'],
    cvUrl: 'https://example.com/driver-cv.pdf',

    vehicleID: null,
    VehiclePictureUrl: 'https://example.com/vehicle-picture.jpg',
    PictureDescription: 'A well-maintained delivery van',
    fueltype: 'diesel',
    boxtype: 'van',
    model: 'Sprinter',
    brand: 'Mercedes-Benz'
  });

  // Pour mettre à jour la propriété 'name'
  const handleNameUpdate = (newName: string) => {
    setClientDTO(prevState => ({
      ...prevState,
      name: newName
    }));
  };

  return (
    <context.Provider value={{ clientDTO, setClientDTO }}>
      {children}
    </context.Provider>
  );
}

export const useContextProvider = (): ContextType => {
  const contextValue = useContext(context);
  if (contextValue === undefined) {
    throw new Error("useContextProvider must be used within a ContextProvider");
  }
  return contextValue;
};
