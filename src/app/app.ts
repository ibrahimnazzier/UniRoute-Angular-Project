import { Component, signal, inject, PLATFORM_ID } from '@angular/core'; // 1. استيراد PLATFORM_ID
import { RouterOutlet } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core'; 
import { NavbarComponent } from './components/navbar/navbar';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // 2. استيراد isPlatformBrowser

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID); // 3. حقن معرف المنصة

  constructor() {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    
    const startLang = 'ar'; 
    this.translate.use(startLang);

    // استدعاء الدالة
    this.updateDirection(startLang);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateDirection(event.lang);
    });
  }

  protected readonly title = signal('UniRoute');

  private updateDirection(lang: string) {
    // 4. الشرط السحري: هل نحن في المتصفح؟
    if (isPlatformBrowser(this.platformId)) {
      // هذا الكود لن يعمل إلا داخل المتصفح، ولن يسبب خطأ في السيرفر
      if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
      }
    }
  }
}