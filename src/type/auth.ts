// src/type/auth.ts

export interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  // Champs contextuels pour la suite
  role?: 'driver' | 'client'; 
  companyName?: string;
  companyDescription?: string;
  licenseNumber?: string;
  vehicleDetails?: string;
}

export interface LoginPayload {
  username: string; // Le backend mobile utilise 'username', pas 'login'
  password: string;
}

export interface AuthResponse {
  token: string;
  profile: any; // UserSessionContext
  chatSession?: any;
}