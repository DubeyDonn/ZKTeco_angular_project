import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatTableDataSource } from '@angular/material/table';
import { TableComponent } from '../../../components/table/table.component';

export interface DailyAttendanceInsight {
  day: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
}

@Component({
  selector: 'app-daily-attendance-insight',
  standalone: true,
  imports: [MatProgressSpinnerModule, TableComponent],
  templateUrl: './daily-attendance-insight.component.html',
  styleUrl: './daily-attendance-insight.component.css',
})
export class DailyAttendanceInsightComponent {
  tableDataSource = new MatTableDataSource<DailyAttendanceInsight>([]);
}
