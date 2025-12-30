// app/types/profile.ts

// Ce type correspond EXACTEMENT au modèle DriverProfile.java
export interface DriverProfile {
  id: string;
  userId: string;
  organisationId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  licenseNumber: string;
  vehicleDetails: string;
  profileImageUrl?: string;
  nickname?: string;
  birthDate?: string;
  nationality?: string;
  gender?: string;
  contactEmail: string;
  language?: string;
  biography?: string;
}

// Ce type correspond EXACTEMENT au modèle ClientProfile.java
export interface ClientProfile {
  id: string;
  userId: string;
  organisationId: string;
  profileImageUrl?: string;
  companyName: string;
  firstName: string; // Nom du contact
  lastName: string;  // Prénom du contact
  nickname?: string;
  contactEmail: string;
  phoneNumber: string;
  birthDate?: string;
  nationality?: string;
  gender?: string;
  language?: string;
}

// Ce type représente le contexte de session complet reçu après la connexion
// et aussi la réponse pour le profil public d'un utilisateur.
export interface UserSessionContext {
  userId: string;
  roles: ('DRIVER' | 'CLIENT' | 'NO_PROFILE')[]; // Maintenant une liste de rôles
  driverProfile?: DriverProfile; // Peut être optionnel (absent si pas chauffeur)
  clientProfile?: ClientProfile; // Peut être optionnel (absent si pas client)
  organisation: {
    organization_id: string; // <-- MODIFIÉ ICI : Utiliser snake_case pour correspondre au JSON
    long_name: string;       // <-- MODIFIÉ ICI : Utiliser snake_case pour correspondre au JSON
    description?: string;
    status: string;
  };
}