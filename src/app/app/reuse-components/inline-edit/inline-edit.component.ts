import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-inline-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.scss']
})
export class InlineEditComponent {
  @Input() value: string | number = '';
  @Input() type: 'text' | 'number' = 'text';
  @Input() min?: number;
  @Input() max?: number;
  @Input() placeholder: string = '_____';
  @Input() isChecked: boolean = false;
  @Input() displayValue?: string; // optional display override
  @ViewChild('mirror') mirror!: ElementRef;
  @ViewChild('inputRef') inputRef!: ElementRef;

  @Output() valueChange = new EventEmitter<string | number>();

  editing = false;
  localValue: string | number = '';

  resizeInput() {
    setTimeout(() => {
      const mirrorEl = this.mirror?.nativeElement;
      const inputEl = this.inputRef?.nativeElement;
      if (mirrorEl && inputEl) {
        const textWidth = mirrorEl.offsetWidth;
        inputEl.style.width = `${textWidth + 8}px`;
      }
    });
  }


  startEdit() {
    if (!this.isChecked) {
      this.localValue = this.value;
      this.editing = true;
      console.log('Switched to editing mode');

      setTimeout(() => {
        this.resizeInput();
        this.inputRef?.nativeElement.focus();
        this.inputRef?.nativeElement.select();
      })
    }
  }


  submit() {
    if (this.localValue !== this.value) {
      this.valueChange.emit(this.localValue);
    }
    this.editing = false;
  }

  cancel() {
    this.editing = false;
  }
}

