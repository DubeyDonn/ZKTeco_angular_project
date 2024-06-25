import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DailyAttendanceService } from '../../../../services/daily-attendance/daily-attendance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { compare } from '../../../daily-attendance/daily-attendance.component';
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MonthPickerComponent } from '../../../../components/month-picker/month-picker.component';
import { TableComponent } from '../../../../components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { last } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

interface MonthlySummary {
  employeeId: number;
  employeeName: string;
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
  selector: 'app-monthly-summary',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MonthPickerComponent,
    TableComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './monthly-summary.component.html',
  styleUrl: './monthly-summary.component.css',
})
export class MonthlySummaryComponent implements OnInit {
  isMobile = window.innerWidth < 768;
  isLoading = false;
  month = new FormControl(new Date(year, month, 1));

  tableDataSource = new MatTableDataSource<MonthlySummary>([]);

  columns = [
    {
      columnDef: 'employeeId',
      header: 'Employee ID',
      sortable: true,
      cell: (element: MonthlySummary) => `${element.employeeId}`,
    },
    {
      columnDef: 'employeeName',
      header: 'Employee Name',
      sortable: true,
      cell: (element: MonthlySummary) => `${element.employeeName}`,
    },
    {
      columnDef: 'totalPresent',
      header: 'Total Days Present',
      sortable: true,
      cell: (element: MonthlySummary) => `${element.totalPresent}`,
    },
    {
      columnDef: 'totalAbsent',
      header: 'Total Days Absent',
      sortable: true,
      cell: (element: MonthlySummary) => `${element.totalAbsent}`,
    },
    {
      columnDef: 'totalLate',
      header: 'Total Days Late',
      sortable: true,
      cell: (element: MonthlySummary) => `${element.totalLate}`,
    },
    {
      columnDef: 'remarks',
      header: 'Remarks',
      sortable: false,
      cell: (element: MonthlySummary) => `${element.remarks}`,
    },
  ];

  constructor(
    private dailyAttendanceService: DailyAttendanceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchAttendanceDataAndMapToMonthlySummary(
      this.month.value,
      this.getToDate(this.month.value)
    );
  }

  goBack = () => {
    window.history.back();
  };

  getToDate = (month: any) => {
    return new Date(month.getFullYear(), month.getMonth() + 1, 0);
  };

  sortData = (event: any) => {
    const data = this.tableDataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.tableDataSource.data = data;
      return;
    }

    this.tableDataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      switch (event.active) {
        case 'employeeId':
          return compare(+a.employeeId, +b.employeeId, isAsc);
        case 'employeeName':
          return compare(a.employeeName, b.employeeName, isAsc);
        case 'totalPresent':
          return compare(+a.totalPresent, +b.totalPresent, isAsc);
        case 'totalAbsent':
          return compare(+a.totalAbsent, +b.totalAbsent, isAsc);
        case 'totalLate':
          return compare(a.totalLate, b.totalLate, isAsc);
        default:
          return 0;
      }
    });
  };

  fetchAttendanceDataAndMapToMonthlySummary = (from: any, to: any) => {
    this.isLoading = true;

    this.tableDataSource.data = [];
    this.snackBar.open('Fetching data...', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: this.isMobile ? 'bottom' : 'top',
    });

    this.dailyAttendanceService
      .getAttendanceRecordByDateRangeAndEmployee(from, to)
      .subscribe({
        next: (response) => {
          //map response to MonthlySummary
          const monthlySummary = this.mapDataToMonthlySummary(response.data);
          this.tableDataSource.data = monthlySummary;
          this.isLoading = false;

          this.snackBar.open('Data fetched successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to fetch data', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
        },
      });
  };

  mapDataToMonthlySummary = (data: any[]) => {
    const monthlySummaryMap = new Map<number, MonthlySummary>();

    // Assuming all records are for the same month and year, extract from the first record
    const sampleDate = new Date(data[0]?.day);
    const month = sampleDate.getMonth();
    const year = sampleDate.getFullYear();

    var last = new Date(year, month + 1, 0).getDate();

    //get today's date
    const today = new Date();
    if (today.getMonth() === month && today.getFullYear() === year) {
      last = today.getDate();
    }

    // Calculate total working days in the month (excluding weekends)
    let totalWorkingDays = 0;
    for (let day = 1; day <= last; day++) {
      const currentDay = new Date(year, month, day).getDay();
      if (currentDay !== 0 && currentDay !== 6) {
        // 0 is Sunday, 6 is Saturday
        totalWorkingDays++;
      }
    }

    data.forEach((element: any) => {
      const { userId, name, checkInTime, checkOutTime, shift } = element;
      const employeeId = userId;

      if (!monthlySummaryMap.has(employeeId)) {
        monthlySummaryMap.set(employeeId, {
          employeeId,
          employeeName: name,
          totalPresent: 0,
          totalAbsent: 0, // Will calculate later
          totalLate: 0,
          remarks: '',
        });
      }

      const monthlySummary = monthlySummaryMap.get(employeeId)!;

      const dayOfWeek = new Date(element.day).getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Check if it's not a weekend
        if (checkInTime || checkOutTime) {
          monthlySummary.totalPresent++;
        }

        if (checkInTime && checkInTime > shift.shiftStart) {
          monthlySummary.totalLate++;
        }
      }

      if (monthlySummary.remarks === '') {
        monthlySummary.remarks = 'N/A';
      }
    });

    // Calculate totalAbsent for each employee
    monthlySummaryMap.forEach((summary, employeeId) => {
      summary.totalAbsent = totalWorkingDays - summary.totalPresent;
      monthlySummaryMap.set(employeeId, summary);
    });

    //sort by name
    return Array.from(monthlySummaryMap.values()).sort((a, b) =>
      a.employeeName.localeCompare(b.employeeName)
    );
  };
}
