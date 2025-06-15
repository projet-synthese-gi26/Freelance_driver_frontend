

export interface userInterface {

    user_id: string
    user_email: string| null;
    emailVerified: boolean;
    userData?:userData;

}

export interface userData {

    user_id: string
    user_email: string| null;
    phone_number : string | null;
    email_verified: boolean;
    is_selected: boolean;


    user_first_name?: string;
    user_last_name?: string;
    user_friendly_name?: string;
    user_type?: string[];
    profile_picture?: string;


    secondary_email?: string | null;
    secondary_phone_number?: string | null;
    gender?: string;
    created_at?: string;
    updated_at?: string;
    email_notification?: boolean;
    push_notification?: boolean;
    sms_notification?: boolean;
    description?: string;
    has_vehicle?: string;
    Country_id?: string; // UUID
    date_of_birth?: string | null;
    nationality?: string;
    avatar_picture?: string; // Assuming URL or base64 string
    registration_date?: string;
    payment_methods?: Set<string>;
    payment_history?: string[];
    last_login_time?: string;
    login_history?: string[];

    // User Preferences
    preferred_language?: string;
    preferred_payment_methods?: Set<string>; // UUID
    preferred_billing_methods?: Set<string>; // UUID
    preferred_pickup_locations?: Set<string>; // UUID
    preferred_dropoff_locations?: Set<string>; // UUID
    preferred_amenities?: Set<string>;
    preferred_social_networks?: Set<string>;

    // User advantages and benefits
    active_discounts?: Set<string>;
    discount_vouchers?: Set<string>;
    discount_history?: string[];
    notification_preferences?: { [key: string]: boolean };
    loyalty_points?: number;

    // User security
    password?: string;
    password_reset_token?: string | null; // Hashed
    password_reset_expiration?: string | null; // Hashed
    privacy_settings?: { [key: string]: boolean };
    is_verified?: boolean;
    is_locked?: boolean;
    is_deleted?: boolean;


}


export interface Subscription {
    user_id: string;
    subscription_id: string;
    tariff_plan_id: string;
    subscribed_at: string;
    upgraded_at: string;
    service_start_date: string;
    service_end_date: string;
    billing_method_id: string;
    billing_frequency: string;
    bill_emission_month_day: number;
    bill_payment_end_month_day: number;
    bill_penality_start_count_month_day: number;
    penalty_cost: number;
    account_status: string;
    created_at: string;
    updated_at: string;
    cancellation_date: string;
    duration: number;
    is_cancelled: boolean;
    is_suspended: boolean;
    is_automatic: boolean;
    service_fee: number;
    total_pay_cost: number;
}

export interface Invoice {
    invoice_id: string;
    user_id: string;
    subscription_id: string;
    invoice_date: string;
    invoice_amount: number;
    payment_status: string;
    payment_date: string;
    is_from_automatic_subscription: boolean;
    created_at: string;
    updated_at: string;
}

export interface LocationPreference {
    location_id: string;
    user_id: string;
    location_name: string;
    location_gps: [number, number];
    is_home: boolean;
    is_work: boolean;
    is_pick_up: boolean;
    is_drop_off: boolean;
    created_at: string;
    updated_at: string;
}

export interface PaymentPreference {
    user_id: string;
    payment_method_id: string;
    payment_method: string;
    card_number: string;
    card_holder_name: string;
    card_expiry_date: string;
    card_cvv: string;
    is_default: boolean;
    created_by_user_id: string;
    updated_by_user_id: string;
    created_at: string;
    updated_at: string;
}

export interface UserDiscount {
    user_id: string;
    discount_id: string;
    discount_code: string;
    discount_type: string;
    discount_value: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

