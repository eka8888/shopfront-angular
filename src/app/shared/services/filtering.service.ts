import { Injectable, inject, signal } from '@angular/core';

import { PRICE_RANGE_MAP } from '../constants/price-range';
import { SearchService } from '../services/search.service';
import { CategoryService } from './category.service';
import { Product } from '../interfaces/product.interface';
import { PriceRange } from '../interfaces/price-range.interface';
import { Filter } from '../types/filter.type';

@Injectable({
  providedIn: 'root',
})
export class FilteringService {
  private searchService = inject(SearchService);
  private categoryService = inject(CategoryService);

  searchResults = this.searchService.searchResults;
  categories = this.categoryService.allCategories;

  filteredResults = signal<Product[]>([]);

  updateSearchAndFilters(
    categoryFilters: Filter,
    priceFilters: Filter,
  ) {
    let filteredCatalog = this.searchResults();

    filteredCatalog = this.filterByCategory(filteredCatalog, categoryFilters);
    filteredCatalog = this.filterByPrice(filteredCatalog, priceFilters);

    this.filteredResults.set(filteredCatalog);
  }

  private filterByCategory(
    products: Product[],
    categoryFilters: Filter,
  ) {
    if (categoryFilters) {
      const selectedCategories = Object.keys(categoryFilters).filter((categoryName) => categoryFilters[categoryName]);

      if (selectedCategories.length > 0) {
        const categoryIds = selectedCategories.map((categoryName) => {
          const existedCategory = this.categories().find(
            (category) => category.name['en-US'] === categoryName,
          );

          if (existedCategory) {
            return existedCategory.id;
          }

          return undefined;
        });

        return products.filter((product) => categoryIds.includes(product.categoryId));
      }
    }

    return products;
  }

  private filterByPrice(
    products: Product[],
    priceFilters: Filter,
  ) {
    if (priceFilters) {
      const selectedPriceRange = Object.keys(priceFilters).filter((priceRangeName) => priceFilters[priceRangeName]);

      if (selectedPriceRange.length > 0) {
        const priceRanges: PriceRange[] = selectedPriceRange.map((value) => PRICE_RANGE_MAP[value]);

        return products.filter((product) => {
          return priceRanges.some((priceRange) => {
            if (priceRange.max) {
              return product.price >= priceRange.min && product.price <= priceRange.max;
            }

            return product.price >= priceRange.min;
          });
        });
      }
    }

    return products;
  }
}
