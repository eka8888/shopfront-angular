import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private router = inject(Router);

  searchInput = signal<string>('');

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
