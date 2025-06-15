export interface BillingMethod {
    billing_method_id: string;
    billing_method_name: string;
    created_at: string;
    updated_at: string;
}

export interface Amenity {
    amenity_id: string;
    amenity_is_for: string[];
    amenity_name: string;
    created_at: string;
    updated_at: string;
}

export interface Keyword {
    keyword_id: string;
    keyword_is_for: string[];
    keyword_text: string;
    created_at: string;
    updated_at: string;
}


export interface YowyobService {
    yowyob_service_id: string;
    yowyob_service_name: string;
    description: string;
    yowyob_service_logo: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface BusinessDomain {
    business_domain_id: string;
    domain_name: string;
    description: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}


export interface Country {
    country_id: string;
    country_name: string;
    phone_indicator: string;
    domain_name_id: string;
    created_at: string;
    updated_at: string;
}

export interface Town {
    town_id: string;
    town_name: string;
    country_id: string;
    created_at: string;
    updated_at: string;
}


export interface PointOfInterest {
    poi_id: string;
    town_id: string;
    created_by_user_id: string;
    poi_name: string;
    poi_long_name: string;
    poi_short_name: string;
    poi_friendly_name: string;
    poi_category: string;
    poi_description: string;
    poi_logo: Blob;
    location_gps: [number, number];
    poi_images: Blob[];
    poi_amenities: string[];
    poi_address: Address;
    poi_contacts: Contact[];
    poi_type: string[];
    poi_keywords: string[];
    phone_number: string;
    website_url: string;
    operation_time_plan: { [key: string]: string };
    reviews: string[];
    created_at: string;
    updated_by_user_id: string;
    updated_at: string;
}

export interface TariffPlan {
    tariff_plan_id: string;
    yowyob_service_id: string;
    country_id: string;
    name: string;
    description: string;
    associated_services: { [key: string]: boolean };
    is_prepaid: boolean;
    duration: number;
    recall_periodicity: number;
    fee: number;
    currency_name: string;
    currency_code: string;
    billing_mode: string;
    billing_frequency: string;
    bill_emission_month_day: number;
    bill_payment_end_month_day: number;
    bill_penality_start_count_month_day: number;
    applied_penalty_cost: number;
    created_at: string;
    updated_at: string;
}

// Interfaces pour les types définis par l'utilisateur

export interface Address {
    address_id: string;
    country: string;
    state: string;
    city: string;
    is_default_address: boolean;
    is_delivery_address: boolean;
    is_business_address: boolean;
    timezone: string;
    created_at: string;
    updated_at: string;
}

export interface Contact {
    contact_name: string;
    is_verified: boolean;
    is_favorite: boolean;
    contact_type: string;
    phone_number: string;
    verified_at: string;
    created_at: string;
    updated_at: string;
}

export interface BusinessPortfolio {
    experience_started_at: string;
    experience_ended_at: string;
    experience_label: string;
    experience_description: string;
    experience_illustrations: Blob[];
    experience_references: string[];
    is_skill: boolean;
    created_at: string;
    updated_at: string;
}

export interface SocialNetwork {
    social_network_name: string;
    social_network_value: string;
}