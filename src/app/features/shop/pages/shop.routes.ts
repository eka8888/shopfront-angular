import { Routes } from '@angular/router';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shop-page/shop-page').then((m) => m.ShopPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./product-details-page/product-details-page').then((m) => m.ProductDetailsPage),
  },
];
