import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // مهم إذا كنت تستخدم Standalone

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss']
})
export class PaginationComponent implements OnChanges {
  
  // المدخلات (تأتي من صفحة البحث)
  @Input() totalItems: number = 0;      // إجمالي عدد الرحلات (مثلاً 50)
  @Input() itemsPerPage: number = 10;   // كم رحلة في الصفحة الواحدة
  @Input() currentPage: number = 1;     // الصفحة الحالية

  // المخرجات (نرسل رقم الصفحة الجديدة للأب)
  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 0;
  pagesArray: number[] = [];

  // دالة تعمل تلقائياً عند تغير المدخلات لحساب عدد الصفحات
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage']) {
      this.calculatePages();
    }
  }

  calculatePages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    // إنشاء مصفوفة أرقام [1, 2, 3, ...]
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // عند الضغط على رقم صفحة
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}