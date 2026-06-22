import { Component, computed, inject, signal, OnDestroy } from '@angular/core';

import { ProductService } from '../../../../shared/services/product.service';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CartService } from '../../../../shared/services/cart.service';
import { ProductsSortPipe } from '../../../../shared/pipes/products-sort-pipe';
import { DEFAULT_SORTING, Sorting } from '../../../../shared/types/sorting.enums';
import { SortingSelector } from '../sorting-selector/sorting-selector';
import { NothingFound } from '../../../../shared/components/nothing-found/nothing-found';
import { SearchService } from '../../../../shared/services/search.service';

@Component({
  selector: 'app-catalog',
  imports: [ProductCard, ProductsSortPipe, SortingSelector, NothingFound],
  templateUrl: './catalog.html',
})
export class Catalog implements OnDestroy {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  selectedSort = signal<Sorting>(DEFAULT_SORTING);
  private searchService = inject(SearchService);

  catalog = this.productService.products;

  textToSearch = this.searchService.searchInput;

  updatedCatalog = computed(() => {
    const textInput = this.textToSearch()?.trim().toLowerCase();
    const catalog = this.catalog();

    if (textInput) {
      return catalog.filter((product) => {
        return product.name.toLowerCase().includes(textInput) || product.description.toLowerCase().includes(textInput);
      });
    }

    return catalog;
  });

  handleAddToCart(productId: number) {
    this.cartService.addToCart(productId);
  }

  handleSelectSort(sortOption: Sorting) {
    this.selectedSort.set(sortOption);
  }

  ngOnDestroy() {
    this.searchService.clearSearch();
  }
}
