import { Component, computed, inject, signal, OnDestroy, OnInit, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ProductService } from '../../../../shared/services/product.service';
import { SearchService } from '../../../../shared/services/search.service';
import { CartService } from '../../../../shared/services/cart.service';
import { ProductsSortPipe } from '../../../../shared/pipes/products-sort-pipe';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { SortingSelector } from '../sorting-selector/sorting-selector';
import { NothingFound } from '../../../../shared/components/nothing-found/nothing-found';
import { priceRange } from '../../../../shared/constants/price-range';

import { DEFAULT_SORTING, Sorting } from '../../../../shared/types/sorting.enums';
import { Category } from '../../../../shared/interfaces/category.interface';
import { Product } from '../../../../shared/interfaces/product.interface';

import categories from '../../../../shared/data/categories.json';

@Component({
  selector: 'app-catalog',
  imports: [ProductCard, ProductsSortPipe, SortingSelector, NothingFound, ReactiveFormsModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private searchService = inject(SearchService);
  private formBuilder = inject(FormBuilder);

  selectedSort = signal<Sorting>(DEFAULT_SORTING);
  categories = signal<Category[]>(categories);
  filteredResults = signal<Product[]>([]);

  catalog = this.productService.products;
  textToSearch = this.searchService.searchInput;
  searchResults = this.searchService.searchResults;

  formattedPriceRange = computed(() => {
    return priceRange.map((price) => {
      return {
        ...price,
        label: price.max ? `$${price.min} - $${price.max}` : `> $${price.min}`,
      };
    });
  });

  filteringForm = this.formBuilder.group({
    categoryList: this.formBuilder.group({
      Tableware: [false],
      'Home decor': [false],
      Holiday: [false],
      Collection: [false],
    }),
    priceRange: this.formBuilder.group({
      '0': [false],
      '10': [false],
      '50': [false],
      '100': [false],
      '200': [false],
    }),
  });

  constructor() {
    effect(() => {
      this.textToSearch();
      this.updateAllFilters();
    });
  }

  handleAddToCart(productId: number) {
    this.cartService.addToCart(productId);
  }

  handleSelectSort(sortOption: Sorting) {
    this.selectedSort.set(sortOption);
  }

  updateAllFilters() {
    let filteredCatalog = this.searchResults();

    const categoryFilters = this.filteringForm.value.categoryList;

    if (categoryFilters) {
      const filters = categoryFilters as Record<string, boolean>;

      const selectedCategories = Object.keys(filters).filter((key) => filters[key]);

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

  resetAllFilters() {
    this.filteringForm.get('categoryList')?.reset();
    this.searchService.clearSearch();

    this.updateAllFilters();
  }

  ngOnInit(): void {
    this.filteringForm.valueChanges.subscribe(() => {
      this.updateAllFilters();
    });

    this.updateAllFilters();
  }

  ngOnDestroy() {
    this.searchService.clearSearch();
  }
}
