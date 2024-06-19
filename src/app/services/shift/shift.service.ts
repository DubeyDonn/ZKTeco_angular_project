import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  constructor(private http: HttpClient) {}

  getShifts(): Observable<any> {
    return this.http.get(AUTH_API + 'shifts');
  }

  updateShift(shiftId: any, shift: any): Observable<any> {
    return this.http.put(AUTH_API + 'shift/edit?shiftId=' + shiftId, shift);
  }

  deleteShift(shiftId: any): Observable<any> {
    return this.http.delete(AUTH_API + 'shift/delete?shiftId=' + shiftId);
  }
}
