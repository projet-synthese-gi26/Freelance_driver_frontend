// app/types/announcement.ts

/*
export type AnnouncementStatus = 'Draft' | 'Published' | 'Confirmed' | 'Terminated' | 'Expired' | 'Cancelled' | 'Ongoing' | 'PendingConfirmation' | 'PendingDriverConfirmation'; // <-- AJOUT DE 'PendingDriverConfirmation'

export interface Announcement {
  id: string;
  title: string;
  
  pickupLocation: string;
  dropoffLocation: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  
  cost: string;
  isNegotiable: boolean;
  paymentMethod: string;

  baggageInfo: string;
  status: AnnouncementStatus;
  
  clientId: string;
  clientName: string;
  createdAt?: string;
  updatedAt?: string;
  clientPhoneNumber?: string;
  profileImageUrl?: string; // Image du client qui a posté
}
  */

// PATH: /home/mbogneng-junior/freelance-driver (Copie)/frontend/app/types/announcement.ts

// --- MODIFICATION ICI : Utiliser un type string literal ---
export type AnnouncementStatus = 
  'Draft' | 
  'Published' | 
  'PendingConfirmation' | // Pour les annonces (client accepte chauffeur)
  'PendingDriverConfirmation' | // Pour les plannings (chauffeur accepte client)
  'Confirmed' | 
  'Ongoing' | 
  'Terminated' | 
  'Expired' | 
  'Cancelled';

export interface Announcement {
  id: string;
  title: string;
  
  pickupLocation: string;
  dropoffLocation: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  
  cost: string;
  isNegotiable: boolean;
  paymentMethod: string;

  baggageInfo: string;
  status: AnnouncementStatus; // Utilise le type string literal
  
  clientId: string;
  clientName: string;
  createdAt?: string;
  updatedAt?: string;
  clientPhoneNumber?: string;
  profileImageUrl?: string; // Image du client qui a posté
}