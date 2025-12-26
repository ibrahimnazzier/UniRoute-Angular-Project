import { Component } from '@angular/core';
import { Trip } from '../../models/trip.model';
import { TripCard } from '../../components/trip-card/trip-card';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../components/pagination/pagination';
import { SearchFilterComponent } from '../../components/search-filter/search-filter';

@Component({
  selector: 'app-search-results',
  imports: [TripCard, CommonModule, TranslateModule, PaginationComponent, SearchFilterComponent],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults {

  trips: Trip[] = [
    {
      tripId: 1,
      companyName: 'Go Bus',
      companyLogoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe2ouJUHIH8nNUZW62pEZQqrdNnnja6on4Jw&s', // تأكد من وجود الصورة
      departureTime: '08:00 AM',
      sourceStationName: 'Tahrir',
      sourceCityName: 'Cairo',
      arrivalTime: '11:30 AM',
      destinationStationName: 'Alexandria',
      destinationCityName: 'Alexandria',
      tripDate: '2023-10-25',
      duration: '3h 30m',
      price: 210,
      currency: 'EGP',
      busTypeName: 'VIP',
      amenities: ['WiFi', 'WC', 'AC', 'Charger'],
      bookingUrl: ''
    },
    {
      tripId: 2,
      companyName: 'Blue Bus',
      companyLogoUrl: 'assets/bluebus.png', // تأكد من وجود الصورة
      departureTime: '09:15 PM',
      sourceStationName: 'Nasr City',
      sourceCityName: 'Cairo', // Added property
      arrivalTime: '05:00 AM',
      destinationStationName: 'Dahab',
      destinationCityName: 'South Sinai', // Added property
      tripDate: '2023-10-25', // Added property (adjust format as needed)

      duration: '7h 45m',
      price: 350,
      currency: 'EGP',
      busTypeName: 'Business',
      amenities: ['WiFi', 'WC', 'Meal', 'Tablet'],
      bookingUrl: ''
    },
    {
      tripId: 3, companyName: 'Super Jet', companyLogoUrl: 'assets/gobus.png', departureTime: '10:00 AM', sourceStationName: 'Ramses', sourceCityName: 'Cairo', arrivalTime: '02:00 PM', destinationStationName: 'Hurghada', destinationCityName: 'Red Sea', tripDate: '2023-10-25', duration: '4h', price: 200, currency: 'EGP', busTypeName: 'Classic', amenities: ['AC'],
      bookingUrl: ''
    },
    {
      tripId: 4, companyName: 'Go Bus', companyLogoUrl: 'assets/gobus.png', departureTime: '01:00 PM', sourceStationName: 'Tahrir', sourceCityName: 'Cairo', arrivalTime: '04:30 PM', destinationStationName: 'Sidi Gaber', destinationCityName: 'Alexandria', tripDate: '2023-10-25', duration: '3h 30m', price: 220, currency: 'EGP', busTypeName: 'Elite', amenities: ['WiFi', 'AC'],
      bookingUrl: ''
    },
    {
      tripId: 5, companyName: 'West Delta', companyLogoUrl: 'assets/gobus.png', departureTime: '07:00 AM', sourceStationName: 'Alex', sourceCityName: 'Alexandria', arrivalTime: '10:00 AM', destinationStationName: 'Cairo', destinationCityName: 'Cairo', tripDate: '2023-10-25', duration: '3h', price: 150, currency: 'EGP', busTypeName: 'Standard', amenities: ['AC'],
      bookingUrl: ''
    },
    {
      tripId: 6, companyName: 'Blue Bus', companyLogoUrl: 'assets/bluebus.png', departureTime: '11:00 PM', sourceStationName: 'Ramses', sourceCityName: 'Cairo', arrivalTime: '06:00 AM', destinationStationName: 'Sharm', destinationCityName: 'South Sinai', tripDate: '2023-10-25', duration: '7h', price: 400, currency: 'EGP', busTypeName: 'First Class', amenities: ['WiFi', 'Meal', 'WC'],
      bookingUrl: ''
    }
  ];
  displayTrips: Trip[] = [];  // هذه المصفوفة التي ستعرض في HTML

  // إعدادات الـ Pagination
  currentPage = 1;
  itemsPerPage = 5; // اعرض 5 رحلات فقط في كل صفحة
  totalItems = 0;

  filteredTrips: Trip[] = []; // مصفوفة جديدة للبيانات المفلترة
  ngOnInit() {
    this.totalItems = this.trips.length;
    this.updateDisplayTrips();
  }

  // هذه الدالة تقطع المصفوفة وتعرض الجزء المطلوب فقط
  onFilterApplied(filter: any) {
    this.filteredTrips = this.trips.filter(trip => {

      // 1. فلتر السعر
      if (filter.priceMin && trip.price < filter.priceMin) return false;
      if (filter.priceMax && trip.price > filter.priceMax) return false;

      // 2. فلتر الشركات (إذا اختار المستخدم شيئاً، يجب أن تكون الشركة موجودة)
      if (filter.companies.length > 0 && !filter.companies.includes(trip.companyName)) return false;

      // 3. فلتر النوع
      if (filter.busType.length > 0 && !filter.busType.includes(trip.busTypeName)) return false;

      // 4. فلتر الخدمات (يجب أن تحتوي الرحلة على كل الخدمات المختارة - OR Logic depends on requirement)
      // هنا سنستخدم منطق: إذا اختار خدمة، يجب أن تكون متوفرة في الرحلة
      // 4. فلتر الخدمات
      if (filter.amenities && filter.amenities.length > 0) {
        const hasAllAmenities = filter.amenities.every((a: string) =>
          (trip.amenities || []).includes(a) // <--- التعديل هنا
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });

    // إعادة ضبط الترقيم للصفحة الأولى وتحديث العرض
    this.currentPage = 1;
    this.totalItems = this.filteredTrips.length;
    this.updateDisplayTrips();
  }

  updateDisplayTrips() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    // لاحظ: نأخذ الآن من filteredTrips وليس allTrips
    this.displayTrips = this.filteredTrips.slice(startIndex, endIndex);
  }
  // دالة تستقبل الحدث من الـ Pagination Component
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updateDisplayTrips();
    // يفضل عمل Scroll لأعلى الصفحة عند تغيير الصفحة
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
