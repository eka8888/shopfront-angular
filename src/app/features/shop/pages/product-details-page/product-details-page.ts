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
export class ProductDetailsPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  readonly ButtonVariant = ButtonVariant;

  productKey = this.route.snapshot.paramMap.get('key') ?? '';
  imagePath = this.productService.getProductDetailsImage(this.productKey);

  currentProduct = computed(() => {
    return this.productService.getProductById(this.productKey);
  });

  currentQuantity = computed(() => {
    const currentItem = this.cartService.cartItems().find((item) => item.id === this.productKey);

    return currentItem?.quantity ?? 0;
  });

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

  onIncreaseQuantity(id: string) {
    this.cartService.increaseQuantity(id);
  }

  onDecreaseQuantity(id: string) {
    this.cartService.decreaseQuantity(id);
  }

  onAddToCart() {
    this.cartService.addToCart(this.productKey);
  }

  onRemoveFromCart() {
    this.cartService.removeFromCart(this.productKey);
  }

  ngOnInit(): void {
    const subscription = this.productService.fetchProductByKey(this.productKey).subscribe({
      next: (data) => console.log(data),
      error: (err) => console.error(err),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
