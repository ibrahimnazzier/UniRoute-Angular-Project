import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


// Services & Models
import { TripService } from '../../services/trip.service';
import { Trip, Company, CityResponse, City } from '../../models/trip.model';
import { TripCard } from '../../components/trip-card/trip-card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-company-search',
  standalone: true,
  imports: [CommonModule, FormsModule, TripCard, TranslateModule],
  templateUrl: './company-search.html',
  styleUrls: ['./company-search.scss']
})
export class CompanySearchComponent implements OnInit {

  // Data Sources
  companies: Company[] = [];
  cities: City[] = [];
  
  // Trips Data
  allTrips: Trip[] = [];       // كل الرحلات القادمة من الـ API
  filteredTrips: Trip[] = [];  // الرحلات بعد الفلترة بالمدن

  // Form Selections
  selectedCompanyId: number | null = null;
  selectedFromCity: string = ''; // سنستخدم اسم المدينة للمقارنة السهلة
  selectedToCity: string = '';

  isLoading = false;
  hasSearched = false;

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadCities();
  }

  // 1. Load Dropdown Data
  loadCompanies() {
    this.tripService.getAllCompanies().subscribe({
      next: (res: any) => {
        // التعامل مع صيغ الاستجابة المختلفة كما فعلنا سابقاً
        if (res.companies) this.companies = res.companies;
        else if (Array.isArray(res)) this.companies = res;
        else this.companies = [];
      }
    });
  }

  loadCities() {
    this.tripService.getAllCities().subscribe({
      next: (res: CityResponse) => {
        // تأكد من هيكل الاستجابة (هل هي مصفوفة مباشرة أم داخل كائن)
        if (Array.isArray(res)) this.cities = res as any; 
        else if (res.cities) this.cities = res.cities;
      }
    });
  }

  // 2. Main Search Function (By Company)
  onCompanyChange() {
  if (!this.selectedCompanyId) return;

  this.isLoading = true;
  this.hasSearched = true;

  // 1. Find the selected company details (to get its logo)
  const selectedCompanyInfo = this.companies.find(c => c.companyId === this.selectedCompanyId);

  this.tripService.getTripsByCompany(this.selectedCompanyId).subscribe({
    next: (response: any) => {
      this.isLoading = false;
      
      let fetchedTrips = [];

      // Handle API structure
      if (response.trips && Array.isArray(response.trips)) {
        fetchedTrips = response.trips;
      } else if (Array.isArray(response)) {
        fetchedTrips = response;
      }

      // 👇 THE FIX: Manually add the logo to every trip
      if (selectedCompanyInfo) {
        fetchedTrips.forEach((trip: any) => {
          // Add the missing fields that the TripCard expects
          trip.companyName = selectedCompanyInfo.companyName;
          trip.companyLogoUrl = selectedCompanyInfo.logoUrl; 
        });
      }

      this.allTrips = fetchedTrips;

      // Apply City Filters
      this.applyFilters();
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Error loading company trips', err);
      this.allTrips = [];
      this.filteredTrips = [];
    }
  });
}
  // 3. Filter Logic (Client-Side for Cities)
  applyFilters() {
    this.filteredTrips = this.allTrips.filter(trip => {
      let match = true;

      // فلتر محطة القيام
      if (this.selectedFromCity) {
        // نستخدم includes لأن الاسم قد يختلف قليلاً (Cairo vs Cairo Gateway)
        if (!trip.departureCityName.toLowerCase().includes(this.selectedFromCity.toLowerCase())) {
          match = false;
        }
      }

      // فلتر محطة الوصول
      if (this.selectedToCity) {
        if (!trip.arrivalCityName.toLowerCase().includes(this.selectedToCity.toLowerCase())) {
          match = false;
        }
      }

      return match;
    });
  }

  // عند تغيير المدينة، فقط نفلتر البيانات الموجودة
  onCityChange() {
    this.applyFilters();
  }
}