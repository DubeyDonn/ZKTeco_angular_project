import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DailyAttendanceService } from '../../services/daily-attendance/daily-attendance.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateRangePickerComponent } from '../../components/date-range-picker/date-range-picker.component';
import { SelectMultipleComponent } from '../../components/select-multiple/select-multiple.component';
import { EmployeeService } from '../../services/employee/employee.service';

export interface DailyAttendance {
  day: string;
  userId: number;
  name: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface Employee {
  id: string;
  value: string;
}

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();

@Component({
  selector: 'app-daily-attendance',
  standalone: true,
  imports: [
    TableComponent,
    MatButtonModule,
    DatePickerComponent,
    CommonModule,
    MatProgressSpinnerModule,
    DateRangePickerComponent,
    SelectMultipleComponent,
    JsonPipe,
  ],
  templateUrl: './daily-attendance.component.html',
  styleUrl: './daily-attendance.component.css',
})
export class DailyAttendanceComponent implements OnInit {
  // formDate: FormControl = new FormControl(new Date());

  // startDate= new FormControl(new Date(year, month, day));
  // endDate= new FormControl(new Date(year, month, day));

  formDateRange = new FormGroup({
    start: new FormControl(new Date(year, month, day)),
    end: new FormControl(new Date(year, month, day)),
  });

  dataSource = new MatTableDataSource<DailyAttendance>([]);

  columns = [
    {
      columnDef: 'day',
      header: 'Day',
      cell: (element: DailyAttendance) => `${element.day}`,
    },
    {
      columnDef: 'id',
      header: 'Employee Id',
      cell: (element: DailyAttendance) => `${element.userId}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: DailyAttendance) => `${element.name}`,
    },
    {
      columnDef: 'login_time',
      header: 'Login Time',
      cell: (element: DailyAttendance) => `${element.checkInTime}`,
    },
    {
      columnDef: 'logout_time',
      header: 'Logout Time',
      cell: (element: DailyAttendance) => `${element.checkOutTime}`,
    },
  ];

  isSyncing: boolean = false;

  selectedEmployees: string[] = [];

  employeeList: Employee[] = [
    // { id: '1', value: 'Niraj' },
    // { id: '2', value: 'Sagar' },
    // { id: '3', value: 'Sachin' },
    // { id: '4', value: 'Rahul' },
    // { id: '5', value: 'Rajesh' },
    // { id: '6', value: 'Raj' },
  ];

  constructor(
    private dailyAttendanceService: DailyAttendanceService,
    private snackBar: MatSnackBar, // Inject MatSnackBar
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.fetchAttendanceData(
      this.formDateRange.value.start,
      this.formDateRange.value.end,
      this.selectedEmployees
    );

    this.fetchEmployeeList();
  }

  syncAttendance(): void {
    this.isSyncing = true;
    this.dailyAttendanceService.syncAttendanceRecord().subscribe({
      next: (response) => {
        this.isSyncing = false;
        console.log('Data synced successfully', response);
        this.fetchAttendanceData(
          this.formDateRange.value.start,
          this.formDateRange.value.end,
          this.selectedEmployees
        );

        // Show success toast
        this.snackBar.open('Data synced successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
      error: (error) => {
        this.isSyncing = false;
        console.error('There was an error!', error);

        // Optionally, show error toast
        this.snackBar.open('Failed to sync data', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  selection = new SelectionModel<DailyAttendance>(true, []);

  // onDateChange = (event: MatDatepickerInputEvent<Date>): void => {
  //   if (event.value) {
  //     this.formDate = new FormControl(event.value);
  //     this.fetchAttendanceData(
  //       this.formDateRange.value.start,
  //       this.formDateRange.value.end
  //     );
  //   }
  // };

  onRangeChange = () => {
    if (!this.formDateRange.value.end && this.formDateRange.value.start) {
      this.formDateRange.value.end = this.formDateRange.value.start;
    }

    this.fetchAttendanceData(
      this.formDateRange.value.start,
      this.formDateRange.value.end,
      this.selectedEmployees
    );
  };

  onEmployeeChange = (): void => {
    this.fetchAttendanceData(
      this.formDateRange.value.start,
      this.formDateRange.value.end,
      this.selectedEmployees
    );
  };

  fetchAttendanceData(fromDate: any, toDate: any, employeeIds: string[]): void {
    this.dailyAttendanceService
      .getAttendanceRecordByDateRangeAndEmployee(fromDate, toDate, employeeIds)
      .subscribe({
        next: (response) => {
          console.log('Data fetched successfully', response.data);
          this.dataSource.data = response.data;

          //toast message
          this.snackBar.open('Data fetched successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        },
        error: (error) => {
          console.error('There was an error!', error);
          //  error toast
          this.snackBar.open('Failed to fetch data', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        },
      });
  }

  fetchEmployeeList(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        console.log('Employee list fetched successfully', response.data);

        response.data.forEach((element: any) => {
          this.employeeList.push({ id: element.id, value: element.name });
        });
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }
}
