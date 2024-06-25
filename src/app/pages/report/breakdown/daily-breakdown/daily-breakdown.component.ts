import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../../../components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { DatePickerComponent } from '../../../../components/date-picker/date-picker.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateRangePickerComponent } from '../../../../components/date-range-picker/date-range-picker.component';
import { MatSortModule } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DailyAttendanceService } from '../../../../services/daily-attendance/daily-attendance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { compare } from '../../../daily-attendance/daily-attendance.component';
import { EmployeeService } from '../../../../services/employee/employee.service';
import { MatIconModule } from '@angular/material/icon';

interface DailyAttendanceBreakdown {
  day: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  remarks: string;
}

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();

@Component({
  selector: 'app-daily-breakdown',
  standalone: true,
  imports: [
    TableComponent,
    MatButtonModule,
    DatePickerComponent,
    CommonModule,
    MatProgressSpinnerModule,
    DateRangePickerComponent,
    JsonPipe,
    MatSortModule,
    MatIconModule,
  ],
  templateUrl: './daily-breakdown.component.html',
  styleUrl: './daily-breakdown.component.css',
})
export class DailyBreakdownComponent implements OnInit {
  isMobile = window.innerWidth < 768;
  formDateRange = new FormGroup({
    start: new FormControl(new Date(year, month, 1)),
    end: new FormControl(new Date(year, month, day)),
  });
  tableDataSource = new MatTableDataSource<DailyAttendanceBreakdown>([]);
  employeeCount = 0;

  columns = [
    {
      columnDef: 'day',
      header: 'Date',
      sortable: true,
      cell: (element: DailyAttendanceBreakdown) => `${element.day}`,
    },
    {
      columnDef: 'totalPresent',
      header: 'Total Present',
      sortable: true,
      cell: (element: DailyAttendanceBreakdown) => `${element.totalPresent}`,
    },
    {
      columnDef: 'totalAbsent',
      header: 'Total Absent',
      sortable: true,
      cell: (element: DailyAttendanceBreakdown) => `${element.totalAbsent}`,
    },
    {
      columnDef: 'totalLate',
      header: 'Total Late',
      sortable: true,
      cell: (element: DailyAttendanceBreakdown) => `${element.totalLate}`,
    },
    {
      columnDef: 'remarks',
      header: 'Remarks',
      sortable: false,
      cell: (element: DailyAttendanceBreakdown) => `${element.remarks}`,
    },
  ];

  isLoading = false;

  constructor(
    private dailyAttendanceService: DailyAttendanceService,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.fetchEmployeeCount();
    this.fetchAttendanceDataAndMapToDailyBreakdown(
      this.formDateRange.value.start,
      this.formDateRange.value.end
    );
  }

  goBack = () => {
    window.history.back();
  };

  sortData = (event: any) => {
    const isAsc = event.direction === 'asc';
    this.tableDataSource.data = this.tableDataSource.data.sort((a, b) => {
      switch (event.active) {
        case 'day':
          return compare(a.day, b.day, isAsc);
        case 'totalPresent':
          return compare(+a.totalPresent, +b.totalPresent, isAsc);
        case 'totalAbsent':
          return compare(+a.totalAbsent, +b.totalAbsent, isAsc);
        case 'totalLate':
          return compare(+a.totalLate, +b.totalLate, isAsc);
        default:
          return 0;
      }
    });
  };

  onRangeChange = () => {
    if (!this.formDateRange.value.end && this.formDateRange.value.start) {
      this.formDateRange.value.end = this.formDateRange.value.start;
    }

    this.fetchAttendanceDataAndMapToDailyBreakdown(
      this.formDateRange.value.start,
      this.formDateRange.value.end
    );
  };

  fetchAttendanceDataAndMapToDailyBreakdown(fromDate: any, toDate: any): void {
    this.isLoading = true;
    this.tableDataSource.data = [];
    this.snackBar.open('Fetching data...', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: this.isMobile ? 'bottom' : 'top',
    });

    this.dailyAttendanceService
      .getAttendanceRecordByDateRangeAndEmployee(fromDate, toDate)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          // Map attendance data to daily breakdown
          const attendanceBreakdown = this.mapDataToAttendanceBreakdown(
            response.data
          );
          this.tableDataSource.data = attendanceBreakdown;

          console.log('breakdown', attendanceBreakdown);
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

  fetchEmployeeCount(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.employeeCount = response.data.length;
        console.log('employee count', this.employeeCount);
      },
      error: (error) => {
        this.snackBar.open('Failed to fetch employee count', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
      },
    });
  }

  mapDataToAttendanceBreakdown = (
    attendanceData: any[]
  ): DailyAttendanceBreakdown[] => {
    const dailyBreakdownMap = new Map<string, DailyAttendanceBreakdown>();
    const totalEmployeeCount = this.employeeCount;

    attendanceData.forEach((record: any) => {
      const { day, checkInTime, checkOutTime, shift } = record;
      if (!dailyBreakdownMap.has(day)) {
        dailyBreakdownMap.set(day, {
          day,
          totalPresent: 0,
          totalAbsent: 0,
          totalLate: 0,
          remarks: '',
        });
      }

      const dailyData = dailyBreakdownMap.get(day);

      if (checkInTime || checkOutTime) {
        dailyData!.totalPresent++;
        if (checkInTime > shift.shiftStart) {
          dailyData!.totalLate++;
        }
      }

      dailyBreakdownMap.set(day, dailyData!);
    });

    dailyBreakdownMap.forEach((attendance) => {
      attendance.totalAbsent = totalEmployeeCount - attendance.totalPresent;
      attendance.remarks = 'N/A';
    });

    return Array.from(dailyBreakdownMap.values());
  };
}
