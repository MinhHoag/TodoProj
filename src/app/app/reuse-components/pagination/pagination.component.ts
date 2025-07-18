import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {InlineEditComponent} from '../inline-edit/inline-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  imports: [
    InlineEditComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  standalone: true
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();

  get totalPages(): number {
    return this.pageSize === 0 ? 1 : Math.ceil(this.totalItems / this.pageSize);
  }

  get start(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get end(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  changePage(delta: number) {
    const newPage = this.currentPage + delta;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.pageChange.emit({page: newPage, pageSize: this.pageSize});
    }
  }

  goToPage(page: string | number): void {
    const num = Math.max(1, Math.min(this.totalPages, Number(page)));
    this.currentPage = num;
    this.pageChange.emit({page: num, pageSize: this.pageSize});
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.pageChange.emit({page: this.currentPage, pageSize: this.pageSize});
  }

  @HostListener('window:keydown', ['$event'])
  handleArrowKeys(event: KeyboardEvent) {
    const active = document.activeElement;
    const isEditable =
      active?.tagName === 'INPUT' ||
      active?.tagName === 'TEXTAREA' ||
      active?.getAttribute('contenteditable') === 'true' ||
      active?.classList.contains('inline-edit');

    if (!isEditable) {
      if (event.key === 'ArrowRight') {
        this.changePage(1);
      } else if (event.key === 'ArrowLeft') {
        this.changePage(-1);
      }
    }
  }
}
