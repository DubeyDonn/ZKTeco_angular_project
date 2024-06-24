import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatePickerComponent } from '../../../../components/date-picker/date-picker.component';
import { MonthPickerComponent } from '../../../../components/month-picker/month-picker.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { DailyAttendanceService } from '../../../../services/daily-attendance/daily-attendance.service';
import { EmployeeService } from '../../../../services/employee/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableComponent } from '../../../../components/table/table.component';
import { compare } from '../../../daily-attendance/daily-attendance.component';
import { MatButtonModule } from '@angular/material/button';

interface MonthlyAttendanceBreakdown {
  month: string;
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
  selector: 'app-monthly-breakdown',
  standalone: true,
  imports: [
    MonthPickerComponent,
    CommonModule,
    MatProgressSpinnerModule,
    TableComponent,
    MatButtonModule,
  ],
  templateUrl: './monthly-breakdown.component.html',
  styleUrl: './monthly-breakdown.component.css',
})
export class MonthlyBreakdownComponent implements OnInit {
  isMobile = window.innerWidth < 768;
  isLoading = false;
  fromMonth = new FormControl(new Date(year, 0, 1));
  toMonth = new FormControl(new Date(year, month + 1, 0));

  tableDataSource = new MatTableDataSource<MonthlyAttendanceBreakdown>([]);
  employeeCount = 0;

  columns = [
    {
      columnDef: 'month',
      header: 'Month',
      sortable: false,
      cell: (element: MonthlyAttendanceBreakdown) => `${element.month}`,
    },
    {
      columnDef: 'totalPresent',
      header: 'Total Present',
      sortable: true,
      cell: (element: MonthlyAttendanceBreakdown) => `${element.totalPresent}`,
    },
    {
      columnDef: 'totalAbsent',
      header: 'Total Absent',
      sortable: true,
      cell: (element: MonthlyAttendanceBreakdown) => `${element.totalAbsent}`,
    },
    {
      columnDef: 'totalLate',
      header: 'Total Late',
      sortable: true,
      cell: (element: MonthlyAttendanceBreakdown) => `${element.totalLate}`,
    },
    {
      columnDef: 'remarks',
      header: 'Remarks',
      sortable: true,
      cell: (element: MonthlyAttendanceBreakdown) => `${element.remarks}`,
    },
  ];

  constructor(
    private dailyAttendanceService: DailyAttendanceService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchEmployeeCount();
    this.fetchAttendanceDataAndMapToMonthlyBreakdown(
      this.fromMonth.value,
      this.toMonth.value
    );
  }

  sortData = (event: any) => {
    const data = this.tableDataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.tableDataSource.data = data;
      return;
    }

    this.tableDataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      switch (event.active) {
        case 'totalPresent':
          return compare(+a.totalPresent, +b.totalPresent, isAsc);
        case 'totalAbsent':
          return compare(+a.totalAbsent, +b.totalAbsent, isAsc);
        case 'totalLate':
          return compare(+a.totalLate, +b.totalLate, isAsc);
        case 'remarks':
          return compare(a.remarks, b.remarks, isAsc);
        default:
          return 0;
      }
    });
  };

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

  onRangeChange = () => {
    this.fetchAttendanceDataAndMapToMonthlyBreakdown(
      this.fromMonth.value,
      this.toMonth.value
    );
  };

  fetchAttendanceDataAndMapToMonthlyBreakdown(
    fromMonth: any,
    toMonth: any
  ): void {
    this.isLoading = true;
    this.tableDataSource.data = [];
    this.snackBar.open('Fetching data...', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: this.isMobile ? 'bottom' : 'top',
    });

    this.dailyAttendanceService
      .getAttendanceRecordByDateRangeAndEmployee(fromMonth, toMonth)
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          // Map attendance data to monthly breakdown
          const attendanceBreakdown = this.mapDataToMonthlyBreakdown(
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
          this.snackBar.open('Failed to fetch data', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
        },
      });
  }

  mapDataToMonthlyBreakdown(
    attendanceData: any[]
  ): MonthlyAttendanceBreakdown[] {
    const monthlyBreakdownMap = new Map<string, any>();
    const daysSet = new Set<string>(); // Using a Set instead of a Map for days
    const totalMonthlyEmployeeCount = this.employeeCount;

    attendanceData.forEach((record: any) => {
      const { day, checkInTime, checkOutTime, shift } = record;
      const date = new Date(day);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!monthlyBreakdownMap.has(key)) {
        monthlyBreakdownMap.set(key, {
          month: key,
          totalEmployeeCount: 0,
          totalPresent: 0,
          totalAbsent: 0,
          totalLate: 0,
          remarks: '',
        });
      }

      const monthlyData = monthlyBreakdownMap.get(key);

      if (!daysSet.has(day)) {
        monthlyData.totalEmployeeCount += totalMonthlyEmployeeCount;
        daysSet.add(day);
      }

      if (checkInTime || checkOutTime) {
        monthlyData.totalPresent += 1;
        if (checkInTime > shift.shiftStart) {
          monthlyData.totalLate += 1;
        }
      }

      monthlyBreakdownMap.set(key, monthlyData);
    });

    monthlyBreakdownMap.forEach((value) => {
      value.totalAbsent = value.totalEmployeeCount - value.totalPresent;
      value.remarks = 'N/A';
    });

    return Array.from(monthlyBreakdownMap.values());
  }
}
