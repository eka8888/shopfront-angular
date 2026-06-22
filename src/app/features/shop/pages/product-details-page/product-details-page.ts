import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../../../shared/services/product.service';
import { CartService } from '../../../../shared/services/cart.service';
import { QuantitySelector } from '../../../../shared/components/quantity-selector/quantity-selector';
import { Button } from '../../../../shared/components/button/button';
import { ButtonVariant } from '../../../../shared/types/form.enums';

@Component({
  selector: 'app-product-details-page',
  imports: [CurrencyPipe, QuantitySelector, Button],
  templateUrl: './product-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsPage {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  readonly ButtonVariant = ButtonVariant;

  productId = Number(this.route.snapshot.paramMap.get('id'));
  imagePath = this.productService.getProductDetailsImage(this.productId);

  currentProduct = computed(() => {
    return this.productService.getProductById(this.productId);
  });

  currentQuantity = computed(() => {
    const currentItem = this.cartService.cartItems().find((item) => item.id === this.productId);

    return currentItem?.quantity ?? 0;
  });

  oldPrice = computed(() => {
    return this.productService.getOldPrice(this.productId);
  });

  onIncreaseQuantity(id: number) {
    this.cartService.increaseQuantity(id);
  }

  onDecreaseQuantity(id: number) {
    this.cartService.decreaseQuantity(id);
  }

  onAddToCart() {
    this.cartService.addToCart(this.productId);
  }

  onRemoveFromCart() {
    this.cartService.removeFromCart(this.productId);
  }
}
