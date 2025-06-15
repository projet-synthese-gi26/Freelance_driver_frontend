

export type Gender="Male" | "Female" | ""

export type DriverDTO={
    driver_id:string;
    user_id:string;
    first_name:string;
    last_name:string;
    friendly_name:string;
    date_of_birth:string;
    driver_plan:string;
    driver_nationality:string;
    driver_registered_at:string;
    driver_gender:Gender;
    driver_language:string;
    driver_bio:string;
    driver_password:string;

    driver_agency_name:string;
    driver_agency_date:string;
    driver_agency_description:string;
    driver_agency_services:string[];
    driver_agency_rate:number;
    driver_agency_rides:number;

    profile_photo_portrait_with_vehicle_immatrucation:string;
    driver_profile_image:string;
    driver_images: string[];
    driver_email: string;
    driver_phone_number: string;
    driver_license_number: string;
    driver_license_photo: string;
    driver_keywords: string[];
    driver_amenities: string[];
    driver_experiences: string[];
    driver_portfolio: string;
}


export const driverDTO:DriverDTO = {
    driver_id:"",
    user_id:"",
    first_name:"",
    last_name:"",
    friendly_name:"",
    date_of_birth:"",
    driver_plan:"",
    driver_nationality:"",
    driver_registered_at:"",
    driver_gender:'Male',
    driver_language:'',
    driver_bio:"",
    driver_password:"",

    driver_agency_name:"",
    driver_agency_date:"30/10/2015",
    driver_agency_description:"",
    driver_agency_services:[],
    driver_agency_rate:0,
    driver_agency_rides:0,

    profile_photo_portrait_with_vehicle_immatrucation:"",
    driver_profile_image:"",
    driver_images:[],
    driver_email: "",
    driver_phone_number: "",
    driver_license_number: "",
    driver_license_photo: "",
    driver_keywords: [],
    driver_amenities: [],
    driver_experiences:[],
    driver_portfolio: "",
}

