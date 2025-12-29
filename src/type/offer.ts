import { Resource } from './resource';

export interface Offer extends Partial<Omit<Resource, 'name' | 'base_price' | 'available_quantity'>> {
  id: string;
  profileUrl: string;
  name: string;
  location: string;
  availableSeats: number;  // maps to available_quantity
  price: number;           // maps to base_price
  date: string;
  time: string;
  paymentMethod: string;
  hasCar: boolean;
  status: string;
  email: string;
  clientName: string;
  phone?: string;         // Optional phone number field
}
