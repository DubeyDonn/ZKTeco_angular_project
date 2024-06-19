import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
// };

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any> {
    return this.http.get(AUTH_API + 'employees');
  }

  updateEmployee(employeeId: any, employee: any): Observable<any> {
    return this.http.put(
      AUTH_API + 'employee/edit?employeeId=' + employeeId,
      employee
    );
  }

  deleteEmployee(employeeId: any): Observable<any> {
    return this.http.delete(
      AUTH_API + 'employee/delete?employeeId=' + employeeId
    );
  }
}
