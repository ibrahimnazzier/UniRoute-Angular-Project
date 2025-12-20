import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core'; // 1. استيراد السيرفسimport { Home } from "./pages/home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private translate = inject(TranslateService);

  constructor() {
    // 3. هذه هي الخطوة المفقودة!
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en'); // اللغة الاحتياطية
    this.translate.use('ar'); // اللغة التي ستبدأ بها فوراً
  }
  protected readonly title = signal('UniRoute');
}
