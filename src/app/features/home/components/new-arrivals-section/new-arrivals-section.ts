import { Component, inject } from '@angular/core';

import { ProductService } from '../../../../shared/services/product.service';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CartApi } from '../../../../core/services/cart-api';
import { Product } from '../../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-new-arrivals-section',
  imports: [ProductCard],
  templateUrl: './new-arrivals-section.html',
})
export class NewArrivalsSection {
  private productService = inject(ProductService);
  private cartApi = inject(CartApi);

  newArrivals = this.productService.newArrivals;

  handleAddToCart(product: Product) {
    this.cartApi.addLineItem(product.sku).subscribe();
  }
}
