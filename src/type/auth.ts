// src/type/auth.ts
/*
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

*/

// src/type/auth.ts

export interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  // Champs contextuels pour la suite
  role: 'driver' | 'client'; // Rendre 'role' obligatoire et limiter aux deux valeurs
  companyName?: string;
  companyDescription?: string;
  licenseNumber?: string;
  vehicleDetails?: string;
}

export interface LoginPayload {
  username: string; // Le backend mobile utilise 'username', pas 'login'
  password: string;
}

export interface RegisterPayload {
    email: string;
    firstName: string;
    lastName: string;
    otpCode: string;
}

export interface AuthResponse {
  token: string;
  profile: any; // UserSessionContext (à remplacer par le type réel)
  chatSession?: any;
}