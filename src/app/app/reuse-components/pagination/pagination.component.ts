import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {InlineEditComponent} from '../inline-edit/inline-edit.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, InlineEditComponent],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 5;
  @Input() currentPage = 1;




  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();

  editingPage = false;
  pageInput: number = this.currentPage;

  goToPage(newPage: string | number): void {
    const page = Number(newPage);
    const clamped = Math.max(1, Math.min(page, this.totalPages));
    this.currentPage = clamped;
    this.pageInput = clamped;
    this.pageChange.emit({ page: clamped, pageSize: this.pageSize });
  }





  get totalPages(): number {
    return this.pageSize === 0 ? 1 : Math.ceil(this.totalItems / this.pageSize);
  }

  get start(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get end(): number {
    if (this.pageSize === 0) return this.totalItems;
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  changePage(delta: number) {
    const newPage = this.currentPage + delta;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.pageChange.emit({ page: this.currentPage, pageSize: this.pageSize });
    }
  }



  onPageSizeChange() {
    // Reset currentPage internally as well
    this.currentPage = 1;

    // Emit updated state to parent
    this.pageChange.emit({ page: this.currentPage, pageSize: this.pageSize });
  }

}
