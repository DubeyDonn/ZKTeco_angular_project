import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { jwtDecode } from 'jwt-decode';
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

  logout(): void {
    this.storageService.removeUser();
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    const now = Date.now().valueOf() / 1000;
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      return true;
    }
    return false;
  }
}
