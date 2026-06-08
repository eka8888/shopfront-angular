import { computed, Injectable, signal } from '@angular/core';

import { Product } from '../interfaces/product.interface';

import productsData from '../data/products.json';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private FAKE_DISCOUNT_AMOUNT = 20;

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
    return this.products().find((item) => item.id === id);
  }

  getOldPrice(id: number) {
    const currentProduct = this.getProductById(id);

    return (currentProduct?.price ?? 0) + this.FAKE_DISCOUNT_AMOUNT;
  }

  getProductDetailsImage(id: number) {
    return `images/product-details/product-${id}/details-1.jpg`;
  }
}
