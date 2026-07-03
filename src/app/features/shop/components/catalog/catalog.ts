import { Component, computed, inject, signal, OnDestroy, OnInit, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ProductService } from '../../../../shared/services/product.service';
import { SearchService } from '../../../../shared/services/search.service';
import { CartService } from '../../../../shared/services/cart.service';
import { FilteringService } from '../../../../shared/services/filtering.service';
import { ProductsSortPipe } from '../../../../shared/pipes/products-sort-pipe';
import { PluralsPipe } from '../../../../shared/pipes/plurals-pipe';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { SortingSelector } from '../sorting-selector/sorting-selector';
import { NothingFound } from '../../../../shared/components/nothing-found/nothing-found';
import { PRICE_RANGES } from '../../../../shared/constants/price-range';

import { DEFAULT_SORTING, Sorting } from '../../../../shared/types/sorting.enums';

@Component({
  selector: 'app-catalog',
  imports: [ProductCard, ProductsSortPipe, SortingSelector, NothingFound, ReactiveFormsModule, PluralsPipe],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private searchService = inject(SearchService);
  private filteringService = inject(FilteringService);
  private formBuilder = inject(FormBuilder);

  selectedSort = signal<Sorting>(DEFAULT_SORTING);

  textToSearch = this.searchService.searchInput;
  categories = this.filteringService.categories;
  filteredResults = this.filteringService.filteredResults;

  formattedPriceRange = computed(() => {
    return PRICE_RANGES.map((price) => {
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
      this.addFilters();
    });
  }

  handleAddToCart(productId: number) {
    this.cartService.addToCart(productId);
  }

  handleSelectSort(sortOption: Sorting) {
    this.selectedSort.set(sortOption);
  }

  addFilters() {
    const categoryFilters = this.filteringForm.value.categoryList;
    const priceFilters = this.filteringForm.value.priceRange;

    this.filteringService.updateSearchAndFilters(categoryFilters, priceFilters);
  }

  resetSearchAndFilters() {
    this.filteringForm.reset();
    this.searchService.clearSearch();

    this.addFilters();
  }

  ngOnInit(): void {
    this.filteringForm.valueChanges.subscribe(() => {
      this.addFilters();
    });

    this.addFilters();
  }

  ngOnDestroy() {
    this.searchService.clearSearch();
  }
}
