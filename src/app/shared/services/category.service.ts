import { Injectable, signal, inject, DestroyRef, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CtCategories, CtCategory } from '../interfaces/category.interface';
import { stripTrailingSlash } from '../../core/utils/url';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private BASE_URL = `${stripTrailingSlash(environment.apiUrl)}/${environment.projectKey}/categories`;

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  allCategories = signal<CtCategory[]>([]);

  readonly homePageCategories = computed(() => {
    return this.allCategories().map((category) => {
      const slug = category.slug['en-US'];

      return {
        ...category,
        image: `images/categories-section/${slug}.jpg`,
        slug,
      };
    });
  });

  constructor() {
    const categorySubscription = this.fetchCategories().subscribe({
      next: (data) => {
        this.allCategories.set(data);
      },
      error: (err) => console.error('Failed to load categories:', err),
    });

    this.destroyRef.onDestroy(() => categorySubscription.unsubscribe());
  }

  fetchCategories() {
    const url = `${this.BASE_URL}`;

    return this.httpClient.get<CtCategories>(url).pipe(map((data) => data.results));
  }
}
