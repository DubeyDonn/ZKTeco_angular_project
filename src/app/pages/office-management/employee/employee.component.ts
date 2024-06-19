import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from '../../../components/table/table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ShiftService } from '../../../services/shift/shift.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Sort } from '@angular/material/sort';
import { compare } from '../../daily-attendance/daily-attendance.component';

export interface Employee {
  id: number;
  name: string;
  shift: any;
}

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  tableDataSource = new MatTableDataSource<Employee>([]);
  isLoading = false;
  isMobile = window.innerWidth < 768;
  columns = [
    {
      columnDef: 'id',
      header: 'User Id',
      sortable: true,
      cell: (element: Employee) => `${element.id}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      sortable: true,
      cell: (element: Employee) => `${element.name}`,
    },
    {
      columnDef: 'shift',
      header: 'Shift',
      sortable: true,
      cell: (element: Employee) => {
        if (!element.shift) {
          return 'N/A';
        }
        const shiftStart =
          element.shift.shiftStart.split(':')[0] +
          ':' +
          element.shift.shiftStart.split(':')[1];
        const shiftEnd =
          element.shift.shiftEnd.split(':')[0] +
          ':' +
          element.shift.shiftEnd.split(':')[1];
        return `${shiftStart} - ${shiftEnd}`;
      },
    },
    {
      columnDef: 'actions',
      header: 'Actions',
      action: true,
      editAction: (element: Employee) => {
        this.openEditDialog(element);
      },
      deleteAction: (element: Employee) => {
        this.openDeleteDialog(element);
      },
    },
  ];

  shifts: any[] = [];

  constructor(
    private shiftService: ShiftService,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.fetchEmployees();
    this.fetchShifts();
  }

  sortData = (event: Sort) => {
    const data = this.tableDataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.tableDataSource.data = data;
      return;
    }

    this.tableDataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      switch (event.active) {
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'shift':
          return compare(a.shift.shiftStart, b.shift.shiftStart, isAsc);
        default:
          return 0;
      }
    });
  };

  fetchEmployees(): void {
    this.isLoading = true;
    this.tableDataSource.data = [];
    this.snackBar.open('Fetching employees...', 'Close', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: this.isMobile ? 'bottom' : 'top',
    });
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.tableDataSource.data = response.data;
        this.snackBar.open('Employees fetched successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to fetch employees', 'Close', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
        this.isLoading = false;
      },
    });
  }

  fetchShifts(): void {
    // Fetch shifts
    this.shiftService.getShifts().subscribe({
      next: (response) => {
        this.shifts = response.data;
      },
      error: (error) => {
        console.log('error', error);
      },
    });
  }

  openEditDialog(element: Employee): void {
    const dialogRef = this.dialog.open(editDialogue, {
      width: '600px',
      data: { employee: element, shifts: this.shifts },
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (!formData) {
        return;
      }
      // Update employee
      this.snackBar.open('Updating employee...', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });
      this.isLoading = true;
      this.employeeService.updateEmployee(element.id, formData).subscribe({
        next: (response) => {
          this.fetchEmployees();
          this.snackBar.open('Employee updated successfully', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
        },
        error: (error) => {
          this.snackBar.open('Failed to update employee', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
        },
      });
    });
  }

  openDeleteDialog(element: Employee): void {
    const dialogRef = this.dialog.open(deleteDialogue, {
      width: '600px',
      data: { employee: element },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      // Delete employee
      this.snackBar.open('Deleting employee...', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });
      this.isLoading = true;
      this.employeeService.deleteEmployee(element.id).subscribe({
        next: (response) => {
          this.snackBar.open('Employee deleted successfully', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.fetchEmployees();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete employee', 'Close', {
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
        },
      });
    });
  }
}

@Component({
  selector: 'employee-edit-dialog',
  templateUrl: 'employee-edit-dialog.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class editDialogue implements OnInit {
  form: FormGroup;
  shifts: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<editDialogue>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = new FormGroup({
      name: new FormControl(),
      shift: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      name: this.data.employee.name,
      shift: {
        id: this.data.employee.shift?.id,
      },
    });
    this.shifts = this.data.shifts;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  // Comparison function for objects
  compareShifts(obj1: any, obj2: any): boolean {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }
}

@Component({
  selector: 'employee-delete-dialog',
  templateUrl: 'employee-delete-dialog.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class deleteDialogue {
  constructor() {}
}
