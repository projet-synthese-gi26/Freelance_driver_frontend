export  interface Payment {
    paymentId: string;
    status: string;
    methodType: string;
    category: string;
    amount: number;
    startDate: string;
    endDate: string;
    userId: string;
  }

export interface Data {
    transaction_amount: number;
    transaction_currency: string;
    transaction_reason: string;
    customer_phone_number: string;
    customer_name: string;
    customer_email: string;
    customer_lang: string;
  };

export interface Promo{
  code: string;
  status:string;
  validity:number;
  discount:number;
  startDate:null | Date;
}

export interface Planl{
  type:String;
  title:String;
  description:[];
  content:String;
  amount:number;
}