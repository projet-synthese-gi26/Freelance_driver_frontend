interface VehicleModel {
    vehicle_model_id: string; // UUID
    model_name: string;
    created_at: string;
    updated_at: string;
}

interface TransmissionType {
    transmission_type_id: string; // UUID
    type_name: string;
    created_at: string;
    updated_at: string;
}

interface VehicleMake {
    vehicle_make_id: string; // UUID
    make_name: string;
}

interface VehicleSize {
    vehicle_size_id: string; // UUID
    size_name: string;
    created_at: string;
    updated_at: string;
}

interface FuelType {
    fuel_type_id: string; // UUID
    fuel_type_name: string;
}

interface VehicleType {
    vehicle_type_id: string; // UUID
    type_name: string;
}

interface Manufacturer {
    manufacturer_id: string; // UUID
    manufacturer_name: string;
}

interface Vehicle {
    vehicle_id: string; // UUID
    vehicle_make_id: string; // UUID
    vehicle_model_id: string; // UUID
    vehicle_transmission_id: string; // UUID
    manufacturer_id: string; // UUID
    vehicle_size_id: string; // UUID
    vehicle_type_id: string; // UUID
    fuel_type_id: string; // UUID
    vehicle_amenities: Set<string>;
    vehicle_keyworks: Set<string>;
    owner_id: string; // UUID
    type_of_owner: string;
    vehicle_serial_number: string;
    vehicle_serial_photo: string;
    registration_number: string;
    registration_photo: string;
    registration_expiry_date: string;
    illustration_images: Array<Blob>;
    tank_capacity: number;
    luggage_max_capacity: number;
    total_seat_number: number;
    can_transport: Array<string>;
    average_fuel_consumption_per_kilometer: number;
    mileage_at_start: number;
    mileage_since_commissioning: number;
    vehicle_age_at_start: number;
    vehicle_reviews: Array<string>; // Array of UUIDs
    created_at: string;
    updated_at: string;
    driver_id: string; // UUID (derived from PRIMARY KEY)
}