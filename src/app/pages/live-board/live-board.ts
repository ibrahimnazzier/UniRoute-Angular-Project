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
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './live-board.html',
  styleUrls: ['./live-board.scss']
})
export class LiveBoardComponent implements OnInit {
  selectedDate: string = getTodayString();  // Dropdown Data
  cities: City[] = [];
  stations: Station[] = [];

  // Selections
  selectedCityId: number | null = null;
  selectedStationId: number | null = null;

  // Board Data
  departures: StationDeparture[] = [];
  isLoading = false;

  constructor(private tripService: TripService) { }

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.tripService.getAllCities().subscribe({
      next: (response: any) => {
        // 👇 Check if data is inside an object or is a direct array
        if (Array.isArray(response)) {
          this.cities = response;
        } else if (response.cities && Array.isArray(response.cities)) {
          this.cities = response.cities;
        } else if (response.items && Array.isArray(response.items)) {
          this.cities = response.items;
        } else {
          this.cities = [];
        }
      },
      error: (err) => console.error('Error loading cities', err)
    });
  }

  // When User Selects a City -> Load Stations
  // When User Selects a City -> Load Stations
  onCityChange() {
    this.stations = [];
    this.departures = [];
    this.selectedStationId = null;

    if (this.selectedCityId) {
      this.tripService.getStationsByCity(this.selectedCityId).subscribe({
        next: (response: any) => {
          // 👇 ADD THIS LINE TO SEE THE DATA IN CONSOLE
          console.log('API Response:', response);

          // Attempt to find the list
          if (Array.isArray(response)) {
            this.stations = response;
          } else if (response.items) {
            this.stations = response.items;
          } else if (response.stations) {
            this.stations = response.stations;
          } else {
            // If we can't find it, log a warning
            console.warn('Could not find array in response:', response);
          }
        },
        error: (err) => console.error('Error loading stations', err)
      });
    }
  }

  // When User Selects a Station -> Load Departures
onStationChange() {
    this.departures = [];
    
    if (this.selectedStationId) {
      this.isLoading = true;

      // نرسل المحطة والتاريخ
      this.tripService.getStationDepartures(this.selectedStationId, this.selectedDate).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('API Response:', response); // للتأكد

          // 👇👇 التعديل الأساسي هنا: البحث عن property اسمه "trips" 👇👇
          if (response.trips && Array.isArray(response.trips)) {
             this.departures = response.trips;
          } 
          // احتياطي للحالات الأخرى
          else if (Array.isArray(response)) {
             this.departures = response;
          } 
          else {
             this.departures = [];
             console.warn('لم يتم العثور على رحلات في الاستجابة', response);
          }
        },
        error: (err) => {
          console.error('Error loading schedule', err);
          this.isLoading = false;
        }
      });
    }
  }
}