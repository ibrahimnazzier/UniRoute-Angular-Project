import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  private translate = inject(TranslateService);
  
  // لحقن الـ Document بشكل آمن مع SSR
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // دالة تغيير اللغة
  changeLang(lang: string) {
    this.translate.use(lang);
    
    // تغيير اتجاه الصفحة (RTL/LTR) فقط إذا كنا في المتصفح
    if (isPlatformBrowser(this.platformId)) {
      const htmlTag = this.document.getElementsByTagName('html')[0];
      htmlTag.setAttribute('lang', lang);
      htmlTag.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }
  }

  // دالة مساعدة لمعرفة اللغة الحالية
  get currentLang() {
    return this.translate.currentLang;
  }
}