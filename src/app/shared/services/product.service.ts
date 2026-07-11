import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { CtProduct, Product } from '../interfaces/product.interface';
import { CtAllProducts } from '../interfaces/product.interface';
import { adaptCtToProduct } from '../adapters/product.adapter';
import { environment } from '../../../environments/environment';
import { stripTrailingSlash } from '../../core/utils/url';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private FAKE_DISCOUNT_AMOUNT = 20;
  private BASE_URL = `${stripTrailingSlash(environment.apiUrl)}/${environment.projectKey}/product-projections`;

  private httpClient = inject(HttpClient);

  products = signal<Product[]>([]);

  newArrivals = computed(() => {
    return this.products()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  });

  constructor() {
    this.fetchAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err) => console.log(err),
    });
  }

  getProductById(id: string) {
    return this.products().find((item) => item.id === id);
  }

  getOldPrice(id: string) {
    const currentProduct = this.getProductById(id);

    return (currentProduct?.price ?? 0) + this.FAKE_DISCOUNT_AMOUNT;
  }

  fetchProductByKey(key: string) {
    const url = `${this.BASE_URL}/key=${key}`;

    return this.httpClient.get<CtProduct>(url).pipe(map((resData) => adaptCtToProduct(resData)));
  }

  fetchAllProducts() {
    const url = `${this.BASE_URL}?limit=50`;

    return this.httpClient
      .get<CtAllProducts>(url)
      .pipe(map((resData) => resData.results.map((obj) => adaptCtToProduct(obj))));
  }
}
