import { Component, Input } from '@angular/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './date-picker.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './date-picker.component.css',
})
export class DatePickerComponent {
  // date = new FormControl(new Date());
  @Input() date?: FormControl;
  @Input() onDateChange: Function = () => {};

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.onDateChange(event);
  }

  constructor() {}

  public monthChanged(value: any, widget: any): void {
    console.log(value);
    const start = new Date(value.getFullYear(), value.getMonth(), 1);
    const end = new Date(value.getFullYear(), value.getMonth() + 1, 0);

    console.log(start, end);
  }
}
