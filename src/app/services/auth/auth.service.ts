import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

const AUTH_API = 'http://localhost:8080/';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
// };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      username,
      password,
    });
  }

  register(data: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', data);
  }

  // logout(): Observable<any> {
  //   return this.http.post(AUTH_API + 'logout', {});
  // }

  logout(): void {
    this.storageService.removeUser();
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }
}
