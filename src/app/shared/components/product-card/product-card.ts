import { Component, computed, input, OnDestroy, OnInit, output } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { Button } from '../button/button';
import { ButtonVariant } from '../../types/form.enums';

@Component({
  selector: 'app-product-card',
  imports: [Button],
  templateUrl: './product-card.html',
  standalone: true,
})
export class ProductCard implements OnInit, OnDestroy {
  readonly ButtonVariant = ButtonVariant;

  product = input.required<Product>();

  addToCart = output<number>();

  discountPrice = computed(() => this.product().price + 20);

  ngOnInit(): void {
    console.log('Product card initialized');
  }

  ngOnDestroy(): void {
    console.log('Product card destroyed');
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product().id);
  }
}
