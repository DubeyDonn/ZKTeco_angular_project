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
import { MatIconModule } from '@angular/material/icon';
import { MonthPickerComponent } from '../../../../components/month-picker/month-picker.component';
import { CommonModule, DatePipe } from '@angular/common';
import { TableComponent } from '../../../../components/table/table.component';
import { MatButton, MatButtonModule } from '@angular/material/button';

interface HoursShortfall {
  employeeId: number;
  employeeName: string;
  holidays: Set<string>;
  expectedHours: number;
  actualHours: number;
  shortfallHours: number;
}

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate();

@Component({
  selector: 'app-hours-shortfall',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MonthPickerComponent,
    DatePipe,
    TableComponent,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './hours-shortfall.component.html',
  styleUrl: './hours-shortfall.component.css',
})
export class HoursShortfallComponent implements OnInit {
  isMobile = window.innerWidth < 768;
  isLoading = false;
  month = new FormControl(new Date(year, month, 1));

  tableDataSource = new MatTableDataSource<HoursShortfall>([]);

  columns = [
    {
      columnDef: 'employeeId',
      header: 'Employee ID',
      sortable: true,
      cell: (element: HoursShortfall) => `${element.employeeId}`,
    },
    {
      columnDef: 'employeeName',
      header: 'Employee Name',
      sortable: true,
      cell: (element: HoursShortfall) => `${element.employeeName}`,
    },
    {
      columnDef: 'holidayTaken',
      header: 'Holidays Taken',
      sortable: true,
      cell: (element: HoursShortfall) => {
        return `${element.holidays.size}`;
      },
    },
    {
      columnDef: 'expectedHours',
      header: 'Expected Hours',
      sortable: true,
      cell: (element: HoursShortfall) => {
        //convert expectedHours to hours and minutes
        const hours = Math.floor(element.expectedHours);
        const minutes = Math.round((element.expectedHours - hours) * 60);
        return `${hours}h ${minutes}m`;
      },
    },
    {
      columnDef: 'actualHours',
      header: 'Actual Hours',
      sortable: true,
      cell: (element: HoursShortfall) => {
        // convert actualHours to hours and minutes
        const hours = Math.floor(element.actualHours);
        const minutes = Math.round((element.actualHours - hours) * 60);
        return `${hours}h ${minutes}m`;
      },
    },
    {
      columnDef: 'shortfallHours',
      header: 'Shortfall Hours',
      sortable: true,
      cell: (element: HoursShortfall) => {
        //if shortfallHours is negative, return 0
        if (element.shortfallHours < 0) {
          return 0;
        }

        // convert shortfallHours to hours and minutes
        const hours = Math.floor(element.shortfallHours);
        const minutes = Math.round((element.shortfallHours - hours) * 60);
        return `${hours}h ${minutes}m`;
      },
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

  getToDate = (date: any) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  sortData = (event: any) => {
    const isAsc = event.direction === 'asc';
    const column = event.active;
    this.tableDataSource.data = this.tableDataSource.data.sort((a, b) => {
      switch (column) {
        case 'employeeId':
          return compare(+a.employeeId, +b.employeeId, isAsc);
        case 'employeeName':
          return compare(a.employeeName, b.employeeName, isAsc);
        case 'holidayTaken':
          return compare(+a.holidays.size, +b.holidays.size, isAsc);
        case 'expectedHours':
          return compare(+a.expectedHours, +b.expectedHours, isAsc);
        case 'actualHours':
          return compare(+a.actualHours, +b.actualHours, isAsc);
        case 'shortfallHours':
          return compare(+a.shortfallHours, +b.shortfallHours, isAsc);
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
          if (response.success) {
            const data = response.data;
            const HoursShortfallData = this.mapDataToHoursShortfall(data);

            this.tableDataSource.data = HoursShortfallData!;
            this.isLoading = false;

            this.snackBar.open('Data fetched successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: this.isMobile ? 'bottom' : 'top',
            });
          } else {
            this.isLoading = false;
            this.snackBar.open('Failed to fetch data', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: this.isMobile ? 'bottom' : 'top',
            });
          }
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

  mapDataToHoursShortfall(data: any[]) {
    if (data.length === 0) {
      return [];
    }

    const HoursShortfallMap = new Map<number, any>();
    const allWorkDaysSet = new Set<string>();

    data.forEach(({ day, userId, name, checkInTime, checkOutTime, shift }) => {
      const employeeId = userId;
      let HoursShortfall = HoursShortfallMap.get(employeeId);

      if (!HoursShortfall) {
        const shiftHours = calculateShiftHours(
          shift.shiftStart,
          shift.shiftEnd
        );
        HoursShortfall = {
          employeeId,
          employeeName: name,
          expectedHours: 0,
          perDayExpectedHours: shiftHours,
          actualHours: 0,
          workedDays: new Set<string>(),
          holidays: new Set<string>(),
          halfHolidays: 0,
          shortfallHours: 0,
        };
        HoursShortfallMap.set(employeeId, HoursShortfall);
      }

      if (!isWeekend(day)) {
        allWorkDaysSet.add(day);
        HoursShortfall.workedDays.add(day);

        const workingHours = calculateWorkingHours(
          checkInTime,
          checkOutTime,
          shift
        );
        if (workingHours < 1) HoursShortfall.holidays.add(day);
        if (workingHours >= 3 && workingHours < 5)
          HoursShortfall.halfHolidays++;
        HoursShortfall.actualHours += workingHours;
      }
    });

    calculateShortfallHours(HoursShortfallMap, allWorkDaysSet);

    return Array.from(HoursShortfallMap.values()).sort((a, b) =>
      a.employeeName.localeCompare(b.employeeName)
    );
  }
}
function calculateShiftHours(shiftStart: string, shiftEnd: string): number {
  return calculateHoursDifference(shiftStart, shiftEnd);
}

function calculateWorkingHours(
  checkInTime: string | undefined,
  checkOutTime: string | undefined,
  shift: { shiftStart: string; shiftEnd: string }
): number {
  if (checkInTime && checkOutTime) {
    return calculateHoursDifference(checkInTime, checkOutTime);
  } else if (checkInTime) {
    return calculateHoursDifference(checkInTime, shift.shiftEnd);
  } else if (checkOutTime) {
    return calculateHoursDifference(shift.shiftStart, checkOutTime);
  }
  return 0;
}

function calculateHoursDifference(startTime: string, endTime: string): number {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return (end.getTime() - start.getTime()) / 3600000;
}

function isWeekend(day: string): boolean {
  const dayOfWeek = new Date(day).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

function calculateShortfallHours(
  HoursShortfallMap: Map<number, any>,
  allWorkDaysSet: Set<string>
) {
  HoursShortfallMap.forEach((summary) => {
    allWorkDaysSet.forEach((day) => {
      summary.expectedHours += summary.perDayExpectedHours;
      if (!summary.workedDays.has(day)) {
        summary.holidays.add(day);
      }
    });

    summary.expectedHours -=
      summary.holidays.size * summary.perDayExpectedHours +
      summary.halfHolidays * (summary.perDayExpectedHours / 2);

    summary.shortfallHours = summary.expectedHours - summary.actualHours;
  });
}
