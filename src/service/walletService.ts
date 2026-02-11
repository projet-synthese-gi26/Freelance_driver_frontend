import apiClient from './apiClient';

export type Wallet = {
  id: string;
  ownerId: string;
  ownerName: string;
  balance: number;
};

export type WalletTransaction = {
  id: string;
  walletId: string;
  amount: number;
  type: string;
  status: string;
};

export const walletService = {
  getMyWallet: async (): Promise<Wallet> => {
    const response = await apiClient.get('/api/v1/driver/wallet');
    return response.data as Wallet;
  },

  getMyTransactions: async (): Promise<WalletTransaction[]> => {
    const response = await apiClient.get('/api/v1/driver/wallet/transactions');
    return Array.isArray(response.data) ? (response.data as WalletTransaction[]) : [];
  },

  recharge: async (amount: number): Promise<WalletTransaction> => {
    const response = await apiClient.post('/api/v1/driver/wallet/recharge', { amount });
    return response.data as WalletTransaction;
  },
};
