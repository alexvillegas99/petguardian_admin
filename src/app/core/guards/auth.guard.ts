import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const isAdmin = await authService.checkAdminRole();
  if (!isAdmin) {
    await authService.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
};
