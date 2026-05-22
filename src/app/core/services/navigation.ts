import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Navigation {
   navItems = signal([
    {
      label: 'Home',
      path: '/home',
    },
    {
      label: 'Shop',
      path: '/shop',
    },
    {
      label: 'About',
      path: '/about',
    },
    {
      label: 'Contact',
      path: '/contact',
    }
  ]);
}
