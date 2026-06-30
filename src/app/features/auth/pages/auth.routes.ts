import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth-guard';
import { guestGuard } from '../../../core/guards/guest-guard';


export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login-page/login-page').then(
        (m) => m.LoginPage
      ),
        canActivate: [guestGuard],
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./register-page/register-page').then(
        (m) => m.RegisterPage
      ),
        canActivate: [guestGuard],
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profile-page/profile-page').then(
        (m) => m.ProfilePage
      ),
  },
];