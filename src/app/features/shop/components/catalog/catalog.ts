import {
  Component,
  computed,
  inject,
  signal,
  OnDestroy,
  OnInit,
  effect,
  DestroyRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SearchService } from '../../../../shared/services/search.service';
import { CartService } from '../../../../shared/services/cart.service';
import { FilteringService } from '../../../../shared/services/filtering.service';
import { ProductService } from '../../../../shared/services/product.service';
import { ProductsSortPipe } from '../../../../shared/pipes/products-sort-pipe';
import { PluralsPipe } from '../../../../shared/pipes/plurals-pipe';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { SortingSelector } from '../sorting-selector/sorting-selector';
import { NothingFound } from '../../../../shared/components/nothing-found/nothing-found';
import { PRICE_RANGES } from '../../../../shared/constants/price-range';
import { Button } from '../../../../shared/components/button/button';

import { DEFAULT_SORTING, Sorting } from '../../../../shared/types/sorting.enums';
import { ButtonVariant } from '../../../../shared/types/form.enums';
import { ButtonType } from '../../../../shared/types/form.enums';
import { CategoryService } from '../../../../shared/services/category.service';

@Component({
  selector: 'app-catalog',
  imports: [
    ProductCard,
    ProductsSortPipe,
    SortingSelector,
    NothingFound,
    ReactiveFormsModule,
    PluralsPipe,
    Button,
  ],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog implements OnInit, OnDestroy {
  readonly ButtonVariant = ButtonVariant;
  readonly ButtonType = ButtonType;

  private cartService = inject(CartService);
  private searchService = inject(SearchService);
  private filteringService = inject(FilteringService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  selectedSort = signal<Sorting>(DEFAULT_SORTING);
  itemsPerPage = signal<number>(12);
  currentPage = signal<number>(1);

  textToSearch = this.searchService.searchInput;
  categories = this.categoryService.allCategories;
  filteredResults = this.filteringService.filteredResults;

  formattedPriceRange = computed(() => {
    return PRICE_RANGES.map((price) => {
      return {
        ...price,
        label: price.max ? `$${price.min} - $${price.max}` : `> $${price.min}`,
      };
    });
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredResults().length / this.itemsPerPage());
  });

  productsAtPage = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();

    return this.filteredResults().slice(startIndex, endIndex);
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

  handleAddToCart(productId: string) {
    this.cartService.addToCart(productId);
  }

  handleSelectSort(sortOption: Sorting) {
    this.selectedSort.set(sortOption);
  }

  addFilters() {
    this.currentPage.set(1);

    const categoryFilters = this.filteringForm.value.categoryList;
    const priceFilters = this.filteringForm.value.priceRange;

    this.filteringService.updateSearchAndFilters(categoryFilters, priceFilters);
  }

  resetSearchAndFilters() {
    this.filteringForm.reset();
    this.searchService.clearSearch();

    this.addFilters();
  }

  setCategory(category: string) {
    this.resetSearchAndFilters();

    const formControl = this.filteringForm.get(['categoryList', category]);
    formControl?.setValue(true);
  }

  showNextPage() {
    const page = this.currentPage();

    if (page < this.totalPages()) {
      this.currentPage.set(page + 1);
    }
  }

  showPrevPage() {
    const page = this.currentPage();

    if (page > 1) {
      this.currentPage.set(page - 1);
    }
  }

  ngOnInit(): void {
    const dataSubscription = this.productService.fetchAllProducts().subscribe({
      next: (data) => {
        this.productService.products.set(data);
      },
      error: (err) => console.error(err),
    });

    const querySubscription = this.route.queryParams.subscribe((params) => {
      const { category } = params;

      if (category && typeof category === 'string') {
        this.setCategory(category);
      }
    });

    const formSubscription = this.filteringForm.valueChanges.subscribe(() => {
      this.addFilters();
    });

    this.categoryService.fetchCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        console.log(data);
      },
      error: (err) => console.log(err),
    });

    this.addFilters();

    this.destroyRef.onDestroy(() => {
      dataSubscription.unsubscribe();
      querySubscription.unsubscribe();
      formSubscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.searchService.clearSearch();
  }
}
