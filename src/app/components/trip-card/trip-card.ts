import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../../models/trip.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-trip-card',
  imports: [TranslateModule, CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.scss',
})
export class TripCard {
@Input({ required: true }) trip!: Trip;

trips = [
    {
      id: 1,
      companyName: 'Go Bus',
      logoUrl: 'assets/gobus.png', // تأكد من وجود الصورة
      deptTime: '08:00 AM',
      deptStation: 'Tahrir',
      arrTime: '11:30 AM',
      arrStation: 'Alexandria',
      duration: '3h 30m',
      price: 210,
      currency: 'EGP',
      type: 'VIP',
      amenities: ['WiFi', 'WC', 'AC', 'Charger']
    },
    {
      id: 2,
      companyName: 'Blue Bus',
      logoUrl: 'assets/bluebus.png', // تأكد من وجود الصورة
      deptTime: '09:15 PM',
      deptStation: 'Nasr City',
      arrTime: '05:00 AM',
      arrStation: 'Dahab',
      duration: '7h 45m',
      price: 350,
      currency: 'EGP',
      type: 'Business',
      amenities: ['WiFi', 'WC', 'Meal', 'Tablet']
    }
  ];
  constructor(private router: Router) {}

onBookClick() {
  // Navigate to the internal Details Page
  this.router.navigate(['/trip', this.trip.tripId]);
}
}
