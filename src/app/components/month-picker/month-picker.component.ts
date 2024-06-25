import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-month-picker',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  templateUrl: './month-picker.component.html',
  styleUrl: './month-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthPickerComponent {
  @Input() date?: FormControl;
  @Input() monthEnd?: boolean | null;

  @Output() dateChange: EventEmitter<FormControl> = new EventEmitter();

  addEvent(value: any, widget: any) {
    if (this.monthEnd) {
      value = new Date(value._i.year, value._i.month + 1, 0);
    } else {
      value = new Date(value._i.year, value._i.month, 1);
    }
    this.dateChange.emit(new FormControl(value));
    this.date = new FormControl(value);
    widget.close();
  }

  constructor() {}
}
