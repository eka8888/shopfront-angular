import { Component, inject } from '@angular/core';

import { ProductService } from '../../../../shared/services/product.service';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-new-arrivals-section',
  imports: [ProductCard],
  templateUrl: './new-arrivals-section.html',
  styleUrl: './new-arrivals-section.scss',
})
export class NewArrivalsSection {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  newArrivals = this.productService.getNewArrivals();

  handleAddToCart(productId: number) {
    this.cartService.addToCart(productId);
  }
}
