import { Routes } from '@angular/router';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/shop-page/shop-page').then((m) => m.ShopPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/product-details-page/product-details-page').then((m) => m.ProductDetailsPage),
  },
];
