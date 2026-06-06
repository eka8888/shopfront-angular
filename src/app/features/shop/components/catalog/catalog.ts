import { Component, inject } from '@angular/core';

import { ProductService } from '../../../../shared/services/product.service';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-catalog',
  imports: [ProductCard],
  templateUrl: './catalog.html',
})
export class Catalog {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  catalog = this.productService.products;

  handleAddToCart(productId: number) {
    this.cartService.addToCart(productId);
  }
}
