export type Vehicle = {
  id: number;
  model: string;
  brand: string;
  transmission: string;
  size: string;
  fuelType: string;
  type: string;
  manufacturer: string;
  amenities: string[];
  keywords: string[];
  registration: string;
  registrationExpiryDate: string;
  serialnumber: string;
  // image: File | null;
  images: File []
  tankCapacity: number;
  luggageCapacity: number;
  availableSeats:number;
  canTransport: string[];
  mileage: number;
  fuelconsumption: number;
  age: number; 
};