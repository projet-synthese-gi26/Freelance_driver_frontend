export interface Order {
    id: string;
    clientName: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time:string;
    pick_location: string;
    drop_location: string;
    availability:'Full time' | 'Part time';
    status: 'Pending' | 'Accepted' | 'Rejected';
    price:number;
    payment_type: 'Flat rate' | 'Per Hour' | 'Per Km' | 'Per Day';
    passenger:number;
    Lugguage:'With Lugguage' | 'Without Lugguage';
    Negociable: boolean;
  }