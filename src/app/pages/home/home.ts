import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Form, FormBuilder, ReactiveFormsModule, FormGroup, Validators} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FeatureCardComponent } from '../../components/feature-card/feature-card';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, FeatureCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private fb =inject(FormBuilder);
  private router = inject(Router);


searchForm: FormGroup = this.fb.group({
    from: ['', Validators.required],
    to: ['', Validators.required],
    date: ['', Validators.required]
  });
  onSubmit() {
    if (this.searchForm.valid) {
      this.router.navigate(['/results'], { 
        queryParams: this.searchForm.value 
      });
    }
  }
}