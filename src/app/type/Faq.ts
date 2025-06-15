export type Question = {
    id: number;
    question: string;
    answer: string | string[];
  };

export  type Rubrique = {
    id: number;
    title: string;
    questions: Question[];
  };

export interface Ride {
    id: string;
    type: 'long distance' | 'short distance';
    startDateTime: Date;
    endDateTime: Date;
    paymentOption: 'cash' | 'daily' | 'hourly' | 'per km';
    paymentDetails: number;
    clientName: string;
    paymentMethod: 'card' | 'paypal' | 'mobile';
    status: 'cancelled' | 'ongoing' | 'completed';
  }