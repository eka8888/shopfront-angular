import { Component, inject } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';

import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './cart-page.html',
})
export class CartPage {
  private cartService = inject(CartService);

  items = this.cartService.cartItems;
  heading = this.cartService.cartHeading;
  total = this.cartService.cartTotal;

  onRemoveFromCart(id: number) {
    this.cartService.removeFromCart(id);
  }

  onIncreaseQuantity(id: number) {
    this.cartService.increaseQuantity(id);
  }

  onDecreaseQuantity(id: number) {
    this.cartService.decreaseQuantity(id);
  }
}
