import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';



export const routes: Routes = [
    {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: '',
    loadChildren: () =>
      import('./features/auth/pages/auth.routes').then(
        (m) => m.AUTH_ROUTES
      ),
  },
      {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.routes').then(
        (m) => m.HOME_ROUTES
      ),
  },
    {
    path: 'contact',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/contact/pages/contact-page/contact-page').then(
        (m) => m.ContactPage
      ),
  },

  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found').then(
        (m) => m.NotFound
      ),
  },
];
