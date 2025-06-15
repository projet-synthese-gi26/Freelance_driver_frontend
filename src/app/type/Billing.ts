export type BillingType={
    id:number; 
    country:string;
    city:string;
    street:string;
    postalCode:string;  
    select:boolean;
}

export type AdressFormData={
    street:string;
    city:string;
    postalCode:string;
    country:string;
}