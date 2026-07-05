import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { CartService } from '../../../../shared/services/cart.service';
import { CartApi } from '../../../../core/services/cart-api';
import { CartStore } from '../../../../core/stores/cart.store';
import { LineItem } from '../../../../core/models/cart.interface';
import { moneyToAmount, localizedName } from '../../../../core/utils/money';
import { QuantitySelector } from '../../../../shared/components/quantity-selector/quantity-selector';
import { Button } from '../../../../shared/components/button/button';
import { ButtonVariant, ButtonType } from '../../../../shared/types/form.enums';
import { PromoCode } from '../../components/promo-code/promo-code';
import { ClearCartModal } from '../../components/clear-cart-modal/clear-cart-modal';
import { NothingFound } from '../../../../shared/components/nothing-found/nothing-found';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, NothingFound, QuantitySelector, Button, PromoCode, ClearCartModal],
  templateUrl: './cart-page.html',
})
export class CartPage {
  private cartApi = inject(CartApi);
  private cartStore = inject(CartStore);
  private cartService = inject(CartService);

  modalVisible = signal(false);
  clearCartModalVisible = signal(false);

  readonly ButtonVariant = ButtonVariant;
  readonly ButtonType = ButtonType;

  items = this.cartStore.lineItems;
  heading = this.cartStore.itemsCount;
  total = this.cartStore.total;
  currencyCode = this.cartStore.currencyCode;

  loading = this.cartStore.loading;
  error = this.cartStore.error;

  discount = this.cartService.discount;
  isDiscountApplied = this.cartService.isDiscountApplied;

  totalForPromo = computed(() => this.total() * (1 - this.discount() / 100));
  discountAmount = computed(() => this.total() * (this.discount() / 100));

  constructor() {
    this.cartApi.loadActiveCart().subscribe();
  }

  itemName(item: LineItem): string {
    return localizedName(item.name);
  }

  itemImage(item: LineItem): string | undefined {
    return item.variant.images?.[0]?.url;
  }

  itemUnitPrice(item: LineItem): number {
    return moneyToAmount(item.price.value);
  }

  itemTotalPrice(item: LineItem): number {
    return moneyToAmount(item.totalPrice);
  }

  onTotalChanged(percent: number) {
    this.cartService.applyDiscount(percent);
  }

  onResetDiscount() {
    this.cartService.resetDiscount();
  }

  onRemoveFromCart(lineItemId: number | string) {
    this.cartApi.removeLineItem(String(lineItemId)).subscribe();
  }

  onIncreaseQuantity(lineItemId: number | string) {
    const item = this.findLineItem(lineItemId);

    if (!item) {
      return;
    }

    this.cartApi.changeLineItemQuantity(item.id, item.quantity + 1).subscribe();
  }

  onDecreaseQuantity(lineItemId: number | string) {
    const item = this.findLineItem(lineItemId);

    if (!item || item.quantity <= 1) {
      return;
    }

    this.cartApi.changeLineItemQuantity(item.id, item.quantity - 1).subscribe();
  }

  onClearCart() {
    this.cartApi.clearCart().subscribe({
      complete: () => this.clearCartModalVisible.set(false),
    });
  }

  discountedPrice(price: number): number {
    return price * (1 - this.discount() / 100);
  }

  discountedSubtotal(item: LineItem): number {
    return this.discountedPrice(this.itemUnitPrice(item)) * item.quantity;
  }

  private findLineItem(lineItemId: number | string): LineItem | undefined {
    return this.items().find((item) => item.id === String(lineItemId));
  }
}
