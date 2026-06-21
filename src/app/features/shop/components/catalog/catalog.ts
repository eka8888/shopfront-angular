import { Component, inject, signal } from '@angular/core';

import { ProductService } from '../../../../shared/services/product.service';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CartService } from '../../../../shared/services/cart.service';
import { ProductsSortPipe } from '../../../../shared/pipes/products-sort-pipe';
import { Sorting } from '../../../../shared/types/sorting.enums';
import { SortingSelector } from '../sorting-selector/sorting-selector';

@Component({
  selector: 'app-catalog',
  imports: [ProductCard, ProductsSortPipe, SortingSelector],
  templateUrl: './catalog.html',
})
export class Catalog {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  selectedSort = signal<Sorting>(Sorting.NameAsc);

  catalog = this.productService.products;

  handleAddToCart(productId: number) {
    this.cartService.addToCart(productId);
  }

  handleSelectSort(sortOption: Sorting) {
    this.selectedSort.set(sortOption);
  }
}
