interface Driver {
    driver_id: string; // UUID
    driver_agency_id: string; // UUID
    user_id: string; // UUID
    driver_first_name: string;
    driver_last_name: string;
    driver_friendly_name: string;
    driver_date_of_birth: Date;
    profile_photo_portrait_with_vehicle_immatrication: string;
    driver_profile_image: string;
    driver_images: Set<string>;
    driver_email: string;
    driver_phone_number: string;
    driver_license_number: string;
    driver_license_photo: string;
    driver_keywords: Set<string>;
    driver_amenities: Set<string>;
    driver_certifications: Set<[string, string]>;
    driver_experiences: Set<string>;
    driver_portfolio: Set<string>;
    preferred_payment_methods: Set<string>; // Set of UUIDs
    preferred_billing_methods: Set<string>; // Set of UUIDs
    preferred_pickup_locations: Set<string>; // Set of UUIDs
    preferred_dropoff_locations: Set<string>; // Set of UUIDs
    preferred_vehicle_types: Set<string>;
    registration_date: string;
    payment_history: string[];
    preferred_language: string;
    driver_capacity_number: string;
    driver_capacity_photo: string;
    driver_identification_number: string;
    is_available: boolean;
    status: string; // 'active', 'revoked', 'pending'
    statistics: Map<string, number>;
    driver_reviews: string[]; // Array of UUIDs
    ride_history: string[]; // Array of UUIDs
    referral_code: string;
    referral_count: number;
    created_at: string;
    updated_at: string;
}

interface DriverExperience {
    driver_experience_id: string; // UUID
    driver_id: string; // UUID
    start_date: string;
    end_date: string;
    description: string;
    vehicle_models: Set<string>; // Set of UUIDs
    transmission_types: Set<string>; // Set of UUIDs
    driving_skills: string;
    experience_illustrations: ArrayBuffer[];
    experience_references: ArrayBuffer[];
    created_at: string;
    updated_at: string;
}

interface DriverAvailability {
    driver_availability_id: string; // UUID
    driver_id: string; // UUID
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    availability_schedule: Map<string, Set<string>>;
    driver_billing_method_id: string; // UUID
    price: number;
    comments: string;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}