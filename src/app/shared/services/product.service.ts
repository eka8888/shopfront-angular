import { computed, Injectable, signal } from '@angular/core';

import { Product } from '../interfaces/product.interface';

import productsData from '../data/products.json';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products = signal<Product[]>(
    productsData.map((product) => {
      return {
        ...product,
        image: `images/products/product-${product.id}.jpg`,
      };
    }),
  );

  getProducts() {
    return this.products;
  }

  getNewArrivals() {
    return computed(() => this.products().filter((product) => product.isNew));
  }
}
