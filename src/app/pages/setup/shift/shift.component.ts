import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../../../services/employee/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShiftService } from '../../../services/shift/shift.service';
import { Sort } from '@angular/material/sort';
import { compare } from '../../daily-attendance/daily-attendance.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import {
  convertTo12HourFormat,
  convertTo24HourFormat,
} from '../../../utils/utility';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface Shift {
  id: number;
  type: string;
  name: string;
  shiftStart: string;
  shiftEnd: string;
  breakStart: string;
  breakEnd: string;
}

@Component({
  selector: 'app-shift',
  standalone: true,
  imports: [CommonModule, TableComponent, MatProgressSpinnerModule],
  templateUrl: './shift.component.html',
  styleUrl: './shift.component.css',
})
export class ShiftComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  tableDataSource = new MatTableDataSource<Shift>([]);
  isLoading = false;
  isMobile = window.innerWidth < 768;
  columns = [
    {
      columnDef: 'name',
      header: 'Name',
      sortable: true,
      cell: (element: Shift) => `${element.name}`,
    },
    {
      columnDef: 'type',
      header: 'Type',
      sortable: true,
      cell: (element: Shift) => `${element.type}`,
    },
    {
      columnDef: 'shiftStart',
      header: 'Shift Start',
      sortable: true,
      cell: (element: Shift) => `${element.shiftStart}`,
    },
    {
      columnDef: 'shiftEnd',
      header: 'Shift End',
      sortable: true,
      cell: (element: Shift) => `${element.shiftEnd}`,
    },
    {
      columnDef: 'breakStart',
      header: 'Break Start',
      sortable: true,
      cell: (element: Shift) => `${element.breakStart}`,
    },
    {
      columnDef: 'breakEnd',
      header: 'Break End',
      sortable: true,
      cell: (element: Shift) => `${element.breakEnd}`,
    },
    {
      columnDef: 'actions',
      header: 'Actions',
      action: true,
      editAction: (element: Shift) => {
        this.openEditDialog(element);
      },
      deleteAction: (element: Shift) => {
        this.openDeleteDialog(element);
      },
    },
  ];

  constructor(
    private snackBar: MatSnackBar,
    private shiftService: ShiftService
  ) {}

  ngOnInit() {
    this.fetchShifts();
  }

  sortData = (sort: Sort) => {
    const data = this.tableDataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.tableDataSource.data = data;
      return;
    }

    this.tableDataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'type':
          return compare(a.type, b.type, isAsc);
        case 'shiftStart':
          return compare(a.shiftStart, b.shiftStart, isAsc);
        case 'shiftEnd':
          return compare(a.shiftEnd, b.shiftEnd, isAsc);
        case 'breakStart':
          return compare(a.breakStart, b.breakStart, isAsc);
        case 'breakEnd':
          return compare(a.breakEnd, b.breakEnd, isAsc);
        default:
          return 0;
      }
    });
  };

  fetchShifts(): void {
    this.isLoading = true;
    this.snackBar.open('Fetching shifts...', 'Close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: this.isMobile ? 'bottom' : 'top',
    });
    this.shiftService.getShifts().subscribe({
      next: (response) => {
        this.tableDataSource.data = response.data;
        this.snackBar.open('Shifts fetched successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error fetching shifts', 'Close', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
        this.isLoading = false;
      },
    });
  }

  openEditDialog(shift: Shift): void {
    const dialogRef = this.dialog.open(ShiftEditDialog, {
      width: '600px',
      data: { shift: shift },
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (!formData) {
        return;
      }
      // Update shift
      this.snackBar.open('Updating shift...', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });

      this.isLoading = true;
      this.shiftService.updateShift(shift.id, formData).subscribe({
        next: (response) => {
          this.snackBar.open('Shift updated successfully', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
          this.fetchShifts();
        },
        error: (error) => {
          this.snackBar.open('Failed to update shift', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
        },
      });
    });
  }

  openDeleteDialog(shift: Shift): void {
    const dialogRef = this.dialog.open(ShiftDeleteDialog, {
      width: '600px',
      data: { shift: shift },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      // Delete shift
      this.snackBar.open('Deleting shift...', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });

      this.isLoading = true;
      this.shiftService.deleteShift(shift.id).subscribe({
        next: (response) => {
          this.snackBar.open('Shift deleted successfully', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
          this.fetchShifts();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete shift', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
        },
      });
    });
  }
}

@Component({
  selector: 'shift-edit-dialog',
  templateUrl: 'shift-edit-dialog.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    NgxMatTimepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShiftEditDialog implements OnInit {
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<ShiftEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = new FormGroup({
      name: new FormControl(),
      type: new FormControl(),
      shiftStart: new FormControl(),
      shiftEnd: new FormControl(),
      breakStart: new FormControl(),
      breakEnd: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      name: this.data.shift.name,
      shiftStart: convertTo12HourFormat(this.data.shift.shiftStart),
      shiftEnd: convertTo12HourFormat(this.data.shift.shiftEnd),
      breakStart: convertTo12HourFormat(this.data.shift.breakStart),
      breakEnd: convertTo12HourFormat(this.data.shift.breakEnd),
      type: this.data.shift.type,
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = { ...this.form.value };
      if (formValue.shiftStart) {
        formValue.shiftStart = convertTo24HourFormat(formValue.shiftStart);
      }
      if (formValue.shiftEnd) {
        formValue.shiftEnd = convertTo24HourFormat(formValue.shiftEnd);
      }
      if (formValue.breakStart) {
        formValue.breakStart = convertTo24HourFormat(formValue.breakStart);
      }
      if (formValue.breakEnd) {
        formValue.breakEnd = convertTo24HourFormat(formValue.breakEnd);
      }

      this.dialogRef.close(formValue);
    } else {
      this.form.markAllAsTouched();
    }
  }
}

@Component({
  selector: 'shift-delete-dialog',
  templateUrl: 'shift-delete-dialog.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShiftDeleteDialog {
  constructor() {}
}
