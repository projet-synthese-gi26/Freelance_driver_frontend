import axios from 'axios';

const API_KEY = '3qUkt_O1YcClmouM6_-W-dZ5bWdx13uf';
const API_URL = `https://gateway.yowyob.com/payment-service/${API_KEY}/payin`;

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export interface PaymentResponse {
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  message?: string;
}

function formatPhoneNumber(phoneNumber: string): string {
  // Ajoute ici la logique de formatage si besoin
  return phoneNumber;
}

export const apiService = {
  initiatePayment: async (amount: number, phoneNumber: string): Promise<PaymentResponse> => {
    const requestData = {
      payer_email: "test@customer.cm",
      payer_name: "test_yow_yob",
      payer_phone_number: formatPhoneNumber(phoneNumber),
      payer_reference: "7c85bea3-8144-4ea2-bed7-ef1f3b5ff8e3",
      service_description: "test post",
      service_reference: "7c85bea3",
      service_name: "test",
      service_quantity: 1,
      transaction_amount: amount,
      transaction_currency: "XAF",
      transaction_method: "MOBILE",
      transaction_reference: ""
    };
    const response = await api.post(API_URL, requestData);
    return {
      transactionId: response.data.transaction_id || response.data.transactionId,
      status: response.data.status,
      amount: response.data.amount,
      currency: response.data.currency,
      message: response.data.message
    };
  }
};
