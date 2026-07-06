import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { CtProduct, Product } from '../interfaces/product.interface';
import { CtAllProducts } from '../interfaces/product.interface';
import { adaptCtToProduct } from '../adapters/product.adapter';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private FAKE_DISCOUNT_AMOUNT = 20;
  private BASE_URL = `${environment.apiUrl}/${environment.projectKey}/product-projections`;

  private httpClient = inject(HttpClient);

  products = signal<Product[]>([]);

  readonly newArrivals = computed(() =>
    this.products()
      .filter((product) => product.isNew)
      .slice(0, 4),
  );

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
