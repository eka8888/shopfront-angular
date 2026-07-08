import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../../../shared/services/product.service';
import { CartApi } from '../../../../core/services/cart-api';
import { CartStore } from '../../../../core/stores/cart.store';
import { QuantitySelector } from '../../../../shared/components/quantity-selector/quantity-selector';
import { Button } from '../../../../shared/components/button/button';
import { ButtonVariant } from '../../../../shared/types/form.enums';

@Component({
  selector: 'app-product-details-page',
  imports: [CurrencyPipe, QuantitySelector, Button],
  templateUrl: './product-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartApi = inject(CartApi);
  private cartStore = inject(CartStore);
  private destroyRef = inject(DestroyRef);

  readonly ButtonVariant = ButtonVariant;

  productKey = this.route.snapshot.paramMap.get('key') ?? '';

  currentProduct = computed(() => {
    return this.productService.getProductById(this.productKey);
  });

  imagePath = computed(() => this.currentProduct()?.detailedImage ?? this.currentProduct()?.image);

  /** The real cart's line item for this product, if it's already in the cart. */
  currentLineItem = computed(() => {
    const ctId = this.currentProduct()?.ctId;

    if (!ctId) {
      return undefined;
    }

    return this.cartStore.lineItems().find((item) => item.productId === ctId);
  });

  currentQuantity = computed(() => this.currentLineItem()?.quantity ?? 0);

  oldPrice = computed(() => {
    return this.productService.getOldPrice(this.productKey);
  });

  constructor() {
    effect(() => {
      if (!this.currentProduct()) {
        this.router.navigate(['/404'], { replaceUrl: true });
      }
    });
  }

  onIncreaseQuantity() {
    const item = this.currentLineItem();

    if (!item) {
      return;
    }

    this.cartApi.changeLineItemQuantity(item.id, item.quantity + 1).subscribe();
  }

  onDecreaseQuantity() {
    const item = this.currentLineItem();

    if (!item || item.quantity <= 1) {
      return;
    }

    this.cartApi.changeLineItemQuantity(item.id, item.quantity - 1).subscribe();
  }

  onAddToCart() {
    const sku = this.currentProduct()?.sku;

    if (!sku) {
      return;
    }

    this.cartApi.addLineItem(sku).subscribe();
  }

  onRemoveFromCart() {
    const lineItemId = this.currentLineItem()?.id;

    if (!lineItemId) {
      return;
    }

    this.cartApi.removeLineItem(lineItemId).subscribe();
  }

  ngOnInit(): void {
    const subscription = this.productService.fetchProductByKey(this.productKey).subscribe({
      next: (data) => console.info('Product loaded:', data),
      error: (err) => console.error(err),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
