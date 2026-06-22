import { Component, computed, inject, OnDestroy } from '@angular/core';

import { ProductService } from '../../../../shared/services/product.service';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CartService } from '../../../../shared/services/cart.service';
import { NothingFound } from '../../../../shared/components/nothing-found/nothing-found';
import { SearchService } from '../../../../shared/services/search.service';

@Component({
  selector: 'app-catalog',
  imports: [ProductCard, NothingFound],
  templateUrl: './catalog.html',
})
export class Catalog implements OnDestroy {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
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

  ngOnDestroy() {
    this.searchService.clearSearch();
  }
}
