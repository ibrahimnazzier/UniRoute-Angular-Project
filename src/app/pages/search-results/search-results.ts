import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms'; 

// Models & Services
import { Trip, Company } from '../../models/trip.model';
import { TripService } from '../../services/trip.service'; 
import { TripCard } from '../../components/trip-card/trip-card';
import { PaginationComponent } from '../../components/pagination/pagination';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [TripCard, CommonModule, TranslateModule, PaginationComponent, FormsModule],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults implements OnInit {

  // --- Data ---
  trips: Trip[] = [];         // Raw data from Server
  filteredTrips: Trip[] = []; // Data after Client Filters
  displayTrips: Trip[] = [];  // Data for current Page
  
  companies: Company[] = []; 
  
  // --- Server Filters (API) ---
  selectedCompanyIds: number[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  
  // --- Client Filters (Local) ---
  // These options should match what 'busTypeName' usually returns
  busTypes = ['VIP', 'Economy', 'Royal', 'Business', 'Smart', 'Elite'];
  amenities = ['WiFi', 'WC', 'AC', 'Charger', 'Meal', 'Tablet', 'Video'];
  
  selectedBusTypes: string[] = [];
  selectedAmenities: string[] = [];

  // --- Search State ---
  searchParams: any = {}; 
  isLoading = false;

  // --- Pagination ---
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;

  constructor(
    private router: Router,
    private tripService: TripService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      if (navigation.extras.state['tripsData']) {
        this.trips = navigation.extras.state['tripsData'];
      }
      if (navigation.extras.state['searchParams']) {
        this.searchParams = navigation.extras.state['searchParams'];
      }
    } 
  }

  ngOnInit() {
    this.filteredTrips = [...this.trips]; 
    this.totalItems = this.filteredTrips.length;
    this.updateDisplayTrips();
    this.loadCompanies();
  }

  // 1. Load Companies
  loadCompanies() {
    this.tripService.getAllCompanies().subscribe({
      next: (response: any) => {
        // Handle { companies: [...] } structure based on your JSON logs
        if (response.companies && Array.isArray(response.companies)) {
          this.companies = response.companies;
        } else if (response.items && Array.isArray(response.items)) {
          this.companies = response.items;
        } else if (Array.isArray(response)) {
          this.companies = response;
        } else {
          this.companies = [];
        }
      },
      error: (err) => console.error('Failed to load companies', err)
    });
  }

  // --- SERVER FILTER HANDLERS (Trigger API Call) ---

  toggleCompanyFilter(companyId: number, event: any) {
    if (event.target.checked) this.selectedCompanyIds.push(companyId);
    else this.selectedCompanyIds = this.selectedCompanyIds.filter(id => id !== companyId);
    this.applyServerFilters();
  }

  onPriceFilterChange() {
    this.applyServerFilters();
  }

  // --- CLIENT FILTER HANDLERS (Filter Locally) ---

  toggleBusTypeFilter(type: string, event: any) {
    if (event.target.checked) this.selectedBusTypes.push(type);
    else this.selectedBusTypes = this.selectedBusTypes.filter(t => t !== type);
    this.applyClientFilters();
  }

  toggleAmenityFilter(amenity: string, event: any) {
    if (event.target.checked) this.selectedAmenities.push(amenity);
    else this.selectedAmenities = this.selectedAmenities.filter(a => a !== amenity);
    this.applyClientFilters();
  }

  // --- FILTER LOGIC ---

  // A. Server Side (Calls API)
  applyServerFilters() {
    this.isLoading = true;

    const requestPayload = {
      ...this.searchParams, 
      MinPrice: this.minPrice,
      MaxPrice: this.maxPrice,
      CompanyIds: this.selectedCompanyIds 
    };

    this.tripService.searchTrips(requestPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.trips = response.items || [];
        // After getting new data, re-apply local filters (Class/Amenities)
        this.applyClientFilters();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Filter error', err);
      }
    });
  }

  // B. Client Side (Filters Memory Array)
  applyClientFilters() {
    let result = [...this.trips];

    // Filter by Bus Type (Matching 'busTypeName' string)
    if (this.selectedBusTypes.length > 0) {
      result = result.filter(trip => 
        trip.busTypeName && this.selectedBusTypes.some(selected => 
          trip.busTypeName.toLowerCase().includes(selected.toLowerCase())
        )
      );
    }

    // Filter by Amenities (Matching 'amenities' string array)
    if (this.selectedAmenities.length > 0) {
      result = result.filter(trip => {
        // If amenities is null/undefined, safe fail
        if (!trip.amenities) return false;
        // Trip must have ALL selected amenities
        return this.selectedAmenities.every(a => trip.amenities!.includes(a));
      });
    }

    this.filteredTrips = result;
    this.totalItems = this.filteredTrips.length;
    this.currentPage = 1;
    this.updateDisplayTrips();
  }

  resetFilters() {
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedCompanyIds = [];
    this.selectedBusTypes = [];
    this.selectedAmenities = [];
    
    // Reload data from server
    this.applyServerFilters();
  }

  // --- PAGINATION ---
  updateDisplayTrips() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayTrips = this.filteredTrips.slice(startIndex, endIndex);
    
    // Auto-fix if page becomes empty after filtering
    if (this.displayTrips.length === 0 && this.totalItems > 0) {
        this.currentPage = Math.ceil(this.totalItems / this.itemsPerPage);
        const newStart = (this.currentPage - 1) * this.itemsPerPage;
        this.displayTrips = this.filteredTrips.slice(newStart, newStart + this.itemsPerPage);
    }
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updateDisplayTrips();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}