import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-month-picker',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './month-picker.component.html',
  styleUrl: './month-picker.component.css',
})
export class MonthPickerComponent {
  // date = new FormControl(new Date());
  @Input() date?: FormControl;
  @Input() monthEnd?: boolean | null;

  @Output() dateChange: EventEmitter<FormControl> = new EventEmitter();

  addEvent(value: any, widget: any) {
    if (this.monthEnd) {
      value = new Date(value.getFullYear(), value.getMonth() + 1, 0);
    }
    this.dateChange.emit(new FormControl(value));
    this.date = new FormControl(value);
    widget.close();
  }

  constructor() {}
}
