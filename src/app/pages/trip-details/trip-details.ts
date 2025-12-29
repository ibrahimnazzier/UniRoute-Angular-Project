import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripService } from '../../services/trip.service';
import { TripDetails } from '../../models/trip.model';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule ], // Import SharedModule or TranslateModule if needed
  templateUrl: './trip-details.html',
  styleUrls: ['./trip-details.scss']
})
export class TripDetailsComponent implements OnInit {
  trip: TripDetails | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    // Get ID from URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchDetails(+id);
    }
  }

  fetchDetails(id: number) {
    this.isLoading = true;
    this.tripService.getTripDetails(id).subscribe({
      next: (data) => {
        console.log('API RESPONSE FOR TRIP ' + id, data);
        this.trip = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching details', err);
        this.isLoading = false;
      }
    });
  }
}