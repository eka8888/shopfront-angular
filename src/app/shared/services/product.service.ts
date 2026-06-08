import { computed, Injectable, signal } from '@angular/core';

import { Product } from '../interfaces/product.interface';

import productsData from '../data/products.json';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly products = signal<Product[]>(
    productsData.map((product) => {
      return {
        ...product,
        image: `images/products/product-${product.id}.jpg`,
      };
    }),
  );

  readonly newArrivals = computed(() =>
    this.products()
      .filter((product) => product.isNew)
      .slice(0, 4),
  );

  getProductById(id: number) {
    return this.products().find(((product) => product.id === id));
  }
}
