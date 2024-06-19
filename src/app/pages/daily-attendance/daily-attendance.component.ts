import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { DailyAttendanceService } from '../../services/daily-attendance/daily-attendance.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateRangePickerComponent } from '../../components/date-range-picker/date-range-picker.component';
import { SelectMultipleComponent } from '../../components/select-multiple/select-multiple.component';
import { EmployeeService } from '../../services/employee/employee.service';
import { MatSortModule, Sort } from '@angular/material/sort';

export interface DailyAttendance {
  day: string;
  userId: number;
  name: string;
  checkInTime: string;
  checkOutTime: string;
  shift: any;
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
    MatSortModule,
  ],
  templateUrl: './daily-attendance.component.html',
  styleUrl: './daily-attendance.component.css',
})
export class DailyAttendanceComponent implements OnInit {
  //last updated date
  lastUpdated: string = '2024-06-14';
  // Determine if the device is likely a mobile device based on the screen width
  isMobile = window.innerWidth < 768;

  // formDate: FormControl = new FormControl(new Date());

  // startDate= new FormControl(new Date(year, month, day));
  // endDate= new FormControl(new Date(year, month, day));

  formDateRange = new FormGroup({
    start: new FormControl(new Date(year, month, day)),
    end: new FormControl(new Date(year, month, day)),
  });

  tableDataSource = new MatTableDataSource<DailyAttendance>([]);

  columns = [
    {
      columnDef: 'day',
      header: 'Day',
      sortable: true,
      cell: (element: DailyAttendance) => `${element.day}`,
    },
    {
      columnDef: 'id',
      header: 'Employee Id',
      sortable: true,
      cell: (element: DailyAttendance) => `${element.userId}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      sortable: true,
      cell: (element: DailyAttendance) => `${element.name}`,
    },
    {
      columnDef: 'check_in_time',
      header: 'Check In Time',
      sortable: true,
      cell: (element: DailyAttendance) => `${element.checkInTime}`,
    },
    {
      columnDef: 'check_out_time',
      header: 'Check Out Time',
      sortable: true,
      cell: (element: DailyAttendance) => `${element.checkOutTime}`,
    },
    {
      columnDef: 'total_hours_worked',
      header: 'Total Hours Worked',
      sortable: false,
      cell: (element: DailyAttendance) => {
        const checkInTime = new Date(
          `${this.lastUpdated}T${element.checkInTime}`
        );
        const checkOutTime = new Date(
          `${this.lastUpdated}T${element.checkOutTime}`
        );
        const difference = checkOutTime.getTime() - checkInTime.getTime();

        //if difference in NaN
        if (isNaN(difference)) {
          return 'N/A';
        }

        // Convert milliseconds to hours and minutes
        const diffHours = Math.floor(difference / (1000 * 60 * 60));
        const diffMinutes = Math.floor((difference / (1000 * 60)) % 60);

        return `${diffHours} hours ${diffMinutes} minutes`;
      },
    },
    {
      columnDef: 'remarks',
      header: 'Remarks',
      sortable: false,
      cell: (element: DailyAttendance) => {
        if (element.checkInTime == 'N/A') {
          return 'N/A';
        }
        if (element.shift) {
          if (element.checkInTime < element.shift.shiftStart) {
            return 'On Time';
          } else {
            return 'Late';
          }
        } else {
          return 'N/A';
        }
        // return element.shift.shiftStart;
      },
    },
  ];

  isSyncing: boolean = false;

  isLoading: boolean = false;

  selectedEmployees: string[] = [];

  employeeList: Employee[] = [];

  constructor(
    private dailyAttendanceService: DailyAttendanceService,
    private snackBar: MatSnackBar,
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

  sortData = (sort: Sort) => {
    const data = this.tableDataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.tableDataSource.data = data;
      return;
    }

    this.tableDataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'day':
          return compare(a.day, b.day, isAsc);
        case 'id':
          return compare(+a.userId, +b.userId, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'check_in_time':
          return compare(a.checkInTime, b.checkInTime, isAsc);
        case 'check_out_time':
          return compare(a.checkOutTime, b.checkOutTime, isAsc);
        default:
          return 0;
      }
    });
  };

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

  syncAttendance(): void {
    this.isSyncing = true;
    this.snackBar.open('Syncing data...', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: this.isMobile ? 'bottom' : 'top',
    });

    this.isLoading = true;

    this.dailyAttendanceService.syncAttendanceRecord().subscribe({
      next: (response) => {
        this.isSyncing = false;
        this.isLoading = false;
        this.fetchAttendanceData(
          this.formDateRange.value.start,
          this.formDateRange.value.end,
          this.selectedEmployees
        );

        // Show success toast
        this.snackBar.open('Data synced successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
      },
      error: (error) => {
        this.isSyncing = false;
        this.isLoading = false;
        console.error('There was an error!', error);

        // Optionally, show error toast
        this.snackBar.open('Failed to sync data', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
      },
    });
  }

  fetchAttendanceData(fromDate: any, toDate: any, employeeIds: string[]): void {
    this.isLoading = true;
    this.tableDataSource.data = [];
    this.snackBar.open('Fetching data...', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: this.isMobile ? 'bottom' : 'top',
    });

    this.dailyAttendanceService
      .getAttendanceRecordByDateRangeAndEmployee(fromDate, toDate, employeeIds)
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          response.data.forEach((element: any) => {
            if (!element.checkInTime) {
              element.checkInTime = 'N/A';
            } else {
              element.checkInTime = element.checkInTime.slice(0, 5);
            }

            if (!element.checkOutTime) {
              element.checkOutTime = 'N/A';
            } else {
              element.checkOutTime = element.checkOutTime.slice(0, 5);
            }
          });
          this.tableDataSource.data = response.data;

          //toast message
          this.snackBar.open('Data fetched successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('There was an error!', error);
          //  error toast
          this.snackBar.open('Failed to fetch data', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
        },
      });
  }

  fetchEmployeeList(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
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

export function compare(
  a: number | string,
  b: number | string,
  isAsc: boolean
) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
