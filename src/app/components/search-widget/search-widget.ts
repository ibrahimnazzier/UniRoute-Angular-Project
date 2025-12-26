import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; 
import { CommonModule } from '@angular/common';

interface Governorate {
  ar: string;
  en: string;
}

@Component({
  selector: 'app-search-widget',
  standalone: true,
  imports: [
    CommonModule,       
    ReactiveFormsModule, 
    FormsModule,        
    TranslateModule     
    
  ],
  // 👇 تأكد أن هذه المسارات تطابق أسماء ملفاتك الحالية
  templateUrl: './search-widget.html', 
  styleUrls: ['./search-widget.scss'],
})
export class SearchWidgetComponent {
  searchForm: FormGroup;
  isLoading = false;
  minDate = new Date().toISOString().split('T')[0];

  governorates: Governorate[] = [
    { ar: 'القاهرة', en: 'Cairo' },
    { ar: 'الجيزة', en: 'Giza' },
    { ar: 'الإسكندرية', en: 'Alexandria' },
    { ar: 'الدقهلية', en: 'Dakahlia' },
    { ar: 'الشرقية', en: 'Sharqia' },
    { ar: 'المنوفية', en: 'Monufia' },
    { ar: 'القليوبية', en: 'Qalyubia' },
    { ar: 'البحيرة', en: 'Beheira' },
    { ar: 'الغربية', en: 'Gharbia' },
    { ar: 'بورسعيد', en: 'Port Said' },
    { ar: 'دمياط', en: 'Damietta' },
    { ar: 'الإسماعيلية', en: 'Ismailia' },
    { ar: 'السويس', en: 'Suez' },
    { ar: 'كفر الشيخ', en: 'Kafr El Sheikh' },
    { ar: 'الفيوم', en: 'Fayoum' },
    { ar: 'بني سويف', en: 'Beni Suef' },
    { ar: 'المنيا', en: 'Minya' },
    { ar: 'أسيوط', en: 'Assiut' },
    { ar: 'سوهاج', en: 'Sohag' },
    { ar: 'قنا', en: 'Qena' },
    { ar: 'الأقصر', en: 'Luxor' },
    { ar: 'أسوان', en: 'Aswan' },
    { ar: 'البحر الأحمر', en: 'Red Sea' },
    { ar: 'الوادي الجديد', en: 'New Valley' },
    { ar: 'مطروح', en: 'Matrouh' },
    { ar: 'شمال سيناء', en: 'North Sinai' },
    { ar: 'جنوب سيناء', en: 'South Sinai' }
  ];

  filteredFromLocations: Governorate[] = [];
  filteredToLocations: Governorate[] = [];
  
  showFromList = false;
  showToList = false;

  constructor(private fb: FormBuilder, public translate: TranslateService) {
    this.searchForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onSearchInput(event: any, type: 'from' | 'to') {
    const value = event.target.value;
    
    if (type === 'from') {
      this.showFromList = true;
      this.filteredFromLocations = this._filter(value);
    } else {
      this.showToList = true;
      this.filteredToLocations = this._filter(value);
    }
  }

  private _filter(value: string): Governorate[] {
    const filterValue = value.toLowerCase();

    return this.governorates.filter(gov => 
      gov.ar.includes(value) ||               
      gov.en.toLowerCase().includes(filterValue) 
    );
  }

  selectOption(gov: Governorate, type: 'from' | 'to') {
    const selectedName = this.translate.currentLang === 'ar' ? gov.ar : gov.en;

    if (type === 'from') {
      this.searchForm.get('from')?.setValue(selectedName);
      this.showFromList = false;
    } else {
      this.searchForm.get('to')?.setValue(selectedName);
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
    if (this.searchForm.valid) {
      this.isLoading = true;
      // محاكاة الاتصال بالسيرفر
      setTimeout(() => this.isLoading = false, 2000);
    } else {
      this.searchForm.markAllAsTouched();
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
  }
}