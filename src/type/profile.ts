// src/type/profile.ts

export interface DriverProfile {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  birthDate?: string;
  phoneNumber?: string;
  nationality?: string;
  gender?: string;
  language?: string;
  biography?: string;
  vehicleDetails?: string;
  profileImageUrl?: string;
}

// Ce type représente le contexte de session complet reçu après la connexion
// et aussi la réponse pour le profil public d'un utilisateur.
export interface UserSessionContext {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    photoUri?: string;
    settings?: { // Corrected to optional
        id: string;
        userId: string;
        theme?: string;
        notificationsEnabled?: boolean;
        language?: string;
        longRideEnabled?: boolean;
        shortRideEnabled?: boolean;
        privacyEnable?: boolean;
        allowCalls?: boolean;
        allowMessages?: boolean;
        notifyNewRides?: boolean;
        notifyRatings?: boolean;
        notifyPracticalTips?: boolean;
        notifyPromotions?: boolean;
        notifyPolicyUpdates?: boolean;
        notifyPeakHourRecommendations?: boolean;
        receiveEmail?: boolean;
        receiveSms?: boolean;
        receivePushNotifications?: boolean;
        receiveWhatsapp?: boolean;
        createdAt?: string;
        updatedAt?: string;
    };
    permissions?: string[];
    roles: { // Corrected to roles array
        id: string;
        userId: string;
        displayName?: string;
        phoneNumber?: string;
        emailAddress?: string;
        avatarUrl?: string;
        languages?: string[];
        roleType?: string;
        reviewableId?: string;
        reactableId?: string;
        averageRating?: number;
        reactionCounts?: { [key: string]: number };
        reviewableType?: string;
        reactableType?: string;
    }[];
  };
  actor?: { // NEW: Added actor
      id: string;
      userId: string;
      displayName?: string;
      phoneNumber?: string;
      emailAddress?: string;
      avatarUrl?: string;
      languages?: string[];
      roleType?: string;
      reviewableId?: string;
      reactableId?: string;
      averageRating?: number;
      reactionCounts?: { [key: string]: number };
      reviewableType?: string;
      reactableType?: string;
  };
  organisation?: { // NEW: Added organisation
      id: string;
      actorId?: string;
      name?: string;
      description?: string;
      taxId?: string;
      logoUrl?: string;
      code?: string;
      service?: string;
      isIndividualBusiness?: boolean;
      email?: string;
      websiteUrl?: string;
      socialNetwork?: string;
      businessRegistrationNumber?: number;
      capitalShare?: string;
      ceoName?: string;
      yearFounded?: string;
      keywords?: string[];
      numberOfEmployees?: number;
      legalForm?: string;
      isActive?: boolean;
      status?: string;
      createdAt?: string;
      updatedAt?: string;
      contacts?: { // NEW: Added contacts
          id: string;
          contactableId?: string;
          contactableType?: string;
          firstName?: string;
          lastName?: string;
          title?: string;
          isEmailVerified?: boolean;
          isPhoneNumberVerified?: boolean;
          isFavorite?: boolean;
          phoneNumber?: string;
          secondaryPhoneNumber?: string;
          faxNumber?: string;
          email?: string;
          secondaryEmail?: string;
          emailVerifiedAt?: string;
          phoneVerifiedAt?: string;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string;
      }[];
      address?: { // NEW: Added address
          id: string;
          addressableId?: string;
          addressableType?: string;
          type?: string;
          addressLine1?: string;
          addressLine2?: string;
          city?: string;
          state?: string;
          locality?: string;
          zipCode?: string;
          postalCode?: string;
          poBox?: string;
          isDefault?: boolean;
          countryId?: string;
          neighborhood?: string;
          informalDescription?: string;
          latitude?: number;
          longitude?: number;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string;
      };
      reviewableId?: string;
      reactableId?: string;
      averageRating?: number;
      reactionCounts?: { [key: string]: number };
      reviewableType?: string;
      reactableType?: string;
  };
}