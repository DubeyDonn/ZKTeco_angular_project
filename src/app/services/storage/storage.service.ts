import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  clear(): void {
    // window.sessionStorage.clear();
    localStorage.clear();
  }

  public saveUser(user: any): void {
    //sessionStorage
    // window.sessionStorage.removeItem(USER_KEY);
    // window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));

    //localStorage
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    // const user = window.sessionStorage.getItem(USER_KEY);

    const user = localStorage.getItem(USER_KEY);

    if (user) {
      return JSON.parse(user).user;
    }

    return {};
  }

  public getToken(): string {
    // const user = window.sessionStorage.getItem(USER_KEY);
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user).token;
    }

    return '';
  }

  public isLoggedIn(): boolean {
    // const user = window.sessionStorage.getItem(USER_KEY);
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  public removeUser(): void {
    // window.sessionStorage.clear();
    localStorage.clear();
  }
}
