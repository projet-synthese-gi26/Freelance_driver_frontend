import axios from 'axios';
import { sessionService } from './sessionService';

export type ComplianceDetails = {
  id: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  cvUrl?: string;
  cniNumber?: string;
  cniRectoUrl?: string;
  cniVersoUrl?: string;
  licenseNumber?: string;
  licenseRectoUrl?: string;
  licenseVersoUrl?: string;
  isVerified?: boolean;
};

export type ComplianceCheck = {
  syndicatDriverId?: string;
  verificationTimestamp?: string;
  globalStatus?: string;
  details?: {
    licenseValid?: boolean;
    insuranceValid?: boolean;
    membershipCurrent?: boolean;
    medicalCheck?: boolean;
  };
  restrictions?: string[];
};

const complianceApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_COMPLIANCE_API_URL || 'https://ugate.pynfi.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

complianceApiClient.interceptors.request.use(
  async (config) => {
    const token = sessionService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const complianceService = {
  getDetails: async (driverId: string): Promise<ComplianceDetails> => {
    const response = await complianceApiClient.get(`/compliance/details/${driverId}`);
    return response.data as ComplianceDetails;
  },

  check: async (driverId: string): Promise<ComplianceCheck> => {
    const response = await complianceApiClient.get(`/compliance/check/${driverId}`);
    return response.data as ComplianceCheck;
  },
};
