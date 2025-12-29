import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../../models/trip.model'; // 👇 استيراد الموديل الجديد

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.scss',
})
export class TripCard implements OnInit {
  
  // 👇 نستخدم الموديل الجديد هنا
  @Input({ required: true }) trip!: Trip;

  displayArrivalTime: string = '';
  displayDuration: string = '';
  // 👇 هذه المصفوفة ستظل فارغة لأن الـ Search API لا يرسل مميزات
  displayAmenities: string[] = []; 

  constructor(private router: Router) {}

  ngOnInit() {
    this.processTripData();
  }

  processTripData() {
    // 1. معالجة وقت الوصول
    if (this.trip.arrivalTime) {
      this.displayArrivalTime = this.trip.arrivalTime;
    } else {
      // حساب 5 ساعات افتراضية لأن الباك إند يرسل null
      this.displayArrivalTime = this.addHoursToTime(this.trip.departureTime, 5);
    }

    // 2. معالجة المدة
    if (this.trip.duration) {
      this.displayDuration = this.trip.duration;
    } else {
      this.displayDuration = '5h 00m';
    }

    // 3. معالجة المميزات
    // الـ Search API لا يرسل amenities، لذلك هذا الكود سيجعلها فارغة
    // ✅ هذا هو الصحيح، لا يجب أن نعرض أيقونات وهمية للمستخدم
    if (this.trip.amenities && Array.isArray(this.trip.amenities)) {
       this.displayAmenities = this.trip.amenities;
    } else {
       this.displayAmenities = []; // ستختفي الأيقونات من الكارت
    }
  }

  // دالة الحساب
  private addHoursToTime(timeStr: string, hoursToAdd: number): string {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    hours = (hours + hoursToAdd) % 24;
    return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
  }

  onBookClick() {
    // عند الضغط، نرسل المستخدم لصفحة التفاصيل باستخدام الـ tripId
    this.router.navigate(['/trip', this.trip.tripId]);
  }
}