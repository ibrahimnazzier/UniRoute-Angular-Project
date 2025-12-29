// trip.model.ts

export interface TripSearchResponse {
  items: Trip[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
export interface Company {
  companyId: number;
  companyName: string;
  logoUrl?: string;
  // Add logo or other fields if the API returns them
}
//--- detailed trip interface  */
// Add these to your existing trip.model.ts
// models/trip.model.ts

export interface TripDetails {
  tripId: number;
  // 👇 Add '?' to these nested objects so TypeScript knows they might be null
  company?: CompanyDetails; 
  departureStation?: StationDetails;
  arrivalStation?: StationDetails;
  
  tripDate: string;
  departureTime: string;
  arrivalTime: string | null; 
  duration: string | null;
  
  // 👇 This was the specific cause of your error (reading 'typeName' of null)
  busType?: BusType; 
  
  price: number;
  currency?: string; 
  tripFeatures: string[];
  tripStops: TripStop[];
  externalUrl: string | null;
}

// Ensure these sub-interfaces are also defined in the file:
export interface CompanyDetails {
  companyId: number;
  companyName: string;
  website: string;
  phoneNumber: string;
  logoUrl: string;
}

export interface StationDetails {
  stationId: number;
  stationName: string;
  cityName: string;
  address: string;
}

export interface BusType {
  busTypeId: number;
  typeName: string;
  description: string;
}

export interface TripStop {
  stationId: number;
  stationName: string;
  stopOrder: number;
  arrivalTime: string | null;
  departureTime: string | null;
}
//******Live station board   */
export interface Station {
  stationId: number;
  stationName: string;
}

export interface StationDeparture {
  tripId: number;
  companyName: string;
  companyLogoUrl?: string;
  destinationCityName: string; // Where is it going?
  departureTime: string;       // "15:30:00"
  busTypeName: string;
  price: number;
  status?: string;             // Optional: "On Time", "Delayed"
}
//******Search Params  */
export interface SearchParams {
  from: string;
  to: string;
  date: string;
}

export interface City {
  cityId: number;
  cityName: string;
}

export interface CityResponse {
  cities: City[];
}

export interface Trip {
    // 👇 Matches API: "tripId"
    tripId: number;
    
    // 👇 Matches API: "companyId" (Added this)
    companyId: number; 

    // 👇 Matches API: "companyName"
    companyName: string;

    // 👇 Matches API: "companyLogoUrl" (nullable in API)
    companyLogoUrl?: string; 

    // 👇 Matches API: "price"
    price: number;

    // 👇 Matches API: "busTypeName"
    busTypeName: string;

    // ---------------------------------------------------------
    // ⚠️ CRITICAL CHANGES BELOW: Renamed to match API exactly
    // ---------------------------------------------------------

    // Was 'sourceCityName' -> Changed to 'departureCityName'
    departureCityName: string;

    // Was 'sourceStationName' -> Changed to 'departureStationName'
    departureStationName: string;

    // Matches API: "tripDate"
    tripDate: string;

    // Matches API: "departureTime"
    departureTime: string;

    // Was 'destinationCityName' -> Changed to 'arrivalCityName'
    arrivalCityName: string;

    // Was 'destinationStationName' -> Changed to 'arrivalStationName'
    arrivalStationName: string;

    // Matches API: "arrivalTime" (nullable in API)
    arrivalTime?: string;

    // Matches API: "duration" (nullable in API)
    duration?: string;

    // Was 'bookingUrl' -> Changed to 'externalUrl' to match API
    externalUrl?: string; 

    // ---------------------------------------------------------
    // Optional UI fields (not in API currently, but useful for UI)
    // ---------------------------------------------------------
    amenities?: string[];
    currency?: string; // You might want to default this to "EGP" in the UI
}