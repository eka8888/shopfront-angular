import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { CartService } from '../../../../shared/services/cart.service';
import { QuantitySelector } from '../../../../shared/components/quantity-selector/quantity-selector';
import { Button } from '../../../../shared/components/button/button';
import { ButtonVariant, ButtonType } from '../../../../shared/types/form.enums';
import { PromoCode } from '../../components/promo-code/promo-code';
import { NothingFound } from '../../../../shared/components/nothing-found/nothing-found';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, NothingFound, QuantitySelector, Button, PromoCode],
  templateUrl: './cart-page.html',
})
export class CartPage {
  private cartService = inject(CartService);
  modalVisible = signal(false);

  readonly ButtonVariant = ButtonVariant;
  readonly ButtonType = ButtonType;

  items = this.cartService.cartItems;
  heading = this.cartService.cartHeading;
  total = this.cartService.cartTotal;

  discount = this.cartService.discount;
  isDiscountApplied = this.cartService.isDiscountApplied;

  totalForPromo = computed(() => this.total() * (1 - this.cartService.discount() / 100));

  discountAmount = computed(() => this.total() * (this.cartService.discount() / 100));

  onTotalChanged(percent: number) {
    this.cartService.applyDiscount(percent);
  }

  onResetDiscount() {
    this.cartService.resetDiscount();
  }

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
