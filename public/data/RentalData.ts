enum FuelCondition {
    FULL_TO_FULL = "FULL_TO_FULL",
    EMPTY_TO_EMPTY = "EMPTY_TO_EMPTY",
    FULL_TO_EMPTY = "FULL_TO_EMPTY"
}
enum FuelType {
  Liquefied_Petroleum_Gas = "Liquefied_Petroleum_Gas",
  Ethanol = "Ethanol",
  Gasoline = "Gasoline",
  Diesel = "Diesel",
  Electric = "Electric",
  Hybrid = "Hybrid",
  Hydrogen = "Hydrogen",
  Biodiesel = "Biodiesel",
}



export interface RentalData {
    rentalId: string;
    cost: number;
    fromDate: Date;
    toDate: Date;
    fuelCondition: FuelCondition;
    fuelType: FuelType;
    city: string;
    mileage: number;
    numberOfPlaces: number;
    vehicleType: string;
}
