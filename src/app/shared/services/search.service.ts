import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private router = inject(Router);
  private productService = inject(ProductService);

  catalog = this.productService.products;

  searchInput = signal<string>('');

  searchResults = computed(() => {
    const textInput = this.searchInput().trim().toLowerCase();
    const catalog = this.catalog();

    if (textInput) {
      return catalog.filter((product) => {
        return (
          product.name.toLowerCase().includes(textInput) ||
          product.description.toLowerCase().includes(textInput)
        );
      });
    }

    return catalog;
  });

  searchProducts(textInput: string) {
    this.searchInput.set(textInput);

    const text = textInput.trim();

    if (text) {
      this.router.navigate(['/shop'], {
        queryParams: { searchFor: text },
      });
    } else {
      this.router.navigate(['/shop']);
    }
  }

  clearSearch() {
    this.searchInput.set('');
  }
}
