 export interface NotificationSettings {
    mode: 'email' | 'sms' | 'push' | 'all';
    newRides: boolean;
    ratings: boolean;
    practicalTips: boolean;
    promotions: boolean;
    policyUpdates: boolean;
    peakHourRecommendations: boolean;
  }
  
  export interface Preferences {
    language: string;
    currency: string;
    paymentMethod: string;
    dateFormat: string;
    timeZone: string;
  }
  
  export interface RidePreferences {
    shortRides: boolean;
    longRides: boolean;
    passengerTypes: string[];
  }
  
  export interface PrivacySettings {
    sharePersonalInfo: boolean;
  }
  
  export interface CommunicationPreferences {
    calls: boolean;
    messages: boolean;
  }
  
  export interface DriverSettings {
    id: string;
    notificationSettings: NotificationSettings;
    preferences: Preferences;
    ridePreferences: RidePreferences;
    privacySettings: PrivacySettings;
    communicationPreferences: CommunicationPreferences;
  }