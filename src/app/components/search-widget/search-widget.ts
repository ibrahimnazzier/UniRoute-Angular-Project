import { Component, OnInit, OnDestroy } from '@angular/core'; // 👈 Added OnDestroy
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; 
import { CommonModule } from '@angular/common';
import { TripService } from '../../services/trip.service'; 
import { Router, RouterModule } from '@angular/router'; 
import { Trip, City } from '../../models/trip.model'; 
import { Subscription } from 'rxjs'; // 👈 Added Subscription

@Component({
  selector: 'app-search-widget',
  standalone: true,
  imports: [
    CommonModule,       
    ReactiveFormsModule, 
    FormsModule,        
    TranslateModule,
    RouterModule 
  ],
  templateUrl: './search-widget.html', 
  styleUrls: ['./search-widget.scss'],
})
export class SearchWidgetComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  isLoading = false;
  minDate = new Date().toISOString().split('T')[0];

  // Raw data from API
  allCities: City[] = []; 
  
  // Filtered lists for the dropdowns
  filteredFromCities: City[] = [];
  filteredToCities: City[] = [];

  // We store the selected IDs here to send them to the backend later
  selectedFromCityId: number | null = null;
  selectedToCityId: number | null = null;
  
  showFromList = false;
  showToList = false;

  // 👇 Regex to detect Arabic Characters
  private readonly ARABIC_REGEX = /[\u0600-\u06FF]/;
  
  // 👇 To handle memory leaks
  private langSub: Subscription | undefined;

  constructor(
    private fb: FormBuilder, 
    public translate: TranslateService, 
    private tripService: TripService, 
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit() {
    // 1. Fetch cities
    this.tripService.getAllCities().subscribe({
      next: (response) => {
        this.allCities = response.cities;
      },
      error: (err) => console.error('Error fetching cities:', err)
    });

    // 2. 👇 Monitor Language Changes
    // If user switches language, we clear the inputs because "Cairo" is invalid in Arabic view
    this.langSub = this.translate.onLangChange.subscribe(() => {
        this.clearInputs();
    });
  }

  // 👇 Cleanup when component is destroyed
  ngOnDestroy() {
    if (this.langSub) this.langSub.unsubscribe();
  }

  clearInputs() {
    this.searchForm.patchValue({ from: '', to: '' });
    this.selectedFromCityId = null;
    this.selectedToCityId = null;
    this.filteredFromCities = [];
    this.filteredToCities = [];
  }

  onSearchInput(event: any, type: 'from' | 'to') {
    const value = event.target.value;
    
    // Reset ID on typing
    if (type === 'from') this.selectedFromCityId = null;
    else this.selectedToCityId = null;

    if (type === 'from') {
      this.showFromList = true;
      this.filteredFromCities = this._filter(value);
    } else {
      this.showToList = true;
      this.filteredToCities = this._filter(value);
    }
  }

  // 👇 UPDATED FILTER LOGIC
  private _filter(value: string): City[] {
    const filterValue = value.toLowerCase();
    const currentLang = this.translate.currentLang || 'ar'; // Default to Arabic

    return this.allCities.filter(city => {
      // 1. Check Language Compatability
      const isArabicName = this.ARABIC_REGEX.test(city.cityName);
      
      // If Lang is AR, we want names that ARE Arabic.
      // If Lang is EN, we want names that are NOT Arabic.
      const matchesLanguage = (currentLang === 'ar') ? isArabicName : !isArabicName;

      // 2. Check Search Text Match
      const matchesSearch = city.cityName.toLowerCase().includes(filterValue);

      return matchesLanguage && matchesSearch;
    });
  }

  selectOption(city: City, type: 'from' | 'to') {
    if (type === 'from') {
      this.searchForm.get('from')?.setValue(city.cityName);
      this.selectedFromCityId = city.cityId;
      this.showFromList = false;
    } else {
      this.searchForm.get('to')?.setValue(city.cityName); 
      this.selectedToCityId = city.cityId;
      this.showToList = false;
    }
  }

  hideListDelayed(type: 'from' | 'to') {
    setTimeout(() => {
      if (type === 'from') this.showFromList = false;
      else this.showToList = false;
    }, 200);
  }

onSubmit() {
  if (this.searchForm.valid && this.selectedFromCityId && this.selectedToCityId) {
    this.isLoading = true;

    const apiPayload = {
      DepartureCityId: this.selectedFromCityId,
      ArrivalCityId: this.selectedToCityId,
      TripDate: this.searchForm.get('date')?.value,
      PageNumber: 1,
      PageSize: 20
    };

    this.tripService.searchTrips(apiPayload).subscribe({
      next: (response: any) => { 
        this.isLoading = false;

        // 👇 CORRECT LOGIC FOR YOUR RESPONSE STRUCTURE
        // The API returns { items: [...], totalCount: 7, ... }
        if (response && response.items) {
          
          this.router.navigate(['/search-result'], { 
            state: { 
              tripsData: response.items, // 👈 Send ONLY the items array
              searchParams: apiPayload,
              totalCount: response.totalCount // Optional: Send count if you want to show "7 Trips Found"
            } 
          });

        } else {
          // Fallback if list is empty
          this.router.navigate(['/search-result'], { 
            state: { 
              tripsData: [], 
              searchParams: apiPayload,
              backendMessage: "No trips found."
            } 
          });
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Search Error:', err);
        alert('Error searching trips.');
      }
    });

  } else {
    // ... validation error handling
  }
}
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.searchForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  
  swapLocations() {
      const fromValue = this.searchForm.get('from')?.value;
      const toValue = this.searchForm.get('to')?.value;
      
      this.searchForm.patchValue({
        from: toValue,
        to: fromValue
      });

      const tempId = this.selectedFromCityId;
      this.selectedFromCityId = this.selectedToCityId;
      this.selectedToCityId = tempId;
  }
}