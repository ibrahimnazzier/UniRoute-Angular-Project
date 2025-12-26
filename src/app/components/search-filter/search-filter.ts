import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- هام جداً للـ Checkbox و Input

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.html',
  styleUrls: ['./search-filter.scss']
})
export class SearchFilterComponent {

  @Output() filterChange = new EventEmitter<any>();

  filters = {
    priceMin: null,
    priceMax: null,
    companies: {} as { [key: string]: boolean }, // سنستخدم Object لسهولة التعامل مع Checkbox
    busType: {} as { [key: string]: boolean },
    amenities: {} as { [key: string]: boolean }
  };

  availableCompanies = ['Go Bus', 'Blue Bus', 'Super Jet', 'West Delta'];
  availableTypes = ['VIP', 'Business', 'Classic', 'Elite'];
  availableAmenities = ['WiFi', 'WC', 'AC', 'Meal', 'Charger'];

  onFilterChange() {
    const activeCompanies = Object.keys(this.filters.companies).filter(key => this.filters.companies[key]);
    const activeTypes = Object.keys(this.filters.busType).filter(key => this.filters.busType[key]);
    const activeAmenities = Object.keys(this.filters.amenities).filter(key => this.filters.amenities[key]);

    this.filterChange.emit({
      priceMin: this.filters.priceMin,
      priceMax: this.filters.priceMax,
      companies: activeCompanies,
      busType: activeTypes,
      amenities: activeAmenities
    });
  }
}