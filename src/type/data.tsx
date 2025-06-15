interface Customer {
    customer_id: string; // UUID
    user_id: string; // UUID
    first_name: string;
    last_name: string;
    booking_history: Set<string>;
    vouchers: Set<string>;
    created_at: string;
    updated_at: string;
    trip_id: string; // UUID (derived from PRIMARY KEY)
}

interface DriverBooking {
    driver_booking_id: string; // UUID
    customer_id: string; // UUID
    driver_id: string; // UUID
    vehicle_id: string | null; // UUID
    vehicle_identification: string | null;
    vehicle_image: ArrayBuffer | null;
    pickup_location: [number, number]; // [longitude, latitude]
    dropoff_location: [number, number]; // [longitude, latitude]
    booking_date: string;
    booking_time: string;
    mileage_at_trip_start: number;
    mileage_at_trip_end: number;
    trip_total_distance: number;
    booking_status: string;
    payment_method: string;
    payment_amount: number;
    payment_status: string;
    payment_date: string;
    created_at: string;
    updated_at: string;
}

interface BookingsByCustomer {
    customer_id: string; // UUID
    booking_id: string; // UUID
    driver_id: string; // UUID
    availability_id: string; // UUID
    start_time: string;
    end_time: string;
    status: string;
    created_at: string;
}

interface BookingsByDriver {
    driver_id: string; // UUID
    booking_id: string; // UUID
    customer_id: string; // UUID
    availability_id: string; // UUID
    start_time: string;
    end_time: string;
    status: string;
    created_at: string;
}

interface BookingsById {
    booking_id: string; // UUID
    customer_id: string; // UUID
    driver_id: string; // UUID
    availability_id: string; // UUID
    start_time: string;
    end_time: string;
    status: string;
    created_at: string;
}

interface SafetyGuideline {
    safety_guideline_id: string; // UUID
    letsgo_service_id: string; // UUID
    guideline_short_message: string;
    guideline_long_message: string;
    created_at: string;
    updated_at: string;
    user_id: string; // UUID (derived from PRIMARY KEY)
    notification_id: string; // UUID (derived from PRIMARY KEY)
}

interface Review { 
    review_id: string; // UUID
    user_id: string; // UUID
    rated_entity_id: string; // UUID
    rated_entity_type: string;
    rating: number;
    comment: string;
    note: number;
    icon: string;
    like_count: number;
    dislike_count: number;
    created_at: string;
    update_at: string;
    is_hidden:boolean;
}

interface ReviewsByDriver {
    driver_id: string; // UUID
    review_id: string; // UUID
    reviewer_id: string; // UUID
    rating: number;
    comment: string;
    likes: number;
    dislikes: number;
    created_at: string;
}

interface ReviewsByAgency {
    agency_id: string; // UUID
    review_id: string; // UUID
    reviewer_id: string; // UUID
    rating: number;
    comment: string;
    likes: number;
    dislikes: number;
    created_at: string;
}

interface MobilityOffer {
    offer_id: string; // UUID
    customer_id: string; // UUID
    pickup_location: [number, number]; // [longitude, latitude]
    dropoff_location: [number, number]; // [longitude, latitude]
    travel_date: string;
    travel_time: string;
    offer_status: string;
    mobility_cost: number;
    is_mobility_cost_negociable: boolean;
    prefered_payment_mode_id: string; // UUID
    prefered_billing_id: string; // UUID
    created_at: string;
    updated_at: string;
    is_luggage: boolean;
}

interface MobilityOfferApplication {
    application_id: string; // UUID
    offer_id: string; // UUID
    driver_id: string; // UUID
    application_status: string;
    proposed_mobility_cost: number;
    payment_mode_id: string; // UUID
    billing_id: string; // UUID
    created_at: string;
    updated_at: string;
}

interface PaymentsByUser {
    user_id: string; // UUID
    payment_id: string; // UUID
    subscription_id: string; // UUID
    amount: number;
    payment_method: string;
    payment_date: string;
    status: string;
    created_at: string;
}

interface SubscriptionsById {
    subscription_id: string; // UUID
    user_id: string; // UUID
    plan: string;
    start_date: string;
    end_date: string;
    status: string;
    amount: number;
    created_at: string;
}