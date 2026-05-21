import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);

  const isLoggedIn = false;

  if (!isLoggedIn) {
    return router.createUrlTree(['/home']);
  }

  return true;
};
