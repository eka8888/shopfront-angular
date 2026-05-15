import { Component, input, output } from '@angular/core';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
    product = input.required<Product>();

  addToCart = output<number>();

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
