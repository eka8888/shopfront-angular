import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../interfaces/product.interface';
import { Button } from '../button/button';
import { ButtonVariant } from '../../types/form.enums';

@Component({
  selector: 'app-product-card',
  imports: [Button, RouterLink],
  templateUrl: './product-card.html',
  standalone: true,
})
export class ProductCard {
  readonly ButtonVariant = ButtonVariant;

  product = input.required<Product>();

  addToCart = output<string>();

  discountPrice = computed(() => this.product().price + 20);

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product().id);
  }
}
