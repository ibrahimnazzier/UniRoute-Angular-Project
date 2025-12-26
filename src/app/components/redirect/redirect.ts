import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './redirect.html',
  styles: [`
    .spinner-border { width: 3rem; height: 3rem; }
  `]
})
export class RedirectComponent implements OnInit {

  companyName: string = '';
  logoUrl: string = '';
  externalUrl: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // 1. استقبال البيانات من الـ Query Params (أسهل من البحث بالـ ID مرة أخرى)
    this.route.queryParams.subscribe(params => {
      this.companyName = params['company'];
      this.logoUrl = params['logo'];
      this.externalUrl = params['url'];

      // 2. التحويل التلقائي بعد 2.5 ثانية
      if (this.externalUrl) {
        setTimeout(() => {
          // هذا الأمر يفتح الرابط الخارجي في نفس النافذة
          window.location.href = this.externalUrl;
          
          // أو استخدم هذا لفتحه في لسان جديد:
          // window.open(this.externalUrl, '_blank');
        }, 2500);
      }
    });
  }
}