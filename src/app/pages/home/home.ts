import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Form, FormBuilder, ReactiveFormsModule, FormGroup, Validators} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FeatureCardComponent } from '../../components/feature-card/feature-card';  
import { SearchWidgetComponent } from '../../components/search-widget/search-widget';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule,FeatureCardComponent , SearchWidgetComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
 
}