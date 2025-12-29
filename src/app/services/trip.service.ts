import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// 👇 Import the correct interfaces we created
import { Trip, TripSearchResponse, CityResponse, Company } from '../models/trip.model';
import { Station, StationDeparture } from '../models/trip.model';
import { TripDetails } from '../models/trip.model';
@Injectable({
  providedIn: 'root'
})
export class TripService {

  // Your backend base URL
  private baseUrl = 'https://localhost:7152';

  constructor(private http: HttpClient) { }

  // 1. Get All Cities
  getAllCities(): Observable<CityResponse> {
    return this.http.get<CityResponse>(`${this.baseUrl}/Cities/GetAllCities`);
  }
  getStationsByCity(cityId: number): Observable<any> {
    // Ensure the parameter name matches your backend (e.g., 'cityId' or 'id')
    const params = new HttpParams().set('cityId', cityId); 
    return this.http.get<any>(`${this.baseUrl}/Station/GetStationsByCity`, { params });
  }

  // 5. Get Live Departures (The Board Data)
// 5. Get Live Departures (Updated)
  getStationDepartures(stationId: number, dateStr: string): Observable<StationDeparture[]> {
    // We send both 'stationId' and 'Date'
    const params = new HttpParams()
      .set('stationId', stationId)
      .set('Date', dateStr); // Matches the Swagger parameter name 'Date'

    return this.http.get<StationDeparture[]>(`${this.baseUrl}/Station/GetStationDepartures`, { params });
  }

  // 2. Search Trips
  // ⚠️ Return Type is now TripSearchResponse (the object with 'items' and 'totalCount')
 // trip.service.ts
getAllStations(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/Stations/GetAllStations`);
}

// 2. جلب الرحلات المغادرة من محطة معينة (Live Board)
getLiveStationBoard(stationId: number): Observable<any> {
  // افترضنا هنا أن الرابط هو /Stations/GetStationDepartures/station?StationId=...
  // يرجى تعديل الرابط إذا كان الـ API الخاص بك مختلفاً
  const params = new HttpParams().set('StationId', stationId);
  return this.http.get<any>(`${this.baseUrl}/Stations/GetStationDepartures/station`, { params });
}
searchTrips(searchData: any): Observable<TripSearchResponse> {
  let params = new HttpParams();

  // 1. Basic Params
  if (searchData.DepartureCityId) params = params.append('DepartureCityId', searchData.DepartureCityId);
  if (searchData.ArrivalCityId) params = params.append('ArrivalCityId', searchData.ArrivalCityId);
  if (searchData.TripDate) params = params.append('TripDate', searchData.TripDate);

  // 2. Pagination
  params = params.append('PageNumber', searchData.PageNumber || 1);
  params = params.append('PageSize', searchData.PageSize || 10);

  // 3. Price Filters
  if (searchData.MinPrice) params = params.append('MinPrice', searchData.MinPrice);
  if (searchData.MaxPrice) params = params.append('MaxPrice', searchData.MaxPrice);

  // 4. 👇 Company Filter (Handle Array for Checkboxes)
  if (searchData.CompanyIds && Array.isArray(searchData.CompanyIds)) {
    // Loop through the array and append 'CompanyId' multiple times
    // This creates a URL like: ...&CompanyId=1&CompanyId=5&CompanyId=9
    searchData.CompanyIds.forEach((id: number) => {
      params = params.append('CompanyId', id.toString());
    });
  } 
  // Handle single ID case (if legacy code uses it)
  else if (searchData.CompanyId) {
    params = params.append('CompanyId', searchData.CompanyId);
  }

  return this.http.get<TripSearchResponse>(`${this.baseUrl}/Trips/SearchTrips/search`, { params });
}
getTripsByCompany(companyId: number): Observable<any> {
  const params = new HttpParams().set('CompanyId', companyId);
  return this.http.get<any>(`${this.baseUrl}/Trips/GetTripsByCompany/company`, { params });
}
  // 6. Get Trip Details
getTripDetails(tripId: number): Observable<TripDetails> {
  const params = new HttpParams().set('TripId', tripId);
  return this.http.get<TripDetails>(`${this.baseUrl}/Trips/GetTripDetails/details`, { params });
}
  getAllCompanies(): Observable<Company[]> {
    // Note: Check if your API returns { companies: [...] } or just [...]
    // Based on Swagger, it likely returns the list directly or wrapped. 
    // I will assume it returns a direct list for now.
    return this.http.get<Company[]>(`${this.baseUrl}/Companies/GetAllCompanies`);
  }
}