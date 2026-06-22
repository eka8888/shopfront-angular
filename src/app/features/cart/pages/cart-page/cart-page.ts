import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { CartService } from '../../../../shared/services/cart.service';
import { QuantitySelector } from '../../../../shared/components/quantity-selector/quantity-selector';
import { NothingFound } from '../../../../shared/components/nothing-found/nothing-found';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, NothingFound, QuantitySelector],
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
