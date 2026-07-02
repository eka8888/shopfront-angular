import { Injectable, inject, signal } from '@angular/core';

import { SearchService } from '../services/search.service';
import { Category } from '../interfaces/category.interface';
import { Product } from '../interfaces/product.interface';

import categories from '../../shared/data/categories.json';

@Injectable({
  providedIn: 'root',
})
export class FilteringService {
  private searchService = inject(SearchService);

  searchResults = this.searchService.searchResults;

  categories = signal<Category[]>(categories);
  filteredResults = signal<Product[]>([]);

  updateSearchAndFilters(categoryFilters: Record<string, boolean | null> | undefined) {
    let filteredCatalog = this.searchResults();

    if (categoryFilters) {
      const selectedCategories = Object.keys(categoryFilters).filter((key) => categoryFilters[key]);

      if (selectedCategories.length > 0) {
        const categoryIds = selectedCategories.map((categoryName) => {
          const existedCategory = this.categories().find(
            (category) => category.name === categoryName,
          );

          if (existedCategory) {
            return existedCategory.id;
          }

          return undefined;
        });

        filteredCatalog = filteredCatalog.filter((product) =>
          categoryIds.includes(product.categoryId),
        );
      }
    }

    this.filteredResults.set(filteredCatalog);
  }
}
