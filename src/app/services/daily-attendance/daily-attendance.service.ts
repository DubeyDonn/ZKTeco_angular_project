import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

const AUTH_API = 'http://localhost:8080/api/';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
// };

@Injectable({
  providedIn: 'root',
})
export class DailyAttendanceService {
  constructor(private http: HttpClient) {}

  //http://localhost:8080/api/daily_attendance_record?fromDate=2024-06-04T00:00:00&toDate=2024-06-04T23:03:45
  getAttendanceRecordByDateRange(fromDate: any, toDate: any): Observable<any> {
    const formattedFromDate = `${fromDate.getFullYear()}-${(
      fromDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fromDate
      .getDate()
      .toString()
      .padStart(2, '0')}T00:00:00`;

    const formattedToDate = `${toDate.getFullYear()}-${(toDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${toDate
      .getDate()
      .toString()
      .padStart(2, '0')}T23:59:59`;

    return this.http.get(
      AUTH_API +
        'daily_attendance_record?fromDate=' +
        formattedFromDate +
        '&toDate=' +
        formattedToDate
    );
  }

  getAttendanceRecordByDateRangeAndEmployee(
    fromDate: any,
    toDate: any,
    employeeIds: string[] = []
  ): Observable<any> {
    const formattedFromDate = `${fromDate.getFullYear()}-${(
      fromDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fromDate
      .getDate()
      .toString()
      .padStart(2, '0')}T00:00:00`;

    const formattedToDate = `${toDate.getFullYear()}-${(toDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${toDate
      .getDate()
      .toString()
      .padStart(2, '0')}T23:59:59`;

    return this.http.get(
      AUTH_API +
        'daily_attendance_record?fromDate=' +
        formattedFromDate +
        '&toDate=' +
        formattedToDate +
        '&employeeIds=' +
        employeeIds
    );
  }

  syncAttendanceRecord(): Observable<any> {
    return this.http.get(AUTH_API + 'sync');
  }
}
