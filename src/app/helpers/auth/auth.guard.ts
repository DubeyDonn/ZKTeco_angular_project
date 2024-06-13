import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const sessionStorage: StorageService = inject(StorageService);
  const router: Router = inject(Router);

  const user = sessionStorage.getUser();
  const token = sessionStorage.getToken();
  if (user && token) {
    return true;
  }
  return router.parseUrl('/login');
};
