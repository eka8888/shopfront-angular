import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, Subject, switchMap, finalize } from 'rxjs';

import { ProductService } from './product.service';
import { environment } from '../../../environments/environment';
import { CtAllProducts } from '../interfaces/product.interface';
import { adaptCtToProduct } from '../adapters/product.adapter';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private BASE_URL = `${environment.apiUrl}/${environment.projectKey}/product-projections/search`;

  private router = inject(Router);
  private productService = inject(ProductService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  private searchSubject$ = new Subject<string>();

  catalog = this.productService.products;

  userInput = signal<string>('');
  searchResults = signal<Product[]>([]);
  isLoading = signal<boolean>(false);

  constructor() {
    const subscription = this.searchSubject$.pipe(
      switchMap((text) => {
        this.isLoading.set(true);
        this.searchResults.set([]);

        return this.fetchFoundProducts(text).pipe(
          map((data) => {
            this.searchResults.set(data);

            return data;
          }),
          finalize(() => this.isLoading.set(false)),
        );
      })
    ).subscribe({
      error: (err) => console.error(`Search error: ${err}`),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  searchProducts(textInput: string) {
    this.userInput.set(textInput);

    const text = textInput.trim();

    if (text) {
      this.router.navigate(['/shop'], {
        queryParams: { searchFor: text },
      });
      this.searchSubject$.next(text);
    } else {
      this.router.navigate(['/shop']);
      this.searchResults.set(this.catalog());
      return;
    }
  }

  fetchFoundProducts(searchText: string) {
    let url = `${this.BASE_URL}?limit=50&fuzzy=true`;

    if (searchText) {
      url += `&text.en-US=${encodeURIComponent(searchText)}`;
    }

    return this.httpClient
      .get<CtAllProducts>(url)
      .pipe(map((data) => data.results.map((obj) => adaptCtToProduct(obj))));
  }

  clearSearch() {
    this.userInput.set('');
    this.searchResults.set(this.catalog());
  }

  getSearchInputFromUrl(text: string) {
    const searchText = text.trim();

    if (searchText) {
      this.userInput.set(searchText);
      this.searchSubject$.next(searchText);
    } else {
      this.userInput.set('');
      this.searchResults.set(this.catalog());
    }
  }
}
