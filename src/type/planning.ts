/*import { Announcement, AnnouncementStatus } from './announcement';

export type PlanningStatus = AnnouncementStatus; // Ils partagent les mêmes statuts

export interface Planning extends Omit<Announcement, 'cost' | 'baggageInfo' | 'status'> {
  status: PlanningStatus;
  // Champs spécifiques au planning
  paymentOption: string;
  regularAmount: string;
  discountPercentage: string;
  discountedAmount: string;
}*/

// PATH: /home/mbogneng-junior/freelance-driver (Copie)/frontend/app/types/planning.ts

import { Announcement, AnnouncementStatus } from './announcement'; // Garder cet import

export type PlanningStatus = AnnouncementStatus; // C'est déjà un alias du type string literal

export interface Planning extends Omit<Announcement, 'cost' | 'baggageInfo' | 'status'> {
  status: PlanningStatus;
  // Champs spécifiques au planning
  paymentOption: string;
  regularAmount: string;
  discountPercentage: string;
  discountedAmount: string;
}