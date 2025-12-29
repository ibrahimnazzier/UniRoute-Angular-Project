// src/app/models/trip.model.ts

// 1. Search Response Wrapper
export interface TripSearchResponse {
  items: Trip[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// 2. Common Shared Interfaces
export interface Company {
  companyId: number;
  companyName: string;
  logoUrl?: string;
}

export interface City {
  cityId: number;
  cityName: string;
}

export interface CityResponse {
  cities: City[];
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
}

// ==========================================
// 3. TRIP CARD MODEL (For Search Results List)
// Matches: /Trips/SearchTrips/search
// ==========================================
export interface Trip {
  tripId: number;
  companyId: number;
  companyName: string;
  companyLogoUrl?: string; // Nullable in API
  
  departureCityName: string;
  departureStationName: string;
  
  arrivalCityName: string;
  arrivalStationName: string;
  
  tripDate: string;
  departureTime: string;
  
  // 👇 تحديث: السماح بـ null صراحة لأن الـ API يرسلها هكذا
  arrivalTime: string | null; 
  duration: string | null;
  
  busTypeName: string;
  price: number;
  externalUrl?: string;

  // 👇 UI Helper fields (Optional)
  // تذكر: الـ Search API لا يرسل هذه البيانات حالياً
  // سنملؤها يدوياً أو نتركها فارغة في الـ Card
  amenities?: string[]; 
  currency?: string; 
}

// ==========================================
// 4. TRIP DETAILS MODEL (For Single Trip Page)
// Matches: /Trips/GetTripDetails/details
// ==========================================
export interface TripDetails {
  tripId: number;
  // 👇 Nested Objects might be null coming from backend
  company?: CompanyDetails; 
  departureStation?: StationDetails;
  arrivalStation?: StationDetails;
  
  tripDate: string;
  departureTime: string;
  arrivalTime: string | null; 
  duration: string | null;
  
  busType?: BusType; 
  
  price: number;
  
  // 👇 لاحظ الاسم هنا يختلف عن الـ Trip (حسب الـ API)
  tripFeatures: string[]; 
  
  tripStops: TripStop[];
  externalUrl: string | null;
}

// --- Sub-Interfaces for Details ---
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

// ==========================================
// 5. LIVE BOARD MODEL
// ==========================================
export interface Station {
  stationId: number;
  stationName: string;
}

export interface StationDeparture {
  tripId: number;
  companyName: string;
  companyLogoUrl?: string;
  destinationCityName: string;
  departureTime: string;
  busTypeName: string;
  price: number;
  status?: string; // Optional: "On Time", "Delayed"
}