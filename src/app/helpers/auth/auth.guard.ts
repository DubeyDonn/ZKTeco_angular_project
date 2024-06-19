import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const sessionStorage: StorageService = inject(StorageService);
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const user = sessionStorage.getUser();
  const token = sessionStorage.getToken();
  if (token && !authService.isTokenExpired(token)) {
    return true;
  }
  sessionStorage.clear();
  return router.parseUrl('/login');
};
