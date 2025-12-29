import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TripService } from '../../services/trip.service';
import { City, Station, StationDeparture } from '../../models/trip.model';

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

@Component({
  selector: 'app-live-board',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule ],
  templateUrl: './live-board.html',
  styleUrls: ['./live-board.scss']
})
export class LiveBoardComponent implements OnInit {
  
  cities: City[] = [];
  stations: Station[] = [];
  
  allDepartures: StationDeparture[] = []; 
  filteredDepartures: StationDeparture[] = []; 

  selectedCityId: number | null = null;
  selectedStationId: number | null = null;
  selectedDate: string = getTodayString();
  searchTerm: string = '';

  isLoading = false;

  constructor(private tripService: TripService) { }

  ngOnInit() {
    this.loadCities();
  }

  // 1. Load Cities
  loadCities() {
    this.tripService.getAllCities().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) this.cities = response;
        else if (response.cities) this.cities = response.cities;
        else if (response.items) this.cities = response.items;
      },
      error: (err) => console.error('Error loading cities', err)
    });
  }

  // 2. City Changed -> Load Stations
  onCityChange() {
    this.stations = [];
    this.allDepartures = [];
    this.filteredDepartures = [];
    this.selectedStationId = null;

    if (this.selectedCityId) {
      this.tripService.getStationsByCity(this.selectedCityId).subscribe({
        next: (response: any) => {
          console.log('Stations Response:', response);
          if (Array.isArray(response)) this.stations = response;
          else if (response.stations) this.stations = response.stations;
          else if (response.items) this.stations = response.items;
        },
        error: (err) => console.error('Error loading stations', err)
      });
    }
  }

  // 3. Station Changed -> Fetch Board
  onStationChange() {
    this.fetchBoardData();
  }

  refreshBoard() {
    this.fetchBoardData();
  }

  fetchBoardData() {
    if (!this.selectedStationId) return;

    this.isLoading = true;
    this.allDepartures = [];
    this.filteredDepartures = [];

    this.tripService.getStationDepartures(this.selectedStationId, this.selectedDate).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        if (response.trips && Array.isArray(response.trips)) {
           this.allDepartures = response.trips;
        } else if (Array.isArray(response)) {
           this.allDepartures = response;
        }

        this.filterBoard();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading board', err);
      }
    });
  }

  filterBoard() {
    if (!this.searchTerm) {
      this.filteredDepartures = this.allDepartures;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredDepartures = this.allDepartures.filter(trip => 
        (trip.destinationCityName && trip.destinationCityName.toLowerCase().includes(term)) || 
        (trip.companyName && trip.companyName.toLowerCase().includes(term))
      );
    }
  }
}