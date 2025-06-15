export interface Ride {
    id: string;
    start_date: string;
    start_time:string;
    end_date:string;
    end_time:string;
    from: string;
    to: string;
    price:number;
    billing:string;
    status: 'completed' | 'upcoming' | 'cancelled' | 'ongoing';
  }